import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

@InputType({ description: 'Input for creating a user' })
export class CreateUserInput {
  @Field({ description: 'Email address' })
  @IsEmail()
  email: string;

  @Field({ description: 'First name' })
  @IsString()
  firstName: string;

  @Field({ description: 'Last name' })
  @IsString()
  lastName: string;

  @Field({ description: 'Display name' })
  @IsString()
  displayName: string;

  @Field({ description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password: string;

  @Field({ nullable: true, description: 'Avatar image path' })
  @IsOptional()
  @IsString()
  image?: string;
}

@InputType({ description: 'Input for updating a user' })
export class UpdateUserInput extends PartialType(CreateUserInput) {}
