import { EntityRepository, Repository } from 'typeorm';

import { Hackaton } from '../models/Hackaton';

@EntityRepository(Hackaton)
export class HackatonRepository extends Repository<Hackaton>  {

}
