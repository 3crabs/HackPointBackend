import {
    Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, QueryParam
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { RefereeNotFoundError } from '../errors/RefereeNotFoundError';
import { RefereeService } from '../services/RefereeService';
import { CreationRefereeRequest } from './requests/CreationRefereeRequest';
import { UpdationRefereeRequest } from './requests/UpdationRefereeRequest';
import { ErrorResponse } from './responses/ErrorResponse';
import { RefereeResponse } from './responses/RefereeResponse';

@JsonController()
@OpenAPI({
    tags: ['Referee'],
})
export class RefereeController {

    public constructor(
        private refereeService: RefereeService
    ) { }

    @Get('/admin/referee')
    @OpenAPI({
        summary: 'get referees', description: 'Referees',
    })
    @ResponseSchema(RefereeResponse, { description: 'Referees', isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '401' })
    public getReferees(
        @QueryParam('skip') skip: number, @QueryParam('take') take: number
    ): Promise<RefereeResponse[]> {
        return this.refereeService.getReferees(skip, take);
    }

    @Post('/admin/referee')
    @OpenAPI({
        summary: 'create referee',
    })
    @ResponseSchema(RefereeResponse, { description: 'referees' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public createReferee(
        @Body({ required: true, validate: true }) body: CreationRefereeRequest
    ): Promise<RefereeResponse> {
        return this.refereeService.createReferee(body);
    }

    @Get('/admin/referee/:id')
    @OpenAPI({
        summary: 'get referee by id',
    })
    @OnUndefined(RefereeNotFoundError)
    @ResponseSchema(RefereeResponse, { description: 'referee' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getRefereeById(@Param('id') refereeId: number): Promise<RefereeResponse | undefined> {
        return this.refereeService.getRefereeById(refereeId);
    }

    @Delete('/admin/referee/:id')
    @OpenAPI({
        summary: 'delete referee by id',
    })
    @OnUndefined(RefereeNotFoundError)
    @ResponseSchema(RefereeResponse, { description: 'referee' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public deleteReferee(@Param('id') refereeId: number): Promise<RefereeResponse> {
        return this.refereeService.deleteReferee(refereeId);
    }

    @Put('/admin/referee/:id')
    @OpenAPI({
        summary: 'update referee by id',
    })
    @OnUndefined(RefereeNotFoundError)
    @ResponseSchema(RefereeResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public updateReferee(
        @Param('id') refereeId: number, @Body({ required: true, validate: true }) body: UpdationRefereeRequest
    ): Promise<RefereeResponse | undefined> {
        return this.refereeService.updateReferee(refereeId, body);
    }

}
