import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(fitlerDTO: GetTasksFilterDTO): Task[] {
    const { search, status } = fitlerDTO;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTaskById(id: string): void {
    const newTasks = this.tasks.filter((task) => task.id !== id);
    this.tasks = newTasks;
  }

  updateTaskById(id: string, status: TaskStatus): Task {
    // const task = this.getTaskById(id);
    // task.status = status;

    // return task;
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        return { ...task, status };
      }
      return task;
    });

    return this.tasks.find((task) => task.id === id);
  }
}
