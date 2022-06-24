import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class UserResponse {

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
    @IsBoolean()
    public isReferee: boolean;

    @Expose()
    @IsInt()
    public createdAt: number;

}
