import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { User, Course } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NewCourseComponent } from '../new-course/new-course.component';

@Component({
	selector: 'app-course-select',
	templateUrl: './course-select.component.html',
	styleUrls: ['./course-select.component.scss']
})
export class CourseSelectComponent implements OnInit {
	user: User;
	coursesUser = [];
	coursesOwner = [];
	loading = true;

	//Variable that references the "create course" dialog.
	createCourseDialogRef: MatDialogRef<NewCourseComponent>;

	constructor(
		private http: HttpClient,
		private router: Router,
		public dialog: MatDialog,
		public snackBar: MatSnackBar
	) { }

	getCourses() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.loading = false;
		this.coursesUser = [];
		this.coursesOwner = [];

		this.http.get<[Course]>('http://localhost:8080/api/course/' + this.user.userId + '/user', {withCredentials: true})
			.subscribe(
				response => {
					let resCourses = response;
					resCourses.forEach(resCourse => {
						if(resCourse.phase == 'PHASE1')
							resCourse.phase = 'Phase 1';
						else if(resCourse.phase == 'PHASE2')
							resCourse.phase = 'Phase 2';
						else if(resCourse.phase == 'PHASE3')
							resCourse.phase = 'Phase 3';
						else 
							resCourse.phase = 'beendet';
						
						let owners = [];

						resCourse.courseOwners.forEach((owner, index2, array) => {
							this.http.get('http://localhost:8080/api/user/' + owner, {withCredentials: true})
							.subscribe(
								responseOwner => {
									owners.push(responseOwner);
									if(owners.length === array.length) {
										resCourse.courseOwners = owners;
										this.coursesUser.push(resCourse);
									}
								},
								error => {console.log(error);}
							);
						});
					});
				},
				error => {console.log(error);}
			);

		if(this.user.role === 'PROF' || this.user.role === 'ADMIN') {
			this.http.get<[Course]>('http://localhost:8080/api/course/' + this.user.userId + '/owner', {withCredentials: true})
			.subscribe(
				response => {
					let resCourses = response;
					resCourses.forEach(resCourse => {
						if(resCourse.phase == 'PHASE1')
							resCourse.phase = 'Phase 1';
						else if(resCourse.phase == 'PHASE2')
							resCourse.phase = 'Phase 2';
						else if(resCourse.phase == 'PHASE3')
							resCourse.phase = 'Phase 3';
						else 
							resCourse.phase = 'beendet';
						
						let owners = [];

						resCourse.courseOwners.forEach((owner, index2, array) => {
							this.http.get('http://localhost:8080/api/user/' + owner, {withCredentials: true})
							.subscribe(
								responseOwner => {
									owners.push(responseOwner);
									if(owners.length === array.length) {
										resCourse.courseOwners = owners;
										this.coursesOwner.push(resCourse);
									}
								},
								error => {console.log(error);}
							);
						});
					});
				},
				error => {console.log(error);}
			);
		}
	}

	//Function that is called when the "create user" button is clicked.
	openCourseDialog() {
		//Open the "create user" dialog
		let createCourseDialogRef = this.dialog.open(NewCourseComponent, { data: { update: false } });

		//Handler for when the dialog returns a successful register.
		const success = createCourseDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			// TODO: Reload table data to directly display the new user
			this.getCourses();
			this.snackBar.open('Kurs erfolgreich angelegt!', 'Ok', {
				duration: 3000
			});
		});

		//Handler for when the dialog returns an error while registering.
		const error = createCourseDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			this.snackBar.open('Kurs konnte nicht angelegt werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	ngOnInit() {
		if(!localStorage.getItem('user')) this.router.navigate(['/login']);
		else {
			this.getCourses();
		}
	}

}
