import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global"

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.STUDENT_ID_LEN)
    studentId: string

    @IsString()
    @IsNotEmpty()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN)
    password: string
}