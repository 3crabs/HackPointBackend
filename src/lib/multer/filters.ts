import * as express from 'express';
import path from 'path';

// import { UnauthorizedError } from 'routing-controllers';
// import { Container } from 'typedi';

// import { AuthService } from '../../auth/AuthService';

export async function fileFilter(
    req: Express.Request | express.Request,
    file: any,
    cb: (error: Error | null, acceptFile: boolean) => void
): Promise<void> {
    // const authService = Container.get<AuthService>(AuthService);
    // const currentAdmin = await authService.getUserByAccessCookie(req as express.Request);
    // if (!currentAdmin?.permissionList.admin_canManageEvents) {
    //     const error = new UnauthorizedError('Authorization is required for that request');
    //     error.name = 'AuthorizationRequiredError';
    //     return cb(
    //         error,
    //         false
    //     );
    // }
    const ext = path.extname(file.originalname);
    const extensions = ['.jpg', '.jpeg', '.png'];
    if (!extensions.includes(ext)) {
        return cb(
            new Error('File error'),
            false
        );
    }
    cb(undefined, true);
}
