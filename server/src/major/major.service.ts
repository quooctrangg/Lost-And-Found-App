import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PAGE_SIZE, ResponseData } from '../global';
import { CreateMajorDto, UpdateMajorDto } from './dto';
import { Major } from '@prisma/client';

@Injectable()
export class MajorService {
  constructor(private readonly prismaService: PrismaService) { }

  async getAllsBySchoolId(schoolId: number) {
    try {
      const school = await this.prismaService.school.findUnique({
        where: {
          id: schoolId
        }
      })
      if (!school) {
        return new ResponseData<string>(null, 400, 'Trường không tồn tại')
      }
      const data = await this.prismaService.major.findMany({
        where: {
          schoolId: schoolId
        }
      })
      return new ResponseData<Major[]>(data, 200, 'Tìm thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async getAlls(option: { page: number, key: string, schoolId: number }) {
    try {
      let { page, key, schoolId } = option
      let totalPages = 1
      let pageSize = undefined
      let next = undefined
      let where: any = {}
      if (key) {
        where.name = {
          contains: key,
          mode: 'insensitive'
        }
      }
      if (schoolId) {
        where.schoolId = Number(schoolId)
      }
      if (page) {
        pageSize = PAGE_SIZE.PAGE_MAJOR
        const totalCount = await this.prismaService.major.count({
          where: where,
          orderBy: {
            schoolId: 'asc'
          }
        })
        totalPages = Math.ceil(totalCount / pageSize)
        if (!totalPages) totalPages = 1
        if (!page || page < 1) page = 1
        next = (page - 1) * pageSize
      }
      const data = await this.prismaService.major.findMany({
        orderBy: {
          schoolId: 'asc'
        },
        skip: next,
        take: pageSize,
        where: where,
        include: {
          School: true
        }
      })
      return new ResponseData<any>({ data, totalPages }, 200, 'Tìm thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async create(createMajorDto: CreateMajorDto) {
    try {
      const school = await this.prismaService.school.findUnique({
        where: {
          id: createMajorDto.schoolId
        }
      })
      if (!school) {
        return new ResponseData<string>(null, 400, 'Trường không tồn tại')
      }
      await this.prismaService.major.create({
        data: {
          name: createMajorDto.name,
          schoolId: createMajorDto.schoolId,
          trainingDuration: createMajorDto.trainingDuration
        }
      })
      return new ResponseData<Major>(null, 200, 'Tạo thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async update(id: number, updateMajorDto: UpdateMajorDto) {
    try {
      if (updateMajorDto.schoolId) {
        const school = await this.prismaService.school.findUnique({
          where: {
            id: updateMajorDto.schoolId
          }
        })
        if (!school) {
          return new ResponseData<string>(null, 400, 'Trường không tồn tại')
        }
      }
      const major = await this.prismaService.major.findUnique({
        where: {
          id: id
        }
      })
      if (!major) {
        return new ResponseData<string>(null, 400, 'Ngành không tồn tại')
      }
      await this.prismaService.major.update({
        where: {
          id: id
        },
        data: {
          ...updateMajorDto
        }
      })
      return new ResponseData<Major>(null, 200, 'Cập nhật thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async delete(id: number) {
    try {
      const major = await this.prismaService.major.findUnique({
        where: {
          id: id
        }
      })
      if (!major) {
        return new ResponseData<string>(null, 400, 'Ngành không tồn tại')
      }
      await this.prismaService.major.delete({
        where: {
          id: id
        }
      })
      return new ResponseData<Major>(null, 200, 'Xóa thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }
}
