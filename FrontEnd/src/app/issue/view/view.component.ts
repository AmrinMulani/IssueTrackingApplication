import { Component, OnInit, ElementRef, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CreateIssue } from 'src/app/_models/create-issue';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from 'src/app/_services/issue.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  // @ViewChild('scrollMe', { read: ElementRef })
  // public scrollMe: ElementRef;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = 'http://localhost:3000/api/v1/';

  constructor(private route: ActivatedRoute, private modalService: BsModalService, private cd: ChangeDetectorRef,
    private issueService: IssueService, private spinner: NgxSpinnerService, private el: ElementRef,
    private userService: UserService, private authService: AuthenticationService, private toastr: ToastrService) { }

  issue: CreateIssue;
  currentUser: any;
  allUsers: any = [];
  modalRef: BsModalRef;
  modalAttachment: BsModalRef;
  photo: any;
  attachment: any = [];
  status: any = ['In-Progress', 'In-Test', 'Done', 'Pending', 'Completed', 'Backlog'];
  currentIssueId: string;
  authToken: string;
  comments = [];
  watchers = [];
  commentDescription: string = '';
  isAWatcher: boolean = false;
  public scrollToCommentTop: boolean = false;
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;

  openModal(photo: string, template: TemplateRef<any>) {
    this.photo = 'http://localhost:3000/' + photo;
    this.modalRef = this.modalService.show(template);
  }

  openAttachmentModal(template: TemplateRef<any>) {
    this.modalAttachment = this.modalService.show(template, { class: 'modal-lg' });
  }

  // ngAfterContentInit() {
  //   this.cd.detectChanges();
  // }
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

    this.initializeUploader();
    this.getIssue(this.currentIssueId);
    this.getComment();
    this.getAllUsers();
    this.getWatchers();
  }

  //file upload code

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    console.log('url')
    console.log(this.baseUrl + 'issues/create/' + this.currentIssueId + '/upload')

    this.uploader = new FileUploader({

      url: this.baseUrl + 'issues/create/' + this.currentIssueId + '/upload?authToken=' + this.authToken,
      itemAlias: 'photo',
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      console.log('response');
      console.log(response);
      console.log('item');
      console.log(item);
      if (response) {
        const res = JSON.parse(response);
        const photo = {

        };
        this.attachment = res.data.attachment;
        this.toastr.success('File Uploaded Successfully')
        // this.lgModal = this.modalService.hide(10);
      }
    }
  }
  //add as watcher
  addWatcher() {
    this.issueService.addWatcher(this.currentIssueId, this.currentUser.userDetails._id, this.authToken).subscribe(
      (resp) => {
        if (resp.status === 200) {
          this.toastr.success(resp.message);
          let watcherObj = {
            watcherId: this.currentUser.userDetails,
            createdOn: resp.data.createdOn
          }
          this.watchers.push(watcherObj);
          this.isAWatcher = true;
        }
        else
          this.toastr.error(resp.message);
      }, (err) => {
        this.toastr.error(err);
      }
    );
  }
  //get watcher

  getWatchers() {
    this.openSpinner(true);
    this.issueService.getWatchers(this.currentIssueId, this.pageValue * 10, this.authToken).subscribe(
      (apiResponse) => {
        let previousData = (this.watchers.length > 0 ? this.watchers.slice() : []);
        if (apiResponse.status == 200) {
          this.watchers = apiResponse.data.concat(previousData);
        }
        else {
          this.watchers = previousData;
          this.toastr.warning(apiResponse.message);
        }
        this.openSpinner(false);
        console.log('this.watchers')
        console.log(this.watchers)
        var test = this.watchers.find(x => x.watcherId._id === this.currentUser.userDetails._id)
        if (test)
          this.isAWatcher = true;
      }, (error) => {
        this.openSpinner(false);
        console.log(error)
        this.toastr.error('Error while fetching watchers- ' + error);
      }
    );
  };//end of getWatchers
  //get comment
  getComment = () => {

    this.openSpinner(true);
    this.issueService.getComment(this.currentIssueId, this.pageValue * 10, this.authToken).subscribe(
      (apiResponse) => {

        console.log('apiResponse')
        console.log(apiResponse)
        let previousData = (this.comments.length > 0 ? this.comments.slice() : []);
        if (apiResponse.status == 200) {
          this.comments = apiResponse.data.concat(previousData);
        }
        else {
          this.comments = previousData;
          this.toastr.warning(apiResponse.message);
        }
        this.loadingPreviousChat = false;
        this.openSpinner(false);
      }, (error) => {
        this.openSpinner(false);
        console.log(error)
        this.toastr.error('Error while fetching comments ' + error);
      }
    );
  };

  //Ctrl+Enter key to send comment
  postUsingKeyPress(event) {
    if (event.ctrlKey && event.keyCode === 13) {
      this.postComment();
    }
  }
  //post comment to post comment to db
  postComment() {
    let objpost = {
      issueId: this.currentIssueId,
      description: this.commentDescription,
      createdBy: this.currentUser.userDetails._id,
      authToken: this.authToken
    };

    this.issueService.postComment(objpost).subscribe(
      (resp) => {
        console.log('resp');
        console.log(resp);
        if (resp.error === false) {
          let comment = {
            description: this.commentDescription,
            createdBy: this.currentUser.userDetails,
            createdOn: resp.data.createdOn
          };
          //push current comment to the comments array
          this.comments.push(comment);

          //to keep scrollbar to the bottom
          this.scrollToCommentTop = false;
          this.commentDescription = '';

          this.toastr.success(resp.message);
        }
        else
          this.toastr.error(resp.message);
      }, (error) => {
        console.log('error')
        console.log(error)

        this.toastr.error(error);
      }
    );
  }

  //load previous 10 comments on Load Previous Comment link
  public loadEarlierComments: any = () => {
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToCommentTop = true;
    this.getComment();
  } //end of load previous chat of user

  //get issue on page load using issueId from url
  getIssue(issueId: string): any {
    this.openSpinner(true);
    this.issueService.getIssue(issueId, this.authToken).subscribe(
      (resp) => {
        if (resp.status === 200) {
          console.log('response of get issue')
          console.log(resp)
          this.issue = {
            title: resp.data.title,
            description: resp.data.description,
            attachment: '',
            assignee: resp.data.assignedTo._id,
            status: resp.data.status
          };

          //set local property attachment to the response's data-attachment
          this.attachment = resp.data.attachment;
        } else {
          this.toastr.error(resp.message);
        }
      }, (err) => {
        this.toastr.error(err);
      }
    );
    this.openSpinner(false);
  }

  //option for text editor
  public options: Object = {
    height: 200,
    charCounterCount: false,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'fontFamily'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'fontFamily'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'fontFamily'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'fontFamily']
  };

  //openspinner to toggle spinner
  openSpinner = (isLoading: boolean) => {
    if (isLoading)
      this.spinner.show();
    else
      this.spinner.hide();
  };//end of openSpinner function

  //getting all users form db to select box
  getAllUsers() {
    this.openSpinner(true);

    this.userService.getAllUsers().subscribe(
      (response) => {
        if (response.status === 200) {
          this.allUsers = response.data;
        }
        else
          this.toastr.warning(response.message);
      }, (err) => {
        this.toastr.error(err);
      }
    );
    this.openSpinner(false);
  };//end of getAllUsers

  //on click of delete photo
  deletePhoto = (photo: string) => {
    console.log(photo);
    this.openSpinner(true);
    this.issueService.deletePhoto(this.currentIssueId, photo, this.authToken).subscribe(
      response => {
        console.log('new response')
        console.log(response);

        //setting attachment property to fresh result
        this.attachment = response.data.attachment;
        this.toastr.success('Deleted Successfully');
        this.openSpinner(false);
      }, error => {
        this.toastr.error(error);
        console.log(error);
        this.openSpinner(false);
      });
  };//end of deletePhoto

  //on click of update information button
  updateInformation() {
    this.openSpinner(true);

    let dataObj = {
      title: this.issue.title,
      description: this.issue.description,
      assignedTo: this.issue.assignee,
      status: this.issue.status,
      issueId: this.currentIssueId,
      authToken: this.authToken,
      modifiedBy: this.currentUser.userDetails._id
    };
    this.issueService.updateIssue(dataObj).subscribe((res) => {
      if (res.status === 200) {
         console.log(res)
         this.toastr.success(res.message);
        // this.issue = {
        //   title: '',
        //   description: '',
        //   attachment: '',
        //   assignee: ''
        // };
        // this.createForm.reset(this.issue);
      } else {
        this.toastr.warning(res.message);
      }
    }, (err) => {
      this.toastr.error(err);
    });
    this.openSpinner(false);
  }
}
