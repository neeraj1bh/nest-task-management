import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly configService: ConfigService,
  ) {
    console.log(configService.get('TEST_VALUE'));
  }

  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status=:status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Some error occured in saving to database user ${user.username}`,
      );
      throw new InternalServerErrorException('Some error occured');
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = {
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    };
    const newTask = this.taskRepository.create(task);
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return found;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const found = await this.taskRepository.delete({ id, user });
    if (found.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }

  async updateTaskById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
