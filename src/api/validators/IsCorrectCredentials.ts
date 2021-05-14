import {
    registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import * as crypto from 'crypto';
import { getConnection } from 'typeorm';

import { RefereeLoginRequest } from '../controllers/requests/RefereeLoginRequest';
import { Referee } from '../models/Referee';

@ValidatorConstraint({ async: true })
export class IsCorrectCredentialsConstraint implements ValidatorConstraintInterface {

    public async validate(text: string, args: ValidationArguments): Promise<boolean> {
        const connection = getConnection();
        const refereeLogin = args.object as RefereeLoginRequest;
        const referee = await connection.getRepository(Referee).findOne({
            where: {
                login: refereeLogin.login,
                password: crypto.createHash('md5').update(refereeLogin.password).digest('hex'),
            },
        });
        if (referee) {
            return true;
        } else {
            return false;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public defaultMessage(args: ValidationArguments): string { // here you can provide default error message if validation failed
        return 'Login or password not correct!';
    }

}

// eslint-disable-next-line @typescript-eslint/ban-types
export function IsCorrectCredentials(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCorrectCredentialsConstraint,
        });
    };
}
