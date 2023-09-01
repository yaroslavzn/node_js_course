import { inject, injectable } from 'inversify';
import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const user = new User(name, email);
		const salt = this.configService.get('PASSWORD_SALT');

		await user.setPassword(password, Number(salt));

		const storedUser = await this.usersRepository.createUser(user);

		return storedUser;
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const storedUser = await this.usersRepository.findUserByEmail(email);

		if (storedUser) {
			return User.comparePasswords(password, storedUser.password);
		}

		return false;
	}

	async findUserByEmail(email: string): Promise<UserModel | null> {
		return this.usersRepository.findUserByEmail(email);
	}
}
