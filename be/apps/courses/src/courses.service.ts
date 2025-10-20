import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entites/course.entity';
import { Repository } from 'typeorm';
import { UpdateCourseDto } from './dto/update-course.dto';
import slugify from 'slugify';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
  ) {}
  private async generateUniqueSlug(title: string): Promise<string> {
    let base = slugify(title, { lower: true, locale: 'vi' });
    let slug = base;
    let count = 1;

    while (await this.repo.findOne({ where: { slug } })) {
      slug = `${base}-${count++}`;
    }

    return slug;
  }

  async getCourseBySlug(slug: string) {
    const course = await this.repo.findOne({
      where: { slug, status: 'published' },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
  async createCourse(dto: CreateCourseDto) {
    const slug = await this.generateUniqueSlug(dto.title);

    const course = this.repo.create({
      ...dto,
      slug,
    });
    return this.repo.save(course);
  }
  async updateCourse(id: string, dto: UpdateCourseDto) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (dto.title && dto.title !== course.title) {
      course.slug = await this.generateUniqueSlug(dto.title);
    }

    Object.assign(course, dto);
    return this.repo.save(course);
  }

  async deleteCourse(id: string) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    await this.repo.remove(course);
  }
}
