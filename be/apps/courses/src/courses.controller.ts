import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':slug')
  async getOne(@Param('slug') slug: string) {
    return this.coursesService.getCourseBySlug(slug);
  }

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
}
