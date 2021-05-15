import { IsString } from 'class-validator';

export class UpdationNoteRequest {

    @IsString()
    public text: string;
}
