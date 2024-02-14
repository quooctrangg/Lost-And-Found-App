import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"
import { POST_SIZE } from "../../global"

export class CreatPostDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(POST_SIZE.TITLE)
    title: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(POST_SIZE.DESCRIPTION)
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
    @IsNotEmpty()
    sendProtection: number
}