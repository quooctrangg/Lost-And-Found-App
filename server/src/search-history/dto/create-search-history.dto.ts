import { IsNotEmpty, IsString } from "class-validator";

export class CreateSearchHistoryDto {
    @IsString()
    @IsNotEmpty()
    content: string
}
