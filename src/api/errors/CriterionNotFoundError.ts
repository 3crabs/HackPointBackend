import { HttpError } from 'routing-controllers';

export class CriterionNotFoundError extends HttpError {
    public constructor() {
        super(404, 'Criterion not found!');
    }
}
