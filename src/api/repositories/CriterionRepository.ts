import { EntityRepository, Repository } from 'typeorm';

import { Criterion } from '../models/Criterion';

@EntityRepository(Criterion)
export class CriterionRepository extends Repository<Criterion>  {

}
