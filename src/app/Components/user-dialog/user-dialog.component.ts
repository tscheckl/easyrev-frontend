import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { User } from '../../models/models';
import { NewUserComponent } from '../new-user/new-user.component';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
	onRegisterSuccess = new EventEmitter(); //Event emitter for when the user was successfully registered.
	onDeleteSuccess = new EventEmitter(); //Event emitter for when the user was successfully deleted.

	user: User;
	loading: Boolean = true;
    
	constructor(
		private dialogRef: MatDialogRef<UserDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private data:User,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private http: HttpClient
	) {}

	deleteUser(id) {
		this.http.delete('http://localhost:8080/api/user/' + id, {withCredentials: true}).subscribe(data => {
			//Emit success-message to parent
			this.onDeleteSuccess.emit();
			//Close the dialog
			this.dialogRef.close();
		});
	}

	updateUser(user) {
		//Open the "create user" dialog
		let newUserDialogRef = this.dialog.open(NewUserComponent, {data: {user: user, update: true}});		

		//Handler for when the dialog returns a successful register.
		const success = newUserDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			// TODO: Reload table data to directly display the new user
			this.onRegisterSuccess.emit();
			this.dialogRef.close();
			this.snackBar.open('User erfolgreich aktualisiert!', 'Ok', {
				duration: 3000
			});
		});

		//Handler for when the dialog returns an error while registering.
		const error = newUserDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			this.snackBar.open('User konnte nicht aktualisiert werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	ngOnInit() {
		if(localStorage.getItem('user')) this.user = JSON.parse(localStorage.getItem('user'));
		this.loading = false;
	}

}
