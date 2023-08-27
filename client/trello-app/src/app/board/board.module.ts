import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';
import { TopbarModule } from '../shared/modules/topbar/topbar.module';
import { InlineFormModule } from '../shared/modules/inline-form/inline-form.module';
import { TaskModelComponent } from './components/task-model/task-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes= [
  {
    path:"boards/:boardId" ,
    component: BoardComponent,
    canActivate: [authGuard],
    children: [
      { path: "tasks/:taskId"  , component:TaskModelComponent}
    ]
  }
]

@NgModule({
  declarations: [
    BoardComponent,
    TaskModelComponent
  ],
  imports: [
    CommonModule,
    TopbarModule,
    InlineFormModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BoardModule { }
