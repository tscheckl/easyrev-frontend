import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatButtonToggleModule, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { User } from '../../models/models';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	email: string;
	password: string;
	pwErrorMessage: string = '';

	user: User;
	role: any;
	roleList = [{displayValue: 'Student', enumValue: 'STUDENT'}, {displayValue: 'Professor', enumValue: 'PROF'}, {displayValue: 'Admin', enumValue: 'ADMIN'}];

	constructor(
		private router: Router,
		private http: HttpClient, //Pass the http-client for http requests
		public snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.user = {
			lastName: '',
			firstName: '',
			email: '',
			role: 'STUDENT',
			password: '',
			courses: [],
			papers: [],
			finalPapers: []
		};
	}

	checkPassword() {
		if(this.user.password.length < 8) {
			this.pwErrorMessage = 'Das Passwort muss mindestens 8 Zeichen lang sein!';
		}
		else {
			this.pwErrorMessage = '';
		}
	}

	login() {
		this.http.post('http://localhost:8080/api/user/login/check', {email: this.email, password: this.password}, {withCredentials: true, headers: new HttpHeaders({'Authorization': 'Basic ' + btoa(this.email + ':' + this.password)})})
			.subscribe(
				response => {
					localStorage.setItem('user', JSON.stringify(response));
					this.router.navigate(['']);
				},
				error => { //Error
					if(error.status == 404) {
						this.snackBar.open('Email oder Passwort ungültig!', 'Ok', {
							duration: 3000
						});
					}
				}
			)
	}

	register() {
		this.http.post('http://localhost:8080/api/user', this.user, {withCredentials: true})
		.subscribe(
			response => {
				this.snackBar.open('User erfolgreich registriert!', 'Ok', {
					duration: 3000
				});
				this.router.navigate(['']);
			},
			error => { //Error

				if(error.status == 400) {
					this.snackBar.open('Keine gültige Email-Adresse!', 'Ok', {
						duration: 3000
					});
				}
				
				if(error.status == 403) {
					this.snackBar.open('Diese Email-Adresse ist bereits vergeben. Bitte verwenden sie eine andere!', 'Ok', {
						duration: 3000
					});
				}
			}
		);
	}

}
