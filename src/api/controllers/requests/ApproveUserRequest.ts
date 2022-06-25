import { IsEnum } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { UserRole } from '../../models/enums/UserRole';

export class ApproveUserRequest {

    @JSONSchema({ example: UserRole.EXPERT })
    @IsEnum(UserRole)
    public role: UserRole;

}
