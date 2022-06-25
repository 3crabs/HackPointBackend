import { Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class TeamUserResponse {

    @Expose()
    @IsInt()
    public id: number;

    @Expose()
    @IsString()
    public name: string;

}
