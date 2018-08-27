import { Component, OnInit, ViewChild, Output, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Course } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { NewCourseComponent } from '../new-course/new-course.component';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';

@Component({
	selector: 'app-course-list',
	templateUrl: './course-list.component.html',
	styleUrls: ['./course-list.component.scss']
})

export class CourseListComponent implements OnInit {
	@Input() courses: Course[];
	//Array with the names for the table columns
	displayedColumns = ['courseName', 'coursePhase'];
	// courses: Course[];
	//Variable which gives the table its data.
	dataSource = new MatTableDataSource<Course>(this.courses);

	//Variable that references the "create course" dialog.
	createCourseDialogRef: MatDialogRef<NewCourseComponent>;
	//Variable that references the user-info dialog.
	courseDialogRef: MatDialogRef<CourseDialogComponent>;

	constructor(private http: HttpClient, public dialog: MatDialog, public snackBar: MatSnackBar) { }

	@ViewChild(MatSort) sort: MatSort;

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim();
		filterValue = filterValue.toLowerCase();
		this.dataSource.filter = filterValue;
	}

	sortData(sort: MatSort) {
		if (sort.direction == 'asc')
			this.courses.sort((a, b) => a[sort.active].localeCompare(b[sort.active]));
		else
			this.courses.sort((a, b) => b[sort.active].localeCompare(a[sort.active]));

		this.dataSource = new MatTableDataSource<Course>(this.courses);
	}

	showCourse(row) {
		//Open the course-info-dialog with the data of the clicked row.
		let courseDialogRef = this.dialog.open(CourseDialogComponent, { data: row });

		//Handler for when the dialog returns a successful register.
		const success = courseDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.getCourses();
		});

		//Handler for when the dialog returns a successful register.
		const deleted = courseDialogRef.componentInstance.onDeleteSuccess.subscribe((msg) => {
			//Update the courses for the table.
			this.getCourses();
			this.snackBar.open('Kurs erfolgreich gelöscht!', 'Ok', {
				duration: 3000
			});
		});
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

	getCourses() {
		//Get all available courses from the backend, save them in the respective variable and update the table's data.
		this.http.get<Course[]>('http://localhost:8080/api/course', {withCredentials: true}).subscribe(data => {
			this.courses = data;
			this.dataSource = new MatTableDataSource<Course>(this.courses);
		});
	}

	ngOnInit(): void {
		//Get all available courses from the backend, save them in the respective variable and update the table's data.
		// this.getCourses();
		console.log(this.courses);
		this.courses.forEach((course, index) => {
			this.http.get<Course>('http://localhost:8080/api/course/' + course, {withCredentials: true})
				.subscribe(
					response => { //Success
						this.courses[index] = response;
						this.dataSource = new MatTableDataSource<Course>(this.courses);
					},
					error => { }
				);
		});
	}

}
