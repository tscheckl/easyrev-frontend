import { Component, OnInit, EventEmitter, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { Paper, User } from '../../models/models';

@Component({
	selector: 'app-new-paper',
	templateUrl: './new-paper.component.html',
	styleUrls: ['./new-paper.component.scss']
})
export class NewPaperComponent implements OnInit {

	onRegisterSuccess = new EventEmitter(); //Event emitter for when the course was successfully registered.
	onRegisterFail = new EventEmitter(); //Event emitter for when the course could not be registered.

	paper: Paper;
	user: User;
	selectedFile: File = null;
	fileLabel = 'Datei Auswählen';

	constructor(
		public dialogRef: MatDialogRef<NewPaperComponent>, //Pass the component a reference to itself
		@Inject(MAT_DIALOG_DATA) private data: any,
		private http: HttpClient, //Pass the http-client for http requests
		public snackBar: MatSnackBar
	) { }

	ngOnInit() {
		if(localStorage.getItem('user')) this.user = JSON.parse(localStorage.getItem('user'));
		if (this.data.paper) {
			this.paper = {
				paperTitle: this.data.paper.paperTitle,
				topic: this.data.paper.topic,
				description: this.data.paper.description,
				paperFile: this.data.paper.paperFile,
				fileName: this.data.paper.fileName,
				authorId: this.data.paper.authorId,
				reviews: this.data.paper.reviews,
			};

			this.fileLabel = this.data.paper.fileName;
		}
		else {
			//Object in which the data that the user enters in the form will be saved.
			this.paper = {
				paperTitle: '',
				topic: '',
				description: '',
				paperFile: '',
				fileName: '',
				authorId: this.user.userId
			};
		}
	}

	onAttachingPaper(file: File) {
		if (file.type === "application/pdf") {
			this.selectedFile = file;
			this.fileLabel = file.name;

			this.paper.fileName = file.name;
		} else {
			this.selectedFile = null;
			this.snackBar.open('Es können nur PDF Dateien hochgeladen werden!', 'Ok', {
				duration: 3000
			});
		}
	}

	//Function that is called when the user hits the send button.
	createPaper() {
		if(this.data.update == false && !this.selectedFile) return;
		
		let requestType = this.data.update ? 'put' : 'post'
		let requestParam = this.data.update ? '/' + this.data.paper.paperId : '';

		//Send entered paper data and register paper
		this.http[requestType]('http://localhost:8080/api/paper' + requestParam, this.paper, {withCredentials: true})
			.subscribe(
				response => { //Success
					if (this.selectedFile != null) {

						const fd = new FormData();
						fd.append('file', this.selectedFile, this.selectedFile.name);

						this.http.post('http://localhost:8080/api/paper/' + response.paperId + '/file', fd, {withCredentials: true})
							.subscribe(
								responseFile => {
									if (this.data.course.phase == "Phase 1" || this.data.course.phase == "PHASE1") {
										if (!this.user.papers.includes(response.paperId)) {
											this.user.papers.push(response.paperId);
											this.http.put('http://localhost:8080/api/user/' + this.user.userId, this.user, {withCredentials: true})
												.subscribe(
													responseUser => {
														if (this.data.course && !this.data.course.coursePapers.includes(response.paperId)) {
															this.data.course.coursePapers.push(response);
															console.log('neuer kurs ', this.data.course);
															
															this.http.put('http://localhost:8080/api/course/' + this.data.course.courseId, this.data.course, {withCredentials: true})
																.subscribe(
																	responsePaper => {
																		//Emit success-message to parent
																		this.onRegisterSuccess.emit();
																		//Close Dialog
																		this.dialogRef.close();
																	},
																	error => { //Error
																		console.log('1 ', error);
																		
																		//Emit error-message to parent
																		this.onRegisterFail.emit();
																	}
																);
														}
													},
													error => { //Error
														console.log('2 ', error);
																		
														//Emit error-message to parent
														this.onRegisterFail.emit();
													}
												);
										}
									}
									else if (this.data.course.phase == "Phase 3" || this.data.course.phase == "PHASE3") {
										if (!this.user.finalPapers.includes(response.paperId)) {
											this.user.finalPapers.push(response.paperId);
											this.http.put('http://localhost:8080/api/user/' + this.user.userId, this.user, {withCredentials: true})
												.subscribe(
													responseUser => {
														if (this.data.course && !this.data.course.courseFinalPapers.includes(response.paperId)) {
															this.data.course.courseFinalPapers.push(response);
															
															this.http.put('http://localhost:8080/api/course/' + this.data.course.courseId, this.data.course, {withCredentials: true})
																.subscribe(
																	responsePaper => {
																		//Emit success-message to parent
																		this.onRegisterSuccess.emit();
																		//Close Dialog
																		this.dialogRef.close();
																	},
																	error => { //Error
																		console.log('1 ', error);
																		
																		//Emit error-message to parent
																		this.onRegisterFail.emit();
																	}
																);
														}
													},
													error => { //Error
														console.log('2 ', error);
																		
														//Emit error-message to parent
														this.onRegisterFail.emit();
													}
												);
										}
									}
									//Emit success-message to parent
									this.onRegisterSuccess.emit();
									//Close Dialog
									this.dialogRef.close();
								},
								error => {
									console.log('3 ', error);
																	
									//Emit error-message to parent
									this.onRegisterFail.emit();
								});
					}
					//Emit success-message to parent
					this.onRegisterSuccess.emit();
					//Close Dialog
					this.dialogRef.close();
				},
				error => { //Error
					console.log('4 ', error);

					//Emit error-message to parent
					this.onRegisterFail.emit();
				}
			);
	}

}
