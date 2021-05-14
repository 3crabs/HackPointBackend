import { createParamDecorator } from 'routing-controllers';

export function AccessCookie(): any {
    return createParamDecorator({
        value: action => {
            if (action.request.headers?.cookie) {
                return action.request.headers?.cookie.split('=')[1];
            } else {
                return false;
            }
        },
    });
}
