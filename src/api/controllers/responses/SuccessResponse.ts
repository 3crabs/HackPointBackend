import { IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class SuccessResponse {

    @JSONSchema({ example: 'OK' })
    @IsString()
    public status: string;

    @JSONSchema({ example: 'Success operation' })
    @IsString()
    public message: string;

}
