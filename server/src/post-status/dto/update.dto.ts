import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePostStatusDto {
    @IsString()
    @IsNotEmpty()
    name: string
}