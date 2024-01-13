import { IsNotEmpty, IsString } from "class-validator";

export class SearchHistoryDto {
    @IsString()
    @IsNotEmpty()
    content: string
}