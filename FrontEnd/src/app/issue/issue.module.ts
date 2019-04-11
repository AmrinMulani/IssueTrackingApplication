import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { LayoutModule } from '../layout/layout.module';
import { MyListComponent } from './my-list/my-list.component';

import { DataTablesModule } from 'angular-datatables';
import { ViewComponent } from './view/view.component';

import { ModalModule } from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
@NgModule({
  declarations: [CreateComponent, MyListComponent, ViewComponent],
  imports: [ LayoutModule,DataTablesModule, ModalModule.forRoot(), FileUploadModule,
    CommonModule, FormsModule, FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),NgxSpinnerModule
  ]
})
export class IssueModule { }
