import { Component, OnInit } from '@angular/core';
import { BoardsService } from 'src/app/shared/service/boards.service';
import { Board } from 'src/app/shared/types/board';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  boards: Board[];
  constructor(private boardService: BoardsService) {
    this.boards = [];
  }

  ngOnInit(): void {
    this.boardService.getBoards().subscribe({
      next: (userBoard) => {
        this.boards = userBoard;
      }
    })
  }

  createBoard(title:string):void{
    this.boardService.createBoard(title).subscribe({
      next: (board) => {
        this.boards = [...this.boards , board]
      }
    })
  }

}
