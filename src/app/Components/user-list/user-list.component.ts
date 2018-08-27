import { Component, OnInit, ViewChild, Output, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { NewUserComponent } from '../new-user/new-user.component';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { User } from '../../models/models';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss'],
})

export class UserListComponent implements OnInit {
	@Input() users: User[];
	//Array with the names for the table columns
	displayedColumns = ['vorname', 'nachname', 'email'];
	// users: User[];
	//Variable which gives the table its data.
	dataSource = new MatTableDataSource<User>(this.users);

	//Variable that references the user-info dialog.
	userDialogRef: MatDialogRef<UserDialogComponent>;

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
			this.users.sort((a, b) => a[sort.active].localeCompare(b[sort.active]));
		else 
			this.users.sort((a, b) => b[sort.active].localeCompare(a[sort.active]));

		this.dataSource = new MatTableDataSource<User>(this.users);
	}

	showUser(row) {
		//Open the user-info-dialog with the data of the clicked row.
		let userDialogRef = this.dialog.open(UserDialogComponent, { data: row });

		//Handler for when the dialog returns a successful register.
		const success = userDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.getUsers();
		});

		//Handler for when the dialog returns a successful register.
		const deleted = userDialogRef.componentInstance.onDeleteSuccess.subscribe((msg) => {
			//Update the users in the table
			this.getUsers();
			this.snackBar.open('User erfolgreich gelöscht!', 'Ok', {
				duration: 3000
			});
		});
	}

	//Function that is called when the "create user" button is clicked.
	openNewUserDialog() {
		//Open the "create user" dialog
		let newUserDialogRef = this.dialog.open(NewUserComponent, { data: { update: false } });

		//Handler for when the dialog returns a successful register.
		const success = newUserDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			// TODO: Reload table data to directly display the new user
			this.getUsers();
			this.snackBar.open('User erfolgreich angelegt!', 'Ok', {
				duration: 3000
			});
		});

		//Handler for when the dialog returns an error while registering.
		const error = newUserDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			this.snackBar.open('User konnte nicht angelegt werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	getUsers() {
		this.http.get<User[]>('http://localhost:8080/api/user', {withCredentials: true}).subscribe(data => {
			this.users = data;
			this.dataSource = new MatTableDataSource<User>(this.users);
		});
	}

	ngOnInit(): void {
		//Get all available users from the backend, save them in the respective variable and update the table's data.
		// this.getUsers();
		console.log(this.users);
		this.users.forEach((user, index) => {
			this.http.get<User>('http://localhost:8080/api/user/' + user, {withCredentials: true})
				.subscribe(
					response => { //Success
						this.users[index] = response;
						this.dataSource = new MatTableDataSource<User>(this.users);
					},
					error => { }
				);
		});
	}

}
