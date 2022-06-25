import * as express from 'express';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { RefereeRepository } from '../api/repositories/RefereeRepository';
import { UserRepository } from '../api/repositories/UserRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';

@Service()
export class AuthService {

    public constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private refereeRepository: RefereeRepository,
        @OrmRepository() private userRepository: UserRepository
    ) { }

    public async getUserByAccessToken(req: express.Request & IncomingMessage): Promise<any> {

        const authorization = req.cookies['_auth'];
        console.log(req.cookies['_auth']);

        if (authorization) {
            this.log.info('AuthService:getUserByAccessToken', { message: 'Admin credentials provided by the client' });
            let decoded: any;
            try {
                decoded = jwt.verify(authorization, env.app.jwtSecret);
            } catch (error) {
                return undefined;
            }
            if (decoded.exp < Date.now()) {
                return undefined;
            }
            const userId = decoded.userId;
            if (userId) {
                const user = await this.userRepository.findOne(userId, { relations: ['team'] });
                if (!user) {
                    this.log.warn('AuthService:getUserByAccessToken', { message: 'This user was deleted by system', userId });
                    return undefined;
                }
                return user;
            }
        }
        this.log.warn('AuthService:getUserByAccessToken', { message: 'No credentials provided by the client' });
        return undefined;
    }

    public async getAdminByAccessCookie(req: express.Request & IncomingMessage): Promise<any> {

        const authorization = req.cookies['_auth'];
        console.log(req.cookies['_auth']);

        if (authorization) {
            this.log.info('AuthService:getAdminByAccessCookie', { message: 'Admin credentials provided by the client' });
            // const refereeByToken = await this.refereeRepository.findOne({
            //     where: {
            //         token: authorization,
            //     },
            // });
            // console.log(refereeByToken);
            let decoded: any;
            try {
                decoded = jwt.verify(authorization, env.app.jwtSecret);
            } catch (error) {
                return undefined;
            }
            if (decoded.exp < Date.now()) {
                return undefined;
            }
            console.log(decoded);
            const refereeId = decoded.refereeId;
            if (refereeId) {
                const referee = await this.refereeRepository.findOne(refereeId);
                if (!referee) {
                    this.log.warn('AuthService:getAdminByAccessCookie', { message: 'This user was deleted by system', refereeId });
                    return undefined;
                }
                return referee;
            }
        }
        this.log.warn('AuthService:getAdminByAccessCookie', { message: 'No credentials provided by the client' });
        return undefined;
    }

}
