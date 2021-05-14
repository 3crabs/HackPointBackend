import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreationCriterionRequest {

    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public description: string;

    @IsOptional()
    @IsInt()
    public priority: number;

}
