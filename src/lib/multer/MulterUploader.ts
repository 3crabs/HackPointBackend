import crypto from 'crypto';
import multer from 'multer';

import { env } from '../../env';

export function createMulterInstance(
    limits: any,
    fileFilter: (
        req: Express.Request,
        file: any,
        callback: (error: Error | null, acceptFile: boolean) => void
    ) => void
): multer.Instance {
    return multer({
        limits,
        storage: multer.diskStorage({
            destination: (req: Express.Request, file: any, cb: any): void => {
                cb(undefined, env.app.images);
            },
            filename: (req: Express.Request, file: any, cb: any) => {
                crypto.pseudoRandomBytes(16, (err, raw) => {
                    cb(err, err ? undefined : (raw.toString('hex') + file.originalname.substr(file.originalname.lastIndexOf('.'))) );
                });
            },
        }),
        fileFilter,
    });
}
