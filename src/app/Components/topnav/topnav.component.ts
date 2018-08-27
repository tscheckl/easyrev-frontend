import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-topnav',
	templateUrl: './topnav.component.html',
	styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
	user: any;

	constructor(
		private router: Router,
        public dialog: MatDialog, 
        public snackBar: MatSnackBar,
        private http: HttpClient
	) {
		router.events.subscribe((val) => {
			if (val instanceof NavigationEnd) {
				if (val.url === '/login') {
					document.getElementById('topnav').style.display = 'none';
				}
				else if (val.url === '/') {
					document.getElementById('topnav').style.display = 'flex';
					document.getElementById('course-link').style.display = 'none';
					document.getElementById('logout').style.display = 'initial';
				}
				else {
					document.getElementById('topnav').style.display = 'flex';
					document.getElementById('course-link').style.display = 'initial';
					document.getElementById('logout').style.display = 'initial';
				}
				if(localStorage.getItem('user')) {
					this.user = JSON.parse(localStorage.getItem('user'));
					if(this.user.role != 'ADMIN') document.getElementById('admin-link').style.display = 'none';
					else document.getElementById('admin-link').style.display = 'initial';
				}
			}
		});
    }
    
    showUser() {
		//Open the user-info-dialog with the data of the clicked row.
		let userDialogRef = this.dialog.open(UserDialogComponent, { data : this.user });

		//Handler for when the dialog returns a successful register.
		const success = userDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
            this.getUser();
        });
        
		//Handler for when the dialog returns a successful register.
		const deleted = userDialogRef.componentInstance.onDeleteSuccess.subscribe((msg) => {
			//Update the users in the table
			this.getUser();
			this.snackBar.open('User erfolgreich gelöscht!', 'Ok', {
				duration: 3000
			});
		});
    }

    getUser(){
        this.http.get('http://localhost:8080/api/user/'+ this.user.userId, {withCredentials: true}).subscribe(data => {
             this.user = data;
             localStorage.setItem('user', JSON.stringify(this.user));
        });
    }


	ngOnInit() {
	}

	logout() {
		localStorage.removeItem('user');
		this.router.navigate(['/login']);
	}

}
