import { IsNotEmpty, IsNumber } from "class-validator";

export class VerifyPostDto {
    @IsNotEmpty()
    @IsNumber()
    verify: number
}