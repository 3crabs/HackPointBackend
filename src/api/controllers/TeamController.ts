import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put,
    QueryParam
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { TeamNotFoundError } from '../errors/TeamNotFoundError';
import { Referee } from '../models/Referee';
import { TeamService } from '../services/TeamService';
import { CreationTeamRequest } from './requests/CreationTeamRequest';
import { CreationTeamUserRequest } from './requests/CreationTeamUserRequest';
import { UpdationTeamRequest } from './requests/UpdationTeamRequest';
import { ErrorResponse } from './responses/ErrorResponse';
import { TeamResponse } from './responses/TeamResponse';
import { TeamUserResponse } from './responses/TeamUserResponse';

@JsonController()
@OpenAPI({
    tags: ['Team'],
})
export class TeamController {

    public constructor(
        private teamService: TeamService
    ) { }

    @Authorized(['referee', 'user'])
    @Get('/team')
    @OpenAPI({
        summary: 'get teams', description: 'Teams', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(TeamResponse, { description: 'Teams', isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '401' })
    public getTeams(
        @QueryParam('skip') skip: number, @QueryParam('take') take: number, @CurrentUser() referee: Referee
    ): Promise<TeamResponse[]> {
        return this.teamService.getTeams(skip, take, referee);
    }

    @Authorized(['referee'])
    @Post('/admin/team')
    @OpenAPI({
        summary: 'create team', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(TeamResponse, { description: 'teams' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public createTeam(
        @Body({ required: true, validate: true }) body: CreationTeamRequest
    ): Promise<TeamResponse> {
        return this.teamService.createTeam(body);
    }

    @Authorized(['user'])
    @Post('/user/team')
    @OpenAPI({
        summary: 'create team', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(TeamResponse, { description: 'teams' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public createUserTeam(
        @Body({ required: true, validate: true }) body: CreationTeamUserRequest
    ): Promise<TeamUserResponse> {
        return this.teamService.createUserTeam(body);
    }

    @Authorized(['referee'])
    @Get('/admin/team/:id')
    @OpenAPI({
        summary: 'get team by id', security: [{ CookieAuth: [] }],
    })
    @OnUndefined(TeamNotFoundError)
    @ResponseSchema(TeamResponse, { description: 'team' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getTeamById(
        @Param('id') teamId: number, @CurrentUser() referee: Referee
    ): Promise<TeamResponse | undefined> {
        return this.teamService.getTeamById(teamId, referee);
    }

    @Authorized(['referee'])
    @Delete('/admin/team/:id')
    @OpenAPI({
        summary: 'delete team by id', security: [{ CookieAuth: [] }],
    })
    @OnUndefined(TeamNotFoundError)
    @ResponseSchema(TeamResponse, { description: 'team' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public deleteTeam(@Param('id') teamId: number): Promise<TeamResponse> {
        return this.teamService.deleteTeam(teamId);
    }

    @Authorized(['referee'])
    @Put('/admin/team/:id')
    @OpenAPI({
        summary: 'update team by id', security: [{ CookieAuth: [] }],
    })
    @OnUndefined(TeamNotFoundError)
    @ResponseSchema(TeamResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public updateTeam(
        @Param('id') teamId: number, @Body({ required: true, validate: true }) body: UpdationTeamRequest
    ): Promise<TeamResponse | undefined> {
        return this.teamService.updateTeam(teamId, body);
    }

}
