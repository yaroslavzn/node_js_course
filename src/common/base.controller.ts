import express, { Response, Router } from 'express';
import { IControllerRoute } from './route.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../logger/logger.interface';

type ExpressResponse = Response<any, Record<string, any>>;

@injectable()
export abstract class BaseController {
	private _router: Router;

	constructor(private logger: ILogger) {
		this._router = express.Router();
	}

	public get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressResponse {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressResponse {
		return this.send(res, 200, message);
	}

	public created(res: Response): ExpressResponse {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			const handler = route.func.bind(this);
			const middlewares = route.middlewares?.map((middleware) =>
				middleware.execute.bind(middleware),
			);
			const pipeline = middlewares ? [...middlewares, handler] : handler;
			this.logger.log(`[${route.method.toUpperCase()}] - ${route.path}`);
			this.router[route.method](route.path, pipeline);
		}
	}
}
