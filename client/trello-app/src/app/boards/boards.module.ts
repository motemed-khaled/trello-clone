import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './components/boards/boards.component';
import { authGuard } from '../auth/guards/auth.guard';
import { InlineFormModule } from '../shared/modules/inline-form/inline-form.module';
import { InlineFormComponent } from '../shared/modules/inline-form/components/inline-form/inline-form.component';
import { TopbarModule } from '../shared/modules/topbar/topbar.module';

const routes: Routes = [
  {path:"boards" , component:BoardsComponent , canActivate:[authGuard]}
]

@NgModule({
  declarations: [
    BoardsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InlineFormModule,
    TopbarModule
  ]
})
export class BoardsModule { }
