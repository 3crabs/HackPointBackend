import { HttpError } from 'routing-controllers';

export class AccessDeniedError extends HttpError {
    public constructor() {
        super(403, 'Access denied!');
    }
}
