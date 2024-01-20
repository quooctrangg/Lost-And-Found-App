import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatPostDto } from './dto';
import { ResponseData } from '../global';
import { ImageService } from '../image/image.service';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService, private readonly imageService: ImageService) { }

    async createPost(userId: number, createPostDto: CreatPostDto, images: Array<Express.Multer.File>) {
        try {
            const { title, description, itemId, sendProtection, locations, typeId } = createPostDto
            const imagesId: number[] = await this.imageService.uploadFiles(images)
            await this.prismaService.post.create({
                data: {
                    userId: userId,
                    title: title,
                    description: description,
                    itemId: itemId,
                    typeId: typeId,
                    sendProtection: sendProtection,
                    Location: {
                        connect: locations.map((id) => ({ id }))
                    },
                    Image: {
                        connect: imagesId.map((id) => ({ id }))
                    }
                }
            })
            return new ResponseData<string>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
