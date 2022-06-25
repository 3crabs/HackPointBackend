import { Expose } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class HackatonResponse {

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public place: string;

    @Expose()
    @IsString()
    public banner: string;

    @Expose()
    @IsString()
    public description: string;

    @Expose()
    @IsNumber()
    public createdAt: number;

    @Expose()
    @IsDate()
    public dateStart: Date;

    @Expose()
    @IsDate()
    public dateEnd: Date;

    @Expose()
    @IsArray()
    public program: { date: { time: string; description: string }}[];
}
