import { plainToClass } from 'class-transformer';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { Not } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { v4 as uuid } from 'uuid';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { CreationRefereeRequest } from '../controllers/requests/CreationRefereeRequest';
import { UpdationNoteRequest } from '../controllers/requests/UpdationNoteRequest';
import { UpdationPointRequest } from '../controllers/requests/UpdationPointRequest';
import { UpdationRefereeRequest } from '../controllers/requests/UpdationRefereeRequest';
import { NoteResponse } from '../controllers/responses/NoteResponse';
import { PointResponse } from '../controllers/responses/PointResponse';
import { RefereeResponse } from '../controllers/responses/RefereeResponse';
import { SuccessResponse } from '../controllers/responses/SuccessResponse';
import { AccessDeniedError } from '../errors/AccessDeniedError';
import { Criterion } from '../models/Criterion';
import { Note } from '../models/Note';
import { Point } from '../models/Point';
import { Referee, RoleReferee } from '../models/Referee';
import { StatusTeam, Team } from '../models/Team';
import { CriterionRepository } from '../repositories/CriterionRepository';
import { NoteRepository } from '../repositories/NoteRepository';
import { PointRepository } from '../repositories/PointRepository';
import { RefereeRepository } from '../repositories/RefereeRepository';
import { TeamRepository } from '../repositories/TeamRepository';

@Service()
export class RefereeService {

    public constructor(
        @OrmRepository() private refereeRepository: RefereeRepository,
        @OrmRepository() private teamRepository: TeamRepository,
        @OrmRepository() private pointRepository: PointRepository,
        @OrmRepository() private noteRepository: NoteRepository,
        @OrmRepository() private criterionRepository: CriterionRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async getReferees(skip: number = 0, take: number = 20): Promise<RefereeResponse[]> {
        this.log.info('RefereeService:find', { skip, take });
        const referees: Referee[] = await this.refereeRepository.find({ skip, take });
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            referees,
            { excludeExtraneousValues: true }
        );
    }

    public async getRefereeById(id: number): Promise<RefereeResponse | undefined> {
        this.log.info('RefereeService:getRefereeById', { RefereeId: id });
        const referee = await this.refereeRepository.findOne({ id });
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            referee,
            { excludeExtraneousValues: true }
        );
    }

    public async deleteReferee(id: number): Promise<RefereeResponse | undefined> {
        this.log.info('RefereeService:deleteReferee', { refereeId: id });
        const referee = await this.refereeRepository.findOne({ id });
        if (!referee) {
            return undefined;
        }
        await this.refereeRepository.delete(referee.id);
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            referee,
            { excludeExtraneousValues: true }
        );
    }

    // Метод для добавления
    public async createReferee(body: CreationRefereeRequest): Promise<RefereeResponse> {
        this.log.info('RefereeService:createReferee', { body });
        const newReferee = new Referee();
        newReferee.name = body.name;
        newReferee.surname = body.surname;
        newReferee.login = body.login;
        newReferee.password = crypto.createHash('md5').update(body.password).digest('hex');
        const savedReferee = await this.refereeRepository.save(newReferee);
        this.log.info('RefereeService:addReferee:created', { refereeId: savedReferee.id });
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            await this.refereeRepository.findOne(savedReferee.id),
            { excludeExtraneousValues: true }
        );
    }

    public async updateReferee(refereeId: number, body: UpdationRefereeRequest): Promise<RefereeResponse | undefined> {
        this.log.info('RefereeService:updateReferee', { body });
        const referee = await this.refereeRepository.findOne(refereeId);
        if (!referee) {
            return undefined;
        }
        body.id = referee.id;
        const savedReferee = await this.refereeRepository.save(body);
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            await this.refereeRepository.findOne(savedReferee.id),
            { excludeExtraneousValues: true }
        );
    }

    public async loginReferee(login: string, password: string, isMobile: boolean = false): Promise<{ token: string; referee: Referee }> {
        this.log.info('RefereeService:loginReferee', { login });
        const referee: Referee = await this.refereeRepository.findOne({
            where: {
                login,
                password,
            },
        });
        if (isMobile) {
            const token: string = uuid();
            const redisClient = (global as any).frameworkSettings.getData('redis_client');
            await redisClient.setAsync(token, referee.id);
            return  { token, referee };
        } else {
            const token: string = jwt.sign({ refereeId: referee.id, login: referee.login }, env.app.jwtSecret);
            const redisClient = (global as any).frameworkSettings.getData('redis_client');
            await redisClient.setAsync(token, JSON.stringify({ refereeId: referee.id, login: referee.login, role: referee.type }));
            return { token, referee };
        }
    }

    public async logoutReferee(cookie: string): Promise<void> {
        this.log.info('RefereeService:logoutReferee');
        const redisClient = (global as any).frameworkSettings.getData('redis_client');
        if (cookie) {
            await redisClient.delAsync(cookie);
        }
    }

    public async endSecondPitch(): Promise<SuccessResponse> {
        this.log.info('RefereeService:endSecondPitch');
        const teams: Team[] = await this.teamRepository.find({
            where: [
                { statusFirstPitch: Not(StatusTeam.PRESENT) },
                { statusSecondPitch: Not(StatusTeam.PRESENT) },
            ],
        });
        for (const team of teams) {
            await this.teamRepository.update(team.id, { isBlocked: true });
        }
        return { status: 'OK', message: 'End checkpoint' };
    }

    public async startFinalPitch(): Promise<SuccessResponse> {
        this.log.info('RefereeService:startFinalPitch');
        const points: Point[] = await this.pointRepository.find();
        if (points.length !== 0) {
            await this.pointRepository.delete(points.map(point => point.id));
        }
        const notes: Note[] = await this.noteRepository.find();
        if (notes.length !== 0) {
            await this.pointRepository.delete(notes.map(point => point.id));
        }
        const criterions: Criterion[] = await this.criterionRepository.find();
        const referees: Referee[] = await this.refereeRepository.find();
        const teams: Team[] = await this.teamRepository.find();
        for (const referee of referees) {
            for (const team of teams) {
                for (const criterion of criterions) {
                    const newPoint = new Point();
                    newPoint.refereeId = referee.id;
                    newPoint.point = 0;
                    newPoint.teamId = team.id;
                    newPoint.criterionId = criterion.id;
                    await this.pointRepository.save(newPoint);
                }
                const newNote: Note = new Note();
                newNote.refereeId = referee.id;
                newNote.teamId = team.id;
                await this.noteRepository.save(newNote);
            }
        }
        return { status: 'OK', message: 'Started final pitch' };
    }

    public async updatePoint(pointId: number, body: UpdationPointRequest, currentReferee: Referee): Promise<SuccessResponse> {
        this.log.info('RefereeService:updatePoint', { pointId, body });
        const point: Point = await this.pointRepository.findOne(pointId);
        if (!point) {
            return undefined;
        }
        if (point.refereeId !== currentReferee.id) {
            throw new AccessDeniedError();
        }
        point.point = body.point;
        await this.pointRepository.save(point);
        return { status: 'OK', message: 'Saved point' };
    }

    public async getPoints(currentReferee: Referee): Promise<PointResponse[]> {
        this.log.info('RefereeService:getPoints', { refereeId: currentReferee.id });
        const points: Point[] = await this.pointRepository.find({
            where: {
                refereeId: currentReferee.id,
            },
            relations: ['criterion', 'referee'],
        });
        return plainToClass<PointResponse, Point>(
            PointResponse,
            points,
            { excludeExtraneousValues: true }
        );
    }

    public async updateNote(noteId: number, body: UpdationNoteRequest, currentReferee: Referee): Promise<SuccessResponse> {
        this.log.info('RefereeService:updateNote', { noteId, body });
        const note: Note = await this.noteRepository.findOne(noteId);
        if (!note) {
            return undefined;
        }
        if (note.refereeId !== currentReferee.id) {
            throw new AccessDeniedError();
        }
        note.text = body.text;
        await this.noteRepository.save(note);
        return { status: 'OK', message: 'Saved note' };
    }

    public async getNotes(currentReferee: Referee): Promise<NoteResponse[]> {
        this.log.info('RefereeService:getNotes', { refereeId: currentReferee.id });
        const notes: Note[] = await this.noteRepository.find({
            where: {
                refereeId: currentReferee.id,
            },
            relations: ['referee'],
        });
        return plainToClass<NoteResponse, Note>(
            NoteResponse,
            notes,
            { excludeExtraneousValues: true }
        );
    }

    public async getPointsAndNote(currentReferee: Referee, teamId: number): Promise<{ points: PointResponse[]; note: NoteResponse }> {
        this.log.info('RefereeService:getPoint', { refereeId: currentReferee.id });
        const points: Point[] = await this.pointRepository.find({
            where: {
                refereeId: currentReferee.id,
                teamId,
            },
            relations: ['criterion', 'referee'],
        });
        const note: Note = await this.noteRepository.findOne({
            where: {
                teamId,
            },
        });
        const pointsResponse = plainToClass<PointResponse, Point>(
            PointResponse,
            points,
            { excludeExtraneousValues: true }
        );
        const noteResponse = plainToClass<NoteResponse, Note>(
            NoteResponse,
            note,
            { excludeExtraneousValues: true }
        );
        return { points: pointsResponse, note: noteResponse };
    }

    public async getRoles(refereeId: number): Promise<string[]> {
        this.log.info('RefereeService:getRoles', { refereeId });
        const roles = Object.values(RoleReferee);
        return roles;
    }

    public async end(currentReferee: Referee): Promise<number> {
        this.log.info('RefereeService:getRoles', { refereeId: currentReferee.id });
        const referee: Referee = await this.refereeRepository.findOne(currentReferee.id, {
            relations: ['points'],
        });
        console.log(referee);
        let amount = 0;
        if (referee.points && referee.points.length !== 0) {
            for (const point of referee.points) {
                amount += point.point;
            }
            return amount;
        }
        return 0;
    }

}
