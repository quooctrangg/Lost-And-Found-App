import { IsNotEmpty, IsString } from "class-validator";

export class UpdateSchoolDto {
    @IsString()
    @IsNotEmpty()
    name: string
}