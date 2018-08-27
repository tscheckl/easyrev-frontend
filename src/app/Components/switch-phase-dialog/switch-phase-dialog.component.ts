import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-switch-phase-dialog',
	templateUrl: './switch-phase-dialog.component.html',
	styleUrls: ['./switch-phase-dialog.component.scss']
})
export class SwitchPhaseDialogComponent implements OnInit {
	onConfirmSwitch = new EventEmitter(); //Event emitter for when the user confirms to switch the phase.

	constructor(
		public dialogRef: MatDialogRef<SwitchPhaseDialogComponent>, //Pass the component a reference to itself
	) { }

	ngOnInit() {
	}

	confirmSwitch(confirmed) {
		if(confirmed) {
			//Emit confirmation to parent.
			this.onConfirmSwitch.emit();
		}
		//Close Dialog.
		this.dialogRef.close()
	}

}
