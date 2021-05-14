import { HttpError } from 'routing-controllers';

export class RefereeNotFoundError extends HttpError {
    public constructor() {
        super(404, 'Referee not found!');
    }
}
