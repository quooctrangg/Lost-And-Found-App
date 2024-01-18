import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostStatusDto {
    @IsString()
    @IsNotEmpty()
    name: string
}