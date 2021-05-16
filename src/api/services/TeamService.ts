import { plainToClass } from 'class-transformer';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CreationTeamRequest } from '../controllers/requests/CreationTeamRequest';
import { UpdationTeamRequest } from '../controllers/requests/UpdationTeamRequest';
import { TeamResponse } from '../controllers/responses/TeamResponse';
import { Point } from '../models/Point';
import { Referee } from '../models/Referee';
import { StatusTeam, Team } from '../models/Team';
import { PointRepository } from '../repositories/PointRepository';
import { TeamRepository } from '../repositories/TeamRepository';

@Service()
export class TeamService {

    public constructor(
        @OrmRepository() private teamRepository: TeamRepository,
        @OrmRepository() private pointRepository: PointRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async getTeams(skip: number = 0, take: number = 20, referee: Referee): Promise<TeamResponse[]> {
        this.log.info('TeamService:find', { skip, take });
        const teams: Team[] = await this.teamRepository.find({
            skip,
            take,
            order: { name: 'ASC' },
        });
        const teamResponse = plainToClass<TeamResponse, Team>(
            TeamResponse,
            teams,
            { excludeExtraneousValues: true }
        );
        for(const team of teamResponse) {
            const points: Point[] = await this.pointRepository.find({
                where: {
                    teamId: team.id,
                    refereeId: referee.id,
                },
            });
            let amount = 0;
            for (const point of points) {
                amount += point.point;
            }
            team.point = amount;
        }
        for (const t of teamResponse) {
            const points = await this.pointRepository.find({
                where: {
                    teamId: t.id,
                    refereeId: referee.id,
                },
                relations: ['referee'],
            });
            let amountAll = 0;
            let amountReferee = 0;
            let amountNotReferee = 0;
            for (const p of points) {
                if (p.referee.type === 'main') {
                    amountReferee += p.point;
                }
                if (p.referee.type === 'regular') {
                    amountNotReferee += p.point;
                }
                amountAll += p.point;
            }
            t.amountAll = amountAll;
            t.amountNotReferee = amountNotReferee;
            t.amountReferee = amountReferee;
        }
        return teamResponse;
    }

    public async getTeamById(id: number): Promise<TeamResponse | undefined> {
        this.log.info('TeamService:getTeamById', { TeamId: id });
        const team = await this.teamRepository.findOne(id);
        return plainToClass<TeamResponse, Team>(
            TeamResponse,
            team,
            { excludeExtraneousValues: true }
        );
    }

    public async deleteTeam(id: number): Promise<TeamResponse | undefined> {
        this.log.info('TeamService:deleteTeam', { teamId: id });
        const team = await this.teamRepository.findOne({ id });
        if (!team) {
            return undefined;
        }
        await this.teamRepository.delete(team.id);
        return plainToClass<TeamResponse, Team>(
            TeamResponse,
            team,
            { excludeExtraneousValues: true }
        );
    }

    // Метод для добавления
    public async createTeam(body: CreationTeamRequest): Promise<TeamResponse> {
        this.log.info('TeamService:createTeam', { body });
        const newTeam = new Team();
        newTeam.descriptionReferee = body.descriptionReferee;
        newTeam.descriptionTeam = body.descriptionTeam;
        newTeam.name = body.name;
        newTeam.nameProject = body.nameProject;
        newTeam.statusFirstPitch = body.statusFirstPitch;
        newTeam.statusSecondPitch = body.statusSecondPitch;
        newTeam.statusFinalPitch = body.statusFinalPitch;
        newTeam.isBlocked = false;
        const savedTeam = await this.teamRepository.save(newTeam);
        this.log.info('TeamService:addTeam:created', { teamId: savedTeam.id });
        return plainToClass<TeamResponse, Team>(
            TeamResponse,
            await this.teamRepository.findOne(savedTeam.id),
            { excludeExtraneousValues: true }
        );
    }

    public async updateTeam(teamId: number, body: UpdationTeamRequest): Promise<TeamResponse | undefined> {
        this.log.info('TeamService:updateTeam', { body });
        const team = await this.teamRepository.findOne(teamId);
        if (!team) {
            return undefined;
        }
        if (body.statusSecondPitch && body.statusSecondPitch === StatusTeam.NOT_PRESENT) {
            await this.teamRepository.update(team.id, { isBlocked: true });
        }
        body.id = team.id;
        const savedTeam = await this.teamRepository.save(body);
        return plainToClass<TeamResponse, Team>(
            TeamResponse,
            await this.teamRepository.findOne(savedTeam.id),
            { excludeExtraneousValues: true }
        );
    }

}
