import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { Course } from '../../models/models';

@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit {

	onRegisterSuccess = new EventEmitter(); //Event emitter for when the course was successfully registered.
	onRegisterFail = new EventEmitter(); //Event emitter for when the course could not be registered.

	course: Course;
	
	users = [];
	owners = [];
    userList: any;
    ownerList: any;
    availableCriteria = [{
        name: '',
        description: ''
    }];
    phases = [
        {value: 'PHASE1', viewValue: 'Phase 1'},
        {value: 'PHASE2', viewValue: 'Phase 2'},
        {value: 'PHASE3', viewValue: 'Phase 3'},
        {value: 'PHASE4', viewValue: 'Beendet'}
    ]; 

	constructor(
		public dialogRef: MatDialogRef<NewCourseComponent>, //Pass the component a reference to itself
		@Inject(MAT_DIALOG_DATA) private data:any,
		private http: HttpClient //Pass the http-client for http requests
	) { }

  	ngOnInit() {

		if(this.data.course) {
			this.course = {
				courseOwners: this.data.course.courseOwners,
				courseName: this.data.course.courseName,
				phase: this.data.course.phase,
				evaluationTemplates: this.data.course.evaluationTemplates,
				courseMembers: this.data.course.courseMembers,
				coursePapers: this.data.course.coursePapers,
				courseFinalPapers: this.data.course.courseFinalPapers
			};

			this.availableCriteria = this.course.evaluationTemplates;
		}
		else {
			//Object in which the data that the user enters in the form will be saved.
			this.course = {
				courseOwners: [],
				courseName: '',
				phase: 'PHASE1',
				evaluationTemplates: [],
				courseMembers: [],
				coursePapers: [],
				courseFinalPapers: []
			};
		}
		console.log('course to send ', this.course);
		

		this.http.get('http://localhost:8080/api/user', {withCredentials: true})
		.subscribe(
			response => { //Success
				this.userList = response;
				let availUserIds = []
				this.userList.forEach((user) => {
					availUserIds.push(user.userId);
				});
				
				this.course.courseMembers.forEach((member) => {
					let userIndex = availUserIds.indexOf(member);
					if(userIndex != -1) {
						this.users.push(this.userList[userIndex]);
					}
				});
				this.ownerList = this.userList.filter(user => user.role === 'PROF' || user.role === 'ADMIN');
				this.course.courseOwners.forEach((owner) => {
					let ownerIndex = availUserIds.indexOf(owner);
					if(ownerIndex != -1) {
						this.owners.push(this.userList[ownerIndex]);
					}
				});
			},
			error => { //Error
				//Emit error-message to parent
				this.onRegisterFail.emit('Error!!');
			}
		);
    }
    
    addCriteria() {
        
        this.availableCriteria.push({
            name: '',
            description: ''
        });
    }

    removeCriteria(crit) {
        
        if(this.availableCriteria.length > 1){
            let index = this.availableCriteria.findIndex(x => x == crit);
            this.availableCriteria.splice(index,1);
        }
        else {
            this.onRegisterFail.emit();
        }

    }

	//Function that is called when the user hits the send button.
	createCourse() {
		this.course.courseMembers = this.users.map(user => user.userId);
		this.course.courseOwners = this.owners.map(owner => owner.userId);
		
		this.course.evaluationTemplates = this.availableCriteria;

		let requestType = this.data.update ?'put' :'post'
		let requestParam = this.data.update ? '/' + this.data.course.courseId :'';
		console.log("course:",this.course);
		
		//Send entered course data and register course
		this.http[requestType]('http://localhost:8080/api/course' + requestParam, this.course, {withCredentials: true})
		.subscribe(
			response => { //Success
				this.users.forEach(user => {
					if(!user.courses.includes(response.courseId)) {
						user.courses.push(response.courseId);
						this.http.put('http://localhost:8080/api/user/' + user.userId, user, {withCredentials: true})
						.subscribe(
							response => {
							},
							error => { //Error
								//Emit error-message to parent
								this.onRegisterFail.emit();
							}
						);
					}
				});

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
