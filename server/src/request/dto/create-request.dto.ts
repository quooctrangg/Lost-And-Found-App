import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRequestDto {
    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsNotEmpty()
    postId: number
}