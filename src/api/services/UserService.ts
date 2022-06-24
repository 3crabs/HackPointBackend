import { plainToClass } from 'class-transformer';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { CreationUserRequest } from '../controllers/requests/CraetionUserRequest';
import { UserResponse } from '../controllers/responses/UserResponse';
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
        const newUser = new User();
        newUser.name = body.name;
        newUser.surname = body.surname;
        newUser.login = body.login;
        newUser.password = crypto.createHash('md5').update(body.password).digest('hex');
        newUser.github = body.github;
        newUser.birthDate = body.birthDate;
        newUser.isReferee = false;
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
}
