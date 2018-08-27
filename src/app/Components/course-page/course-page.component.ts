import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NewCourseComponent } from '../new-course/new-course.component';
import { NewPaperComponent } from '../new-paper/new-paper.component';
import { PaperDialogComponent } from '../paper-dialog/paper-dialog.component';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { Review, User, Paper } from '../../models/models';
import { SwitchPhaseDialogComponent } from '../switch-phase-dialog/switch-phase-dialog.component';

@Component({
	selector: 'app-course-page',
	templateUrl: './course-page.component.html',
	styleUrls: ['./course-page.component.scss']
})
export class CoursePageComponent implements OnInit {
	onRegisterSuccess = new EventEmitter(); //Event emitter for when the course was successfully registered.
	onDeleteSuccess = new EventEmitter(); //Event emitter for when the course was successfully deleted.

	sub: any;
	course: any;
	currentPhase: String;
	loading = true;
	user: User;
	usersPaper: Paper;
	finalPaper: Paper;
	assignedPapers = []; //[{paper: Paper, wasReviewed: Boolean}]
	reviews = [];
	allPapers: [String];
	userRole: String;

	//Variable that references the paper-info dialog.
	paperDialogRef: MatDialogRef<PaperDialogComponent>;
	//Variable that references the review-info dialog.
	reviewDialogRef: MatDialogRef<ReviewDialogComponent>;
	//Variable that references the switch-phase dialog.
	switchDialogRef: MatDialogRef<SwitchPhaseDialogComponent>;

  	constructor(
		private route: ActivatedRoute,
		private http: HttpClient,
		private router: Router,
		public dialog: MatDialog,
		public snackBar: MatSnackBar
	) { }

	getCourse() {
		this.sub = this.route.params.subscribe(params => {
			this.http.get('http://localhost:8080/api/course/' + params['id'], {withCredentials: true})
			.subscribe(
				response => { //Success
					this.course = response;
					console.log(this.course);
					
					
					if(this.course.courseOwners.includes(this.user.userId)) this.userRole = 'owner';
					else if(this.course.courseMembers.includes(this.user.userId)) this.userRole = 'user';

					this.course.coursePapers.some(paper => {
						if(paper.authorId == this.user.userId) {
							this.usersPaper = paper;
							return true;
						}
						return false;
					});

					this.course.courseFinalPapers.some(paper => {
						if(paper.authorId == this.user.userId) {
							this.finalPaper = paper;
							return true;
						}
						return false;
					});

					this.allPapers = this.course.coursePapers.map(paper => paper.paperId);

					if(this.course.phase == 'PHASE1') 
						this.currentPhase = 'Phase 1';
					else if(this.course.phase == 'PHASE2') {
						this.currentPhase = 'Phase 2';
						if(this.userRole == 'user') {
							this.http.get<[Paper]>('http://localhost:8080/api/user/' + this.user.userId + '/getPaperToReview/' + this.course.courseId, {withCredentials: true})
							.subscribe(
								response => {
									this.assignedPapers = [];
									response.forEach(responseObject => {
										this.assignedPapers.push({paper: responseObject, wasReviewed: false});
									});
									for(let paperObject of this.assignedPapers) {
										this.http.get<[Review]>('http://localhost:8080/api/paper/' + paperObject.paper.paperId + '/reviews', {withCredentials: true})
										.subscribe(
											response => {
												for(let paperReview of response) {
													if(paperReview.reviewer == this.user.userId 
														&&!paperReview.evaluations.some(evaluation => {
														if(evaluation.review != null) return false;
														return true;
													})) paperObject.wasReviewed = true;
												}
												
											},
											error => {console.log(error);}
										);
									}
								},
								error => {console.log(error);}
							);
						}
					}
					else if(this.course.phase == 'PHASE3') {
						this.reviews = [];
						this.currentPhase = 'Phase 3';
						if(this.usersPaper) {
							this.http.get<[Review]>('http://localhost:8080/api/paper/' + this.usersPaper.paperId + '/reviews', {withCredentials: true})
							.subscribe(
								response => {
									response.forEach(review => {
										if(!review.evaluations.some(evaluation => {
											if(evaluation.review != null) return false;
											return true;
										})) this.reviews.push(review);
									});
								},
								error => {console.log(error);}
							);
						}
					}
					else
						this.currentPhase = 'beendet';

					this.loading = false;

					// console.log(this.course);
				},
				error => {}
			);
		 });
	}

	updateCourse(course) {
		let courseCopy = Object.assign({}, course);
		
		courseCopy.courseMembers = courseCopy.courseMembers.map(member => member.userId);
		courseCopy.courseOwners = courseCopy.courseOwners.map(owner => owner.userId);

		console.log('injected course ', courseCopy);
		
		//Open the "create course" dialog
		let newCourseDialogRef = this.dialog.open(NewCourseComponent, {data: {course: courseCopy, update: true}});		

		//Handler for when the dialog returns a successful register.
		const success = newCourseDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.snackBar.open('Kurs erfolgreich aktualisiert!', 'Ok', {
				duration: 3000
			});
			this.loading = true;
			this.getCourse();
		});

		//Handler for when the dialog returns an error while registering.
		const error = newCourseDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			this.snackBar.open('Kurs konnte nicht aktualisiert werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	uploadPaper() {
		let courseCopy = Object.assign({}, this.course);
		
		courseCopy.courseMembers = courseCopy.courseMembers.map(member => member.userId);
		courseCopy.courseOwners = courseCopy.courseOwners.map(owner => owner.userId);

		//Open the "upload paper" dialog
		let newPaperDialogRef = this.dialog.open(NewPaperComponent, {data: {course: courseCopy, update: false}});		

		//Handler for when the dialog returns a successful register.
		const success = newPaperDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.snackBar.open('Paper erfolgreich hochgeladen!', 'Ok', {
				duration: 3000
			});
			this.loading = true;
			this.getCourse();
		});

		//Handler for when the dialog returns an error while registering.
		const error = newPaperDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			console.log(msg);
			
			this.snackBar.open('Paper konnte nicht hochgeladen werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	showPaper(paper) {
		if(this.currentPhase == 'Phase 1' || (this.currentPhase == 'Phase 3' && this.finalPaper && paper == this.finalPaper)) {
			paper.canEdit = true;
		}
		else {
			paper.canEdit = false;
		}
		console.log(paper);
		
		//Open the paper-info-dialog with the data of the clicked row.
		let paperDialogRef = this.dialog.open(PaperDialogComponent, { data: paper });
		
		//Handler for when the dialog returns a successful register.
		const success = paperDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.getCourse();
		});

		//Handler for when the dialog returns a successful register.
		const deleted = paperDialogRef.componentInstance.onDeleteSuccess.subscribe((msg) => {
			//Update the courses for the table.
			this.getCourse();
			this.snackBar.open('Paper erfolgreich gelöscht!', 'Ok', {
				duration: 3000
			});
		});
	}

	showReview(review) {
		//Open the paper-info-dialog with the data of the clicked row.
		let reviewDialogRef = this.dialog.open(ReviewDialogComponent, { data: review });
	}

	setToNextPhase() {
		let switchDialogRef = this.dialog.open(SwitchPhaseDialogComponent);

		//Handler for when the dialog returns confirmation for swtiching the phase.
		const confirmed = switchDialogRef.componentInstance.onConfirmSwitch.subscribe((msg) => {
			console.log(this.course);
			switch (this.course.phase) {
				case 'PHASE1':
					this.course.phase = 'PHASE2';
					this.currentPhase = 'Phase 2';
					break;
				
				case 'PHASE2':
					this.course.phase = 'PHASE3';
					this.currentPhase = 'Phase 3';
					break;

				case 'PHASE3':
					this.course.phase = 'PHASE4';
					this.currentPhase = 'beendet';
					break;
			
				default:
					break;
			}

			let rawCourse = Object.assign({}, this.course);
			rawCourse.courseMembers = rawCourse.courseMembers.map(member => member.userId);
			rawCourse.courseOwners = rawCourse.courseOwners.map(owner => owner.userId);
			
			this.http.put('http://localhost:8080/api/course/' + this.course.courseId , rawCourse, {withCredentials: true})
			.subscribe(
				response => { //Success
					this.snackBar.open('Phase erfolgreich geändert!', 'Ok', {
						duration: 3000
					});
				},
				error => { //Error
				}
			);
		});		
	}

	ngOnInit() {
		if(!localStorage.getItem('user')) this.router.navigate(['/login']);
		else {
			this.user = JSON.parse(localStorage.getItem('user'));
			this.getCourse();
		}
	}

}
