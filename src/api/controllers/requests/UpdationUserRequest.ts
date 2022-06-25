import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdationUserRequest {

    @IsOptional()
    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public surname: string;

    @IsOptional()
    @IsString()
    public github: string;

    @IsOptional()
    @IsString()
    public login: string;

    @IsOptional()
    @IsInt()
    public teamId: number;

    public id: number;

}
