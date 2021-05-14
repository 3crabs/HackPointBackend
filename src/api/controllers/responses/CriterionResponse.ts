import { Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CriterionResponse {

    @Expose()
    @IsInt()
    public id: string;

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsString()
    public description: string;

    @Expose()
    @IsInt()
    public priority: number;

}

