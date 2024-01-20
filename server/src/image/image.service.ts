import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { ResponseData } from '../global';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ImageService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService) { }

    async uploadFiles(files: Array<Express.Multer.File>) {
        try {
            let uploadedImages: number[] = []
            for (const file of files) {
                const result = await this.cloudinaryService.uploadFile(file)
                const data = await this.prismaService.image.create({
                    data: result.url
                })
                uploadedImages.push(data.id)
            }
            return uploadedImages
        } catch (error) {
            console.log(error.message);
        }
    }
}
