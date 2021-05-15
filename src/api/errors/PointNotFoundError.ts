import { HttpError } from 'routing-controllers';

export class PointNotFoundError extends HttpError {
    public constructor() {
        super(404, 'Point not found!');
    }
}
