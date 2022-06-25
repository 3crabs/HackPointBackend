import { Expose, Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

import { RefereeResponse } from './RefereeResponse';
import { TeamResponse } from './TeamResponse';

export class UserResponse {

    @Expose()
    @IsInt()
    public id: string;

    @Expose()
    @IsString()
    public login: string;

    @Expose()
    @IsString()
    public github: string;

    @Expose()
    @IsInt()
    public createdAt: number;

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
