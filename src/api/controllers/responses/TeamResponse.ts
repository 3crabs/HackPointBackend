import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsString, ValidateNested } from 'class-validator';

import { StatusTeam } from '../../models/Team';

export class TeamResponse {

    @Expose()
    @IsInt()
    public id: number;

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

    @Expose()
    @ValidateNested({ each: true })
    @Type(() => TeamUserResponse)
    public users: TeamUserResponse[];

    @IsInt()
    public point: number;

    @IsInt()
    public amountAll: number;

    @IsInt()
    public amountReferee: number;

    @IsInt()
    public amountNotReferee: number;
}

export class TeamUserResponse {

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

}
