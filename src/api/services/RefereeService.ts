import { plainToClass } from 'class-transformer';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { CreationRefereeRequest } from '../controllers/requests/CreationRefereeRequest';
import { UpdationRefereeRequest } from '../controllers/requests/UpdationRefereeRequest';
import { RefereeResponse } from '../controllers/responses/RefereeResponse';
import { Referee } from '../models/Referee';
import { RefereeRepository } from '../repositories/RefereeRepository';

@Service()
export class RefereeService {

    public constructor(
        @OrmRepository() private refereeRepository: RefereeRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async getReferees(skip: number = 0, take: number = 20): Promise<RefereeResponse[]> {
        this.log.info('RefereeService:find', { skip, take });
        const referees: Referee[] = await this.refereeRepository.find({ skip, take });
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            referees,
            { excludeExtraneousValues: true }
        );
    }

    public async getRefereeById(id: number): Promise<RefereeResponse | undefined> {
        this.log.info('RefereeService:getRefereeById', { RefereeId: id });
        const referee = await this.refereeRepository.findOne({ id });
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            referee,
            { excludeExtraneousValues: true }
        );
    }

    public async deleteReferee(id: number): Promise<RefereeResponse | undefined> {
        this.log.info('RefereeService:deleteReferee', { refereeId: id });
        const referee = await this.refereeRepository.findOne({ id });
        if (!referee) {
            return undefined;
        }
        await this.refereeRepository.delete(referee.id);
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            referee,
            { excludeExtraneousValues: true }
        );
    }

    // Метод для добавления
    public async createReferee(body: CreationRefereeRequest): Promise<RefereeResponse> {
        this.log.info('RefereeService:createReferee', { body });
        const newReferee = new Referee();
        newReferee.name = body.name;
        newReferee.login = body.login;
        newReferee.password = crypto.createHash('md5').update(body.password).digest('hex');
        const savedReferee = await this.refereeRepository.save(newReferee);
        this.log.info('RefereeService:addReferee:created', { refereeId: savedReferee.id });
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            await this.refereeRepository.findOne(savedReferee.id),
            { excludeExtraneousValues: true }
        );
    }

    public async updateReferee(refereeId: number, body: UpdationRefereeRequest): Promise<RefereeResponse | undefined> {
        this.log.info('RefereeService:updateReferee', { body });
        const referee = await this.refereeRepository.findOne(refereeId);
        if (!referee) {
            return undefined;
        }
        body.id = referee.id;
        const savedReferee = await this.refereeRepository.save(body);
        return plainToClass<RefereeResponse, Referee>(
            RefereeResponse,
            await this.refereeRepository.findOne(savedReferee.id),
            { excludeExtraneousValues: true }
        );
    }

    public async loginReferee(login: string, password: string): Promise<string> {
        this.log.info('RefereeService:loginReferee', { login });
        const referee: Referee = await this.refereeRepository.findOne({
            where: {
                login,
                password,
            },
        });
        const token: string = jwt.sign({ refereeId: referee.id, login: referee.login }, env.app.jwtSecret);
        const redisClient = (global as any).frameworkSettings.getData('redis_client');
        await redisClient.setAsync(token, JSON.stringify({ refereeId: referee.id, login: referee.login, role: referee.type }));
        return token;
    }

    public async logoutReferee(cookie: string): Promise<void> {
        this.log.info('RefereeService:logoutReferee');
        const redisClient = (global as any).frameworkSettings.getData('redis_client');
        if (cookie) {
            await redisClient.delAsync(cookie);
        }
    }

}
