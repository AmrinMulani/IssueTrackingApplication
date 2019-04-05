import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [NavComponent],
  imports: [
    CommonModule, BsDropdownModule.forRoot()
  ],
  exports:[
    NavComponent
  ]
})
export class LayoutModule { }
