import { Expose } from 'class-transformer';
import { IsInt, IsISO8601, IsNumber, IsString } from 'class-validator';

export class NewsResponse {

    @Expose()
    @IsInt()
    public id: number;

    @Expose()
    @IsString()
    public title: string;

    @Expose()
    @IsString()
    public description: string;

    @Expose()
    @IsString()
    public banner: string;

    @Expose()
    @IsISO8601()
    public date: Date;

    @Expose()
    @IsNumber()
    public createdAt: number;
}
