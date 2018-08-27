import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
	openDropdown() {
		if (document.getElementById("dropdown").classList.contains('display-none')) {
			document.getElementById("dropdown").classList.remove('display-none');
			document.getElementById("dropdown-icon").innerText = "expand_less";

		}
		else {
			document.getElementById("dropdown").classList.add('display-none');
			document.getElementById("dropdown-icon").innerText = "expand_more";
		}
	}

}
