import { IsNotEmpty, MaxLength } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { IsCorrectCredentials } from '../../validators/IsCorrectCredentials';

export class LoginRequest {

    @JSONSchema({ example: 'admin' })
    @IsCorrectCredentials()
    @IsNotEmpty()
    @MaxLength(150)
    public login: string;

    @JSONSchema({ example: 'pass' })
    @IsNotEmpty()
    @MaxLength(150)
    public password: string;

}
