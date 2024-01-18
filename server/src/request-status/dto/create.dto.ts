import { IsNotEmpty, IsString } from "class-validator";

export class CreateRequestStatusDto {
    @IsString()
    @IsNotEmpty()
    name: string
}