import { plainToClass } from 'class-transformer';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CreationCriterionRequest } from '../controllers/requests/CreationCriterionRequest';
import { UpdationCriterionRequest } from '../controllers/requests/UpdationCriterionRequest';
import { CriterionResponse } from '../controllers/responses/CriterionResponse';
import { Criterion } from '../models/Criterion';
import { CriterionRepository } from '../repositories/CriterionRepository';

@Service()
export class CriterionService {

    public constructor(
        @OrmRepository() private criterionRepository: CriterionRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async getCriterions(skip: number = 0, take: number = 20): Promise<CriterionResponse[]> {
        this.log.info('CriterionService:find', { skip, take });
        const criterions: Criterion[] = await this.criterionRepository.find({
            skip,
            take,
            order: { priority: 'ASC' },
        });
        return plainToClass<CriterionResponse, Criterion>(
            CriterionResponse,
            criterions,
            { excludeExtraneousValues: true }
        );
    }

    public async getCriterionById(id: number): Promise<CriterionResponse | undefined> {
        this.log.info('CriterionService:getCriterionById', { CriterionId: id });
        const criterion = await this.criterionRepository.findOne(id);
        return plainToClass<CriterionResponse, Criterion>(
            CriterionResponse,
            criterion,
            { excludeExtraneousValues: true }
        );
    }

    public async deleteCriterion(id: number): Promise<CriterionResponse | undefined> {
        this.log.info('CriterionService:deleteCriterion', { criterionId: id });
        const criterion = await this.criterionRepository.findOne({ id });
        if (!criterion) {
            return undefined;
        }
        await this.criterionRepository.delete(criterion.id);
        return plainToClass<CriterionResponse, Criterion>(
            CriterionResponse,
            criterion,
            { excludeExtraneousValues: true }
        );
    }

    // Метод для добавления
    public async createCriterion(body: CreationCriterionRequest): Promise<CriterionResponse> {
        this.log.info('CriterionService:createCriterion', { body });
        const newCriterion = new Criterion();
        newCriterion.name = body.name;
        newCriterion.description = body.description;
        newCriterion.priority = body.priority;
        const savedCriterion = await this.criterionRepository.save(newCriterion);
        this.log.info('CriterionService:addCriterion:created', { criterionId: savedCriterion.id });
        return plainToClass<CriterionResponse, Criterion>(
            CriterionResponse,
            await this.criterionRepository.findOne(savedCriterion.id),
            { excludeExtraneousValues: true }
        );
    }

    public async updateCriterion(criterionId: number, body: UpdationCriterionRequest): Promise<CriterionResponse | undefined> {
        this.log.info('CriterionService:updateCriterion', { body });
        const criterion = await this.criterionRepository.findOne(criterionId);
        if (!criterion) {
            return undefined;
        }
        body.id = criterion.id;
        const savedCriterion = await this.criterionRepository.save(body);
        return plainToClass<CriterionResponse, Criterion>(
            CriterionResponse,
            await this.criterionRepository.findOne(savedCriterion.id),
            { excludeExtraneousValues: true }
        );
    }

}
