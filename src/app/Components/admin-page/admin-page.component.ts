import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, Course, Paper } from '../../models/models';

@Component({
	selector: 'app-admin-page',
	templateUrl: './admin-page.component.html',
	styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
	category = 'User';
	categoryList = ['User', 'Kurse', 'Paper'];
	loading = true;

	data: any[];

	constructor(
		private http: HttpClient,
		private router: Router
	) { }

	getUsers() {
		this.http.get<User[]>('http://localhost:8080/api/user', {withCredentials: true}).subscribe(data => {
			this.data = data.map(elem => elem.userId);
			this.loading = false;
		});
	}

	getCourses() {
		this.http.get<Course[]>('http://localhost:8080/api/course', {withCredentials: true}).subscribe(data => {
			this.data = data.map(elem => elem.courseId);
			this.loading = false;
		});
	}

	getPapers() {
		this.http.get<Paper[]>('http://localhost:8080/api/paper', {withCredentials: true}).subscribe(data => {
			this.data = data.map(elem => elem.paperId);;
			this.loading = false;
		});
	}

	changeCategory(event) {
		this.loading = true;
		if (event.value === 'User') this.getUsers();
		else if (event.value === 'Kurse') this.getCourses();
		else if (event.value === 'Paper') this.getPapers();
	}
	
	ngOnInit() {
		if(!localStorage.getItem('user')) this.router.navigate(['/login']);
		else {
			this.getUsers();
		}
	}

}
