import { IsNotEmpty, IsString, MinLength } from "class-validator"
import { CONSTANTS_MIN } from "../../global"

export class updatePasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN)
    currentPassword: string

    @IsString()
    @IsNotEmpty()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN)
    newPassword: string
}