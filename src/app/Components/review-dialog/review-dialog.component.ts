import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA} from '@angular/material';
import { Review } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialogComponent implements OnInit {

	onDeleteSuccess = new EventEmitter(); //Event emitter for when the review was successfully deleted.

	constructor(
		private dialogRef: MatDialogRef<ReviewDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private data,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private http: HttpClient
	) {}

	ngOnInit() {
	}

}
