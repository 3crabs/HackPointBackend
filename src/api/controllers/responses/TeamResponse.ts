import { Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

import { StatusTeam } from '../../models/Team';

export class TeamResponse {

    @Expose()
    @IsInt()
    public id: string;

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public nameProject: string;

    @Expose()
    @IsString()
    public descriptionTeam: string;

    @Expose()
    @IsString()
    public descriptionReferee: string;

    @Expose()
    @IsEnum(StatusTeam)
    public statusFirstPitch: string;

    @Expose()
    @IsEnum(StatusTeam)
    public statusSecondPitch: string;

    @Expose()
    @IsEnum(StatusTeam)
    public statusFinalPitch: string;

    @Expose()
    @IsString()
    public isBlocked: boolean;

    @Expose()
    @IsNumber()
    public createdAt: number;
}
