import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuardName } from '../enums/guard_name.enum';

@Injectable()
export class JWTAuthGuard extends AuthGuard(GuardName.JWT) {}
