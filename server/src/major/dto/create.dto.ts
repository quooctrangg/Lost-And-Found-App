import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateMajorDto {

    @IsNumber()
    @IsNotEmpty()
    schoolId: number

    @IsNotEmpty()
    @IsString()
    name: string
}