import { IsEnum, IsOptional, IsString } from 'class-validator';

import { RoleReferee } from '../../models/Referee';

export class CreationRefereeRequest {

    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public surname: string;

    @IsOptional()
    @IsEnum(RoleReferee)
    public type: string;

    @IsOptional()
    @IsString()
    public login: string;

    @IsOptional()
    @IsString()
    public password: string;

}
