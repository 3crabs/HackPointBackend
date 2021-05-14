import * as express from 'express';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { RefereeRepository } from '../api/repositories/RefereeRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';

@Service()
export class AuthService {

    public constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private refereeRepository: RefereeRepository
    ) { }

    public async getMerchantByAccessToken(req: IncomingMessage | express.Request): Promise<any> {

        const authorization: string = req.headers.authorization;

        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            this.log.info('AuthService:getMerchantByAccessToken', { message: 'Credentials provided by the client' });
            const accessToken: string = authorization.split(' ')[1];
            if (!accessToken) {
                this.log.warn('AuthService:getMerchantByAccessToken', { message: 'Token not found.' });
                return undefined;
            }
            // const merchant: Merchant = await this.merchantRepository.findOne({
            //     where: {
            //         id: accessToken,
            //     },
            //     relations: ['permissionList'],
            // });
            // if (!merchant) {
            //     this.log.warn('AuthService:getMerchantByAccessToken', { message: 'Merchant not found in system.' });
            //     return undefined;
            // }
            // if (merchant.name !== 'fee' && !merchant.permissionList.canLogin) {
            //     this.log.warn('AuthService:getMerchantByAccessToken', { message: 'Merchant blocked by system.' });
            //     return undefined;
            // }
            // return merchant;
        }
        this.log.warn('AuthService:getMerchantByAccessToken', { message: 'No credentials provided by the client.' });
        return undefined;
    }

    public async getAdminByAccessCookie(req: express.Request & IncomingMessage): Promise<any> {

        if (!req.headers.cookie) {
            return undefined;
        }
        const authorization = req.headers.cookie.split('=')[1];

        if (authorization) {
            this.log.info('AuthService:getAdminByAccessCookie', { message: 'Admin credentials provided by the client' });
            const redisClient = (global as any).frameworkSettings.getData('redis_client');
            if (await redisClient.getAsync(authorization) === null) {
                return undefined;
            }
            let decoded: any;
            try {
                decoded = jwt.verify(authorization, env.app.jwtSecret);
            } catch (error) {
                return undefined;
            }
            if (decoded.exp < Date.now()) {
                return undefined;
            }
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
