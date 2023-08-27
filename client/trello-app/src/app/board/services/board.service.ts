import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from 'src/app/shared/service/socket.service';
import { Board } from 'src/app/shared/types/board';
import { Colum } from 'src/app/shared/types/colum';
import { SocketEventEnum } from 'src/app/shared/types/socket.enum';
import { Task } from 'src/app/shared/types/task';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private board = new BehaviorSubject<Board | null>(null);
  colums = new BehaviorSubject<Colum[]>([]);
  task = new BehaviorSubject<Task[]>([]);
  constructor(private socketService: SocketService) {}

  setBoard(board: Board): void {
    this.board.next(board);
  }

  getBoard(): Observable<Board | null> {
    return this.board.asObservable();
  }

  setColums(columsArray: Colum[]): void {
    this.colums.next(columsArray);
  }

  setTasks(tasksArray: Task[]): void {
    this.task.next(tasksArray);
  }

  leaveBoard(boardId: string): void {
    this.board.next(null);
    this.socketService.emit(SocketEventEnum.boardsLeave, { boardId: boardId });
  }

  addColum(colum: Colum): void {
    const updatedColumns = [...this.colums.getValue(), colum];
    let answer:Colum[] = [];

    updatedColumns.forEach((x) => {
      if (!answer.some((y) => JSON.stringify(y) === JSON.stringify(x))) {
        answer.push(x);
      }
    });
    this.colums.next(answer);
  }

  addTask(task: Task): void {
    const updatedTasks = [...this.task.getValue(), task];
    let answer:Task[] = [];

    updatedTasks.forEach((x) => {
      if (!answer.some((y) => JSON.stringify(y) === JSON.stringify(x))) {
        answer.push(x);
      }
    });
    this.task.next(answer);
  }

  updateBoard(updatedBoard: Board): void {
    const board = this.board.getValue();
    if (!board) {
      throw new Error('board is not intilized');
    }
    this.board.next({ ...board, title: updatedBoard.title });
  }

  deleteColum(columId: string): void {
    const updateColums = this.colums
      .getValue()
      .filter((col) => col._id !== columId);
    this.colums.next(updateColums);
  }

  updateColum(columUpdated: Colum):void {
    const updatedCoulm = this.colums.getValue().map(colum => {
      if (colum._id === columUpdated._id) {
        return {...colum , title:columUpdated.title}
      }
      return colum;
    })
    this.colums.next(updatedCoulm);
  }

  updateTask(taskUpdated: Task):void {
    const updatedTask = this.task.getValue().map(task => {
      if (task._id === taskUpdated._id) {
        return {...task , title:taskUpdated.title , description:taskUpdated.description , columId:taskUpdated.columId}
      }
      return task;
    })
    this.task.next(updatedTask);
  }

  deleteTask( taskId:string): void {
    const updatetasks= this.task
      .getValue()
      .filter((task) => task._id !== taskId);
    this.task.next(updatetasks);
  }
}
