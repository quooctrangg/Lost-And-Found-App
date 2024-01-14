import { IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global"

export class updateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.NAME_LEN)
    @MinLength(CONSTANTS_MIN.NAME_LEN)
    name: string

    @IsString()
    @IsOptional()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN)
    newPassword: string
}