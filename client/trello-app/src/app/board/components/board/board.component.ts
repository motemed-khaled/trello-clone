import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardsService } from 'src/app/shared/service/boards.service';
import { BoardService } from '../../services/board.service';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { Board } from 'src/app/shared/types/board';
import { SocketService } from 'src/app/shared/service/socket.service';
import { SocketEventEnum } from 'src/app/shared/types/socket.enum';
import { ColumService } from 'src/app/shared/service/colum.service';
import { Colum } from 'src/app/shared/types/colum';
import { ColumRequest } from 'src/app/shared/types/colum-request';
import { environments } from 'src/environments/environments';
import { Task } from 'src/app/shared/types/task';
import { TaskService } from 'src/app/shared/service/task.service';
import { TaskRequest } from 'src/app/shared/types/task-request';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  board!: Board | null;
  colums!: Colum[];
  tasks!: Task[];
  unSubscribe: Subject<void>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private socketService: SocketService,
    private router: Router,
    private columService: ColumService,
    private taskService: TaskService
  ) {
    this.unSubscribe = new Subject();
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error('can not get prodId from url');
    }
    this.boardId = boardId;
    this.boardService.getBoard().subscribe({
      next: (currentBoard) => {
        this.board = currentBoard;
      },
    });
    this.boardService.colums.subscribe({
      next: (columsArray) => {
        this.colums = columsArray;
      },
    });
    this.boardService.task.subscribe({
      next: (tasksArray) => {
        this.tasks = tasksArray;
      },
    });
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventEnum.boardsJoin, {
      boardId: this.boardId,
    });
    this.getBroad();
    this.initializeListiner();
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  initializeListiner(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !event.url.includes("/boards/")) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    this.socketService
      .listen<Colum>(SocketEventEnum.columsCreateSuccess)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (colum) => {
          console.log(colum);
          this.boardService.addColum(colum);
        },
      });

    this.socketService
      .listen<Task>(SocketEventEnum.taskCreateSuccess)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (task) => {
          this.boardService.addTask(task);
        },
      });

    this.socketService
      .listen<string>(SocketEventEnum.columsDeleteSuccess)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (columId) => {
          this.boardService.deleteColum(columId);
        },
      });

    this.socketService
      .listen<Board>(SocketEventEnum.boardsUpdateSuccess)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (board) => {
          this.boardService.updateBoard(board);
        },
      });

    this.socketService
      .listen<Colum>(SocketEventEnum.columsUpdateSuccess)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (colum) => {
          this.boardService.updateColum(colum);
        },
      });
    
    this.socketService
      .listen<Task>(SocketEventEnum.taskUpdateSuccess)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: (task) => {
          this.boardService.updateTask(task);
        },
      });

    this.socketService
      .listen<void>(SocketEventEnum.boardsDeleteSuccess)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/boards');
        },
      });
    
      this.socketService.listen<string>(SocketEventEnum.taskDeleteSuccess).pipe(takeUntil(this.unSubscribe)).subscribe({
        next: (taskId) => {
          this.boardService.deleteTask(taskId);
        }
      })
  }

  getBroad(): void {
    this.boardsService.getBoard(this.boardId).subscribe({
      next: (board) => {
        this.boardService.setBoard(board);
      },
    });
    this.columService.getColums(this.boardId).subscribe({
      next: (colums) => {
        this.boardService.setColums(colums);
      },
    });
    this.taskService.gettasks(this.boardId).subscribe({
      next: (tasks) => {
        this.boardService.setTasks(tasks);
      },
    });
  }

  createColumn(title: string): void {
    const columRequest: ColumRequest = {
      title,
      boardId: this.boardId,
    };
    this.columService.createColum(columRequest);
  }

  createTask(title: string, columId: string): void {
    const taskRequest: TaskRequest = {
      title,
      boardId: this.boardId,
      columId: columId,
    };
    this.taskService.createTask(taskRequest);
  }

  getTasksByColum(columId: string, tasks: Task[]): Task[] {
    return tasks.filter((task) => task.columId === columId);
  }

  updateBoardName(title: string): void {
    this.boardsService.updateBoard(this.boardId, { title });
  }

  deleteBoard(): void {
    if (confirm('Areyou sure to delete this board')) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }

  deleteColum(columId: string): void {
    this.columService.deleteColum(this.boardId, columId);
  }

  updateColumName(title: string, columId: string): void {
    this.columService.updateColum(this.boardId, columId, { title });
  }

  openTask(taskId: string): void{
    this.router.navigate(["boards", this.boardId, "tasks", taskId]);
  }

  
}
