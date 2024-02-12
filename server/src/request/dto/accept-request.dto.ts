import { IsNotEmpty, IsNumber } from "class-validator";

export class AcceptRequestDto {
    @IsNotEmpty()
    @IsNumber()
    idRequest: number
}