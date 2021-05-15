import { Expose, Type } from 'class-transformer';
import { IsInt, IsObject, ValidateNested } from 'class-validator';

import { CriterionResponse } from './CriterionResponse';
import { RefereeResponse } from './RefereeResponse';

export class PointResponse {

    @Expose()
    @IsInt()
    public id: string;

    @Expose()
    @IsInt()
    public point: number;

    @Expose()
    @IsInt()
    public criterionId: number;

    @Expose()
    @IsInt()
    public refereeId: number;

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

