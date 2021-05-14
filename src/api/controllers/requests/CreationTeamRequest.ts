import { IsEnum, IsOptional, IsString } from 'class-validator';

import { StatusTeam } from '../../models/Team';

export class CreationTeamRequest {

    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public nameProject: string;

    @IsOptional()
    @IsString()
    public descriptionTeam: string;

    @IsOptional()
    @IsString()
    public descriptionReferee: string;

    @IsOptional()
    @IsEnum(StatusTeam)
    public statusFirstPitch: string;

    @IsOptional()
    @IsEnum(StatusTeam)
    public statusSecondPitch: string;

    @IsOptional()
    @IsEnum(StatusTeam)
    public statusFinalPitch: string;

}
