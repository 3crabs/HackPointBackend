import { Authorized, Body, Get, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { HackatonService } from '../services/HackatonService';
import { CreationHackatonRequest } from './requests/CreationHackatonRequest';
import { ErrorResponse } from './responses/ErrorResponse';
import { HackatonResponse } from './responses/HackatonResponse';

@JsonController('/hackaton')
@OpenAPI({
    tags: ['Hackaton'],
})
export class HackatonController {

    public constructor(
        private hackatonService: HackatonService
    ) { }

    @Authorized(['referee'])
    @Post('/')
    @OpenAPI({
        summary: 'create hackaton', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(HackatonResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public createHackaton(
        @Body({ required: true, validate: true }) body: CreationHackatonRequest
    ): Promise<HackatonResponse> {
        return this.hackatonService.createHackaton(body);
    }

    @Authorized(['referee', 'user'])
    @Get('/')
    @OpenAPI({
        summary: 'get hackaton', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(HackatonResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getHackaton(): Promise<HackatonResponse> {
        return this.hackatonService.getHackaton();
    }

}
