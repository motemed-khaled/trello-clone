import { Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { Task } from 'src/app/shared/types/task';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { Colum } from 'src/app/shared/types/colum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from 'src/app/shared/service/task.service';
import { SocketService } from 'src/app/shared/service/socket.service';
import { SocketEventEnum } from 'src/app/shared/types/socket.enum';

@Component({
  selector: 'app-task-model',
  templateUrl: './task-model.component.html',
  styleUrls: ['./task-model.component.scss'],
})
export class TaskModelComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';
  boardId: string;
  taskId: string;
  task!: Task;
  colums!: Colum[];
  columForm!: FormGroup;
  unSubScribe!: Subject<void>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private fb: FormBuilder,
    private taskService: TaskService,
    private socketService:SocketService
  ) {
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    const taskId = this.route.snapshot.paramMap.get('taskId');
    this.unSubScribe = new Subject();

    if (!boardId) {
      throw new Error('can not get boardId from url');
    }
    if (!taskId) {
      throw new Error('can not get taskId from url');
    }
    this.boardId = boardId;
    this.taskId = taskId;
    this.columForm = this.fb.group({
      columId: [null],
    });

    this.boardService.task
      .pipe(
        takeUntil(this.unSubScribe),
        map((tasks) => {
          return tasks.find((task) => task._id === this.taskId);
        }),
        filter(Boolean)
      )
      .subscribe({
        next: (task) => {
          this.task = task;
          this.columForm.patchValue({ columId: task.columId });
        },
      });

    this.boardService.colums.pipe(takeUntil(this.unSubScribe)).subscribe({
      next: (columsArray) => {
        this.colums = columsArray;
      },
    });

    this.columForm
      .get('columId')
      ?.valueChanges.pipe(takeUntil(this.unSubScribe))
      .subscribe({
        next: (value) => {
          if (value !== this.task.columId) {
            this.taskService.updateTask(this.boardId, this.taskId, {
              columId: value,
            });
          }
        },
      });
    
    this.socketService.listen<string>(SocketEventEnum.taskDeleteSuccess).pipe(takeUntil(this.unSubScribe)).subscribe({
      next: () => {
        this.goToBoard()
      }
    });
  }

  ngOnDestroy(): void {
    this.unSubScribe.next();
    this.unSubScribe.complete();
  }

  goToBoard() {
    this.router.navigate(['boards', this.boardId]);
  }

  UpdateTaskName(taskName: string): void {
    this.taskService.updateTask(this.boardId, this.taskId, { title: taskName });
  }

  updateTaskDescription(taskDescription: string): void {
    this.taskService.updateTask(this.boardId, this.taskId, {
      description: taskDescription,
    });
  }

  deleteTask(){
    this.taskService.deleteTask(this.boardId,this.task._id)
  }
}
