import { plainToClass } from 'class-transformer';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CreationHackatonRequest } from '../controllers/requests/CreationHackatonRequest';
import { HackatonResponse } from '../controllers/responses/HackatonResponse';
import { Hackaton } from '../models/Hackaton';
import { HackatonRepository } from '../repositories/HackatonRepository';

@Service()
export class HackatonService {

    public constructor(
        @OrmRepository() private hackatonRepository: HackatonRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async createHackaton(body: CreationHackatonRequest): Promise<HackatonResponse> {
        this.log.info('HackatonService:createHackaton', { body });
        const newHackaton = new Hackaton();
        newHackaton.name = body.name;
        newHackaton.dateStart = body.dateStart;
        newHackaton.dateEnd = body.dateEnd;
        newHackaton.description = body.description;
        newHackaton.place = body.place;
        newHackaton.program = body.program;
        newHackaton.banner = body.banner;
        const savedHackaton = await this.hackatonRepository.save(newHackaton);
        this.log.info('HackatonService:createHackaton:created', { hackId: savedHackaton.id });
        return plainToClass<HackatonResponse, Hackaton>(
            HackatonResponse,
            await this.hackatonRepository.findOne(savedHackaton.id),
            { excludeExtraneousValues: true }
        );
    }

    public async getHackaton(): Promise<HackatonResponse> {
        this.log.info('HackatonService:getHackaton');
        const hackatons = await this.hackatonRepository.find();
        return plainToClass<HackatonResponse, Hackaton>(
            HackatonResponse,
            hackatons[0],
            { excludeExtraneousValues: true }
        );
    }
}
