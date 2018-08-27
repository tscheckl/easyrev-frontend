import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { NewPaperComponent } from '../new-paper/new-paper.component';
import { NewReviewComponent } from '../new-review/new-review.component';
import { Paper, User, Review } from '../../models/models';

@Component({
  selector: 'app-paper-dialog',
  templateUrl: './paper-dialog.component.html',
  styleUrls: ['./paper-dialog.component.scss']
})
export class PaperDialogComponent implements OnInit {
	onRegisterSuccess = new EventEmitter(); //Event emitter for when the course was successfully registered.
	onDeleteSuccess = new EventEmitter(); //Event emitter for when the course was successfully deleted.
	
	user: User;
	author: User;
	review: Review;
	loading: Boolean = true;

	constructor(
		private dialogRef: MatDialogRef<PaperDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private data:Paper,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private http: HttpClient
	) {}

	deletePaper(id) {
		this.http.delete('http://localhost:8080/api/paper/' + id, {withCredentials: true})
		.subscribe(data => {
			console.log("delete response: ", data);
			//Emit success-message to parent
			this.onDeleteSuccess.emit();
			//Close the dialog
			this.dialogRef.close();
		});
	}

	updatePaper(paper) {
		//Open the "create paper" dialog
		let newPaperDialogRef = this.dialog.open(NewPaperComponent, {data: {paper: paper, update: true}});		

		//Handler for when the dialog returns a successful register.
		const success = newPaperDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.onRegisterSuccess.emit();
			this.dialogRef.close();
			this.snackBar.open('Paper erfolgreich aktualisiert!', 'Ok', {
				duration: 3000
			});
		});

		//Handler for when the dialog returns an error while registering.
		const error = newPaperDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			console.log(msg);
			this.snackBar.open('Paper konnte nicht aktualisiert werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	downloadPaper() {
		window.open(`http://localhost:8080/api/paper/${this.data.paperId}/pdf`);
	}

	ratePaper(review) {
		//Open the "create review" dialog
		let newReviewDialogRef = this.dialog.open(NewReviewComponent, {data: {paper: this.data, review: review}});		

		//Handler for when the dialog returns a successful register.
		const success = newReviewDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.onRegisterSuccess.emit();
			this.dialogRef.close();
			this.snackBar.open('Paper erfolgreich bewertet!', 'Ok', {
				duration: 3000
			});
		});

		//Handler for when the dialog returns an error while registering.
		const error = newReviewDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			console.log(msg);
			this.snackBar.open('Paper konnte nicht bewertet werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	ngOnInit() {
		if(localStorage.getItem('user')) this.user = JSON.parse(localStorage.getItem('user'));
		this.http.get<User>('http://localhost:8080/api/user/' + this.data.authorId, {withCredentials: true})
			.subscribe(
				response => { //Success
					this.author = response;
					this.http.get<[Review]>('http://localhost:8080/api/paper/' + this.data.paperId + '/reviews', {withCredentials: true})
					.subscribe(
						response => {
							response.some(review => {
								if(review.reviewer == this.user.userId) {
									this.review = review;
									return true;
								}
								return false;
							});
							this.loading = false;
						},
						error => {
							if(error.status == 404) this.loading = false;
							else {
								console.log(error);
								//Close the dialog
								this.dialogRef.close();
							}
						}
					);
				},
				error => {
					console.log(error);
					//Close the dialog
					this.dialogRef.close();
				}
			);
	}

}
