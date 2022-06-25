import {
    Authorized, Body, Get, JsonController, Post, Put, Req, UseBefore
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { createMulterInstance, fileFilter } from '../../lib/multer';
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

    @Authorized(['referee'])
    @UseBefore(
        createMulterInstance(
            {
                fileSize: 5242880,
            },
            fileFilter
        ).fields([{ name: 'image', maxCount: 10 }])
    )
    @Put('/banner')
    @OpenAPI({
        security: [{ CookieAuth: [] }], summary: 'create event',
        requestBody: { content: { 'multipart/form-data': { schema: { $ref: '#/components/schemas/NewEventDTO' } } } },
    })
    @ResponseSchema(Boolean)
    @ResponseSchema(ErrorResponse, { description: 'Invalid body.', statusCode: '400' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied.', statusCode: '403' })
    public async createEvent(@Req() req: any): Promise<boolean> {
        // tslint:disable-next-line:no-string-literal
        if (!req.files?.['image']) {
            throw new Error('BadRequestError');
        }
        return await this.hackatonService.uploadFile(req.files);
    }

}
