import { Role } from 'src/modules/user/enum/roles.enum';

export interface TokenPayload {
  userID: string;
  email: string;
  role: Role;
}
