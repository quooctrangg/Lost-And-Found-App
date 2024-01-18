import { IsNotEmpty, IsString } from "class-validator";

export class CreateVerifyStatusDto {
    @IsString()
    @IsNotEmpty()
    name: string
}