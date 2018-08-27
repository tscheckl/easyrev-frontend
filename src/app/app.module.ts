import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule, MatToolbarModule, MatSortModule, MatInputModule, MatNativeDateModule, MatButtonToggleModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { PaperListComponent } from './components/paper-list/paper-list.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewDialogComponent } from './components/review-dialog/review-dialog.component';
import { PaperDialogComponent } from './components/paper-dialog/paper-dialog.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { NewCourseComponent } from './components/new-course/new-course.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { NewPaperComponent } from './components/new-paper/new-paper.component';
import { LoginComponent } from './components/login/login.component';
import { CourseSelectComponent } from './components/course-select/course-select.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { CoursePageComponent } from './components/course-page/course-page.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { NewReviewComponent } from './components/new-review/new-review.component';
import { SwitchPhaseDialogComponent } from './components/switch-phase-dialog/switch-phase-dialog.component';

const appRoutes: Routes = [
	{ path: '', component: CourseSelectComponent },
	{ path: 'papers', component: PaperListComponent },
	{ path: 'reviews', component: ReviewListComponent },
	{ path: 'users', component: UserListComponent },
    { path: 'courses', component: CourseListComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'course/:id', component: CoursePageComponent },
	{ path: 'admin', component: AdminPageComponent },
];

@NgModule({
	declarations: [
		AppComponent,
		SidenavComponent,
		PaperListComponent,
		ReviewListComponent,
		ReviewDialogComponent,
		PaperDialogComponent,
		HomePageComponent,
		UserListComponent,
		NewUserComponent,
		NewCourseComponent,
		CourseListComponent,
		UserDialogComponent,
		CourseDialogComponent,
		NewPaperComponent,
		LoginComponent,
		CourseSelectComponent,
		TopnavComponent,
		CoursePageComponent,
		AdminPageComponent,
		NewReviewComponent,
		SwitchPhaseDialogComponent,
	],
	imports: [
		RouterModule.forRoot(appRoutes),
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatCheckboxModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatListModule,
		MatTableModule,
		MatSortModule,
		MatInputModule,
		MatDialogModule,
		MatCardModule,
		MatGridListModule,
		MatTooltipModule,
		MatSlideToggleModule,
		MatDatepickerModule,
		MatSnackBarModule,
		MatNativeDateModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule
	],
	entryComponents: [
		ReviewDialogComponent,
		PaperDialogComponent,
		NewUserComponent,
		NewCourseComponent,
		NewPaperComponent,
		NewReviewComponent,
		UserDialogComponent,
		CourseDialogComponent,
		SwitchPhaseDialogComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
