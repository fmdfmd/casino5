export type UserRoles = 'ADMIN' | 'OPERATOR' | 'USER';

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	authMethod: 'email' | 'google' | 'steam' | 'twitter';
	googlePicture?: string;
	isEmailVerified: boolean;
	createdAt: string;
	updatedAt: string;
	avatar?: string;
	roles: UserRoles[];
}
