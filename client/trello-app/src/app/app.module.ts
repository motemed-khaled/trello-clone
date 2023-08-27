import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { HomeModule } from './home/home.module';
import { AuthInterceptor } from './auth/services/auth.interceptor';
import { BoardsModule } from './boards/boards.module';
import { BoardModule } from './board/board.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HomeModule,
    BoardModule,
    BoardsModule,
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
