import { Exclude, Transform } from 'class-transformer';

export class UserDto {
  id: String;
  username: String;
  firstName: String;
  lastName: String;
  role: String;
  createdAt: Date;
  updatedAt: Date;
  parentId?: String;

  @Exclude()
  password: String;
}
