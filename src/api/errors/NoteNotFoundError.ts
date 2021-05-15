import { HttpError } from 'routing-controllers';

export class NoteNotFoundError extends HttpError {
    public constructor() {
        super(404, 'Note not found!');
    }
}
