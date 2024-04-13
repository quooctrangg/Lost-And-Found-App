import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { CONSTANTS_MAX, CONSTANTS_MIN } from "../../global"

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(CONSTANTS_MAX.NAME_LEN)
    @MinLength(CONSTANTS_MIN.NAME_LEN)
    name: string

    @IsString()
    @IsOptional()
    @MinLength(CONSTANTS_MIN.PASSWORD_LEN)
    newPassword: string

    @IsNumber()
    @IsOptional()
    majorId: number

    @IsNumber()
    @IsOptional()
    type: number
}