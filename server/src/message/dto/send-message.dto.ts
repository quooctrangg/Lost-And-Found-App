import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    @IsNumber()
    conversationId: number
}