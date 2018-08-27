import { Component, OnInit, Output, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EventEmitter } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { User } from '../../models/models';

@Component({
	selector: 'app-new-user',
	templateUrl: './new-user.component.html',
	styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
	onRegisterSuccess = new EventEmitter(); //Event emitter for when the user was successfully registered.
	onRegisterFail = new EventEmitter(); //Event emitter for when the user could not be registered.

	user: User;
	role: any;
	roleList = [{displayValue: 'Student', enumValue: 'STUDENT'}, {displayValue: 'Professor', enumValue: 'PROF'}, {displayValue: 'Admin', enumValue: 'ADMIN'}];
	loginUser: User;

	constructor(
		public dialogRef: MatDialogRef<NewUserComponent>, //Pass the component a reference to itself
		@Inject(MAT_DIALOG_DATA) private data:any,
		private http: HttpClient //Pass the http-client for http requests
	) { }

	ngOnInit() {
		if(localStorage.getItem('user')) this.loginUser = JSON.parse(localStorage.getItem('user'));
		if(this.data.user) {
			this.user = {
				lastName: this.data.user.lastName,
				firstName: this.data.user.firstName,
				email: this.data.user.email,
				role: this.data.user.role,
				password: this.data.user.password,
				courses: this.data.user.courses,
				papers: this.data.user.papers,
				finalPapers: this.data.user.finalPapers
			};

			this.roleList.forEach(roleObject => {
				if(this.data.user.role == roleObject.enumValue) this.role = roleObject;
			});
		}
		else {
			//Object in which the data that the user enters in the form will be saved.
			this.user = {
				lastName: '',
				firstName: '',
				email: '',
				role: '',
				password: '',
				courses: [],
				papers: [],
				finalPapers: []
			};
		}
	}

	//Function that is called when the user hits the send button.
	createUser() {
		this.user.role = this.role.enumValue;

		let requestType = this.data.update ?'put' :'post'
		let requestParam = this.data.update ?'/' + this.data.user.userId :'';
		
		//Send entered course data and register course
		this.http[requestType]('http://localhost:8080/api/user' + requestParam, this.user, {withCredentials: true})
		.subscribe(
			response => { //Success
				//Emit success-message to parent
				this.onRegisterSuccess.emit();
				//Close Dialog
				this.dialogRef.close();
			},
			error => { //Error
				//Emit error-message to parent
				this.onRegisterFail.emit();
			}
		);
	}

}
