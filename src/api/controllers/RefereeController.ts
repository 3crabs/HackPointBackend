import crypto from 'crypto';
import * as express from 'express';
import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put,
    QueryParam, Res
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { AccessCookie } from '../../decorators/AccessCookie';
import { env } from '../../env';
import { NoteNotFoundError } from '../errors/NoteNotFoundError';
import { PointNotFoundError } from '../errors/PointNotFoundError';
import { RefereeNotFoundError } from '../errors/RefereeNotFoundError';
import { Referee } from '../models/Referee';
import { RefereeService } from '../services/RefereeService';
import { CreationRefereeRequest } from './requests/CreationRefereeRequest';
import { RefereeLoginRequest } from './requests/RefereeLoginRequest';
import { UpdationNoteRequest } from './requests/UpdationNoteRequest';
import { UpdationPointRequest } from './requests/UpdationPointRequest';
import { UpdationRefereeRequest } from './requests/UpdationRefereeRequest';
import { ErrorResponse } from './responses/ErrorResponse';
import { NoteResponse } from './responses/NoteResponse';
import { PointResponse } from './responses/PointResponse';
import { RefereeResponse } from './responses/RefereeResponse';
import { SuccessResponse } from './responses/SuccessResponse';

@JsonController()
@OpenAPI({
    tags: ['Referee'],
})
export class RefereeController {

    public constructor(
        private refereeService: RefereeService
    ) { }

    @Authorized(['referee'])
    @Get('/admin/referee')
    @OpenAPI({
        summary: 'get referees', description: 'Referees', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(RefereeResponse, { description: 'Referees', isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '401' })
    public getReferees(
        @QueryParam('skip') skip: number, @QueryParam('take') take: number
    ): Promise<RefereeResponse[]> {
        return this.refereeService.getReferees(skip, take);
    }

    @Authorized(['referee'])
    @Post('/admin/referee')
    @OpenAPI({
        summary: 'create referee', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(RefereeResponse, { description: 'referees' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public createReferee(
        @Body({ required: true, validate: true }) body: CreationRefereeRequest
    ): Promise<RefereeResponse> {
        return this.refereeService.createReferee(body);
    }

    @Authorized(['referee'])
    @Get('/admin/referee/:id')
    @OpenAPI({
        summary: 'get referee by id', security: [{ CookieAuth: [] }],
    })
    @OnUndefined(RefereeNotFoundError)
    @ResponseSchema(RefereeResponse, { description: 'referee' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getRefereeById(@Param('id') refereeId: number): Promise<RefereeResponse | undefined> {
        return this.refereeService.getRefereeById(refereeId);
    }

    @Authorized(['referee'])
    @Delete('/admin/referee/:id')
    @OpenAPI({
        summary: 'delete referee by id', security: [{ CookieAuth: [] }],
    })
    @OnUndefined(RefereeNotFoundError)
    @ResponseSchema(RefereeResponse, { description: 'referee' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public deleteReferee(@Param('id') refereeId: number): Promise<RefereeResponse> {
        return this.refereeService.deleteReferee(refereeId);
    }

    @Authorized(['referee'])
    @Put('/admin/referee/:id')
    @OpenAPI({
        summary: 'update referee by id', security: [{ CookieAuth: [] }],
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

    @Post('/login')
    @OpenAPI({
        tags: ['Auth'], summary: 'login referee',
        responses: { 200: { headers: { 'Set-Cookie': { schema: {
            type: 'string', example: '_auth=abcdefghijklmnopqrstuvwxyz;Path=/;HttpOnly;SameSite=Strict;Secure' }, description: 'JWT access token in cookie' } },
        } },
    })
    @ResponseSchema(SuccessResponse, { description: 'OK. Login' })
    @ResponseSchema(ErrorResponse, { description: 'Login or password not correct.', statusCode: '400' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied.', statusCode: '403' })
    public async login(
        @Body({ validate: { whitelist: true } }) refereeData: RefereeLoginRequest, @Res() res: express.Response
    ): Promise<SuccessResponse> {
        const credentials = await this.refereeService.loginReferee(
            refereeData.login, crypto.createHash('md5').update(refereeData.password).digest('hex'), refereeData.isMobile
        );
        const successResponse = new SuccessResponse();
        successResponse.status = 'OK';
        successResponse.referee = credentials.referee;
        if (refereeData.isMobile && credentials.token) {
            res.header('Access-Token', credentials.token);
            successResponse.token = credentials.token;
        } else {
            res.cookie('_auth', credentials.token, {
                httpOnly: env.app.cookie.httpOnly,
                secure: env.app.cookie.secure,
                sameSite: env.app.cookie.sameSite,
            });
        }
        return successResponse;
    }

    @Authorized(['referee'])
    @Post('/logout')
    @OpenAPI({
        tags: ['Auth'], summary: 'logout referee', security: [{ CookieAuth: [] }],
        responses: { 200: { headers: { 'Set-Cookie': { schema: {
            type: 'string', example: '_auth=;Path=/;HttpOnly;SameSite=Strict;Secure' }, description: 'Empty JWT access token in cookie' } },
        } },
    })
    @ResponseSchema(SuccessResponse, { description: 'OK. Logout' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied.', statusCode: '403' })
    public async logout(
        @AccessCookie() cookie: string, @Res() res: express.Response
    ): Promise<{ status: string }> {
        await this.refereeService.logoutReferee(cookie);
        const now = new Date();
        now.setMinutes(now.getMinutes() - 5);
        res.cookie('_auth', undefined, {
            expires: now,
            httpOnly: env.app.cookie.httpOnly,
            secure: env.app.cookie.secure,
            sameSite: env.app.cookie.sameSite,
        });
        return { status: 'OK' };
    }

    @Post('/login/check')
    @OpenAPI({
        tags: ['Auth'], summary: 'check cookie', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(SuccessResponse, { description: 'OK. Login' })
    @ResponseSchema(ErrorResponse, { description: 'Login or password not correct.', statusCode: '400' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied.', statusCode: '403' })
    public async checkCookie(
        @AccessCookie() cookie: string
    ): Promise<boolean> {
        if (!cookie) {
            return false;
        }
        return true;
    }

    @Authorized(['referee'])
    @Post('/admin/referee/checkpoint')
    @OpenAPI({
        summary: 'end second pitch', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(SuccessResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public endSecondPitch(): Promise<SuccessResponse> {
        return this.refereeService.endSecondPitch();
    }

    @Authorized(['referee'])
    @Post('/admin/referee/demofest')
    @OpenAPI({
        summary: 'start final round', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(SuccessResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public startFinalPitch(): Promise<SuccessResponse> {
        return this.refereeService.startFinalPitch();
    }

    @Authorized(['referee'])
    @Put('/referee/point/:id')
    @OnUndefined(PointNotFoundError)
    @OpenAPI({
        summary: 'update point', security: [{ CookieAuth: [] }], tags: ['Point'],
    })
    @ResponseSchema(SuccessResponse)
    @ResponseSchema(ErrorResponse, { description: 'BadRequest', statusCode: '400' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    @ResponseSchema(ErrorResponse, { description: 'Point not found', statusCode: '404' })
    public updatePoint(
        @Param('id') pointId: number, @Body({ required: true, validate: true }) body: UpdationPointRequest, @CurrentUser() referee: Referee
    ): Promise<SuccessResponse> {
        return this.refereeService.updatePoint(pointId, body, referee);
    }

    @Authorized(['referee'])
    @Get('/referee/point')
    @OnUndefined(PointNotFoundError)
    @OpenAPI({
        summary: 'get points', security: [{ CookieAuth: [] }], tags: ['Point'],
    })
    @ResponseSchema(PointResponse, { isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getPoints(
        @CurrentUser() referee: Referee
    ): Promise<PointResponse[]> {
        return this.refereeService.getPoints(referee);
    }

    @Authorized(['referee'])
    @Put('/referee/note/:id')
    @OnUndefined(NoteNotFoundError)
    @OpenAPI({
        summary: 'update note', security: [{ CookieAuth: [] }], tags: ['Note'],
    })
    @ResponseSchema(SuccessResponse)
    @ResponseSchema(ErrorResponse, { description: 'BadRequest', statusCode: '400' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    @ResponseSchema(ErrorResponse, { description: 'Note not found', statusCode: '404' })
    public updateNote(
        @Param('id') pointId: number, @Body({ required: true, validate: true }) body: UpdationNoteRequest, @CurrentUser() referee: Referee
    ): Promise<SuccessResponse> {
        return this.refereeService.updateNote(pointId, body, referee);
    }

    @Authorized(['referee'])
    @Get('/referee/note')
    @OnUndefined(NoteNotFoundError)
    @OpenAPI({
        summary: 'get notes', security: [{ CookieAuth: [] }], tags: ['Note'],
    })
    @ResponseSchema(NoteResponse, { isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getNotes(
        @CurrentUser() referee: Referee
    ): Promise<NoteResponse[]> {
        return this.refereeService.getNotes(referee);
    }

    @Authorized(['referee'])
    @Get('/referee/point/note')
    @OnUndefined(NoteNotFoundError)
    @OpenAPI({
        summary: 'get notes', security: [{ CookieAuth: [] }], tags: ['Point'],
    })
    @ResponseSchema(PointResponse, { isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getPointsAndNote(
        @CurrentUser() referee: Referee, @QueryParam('teamId', { required: true }) teamId: number
    ): Promise<{ points: PointResponse[]; note: NoteResponse }> {
        return this.refereeService.getPointsAndNote(referee, teamId);
    }

    @Authorized(['referee'])
    @Get('/admin/referees/role')
    @OpenAPI({
        summary: 'get notes', security: [{ CookieAuth: [] }], tags: ['Referee'],
    })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getRoles(
        @CurrentUser() referee: Referee
    ): Promise<string[]> {
        return this.refereeService.getRoles(referee.id);
    }

    @Authorized(['referee'])
    @Post('/admin/referee/pitch/final')
    @OpenAPI({
        summary: 'final', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(SuccessResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public final(
        @CurrentUser() referee: Referee
    ): Promise<number> {
        return this.refereeService.end(referee);
    }

}
