import { IsString } from 'class-validator';

export class CreationTeamUserRequest {

    @IsString()
    public name: string;

}
