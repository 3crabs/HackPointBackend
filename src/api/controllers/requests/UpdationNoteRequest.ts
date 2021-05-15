import { IsInt, IsString } from 'class-validator';

export class UpdationNoteRequest {

    @IsString()
    public text: string;

    @IsInt()
    public teamId: number;
}
