import { IsEmail, IsString } from 'class-validator';
import 'reflect-metadata';

export class UserRegisterDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	name: string;
}
