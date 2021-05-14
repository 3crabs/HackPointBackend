import { Action } from 'routing-controllers';
import { Connection } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function currentUserChecker(connection: Connection): (action: Action) => Promise<any> {
    return async function innerCurrentUserChecker(action: Action): Promise<any> {
        return action.request.user;
    };
}
