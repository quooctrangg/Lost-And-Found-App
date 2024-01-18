import { IsNotEmpty, IsString } from "class-validator";

export class UpdateVerifyStatusDto {
    @IsString()
    @IsNotEmpty()
    name: string
}