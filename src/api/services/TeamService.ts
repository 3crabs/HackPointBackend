import { plainToClass } from 'class-transformer';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { In } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CreationTeamRequest } from '../controllers/requests/CreationTeamRequest';
import { CreationTeamUserRequest } from '../controllers/requests/CreationTeamUserRequest';
import { UpdationTeamRequest } from '../controllers/requests/UpdationTeamRequest';
import { TeamResponse } from '../controllers/responses/TeamResponse';
import { TeamUserResponse } from '../controllers/responses/TeamUserResponse';
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
            relations: ['users'],
        });
        const teamResponse = plainToClass<TeamResponse, Team>(
            TeamResponse,
            teams,
            { excludeExtraneousValues: true }
        );
        const points = await this.pointRepository.find({
            where: {
                teamId: In(teamResponse.map(team => team.id)),
            },
            relations: ['referee'],
        });

        teamResponse.forEach(team => {
            this.setAmountsTeam(points, team.id, referee.id, team);
        });
        return teamResponse;
    }

    public async getTeamById(id: number, referee: Referee): Promise<TeamResponse | undefined> {
        this.log.info('TeamService:getTeamById', { teamId: id });
        const team = await this.teamRepository.findOne(id);
        if (!team) {
            return undefined;
        }
        const teamResponse = plainToClass<TeamResponse, Team>(
            TeamResponse,
            team,
            { excludeExtraneousValues: true }
        );
        const points = await this.pointRepository.find({
            where: {
                teamId: team.id,
            },
            relations: ['referee'],
        });
        this.setAmountsTeam(points, team.id, referee.id, teamResponse);
        return teamResponse;
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

    public async createUserTeam(body: CreationTeamUserRequest): Promise<TeamUserResponse> {
        this.log.info('TeamService:createUserTeam', { body });
        if (await this.teamRepository.findOne({ where: { name: body.name }})) {
            throw new BadRequestError('Duplicated team');
        }
        const newTeam = new Team();
        newTeam.name = body.name;
        newTeam.isBlocked = false;
        const savedTeam = await this.teamRepository.save(newTeam);
        this.log.info('TeamService:createUserTeam:created', { teamId: savedTeam.id });
        return plainToClass<TeamUserResponse, Team>(
            TeamUserResponse,
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

    private setAmountsTeam(points: Point[], teamId: number, refereeId: number, teamResponse: TeamResponse): void {
        let amountReferee = 0;
        let amountAll = 0;
        let amountNotReferee = 0;
        let amount = 0;
        points.forEach(point => {
            if (point.referee.type === 'main' && point.teamId === teamId) {
                amountReferee += point.point;
            }
            if (point.referee.type === 'regular' && point.teamId === teamId) {
                amountNotReferee += point.point;
            }
            if (point.teamId === teamId) {
                amountAll += point.point;
            }
            if (point.refereeId === refereeId && point.teamId === teamId) {
                amount += point.point;
            }
        });
        teamResponse.amountAll = amountAll;
        teamResponse.amountReferee = amountReferee;
        teamResponse.amountNotReferee = amountNotReferee;
        teamResponse.point = amount;
    }

}
