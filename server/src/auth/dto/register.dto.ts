import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global"

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.EMAIL_LEN)
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.NAME_LEN)
    @MinLength(CONSTANTS_MIN.NAME_LEN)
    name: string

    @IsString()
    @IsNotEmpty()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN)
    password: string

    @IsNumber()
    @IsNotEmpty()
    code: number
}