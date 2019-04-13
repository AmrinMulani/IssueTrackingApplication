import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LayoutModule } from '../layout/layout.module';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule, LayoutModule,NgxSpinnerModule, FormsModule
  ],
  declarations: [LoginComponent]
})
export class UserModule { }
