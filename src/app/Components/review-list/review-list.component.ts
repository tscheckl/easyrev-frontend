import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { Review } from '../../models/models';

@Component({
	selector: 'app-review-list',
	templateUrl: './review-list.component.html',
	styleUrls: ['./review-list.component.scss']
})

export class ReviewListComponent {
	displayedColumns = ['reviewer', 'paper', 'reviewedCriteria'];
	reviews: Review[];

	dataSource = new MatTableDataSource<Review>(this.reviews);

	reviewDialogRef: MatDialogRef<ReviewDialogComponent>;

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

	showReview(row) {
		let reviewDialogRef = this.dialog.open(ReviewDialogComponent, { data: row });

		//Handler for when the dialog returns a successful register.
		const deleted = reviewDialogRef.componentInstance.onDeleteSuccess.subscribe((msg) => {
			//Update the courses for the table.
			this.getReviews();
			this.snackBar.open('Gutachten erfolgreich gelöscht!', 'Ok', {
				duration: 3000
			});
		});
	}

	getReviews() {
		//Get all available reviews from the backend, save them in the respective variable and update the table's data.
		this.http.get<Review[]>('http://localhost:8080/api/review', {withCredentials: true}).subscribe(data => {
			this.reviews = data;
			this.dataSource = new MatTableDataSource<Review>(this.reviews);
		});
	}

	ngOnInit(): void {
		this.getReviews();
	}

}

