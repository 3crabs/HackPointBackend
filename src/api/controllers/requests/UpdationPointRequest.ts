import { IsInt, Max, Min } from 'class-validator';

export class UpdationPointRequest {

    @IsInt()
    @Min(0)
    @Max(10)
    public point: number;

}
