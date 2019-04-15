import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Person } from 'src/app/_models/person';
import { DataTablesResponse } from 'src/app/_models/DataTablesResponse';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  //persons: Person[];
  persons: Person[];
  constructor(private toastr: ToastrService, private http: HttpClient) { }

  ngOnInit() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      lengthMenu: [10, 25, 50, 100],
      serverSide: true,
      processing: true,
      language: {
        processing: '<i class="fa fa-spinner fa-spin fa-fw text-primary"></i><span class="sr-only">Loading...</span>'
      },
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            '${environment.baseUrl}/users/get/all',
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.persons = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'title' }, { data: 'assignedTo', orderable: false }, { data: 'createdOn' }, { data: 'status' }]
    };
  }

}
