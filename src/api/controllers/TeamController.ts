import {
    Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, QueryParam
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { TeamNotFoundError } from '../errors/TeamNotFoundError';
import { TeamService } from '../services/TeamService';
import { CreationTeamRequest } from './requests/CreationTeamRequest';
import { UpdationTeamRequest } from './requests/UpdationTeamRequest';
import { ErrorResponse } from './responses/ErrorResponse';
import { TeamResponse } from './responses/TeamResponse';

@JsonController()
@OpenAPI({
    security: [{ ApiKeyAuth: [] }],
    tags: ['Team'],
})
export class TeamController {

    public constructor(
        private teamService: TeamService
    ) { }

    @Get('/admin/team')
    @OpenAPI({
        summary: 'get teams', description: 'Teams',
    })
    @ResponseSchema(TeamResponse, { description: 'Teams', isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '401' })
    public getTeams(
        @QueryParam('skip') skip: number, @QueryParam('take') take: number
    ): Promise<TeamResponse[]> {
        return this.teamService.getTeams(skip, take);
    }

    @Post('/admin/team')
    @OpenAPI({
        summary: 'create team',
    })
    @ResponseSchema(TeamResponse, { description: 'teams' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public createTeam(
        @Body({ required: true, validate: true }) body: CreationTeamRequest
    ): Promise<TeamResponse> {
        return this.teamService.createTeam(body);
    }

    @Get('/admin/team/:id')
    @OpenAPI({
        summary: 'get team by id',
    })
    @OnUndefined(TeamNotFoundError)
    @ResponseSchema(TeamResponse, { description: 'team' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getTeamById(@Param('id') teamId: number): Promise<TeamResponse | undefined> {
        return this.teamService.getTeamById(teamId);
    }

    @Delete('/admin/team/:id')
    @OpenAPI({
        summary: 'delete team by id',
    })
    @OnUndefined(TeamNotFoundError)
    @ResponseSchema(TeamResponse, { description: 'team' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public deleteTeam(@Param('id') teamId: number): Promise<TeamResponse> {
        return this.teamService.deleteTeam(teamId);
    }

    @Put('/admin/team/:id')
    @OpenAPI({
        summary: 'update team by id',
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
