import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreationNewsRequest {

    @IsString()
    public title: string;

    @IsOptional()
    @IsString()
    public description: string;

    @IsOptional()
    @IsISO8601()
    public date: Date;

}
