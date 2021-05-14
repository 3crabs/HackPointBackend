import { plainToClass } from 'class-transformer';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CreationTeamRequest } from '../controllers/requests/CreationTeamRequest';
import { UpdationTeamRequest } from '../controllers/requests/UpdationTeamRequest';
import { TeamResponse } from '../controllers/responses/TeamResponse';
import { Team } from '../models/Team';
import { TeamRepository } from '../repositories/TeamRepository';

@Service()
export class TeamService {

    public constructor(
        @OrmRepository() private teamRepository: TeamRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async getTeams(skip: number = 0, take: number = 20): Promise<TeamResponse[]> {
        this.log.info('TeamService:find', { skip, take });
        const teams: Team[] = await this.teamRepository.find({ skip, take });
        return plainToClass<TeamResponse, Team>(
            TeamResponse,
            teams,
            { excludeExtraneousValues: true }
        );
    }

    public async getTeamById(id: number): Promise<TeamResponse | undefined> {
        this.log.info('TeamService:getTeamById', { TeamId: id });
        const team = await this.teamRepository.findOne({ id });
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
        body.id = team.id;
        const savedTeam = await this.teamRepository.save(body);
        return plainToClass<TeamResponse, Team>(
            TeamResponse,
            await this.teamRepository.findOne(savedTeam.id),
            { excludeExtraneousValues: true }
        );
    }

}
