import { plainToClass } from 'class-transformer';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { CreationUserRequest } from '../controllers/requests/CraetionUserRequest';
import { UpdationUserRequest } from '../controllers/requests/UpdationUserRequest';
import { UserResponse } from '../controllers/responses/UserResponse';
import { UserRole } from '../models/enums/UserRole';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

@Service()
export class UserService {

    public constructor(
        @OrmRepository() private userRepository: UserRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async loginUser(login: string, password: string): Promise<{ token: string; user: any }> {
        this.log.info('UserService:loginUser', { login });
        const user: User = await this.userRepository.findOne({
            where: {
                login,
                password,
            },
        });
        const token: string = jwt.sign({ userId: user.id, login: user.login, exp: Date.now() + (7200 * 1000) }, env.app.jwtSecret);
        await this.userRepository.update(user.id, { token });
        this.log.info('UserService:updateUser:updated', { userId: user.id });
        return { token, user };
    }

    public async registrationUser(body: CreationUserRequest): Promise<{ user: UserResponse; token: string }> {
        this.log.info('UserService:registrationUser', { body });
        if (await this.userRepository.findOne({ where: { login: body.login }})) {
            throw new BadRequestError('Login duplicated');
        }
        const newUser = new User();
        newUser.name = body.name;
        newUser.surname = body.surname;
        newUser.login = body.login;
        newUser.password = crypto.createHash('md5').update(body.password).digest('hex');
        newUser.github = body.github;
        newUser.isReferee = false;
        newUser.role = body.role;
        newUser.isVerified = false;
        const user = await this.userRepository.save(newUser);
        const token: string = jwt.sign({ userId: user.id, login: user.login, exp: Date.now() + (7200 * 1000) }, env.app.jwtSecret);
        await this.userRepository.update(user.id, { token });
        this.log.info('UserService:registrationUser:created', { userId: user.id });
        return  { user: plainToClass<UserResponse, User>(
            UserResponse,
            user,
            { excludeExtraneousValues: true }
        ), token };
    }

    public async getRoles(): Promise<UserRole[]> {
        return Object.values(UserRole);
    }

    public async getUsers(): Promise<UserResponse[]> {
        const user = await this.userRepository.find({ relations: ['team', 'referee'] });
        return plainToClass<UserResponse, User>(
            UserResponse,
            user,
            { excludeExtraneousValues: true }
        );
    }

    public async updateTeam(userId: number, body: UpdationUserRequest): Promise<UserResponse | undefined> {
        this.log.info('UserService:updateTeam', { body });
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            return undefined;
        }
        if (await this.userRepository.findOne({ where: { login: body.login}})) {
            throw new BadRequestError('Duplicated login');
        }
        body.id = user.id;
        const savedTeam = await this.userRepository.save(body);
        return plainToClass<UserResponse, User>(
            UserResponse,
            await this.userRepository.findOne(savedTeam.id, { relations: ['team'] }),
            { excludeExtraneousValues: true }
        );
    }
}
