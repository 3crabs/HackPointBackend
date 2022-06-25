import { IsNotEmpty, MaxLength } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { IsCorrectCredentialsAdmin } from '../../validators/IsCorrectCredentialsAdmin';

export class AdminLoginRequest {

    @JSONSchema({ example: 'admin' })
    @IsCorrectCredentialsAdmin()
    @IsNotEmpty()
    @MaxLength(150)
    public login: string;

    @JSONSchema({ example: 'pass' })
    @IsNotEmpty()
    @MaxLength(150)
    public password: string;

}
