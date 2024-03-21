import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { POST_SIZE } from "../../global"

export class CreatPostDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(POST_SIZE.DESCRIPTION_MAX)
    @MinLength(POST_SIZE.DESCRIPTION_MIN)
    description: string

    @IsNumber()
    @IsNotEmpty()
    type: number

    @IsNotEmpty()
    @IsNumber()
    itemId: number

    @IsArray()
    @IsNotEmpty()
    locations: number[]

    @IsNumber()
    @IsOptional()
    done: number
}