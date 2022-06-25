import { plainToClass } from 'class-transformer';
import crypto from 'crypto';
import * as express from 'express';
import {
    Authorized, Body, CurrentUser, Get, JsonController, Post, Put, Res
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { env } from '../../env';
import { UserRole } from '../models/enums/UserRole';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { CreationUserRequest } from './requests/CraetionUserRequest';
import { LoginRequest } from './requests/LoginRequest';
import { UpdationUserRequest } from './requests/UpdationUserRequest';
import { ErrorResponse } from './responses/ErrorResponse';
import { SuccessResponse } from './responses/SuccessResponse';
import { UserResponse } from './responses/UserResponse';

@JsonController('/user')
@OpenAPI({
    tags: ['User'],
})
export class UserController {

    public constructor(
        private userService: UserService
    ) { }

    @Post('/login')
    @OpenAPI({
        tags: ['User'], summary: 'login user',
        responses: { 200: { headers: { 'Set-Cookie': { schema: {
            type: 'string', example: '_auth=abcdefghijklmnopqrstuvwxyz;Path=/;HttpOnly;SameSite=Strict;Secure' }, description: 'JWT access token in cookie' } },
        } },
    })
    @ResponseSchema(SuccessResponse, { description: 'OK. Login' })
    @ResponseSchema(ErrorResponse, { description: 'Login or password not correct.', statusCode: '400' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied.', statusCode: '403' })
    public async login(
        @Body({ validate: { whitelist: true } }) userData: LoginRequest, @Res() res: express.Response
    ): Promise<SuccessResponse> {
        const credentials = await this.userService.loginUser(
            userData.login, crypto.createHash('md5').update(userData.password).digest('hex')
        );
        const successResponse = new SuccessResponse();
        successResponse.status = 'OK';
        res.cookie('_auth', credentials.token, {
            httpOnly: env.app.cookie.httpOnly,
            secure: env.app.cookie.secure,
            sameSite: env.app.cookie.sameSite,
        });
        return successResponse;
    }

    @Post('/registration')
    @OpenAPI({
        summary: 'create user',
    })
    @ResponseSchema(UserResponse, { description: 'user' })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public async createReferee(
        @Body({ required: true, validate: true }) body: CreationUserRequest, @Res() res: express.Response
    ): Promise<UserResponse> {
        const credentials = await this.userService.registrationUser(body);
        res.cookie('_auth', credentials.token, {
            httpOnly: env.app.cookie.httpOnly,
            secure: env.app.cookie.secure,
            sameSite: env.app.cookie.sameSite,
        });
        return credentials.user;
    }

    @Get('/roles')
    @OpenAPI({
        summary: 'get roles',
    })
    @ResponseSchema(String, { isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getRoles(): Promise<UserRole[]> {
        return this.userService.getRoles();
    }

    @Authorized(['user', 'referee'])
    @Get('/')
    @OpenAPI({
        summary: 'get users', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(UserResponse, { isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public getUsers(@CurrentUser() user: User): Promise<UserResponse[]> {
        console.log(user);
        return this.userService.getUsers();
    }

    @Authorized(['user'])
    @Get('/me')
    @OpenAPI({
        summary: 'get users', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(UserResponse, { isArray: true })
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public async getMe(@CurrentUser() user: User): Promise<UserResponse> {
        return plainToClass<UserResponse, User>(
            UserResponse,
            user,
            { excludeExtraneousValues: true }
        );
    }

    @Authorized(['user'])
    @Put('/')
    @OpenAPI({
        summary: 'update user', security: [{ CookieAuth: [] }],
    })
    @ResponseSchema(UserResponse)
    @ResponseSchema(ErrorResponse, { description: 'Unauthorized', statusCode: '401' })
    @ResponseSchema(ErrorResponse, { description: 'Access denied', statusCode: '403' })
    public updateTeam(
        @CurrentUser() user: User, @Body({ required: true, validate: true }) body: UpdationUserRequest
    ): Promise<UserResponse> {
        return this.userService.updateTeam(user.id, body);
    }
}
