import { IsNotEmpty, IsNumber } from "class-validator";

export class RejectRequestDto {
    @IsNotEmpty()
    @IsNumber()
    idRequest: number
}