import { Expose, Type } from 'class-transformer';
import { IsInt, IsObject, IsString, ValidateNested } from 'class-validator';

import { CriterionResponse } from './CriterionResponse';
import { RefereeResponse } from './RefereeResponse';

export class NoteResponse {

    @Expose()
    @IsInt()
    public id: string;

    @Expose()
    @IsString()
    public text: string;

    @Expose()
    @IsInt()
    public refereeId: number;

    @Expose()
    @IsInt()
    public criterionId: number;

    @Expose()
    @ValidateNested({ each: true })
    @Type(() => RefereeResponse)
    @IsObject()
    public referee: RefereeResponse;

    @Expose()
    @ValidateNested({ each: true })
    @Type(() => RefereeResponse)
    @IsObject()
    public criterion: CriterionResponse;
}

