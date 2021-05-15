import { EntityRepository, Repository } from 'typeorm';

import { Point } from '../models/Point';

@EntityRepository(Point)
export class PointRepository extends Repository<Point>  {

}
