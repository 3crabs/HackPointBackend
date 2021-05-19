import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class RefereePointResponse {

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

}

export class RefereeNoteResponse {

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

}

export class RefereeResponse {

    @Expose()
    @IsInt()
    public id: number;

    @Expose()
    @IsString()
    public name: string;

    @Expose()
    @IsOptional()
    @IsString()
    public surname: string;

    @Expose()
    @IsOptional()
    @IsString()
    public type: string;

    @Expose()
    @IsOptional()
    @IsString()
    public login: string;

    @Expose()
    @IsOptional()
    @IsString()
    public password: string;

    @Expose()
    @ValidateNested({ each: true })
    @Type(() => RefereePointResponse)
    public points: RefereePointResponse[];

    @Expose()
    @ValidateNested({ each: true })
    @Type(() => RefereeNoteResponse)
    public notes: RefereeNoteResponse[];

}
