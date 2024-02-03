import { IsOptional, IsString, MaxLength } from "class-validator";
import { CONSTANTS_MAX } from "../../global";

export class toggleBanUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.FEEDBACK_LEN)
    feedback: string
}