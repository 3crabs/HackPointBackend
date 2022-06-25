import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '../../models/enums/UserRole';

export class CreationUserRequest {

    @IsString()
    public name: string;

    @IsBoolean()
    public checkBox: boolean;

    @IsOptional()
    @IsString()
    public surname: string;

    @IsOptional()
    @IsEmail()
    public phone: string;

    @IsOptional()
    @IsString()
    public email: string;

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
