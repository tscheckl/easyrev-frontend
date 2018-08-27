import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA} from '@angular/material';
import { Course } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { NewCourseComponent } from '../new-course/new-course.component';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.scss']
})
export class CourseDialogComponent implements OnInit {
	onRegisterSuccess = new EventEmitter(); //Event emitter for when the course was successfully registered.
	onDeleteSuccess = new EventEmitter(); //Event emitter for when the course was successfully deleted.
	userList = [];
	ownerList = [];

	constructor(
		private dialogRef: MatDialogRef<CourseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private data:Course,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private http: HttpClient
	) {}

	deleteCourse(id) {
		this.http.delete('http://localhost:8080/api/course/' + id, {withCredentials: true}).subscribe(data => {
			//Emit success-message to parent
			this.onDeleteSuccess.emit();
			//Close the dialog
			this.dialogRef.close();
		});
	}

	updateCourse(course) {
		//Open the "create course" dialog
		let newCourseDialogRef = this.dialog.open(NewCourseComponent, {data: {course: course, update: true}});		

		//Handler for when the dialog returns a successful register.
		const success = newCourseDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.onRegisterSuccess.emit();
			this.dialogRef.close();
			this.snackBar.open('Kurs erfolgreich aktualisiert!', 'Ok', {
				duration: 3000
			});
		});

		//Handler for when the dialog returns an error while registering.
		const error = newCourseDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			this.snackBar.open('Kurs konnte nicht aktualisiert werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	ngOnInit() {
		
		this.data.courseMembers.forEach((member, index) => {
			this.http.get('http://localhost:8080/api/user/' + member, {withCredentials: true})
			.subscribe(
				response => { //Success
					this.userList.push(response);
				},
				error => {}
			);
		});
		this.data.courseOwners.forEach((owner, index) => {
			this.http.get('http://localhost:8080/api/user/' + owner, {withCredentials: true})
			.subscribe(
				response => { //Success
					this.ownerList.push(response);
				},
				error => {}
			);
		});
	}

}
