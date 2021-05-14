import { EntityRepository, Repository } from 'typeorm';

import { Referee } from '../models/Referee';

@EntityRepository(Referee)
export class RefereeRepository extends Repository<Referee>  {

}
