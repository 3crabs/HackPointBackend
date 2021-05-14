import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class RefereeResponse {

    @Expose()
    @IsInt()
    public id: number;

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsOptional()
    @IsString()
    public surname: string;

    @Expose()
    @IsOptional()
    @IsString()
    public type: string;

    @Expose()
    @IsOptional()
    @IsString()
    public login: string;

    @Expose()
    @IsOptional()
    @IsString()
    public password: string;

}
