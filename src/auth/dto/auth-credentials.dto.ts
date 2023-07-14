import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password should be at least 8 characters long.',
  })
  @MaxLength(20, {
    message: 'Password should not be more than 20 characters long.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password should contain at least:
    1 upper case letter,
    1 lower case letter,
    and 1 number or special character.`,
  })
  password: string;
}
