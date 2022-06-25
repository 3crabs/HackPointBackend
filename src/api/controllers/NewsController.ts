import {
    Authorized, Body, Get, JsonController, Param, Post, Put, Req, UseBefore
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { createMulterInstance, fileFilter } from '../../lib/multer';
import { NewsService } from '../services/NewsService';
import { CreationNewsRequest } from './requests/CreationNewsRequest';
import { ErrorResponse } from './responses/ErrorResponse';
import { NewsResponse } from './responses/NewsResponse';

@JsonController('/news')
@OpenAPI({
    tags: ['News'],
})
export class NewsController {

    public constructor(
        private newsService: NewsService
    ) { }

    @Authorized(['referee'])
    @Post('/')
    @OpenAPI({
        summary: 'create news', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(NewsResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public createHackaton(
        @Body({ required: true, validate: true }) body: CreationNewsRequest
    ): Promise<NewsResponse> {
        return this.newsService.createNews(body);
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
    @Put('/:newsId/banner')
    @OpenAPI({
        security: [{ CookieAuth: [] }], summary: 'create banner news',
        requestBody: { content: { 'multipart/form-data': { schema: { $ref: '#/components/schemas/NewEventDTO' } } } },
    })
    @ResponseSchema(Boolean)
    @ResponseSchema(ErrorResponse, { description: 'Invalid body.', statusCode: '400' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied.', statusCode: '403' })
    public async createEvent(@Param('newsId') newsId: number, @Req() req: any): Promise<boolean> {
        // tslint:disable-next-line:no-string-literal
        if (!req.files?.['image']) {
            throw new Error('BadRequestError');
        }
        return await this.newsService.uploadFile(newsId, req.files);
    }

    @Authorized(['referee', 'user'])
    @Get('/')
    @OpenAPI({
        summary: 'get news', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(NewsResponse, { isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getHackaton(): Promise<NewsResponse[]> {
        return this.newsService.getNews();
    }
}
