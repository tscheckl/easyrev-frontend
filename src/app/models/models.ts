export interface User {
	lastName: String;
	firstName: String;
	email: String;
	userId?: String;
	role: any;
	courses?: any;
	papers?: any;
	finalPapers?: any;
	password: String;
}

export interface Review {
	reviewId?: String;
	reviewer: String;
	paper: String;
	evaluations?: any;
}

export interface Paper {
	paperId?: String;
	paperTitle: String;
	topic?: String;
	description: String;
	paperFile: any;
	fileName: any;
	authorId: any;
	reviews?: any;
}

export interface Course {
	courseId?: String;
	courseOwners?: any;
	courseName: String;
	phase: any;
	evaluationTemplates?: any;
	courseMembers?: any;
	coursePapers?: any;
	courseFinalPapers?: any;
}