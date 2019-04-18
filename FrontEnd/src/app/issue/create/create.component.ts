import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CreateIssue } from 'src/app/_models/create-issue';

//spinner service
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NgForm } from '@angular/forms';
import { SocketService } from 'src/app/_services/socket.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  @ViewChild('createForm') createForm: NgForm;
  constructor(private spinner: NgxSpinnerService, private el: ElementRef, private socket: SocketService,
    private userService: UserService, private authService: AuthenticationService, private toastr: ToastrService) { }
  issue: CreateIssue;
  currentUser: any;
  allUsers: any = [];
  ngOnInit() {
    this.openSpinner(true)
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
    });
    this.getAllUsers();
    this.openSpinner(false)
  }
  openSpinner = (isLoading: boolean) => {
    if (isLoading)
      this.spinner.show();
    else
      this.spinner.hide();
  };//end of openSpinner function

  getAllUsers() {
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
  }
  saveData = () => {
    console.log(this.issue)
    if (this.issue.description.trim() === "") {
      this.toastr.error('Description is empty, Please give a description of the issue')
    }
    else {
      this.openSpinner(true);
      let formData = new FormData();

      //locate the file element meant for the file upload.
      let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#attachment');
      //get the total amount of files attached to the file input.
      let fileCount: number = inputEl.files.length;
      //check if the filecount is greater than zero, to be sure a file was selected.
      if (fileCount > 0) { // a file was selected
        //append the key name 'photo' with the first file in the element

        for (let i = 0; i < fileCount; i++) {
          formData.append('photos', inputEl.files.item(i));
        }
      }
      console.log(inputEl.files.item(0))

      formData.append('title', this.issue.title);
      formData.append('description', this.issue.description);
      formData.append('assignee', this.issue.assignee);
      formData.append('createdBy', this.currentUser.userDetails._id);

      this.userService.createIssue(formData).subscribe((res) => {
        if (res.status === 200) {
          console.log(res)

          let brodCastObject = {
            issueId: res.data.issueId,
            assignee: res.data.assignedTo,
            createdBy: res.data.createdBy
          };
          this.BroadcastMessage(brodCastObject);
          this.toastr.success('Data Saved Successfully!!');
          this.issue = {
            title: '',
            description: '',
            attachment: '',
            assignee: ''
          };
          this.createForm.reset(this.issue);
        } else {
          this.toastr.warning(res.message);
        }
        this.openSpinner(false);
      }, (err) => {
        this.toastr.error(err);
        this.openSpinner(false);
      });
    }
  }

  BroadcastMessage = (data) => {
    console.log('data form broadcast\n\n')
    console.log(data)
    console.log('brodcastNotfication data')
    this.socket.notifyAssignee(data);
    console.log(data)
  };//end of broadCastNotificcation

}
