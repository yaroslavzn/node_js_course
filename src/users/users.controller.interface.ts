import { Router } from 'express';

export interface IUsersController {
	login(...args: unknown[]): void;
	register(...args: unknown[]): void;
	router: Router;
}
