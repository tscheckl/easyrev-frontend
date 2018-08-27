import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

	constructor(){}

	groups = [
		{
			name: 'Wissenschaftliches Arbeiten',
			phase: 1,
			aufgabe: 'Paper wurde bereits hochgeladen.'
		},
		{
			name: 'Englisch',
			phase: 3,
			aufgabe: 'Keine Aufgaben in Phase 3.'
		},
		{
			name: 'Private Gruppe',
			phase: 2,
			aufgabe: 'Review muss noch erstellt werden.'
		}
	];

	papers = [
		{
			name: 'Das neue Modulsystem von Java',
			bewertung: 2.3
		},
		{
			name: 'Kryptominig als Alternative zu Werbung',
			bewertung: 1.7
		}
	];

	buttons = [
		{
			icon: 'description',
			tooltip: 'Eigene Paper',
			routerLink: '/'
		},
		{
			icon: 'thumbs_up_down',
			tooltip: 'Eigene Reviews',
			routerLink: '/'
		},
		{
			icon: 'group',
			tooltip: 'Eigene Gruppen',
			routerLink: '/'
		},
		{
			icon: 'stars',
			tooltip: 'Best Paper',
			routerLink: '/'
		},
		{
			icon: 'format_list_bulleted',
			tooltip: 'Alle Paper',
			routerLink: '/papers'
		},
		{
			icon: 'format_list_numbered',
			tooltip: 'Alle Reviews',
			routerLink: '/reviews'
		},
		{
			icon: 'contacts',
			tooltip: 'Alle User',
			routerLink: '/users'
		},
		{
			icon: 'person',
			tooltip: 'Account',
			routerLink: '/'
		}
	]
}
