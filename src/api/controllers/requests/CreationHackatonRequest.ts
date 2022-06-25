import { IsArray, IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreationHackatonRequest {

    @IsString()
    public name: string;

    @IsOptional()
    @IsISO8601()
    public dateStart: Date;

    @IsOptional()
    @IsISO8601()
    public dateEnd: Date;

    @IsOptional()
    @IsString()
    public place: string;

    @IsOptional()
    @IsArray()
    public program: { date: [{ time: string; description: string }] }[];

    @IsOptional()
    @IsString()
    public description: string;

    // TODO: banner
    @IsOptional()
    @IsString()
    public banner: string;


}
