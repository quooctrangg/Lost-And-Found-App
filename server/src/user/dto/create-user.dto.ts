import { IsString, IsNotEmpty, IsNumber, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.STUDENT_ID_LEN)
    studentId: string

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
    majorId: number
}