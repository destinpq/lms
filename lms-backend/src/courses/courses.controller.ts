import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Request } from 'express';

// Add interface to properly type the request with user
interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: UserRole;
  };
}

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: RequestWithUser,
  ) {
    // Add the instructor (current user) to the course
    return this.coursesService.create(createCourseDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.coursesService.update(id, updateCourseDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.coursesService.remove(id, req.user.sub);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  enrollInCourse(@Param('id') courseId: string, @Req() req: RequestWithUser) {
    return this.coursesService.enrollStudent(courseId, req.user.sub);
  }

  @Get('enrolled')
  @UseGuards(JwtAuthGuard)
  getEnrolledCourses(@Req() req: RequestWithUser) {
    return this.coursesService.getEnrolledCourses(req.user.sub);
  }
}
