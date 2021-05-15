import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { RefereeResponse } from './RefereeResponse';

export class SuccessResponse {

    @JSONSchema({ example: 'OK' })
    @IsString()
    public status: string;

    @JSONSchema({ example: 'Success operation' })
    @IsString()
    public message: string;

    @IsString()
    public token?: string;

    @ValidateNested({ each: true })
    @Type(() => RefereeResponse)
    @IsObject()
    public referee?: RefereeResponse;
}
