import { EntityRepository, Repository } from 'typeorm';

import { News } from '../models/News';

@EntityRepository(News)
export class NewsRepository extends Repository<News>  {

}
