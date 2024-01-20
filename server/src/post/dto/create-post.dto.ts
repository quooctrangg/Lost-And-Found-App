import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"
import { POST_SIZE } from "../../global"

export class CreatPostDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(POST_SIZE.TITLE)
    title: string

    @IsString()
    @IsOptional()
    @MaxLength(POST_SIZE.DESCRIPTION)
    description: string

    @IsNotEmpty()
    @IsNumber()
    typeId: number

    @IsNotEmpty()
    @IsNumber()
    itemId: number

    @IsArray()
    @IsNotEmpty()
    locations: number[]

    @IsOptional()
    @IsBoolean()
    sendProtection: boolean
}