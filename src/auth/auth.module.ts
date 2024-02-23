import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { jwtConstants } from './constants';
import { AccessTokeStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    PrismaService,
    AccessTokeStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
