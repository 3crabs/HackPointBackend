import { HttpError } from 'routing-controllers';

export class TeamNotFoundError extends HttpError {
    public constructor() {
        super(404, 'Team not found!');
    }
}
