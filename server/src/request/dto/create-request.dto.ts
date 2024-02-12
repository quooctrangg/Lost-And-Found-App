import { IsNotEmpty, IsString } from "class-validator";

export class CreateRequestDto {
    @IsString()
    @IsNotEmpty()
    description: string
}