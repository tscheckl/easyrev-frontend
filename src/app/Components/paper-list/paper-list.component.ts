import { Component, OnInit, ViewChild, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { PaperDialogComponent } from '../paper-dialog/paper-dialog.component';
import { NewPaperComponent } from '../new-paper/new-paper.component';
import { Paper } from '../../models/models';
 
@Component({
	selector: 'app-paper-list',
	templateUrl: './paper-list.component.html',
	styleUrls: ['./paper-list.component.scss']
})

export class PaperListComponent {
	@Input() papers: Paper[];
	//Array with the names for the table columns
	displayedColumns = ['paperTitle', 'topic'];
	// paper: Paper[];
	//Variable which gives the table its data.
	dataSource = new MatTableDataSource<Paper>(this.papers);

	//Variable that references the paper-info dialog.
	paperDialogRef: MatDialogRef<PaperDialogComponent>;

	constructor(public dialog: MatDialog, private http: HttpClient, public snackBar: MatSnackBar) { }

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
			this.papers.sort((a, b) => a[sort.active].localeCompare(b[sort.active]));
		else 
			this.papers.sort((a, b) => b[sort.active].localeCompare(a[sort.active]));

		this.dataSource = new MatTableDataSource<Paper>(this.papers);
	}

	showPaper(row) {
		//Open the paper-info-dialog with the data of the clicked row.
		let paperDialogRef = this.dialog.open(PaperDialogComponent, { data: row });
		
		//Handler for when the dialog returns a successful register.
		const success = paperDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			this.getPapers();
		});

		//Handler for when the dialog returns a successful register.
		const deleted = paperDialogRef.componentInstance.onDeleteSuccess.subscribe((msg) => {
			//Update the courses for the table.
			this.getPapers();
			this.snackBar.open('Paper erfolgreich gelöscht!', 'Ok', {
				duration: 3000
			});
		});
	}

	//Function that is called when the "create paper" button is clicked.
	openNewPaperDialog() {
		//Open the "create paper" dialog
		let createPaperDialogRef = this.dialog.open(NewPaperComponent, {data: {update:false}});		

		//Handler for when the dialog returns a successful register.
		const success = createPaperDialogRef.componentInstance.onRegisterSuccess.subscribe((msg) => {
			// TODO: Reload table data to directly display the new paper
			this.getPapers();
			this.snackBar.open('Paper erfolgreich erstellt!', 'Ok', {
				duration: 3000
			});
		});

		//Handler for when the dialog returns an error while registering.
		const error = createPaperDialogRef.componentInstance.onRegisterFail.subscribe((msg) => {
			this.snackBar.open('Paper konnte nicht erstellt werden, bitte erneut versuchen!', 'Ok', {
				duration: 3000
			});
		});
	}

	getPapers() {
		//Get all available papers from the backend, save them in the respective variable and update the table's data.
		this.http.get<Paper[]>('http://localhost:8080/api/paper', {withCredentials: true}).subscribe(data => {
			this.papers = data;
			this.dataSource = new MatTableDataSource<Paper>(this.papers);
		});
	}

	ngOnInit() {
		//Get all available papers from the backend, save them in the respective variable and update the table's data.
		// this.getPapers();
		console.log(this.papers);
		this.papers.forEach((paper, index) => {
			this.http.get<Paper>('http://localhost:8080/api/paper/' + paper, {withCredentials: true})
				.subscribe(
					response => { //Success
						this.papers[index] = response;
						this.dataSource = new MatTableDataSource<Paper>(this.papers);
					},
					error => { }
				);
		});
	}
}
