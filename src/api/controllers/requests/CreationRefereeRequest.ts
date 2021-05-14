import { IsEnum, IsOptional, IsString } from 'class-validator';

import { StatusTeam } from '../../models/Referee';

export class CreationRefereeRequest {

    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public surname: string;

    @IsOptional()
    @IsEnum(StatusTeam)
    public type: string;

    @IsOptional()
    @IsString()
    public login: string;

    @IsOptional()
    @IsString()
    public password: string;

}
