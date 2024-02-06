import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatPostDto } from './dto';
import { ResponseData } from '../global';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) { }

    // async uploadFiles(files: Array<Express.Multer.File>) {
    //     try {
    //         let uploadedImages: number[] = []
    //         for (const file of files) {
    //             const result = await this.cloudinaryService.uploadFile(file)
    //             const data = await this.prismaService.image.create({
    //                 data: result.url
    //             })
    //             uploadedImages.push(data.id)
    //         }
    //         return uploadedImages
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    async createPost(userId: number, createPostDto: CreatPostDto, images: Array<Express.Multer.File>) {
        try {
            // const { title, description, itemId, sendProtection, locations, typeId } = createPostDto
            //  const imagesId: number[] = await this.imageService.uploadFiles(images)
            // await this.prismaService.post.create({
            //     data: {
            //         userId: userId,
            //         title: title,
            //         description: description,
            //         itemId: itemId,
            //         typeId: typeId,
            //         sendProtection: sendProtection,
            //         Location: {
            //             connect: locations.map((id) => ({ id }))
            //         },
            //         Image: {
            //             connect: imagesId.map((id) => ({ id }))
            //         }
            //     }
            // })
            // return new ResponseData<string>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
