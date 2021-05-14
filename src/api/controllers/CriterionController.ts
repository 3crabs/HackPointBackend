
import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, QueryParam
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { CriterionNotFoundError } from '../errors/CriterionNotFoundError';
import { CriterionService } from '../services/CriterionService';
import { CreationCriterionRequest } from './requests/CreationCriterionRequest';
import { UpdationCriterionRequest } from './requests/UpdationCriterionRequest';
import { CriterionResponse } from './responses/CriterionResponse';
import { ErrorResponse } from './responses/ErrorResponse';

@JsonController()
@OpenAPI({
    tags: ['Criterion'],
})
export class CriterionController {

    public constructor(
        private criterionService: CriterionService
    ) { }

    @Authorized(['referee'])
    @Get('/admin/criterion')
    @OpenAPI({
        summary: 'get criterions', description: 'Criterions', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(CriterionResponse, { description: 'Criterions', isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '401' })
    public getCriterions(
        @QueryParam('skip') skip: number, @QueryParam('take') take: number
    ): Promise<CriterionResponse[]> {
        return this.criterionService.getCriterions(skip, take);
    }

    @Authorized(['referee'])
    @Post('/admin/criterion')
    @OpenAPI({
        summary: 'create criterion', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(CriterionResponse, { description: 'criterions' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public createCriterion(
        @Body({ required: true, validate: true }) body: CreationCriterionRequest
    ): Promise<CriterionResponse> {
        return this.criterionService.createCriterion(body);
    }

    @Authorized(['referee'])
    @Get('/admin/criterion/:id')
    @OpenAPI({
        summary: 'get criterion by id', security: [{ CookieAuth: [] }],
    })
    @OnUndefined(CriterionNotFoundError)
    @ResponseSchema(CriterionResponse, { description: 'criterion' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getCriterionById(@Param('id') criterionId: number): Promise<CriterionResponse | undefined> {
        return this.criterionService.getCriterionById(criterionId);
    }

    @Authorized(['referee'])
    @Delete('/admin/criterion/:id')
    @OpenAPI({
        summary: 'delete criterion by id', security: [{ CookieAuth: [] }],
    })
    @OnUndefined(CriterionNotFoundError)
    @ResponseSchema(CriterionResponse, { description: 'criterion' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public deleteCriterion(@Param('id') criterionId: number): Promise<CriterionResponse> {
        return this.criterionService.deleteCriterion(criterionId);
    }

    @Authorized(['referee'])
    @Put('/admin/criterion/:id')
    @OpenAPI({
        summary: 'update criterion by id', security: [{ CookieAuth: [] }],
    })
    @OnUndefined(CriterionNotFoundError)
    @ResponseSchema(CriterionResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public updateCriterion(
        @Param('id') criterionId: number, @Body({ required: true, validate: true }) body: UpdationCriterionRequest
    ): Promise<CriterionResponse | undefined> {
        return this.criterionService.updateCriterion(criterionId, body);
    }

}
