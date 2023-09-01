import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUsersController } from './users/users.controller.interface';
import { IUserService } from './users/user.service.interface';
import { UserService } from './users/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';

interface IBootstrapResult {
	appContainer: Container;
	app: App;
}

async function bootstrap(): Promise<IBootstrapResult> {
	const appBindings = new ContainerModule((bind: interfaces.Bind) => {
		bind<App>(TYPES.Application).to(App).inSingletonScope();
		bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
		bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter).inSingletonScope();
		bind<IUsersController>(TYPES.IUsersController).to(UsersController).inSingletonScope();
		bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
		bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
		bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
		bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
	});

	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);

	await app.init();

	return { appContainer, app };
}

export const boot = bootstrap();
