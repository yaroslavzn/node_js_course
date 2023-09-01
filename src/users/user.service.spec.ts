import 'reflect-metadata';
import { Container } from 'inversify';
import { IUserService } from './user.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { TYPES } from '../types';
import { UserService } from './user.service';
import { UserModel } from '@prisma/client';

const container = new Container();

let userService: IUserService;
let configService: IConfigService;
let usersRepository: IUsersRepository;

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	createUser: jest.fn(),
	findUserByEmail: jest.fn(),
};

let createdUser: UserModel | null;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(UsersRepositoryMock);

	userService = container.get(TYPES.IUserService);
	configService = container.get(TYPES.IConfigService);
	usersRepository = container.get(TYPES.IUsersRepository);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce(10);
		usersRepository.createUser = jest.fn().mockImplementationOnce((user: UserModel) => ({
			email: user.email,
			name: user.name,
			password: user.password,
			id: 1,
		}));

		createdUser = await userService.createUser({
			email: 'test@test.com',
			name: 'John Doe',
			password: '12345',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('12345');
	});

	it('validateUser - success', async () => {
		usersRepository.findUserByEmail = jest.fn().mockReturnValueOnce(createdUser);

		const res = await userService.validateUser({
			email: 'test@test.com',
			password: '12345',
		});

		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.findUserByEmail = jest.fn().mockReturnValueOnce(createdUser);

		const res = await userService.validateUser({
			email: 'test@test.com',
			password: '12345678',
		});

		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.findUserByEmail = jest.fn().mockReturnValueOnce(null);

		const res = await userService.validateUser({
			email: 'test@test.com',
			password: '12345',
		});

		expect(res).toBeFalsy();
	});
});
