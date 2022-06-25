import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { Logger } from '../lib/logger';
import { AuthService } from './AuthService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function authorizationChecker(connection: Connection): (action: Action, roles: any[]) => Promise<boolean> | boolean {
    const log = new Logger(__filename);
    const authService = Container.get<AuthService>(AuthService);

    return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {

        let user: any;
        for (const role of roles) {
            // if (roles.find((element) => element.startsWith('referee'))) {
            //     user = await authService.getAdminByAccessCookie(action.request);
            // } else {
            //     user = await authService.getUserByAccessToken(action.request);
            // }
            if (role === 'referee') {
                user = await authService.getAdminByAccessCookie(action.request);
            } else {
                user = await authService.getUserByAccessToken(action.request);
            }
            if (user) {
                break;
            }
        }
        if (user === undefined) {
            log.warn('authorizationChecker:innerAuthorizationChecker:warning', { message: 'No credentials given' });
            return false;
        }

        action.request.user = user;
        if (action.request.user === undefined) {
            log.warn('authorizationChecker:innerAuthorizationChecker:warning', { message: 'Invalid credentials given' });
            return false;
        }
        log.info('authorizationChecker:innerAuthorizationChecker', { message: 'successful' });
        return true;
    };
}
