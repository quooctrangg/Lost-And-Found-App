import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"
import { CONSTANTS_MAX } from "../../global"

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONSTANTS_MAX.COMMENT_LEN)
    content: string

    @IsNumber()
    @IsNotEmpty()
    postId: number

    @IsOptional()
    @IsNumber()
    parentId: number
}
