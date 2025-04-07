import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    instructorId: string,
  ): Promise<Course> {
    // Get the instructor
    const instructor = await this.usersService.findOne(instructorId);

    // Create the course
    const course = this.courseRepository.create({
      ...createCourseDto,
      instructor,
    });

    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['instructor'],
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['instructor', 'students', 'modules'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
  ): Promise<Course> {
    // Get the course
    const course = await this.findOne(id);

    // Check if the user is the instructor of the course
    if (course.instructor.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this course',
      );
    }

    // Update the course
    Object.assign(course, updateCourseDto);

    return this.courseRepository.save(course);
  }

  async remove(id: string, userId: string): Promise<void> {
    // Get the course
    const course = await this.findOne(id);

    // Check if the user is the instructor of the course
    if (course.instructor.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this course',
      );
    }

    // Delete the course
    await this.courseRepository.remove(course);
  }

  async enrollStudent(courseId: string, studentId: string): Promise<Course> {
    // Get the course and student
    const course = await this.findOne(courseId);
    const student = await this.usersService.findOne(studentId);

    // Check if the student is already enrolled
    const isEnrolled = course.students?.some((s) => s.id === studentId);
    if (isEnrolled) {
      return course; // Student is already enrolled
    }

    // Add the student to the course
    if (!course.students) {
      course.students = [];
    }
    course.students.push(student);

    return this.courseRepository.save(course);
  }

  async getEnrolledCourses(studentId: string): Promise<Course[]> {
    return this.courseRepository
      .createQueryBuilder('course')
      .innerJoin('course.students', 'student')
      .where('student.id = :studentId', { studentId })
      .leftJoinAndSelect('course.instructor', 'instructor')
      .getMany();
  }
}
