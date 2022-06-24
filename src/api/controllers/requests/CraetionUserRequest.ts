import { IsOptional, IsString } from 'class-validator';

export class CreationUserRequest {

    @IsString()
    public name: string;

    @IsOptional()
    @IsString()
    public surname: string;

    @IsOptional()
    @IsString()
    public birthDate: number;

    @IsOptional()
    @IsString()
    public login: string;

    @IsOptional()
    @IsString()
    public github: string;

    @IsString()
    public password: string;

}
