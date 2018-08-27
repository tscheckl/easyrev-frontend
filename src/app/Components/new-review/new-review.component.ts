import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Review, Paper, User } from '../../models/models';

@Component({
	selector: 'app-new-review',
	templateUrl: './new-review.component.html',
	styleUrls: ['./new-review.component.scss']
})
export class NewReviewComponent implements OnInit {

	onRegisterSuccess = new EventEmitter(); //Event emitter for when the course was successfully registered.
	onRegisterFail = new EventEmitter(); //Event emitter for when the course could not be registered.

	user: User;
	review: Review;
	paper: Paper;
	author: User;
	loading: Boolean = true;

	constructor(
		public dialogRef: MatDialogRef<NewReviewComponent>, //Pass the component a reference to itself
		@Inject(MAT_DIALOG_DATA) private data: any,
		private http: HttpClient, //Pass the http-client for http requests
		public snackBar: MatSnackBar
	) { }

	createReview() {
		this.http.put('http://localhost:8080/api/review/' + this.review.reviewId, this.review, {withCredentials: true})
		.subscribe(
			response => { //Success
				//Emit success-message to parent
				this.onRegisterSuccess.emit();
				//Close Dialog
				this.dialogRef.close();
			},
			error => {
				console.log(error);
				//Emit error-message to parent
				this.onRegisterFail.emit();
				//Close Dialog
				this.dialogRef.close();
			}
		);
	}

	ngOnInit() {
		if (localStorage.getItem('user')) this.user = JSON.parse(localStorage.getItem('user'));
		this.review = this.data.review;
		this.paper = this.data.paper;

		console.log(this.review.evaluations);
		
		this.http.get<User>('http://localhost:8080/api/user/' + this.paper.authorId, { withCredentials: true })
			.subscribe(
				response => { //Success
					this.author = response;
					this.loading = false;
				},
				error => {
					console.log(error);
					//Close the dialog
					this.dialogRef.close();
				}
			);
	}
}
