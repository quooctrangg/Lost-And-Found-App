import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class VerifyPostDto {
    @IsNotEmpty()
    @IsNumber()
    verify: number

    @IsOptional()
    @IsString()
    feedback: string
}