import { Component, OnInit, ElementRef, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CreateIssue } from 'src/app/_models/create-issue';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from 'src/app/_services/issue.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, private modalService: BsModalService,
    private issueService: IssueService, private spinner: NgxSpinnerService, private el: ElementRef,
    private userService: UserService, private authService: AuthenticationService, private toastr: ToastrService) { }

  issue: CreateIssue;
  currentUser: any;
  allUsers: any = [];
  modalRef: BsModalRef;
  photo: any;
  attachment: any = [];
  currentIssueId: string;
  authToken: string;
  openModal(photo: string, template: TemplateRef<any>) {
    this.photo = 'http://localhost:3000/' + photo;
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit() {
    this.currentIssueId = this.route.snapshot.paramMap.get("issueId");

    this.issue = {
      title: '',
      description: '',
      attachment: '',
      assignee: ''
    };

    this.authService.currentUser.subscribe(user => {
      console.log('user')
      console.log(user)
      this.currentUser = user;
      this.authToken = this.currentUser.authToken;
    });

    this.getIssue(this.currentIssueId);
    this.getAllUsers();
  }
  getIssue(issueId: string): any {
    this.openSpinner(true);
    this.issueService.getIssue(issueId, this.authToken).subscribe(
      (resp) => {
        if (resp.status === 200) {
          this.issue = {
            title: resp.data.title,
            description: resp.data.description,
            attachment: '',
            assignee: resp.data.assignedTo._id
          };
          this.attachment = resp.data.attachment;
          console.log(this.attachment)

        } else {
          this.toastr.error(resp.message);
        }
      }, (err) => {
        console.log(err);
      }
    );
    this.openSpinner(false);
  }

  public options: Object = {
    height: 200,
    charCounterCount: false,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'fontFamily'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'fontFamily'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'fontFamily'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'fontFamily']
  };
  openSpinner = (isLoading: boolean) => {
    if (isLoading)
      this.spinner.show();
    else
      this.spinner.hide();
  };//end of openSpinner function

  getAllUsers() {
    this.openSpinner(true);

    this.userService.getAllUsers().subscribe(
      (response) => {
        if (response.status === 200) {
          this.allUsers = response.data;
          console.log(this.allUsers);
          this.toastr.success(response.message);
        }
        else
          this.toastr.warning(response.message);
      }, (err) => {
        this.toastr.error(err);
      }
    );
    this.openSpinner(false);
  };//end of getAllUsers

  deletePhoto = (photo: string) => {
    console.log(photo);
    this.openSpinner(true);
    this.issueService.deletePhoto(this.currentIssueId, photo, this.authToken).subscribe(
      response => {
        console.log('new response')
        console.log(response);
        this.attachment = response.data.attachment;
        this.toastr.success('Deleted Successfully');
        this.openSpinner(false);
      },error=>{
        this.toastr.error(error);
        console.log(error);
        this.openSpinner(false);
      });
  };//end of deletePhoto
}
