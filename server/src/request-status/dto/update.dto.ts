import { IsNotEmpty, IsString } from "class-validator";

export class UpdateRequestStatusDto {
    @IsString()
    @IsNotEmpty()
    name: string
}