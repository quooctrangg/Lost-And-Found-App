import { IsOptional, IsString } from "class-validator";

export class toggleBanUserDto {
    @IsString()
    @IsOptional()
    feedback: string
}