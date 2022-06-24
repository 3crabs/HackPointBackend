import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '../../models/enums/UserRole';

export class CreationUserRequest {

    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public surname: string;

    @IsString()
    public login: string;

    @IsEnum(UserRole)
    @IsOptional()
    public role: UserRole = UserRole.PARTICIPANT;

    @IsOptional()
    @IsString()
    public github: string;

    @IsString()
    public password: string;

}
