import { Expose, Type } from 'class-transformer';
import {
    IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString, ValidateNested
} from 'class-validator';

import { UserRole } from '../../models/enums/UserRole';
import { RefereeResponse } from './RefereeResponse';
import { TeamResponse } from './TeamResponse';

export class UserResponse {

    @Expose()
    @IsInt()
    public id: string;

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public surname: string;

    @Expose()
    @IsString()
    public login: string;

    @Expose()
    @IsString()
    public github: string;

    @Expose()
    @IsBoolean()
    public isVerified: boolean;

    @Expose()
    @IsInt()
    public createdAt: number;

    @Expose()
    @IsInt()
    public teamId: number;

    @Expose()
    @IsEnum(UserRole)
    public role: UserRole;

    @Expose()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RefereeResponse)
    @IsObject()
    public referee: RefereeResponse;

    @Expose()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => TeamResponse)
    @IsObject()
    public team: TeamResponse;

}
