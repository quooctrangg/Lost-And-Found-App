import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateMajorDto {

    @IsNumber()
    @IsOptional()
    schoolId: number

    @IsOptional()
    @IsString()
    name: string
}