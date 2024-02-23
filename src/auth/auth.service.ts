import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpInput } from './dto/signup.input';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginResponse } from './dto/login-response';
import { SigninInput } from './dto/signin.input';
import { LogoutResponse } from './dto/logout-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signin(signinInput: SigninInput) {
    const user = await this.usersService.findOne(signinInput.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatchedPassword = await bcrypt.compare(
      signinInput.password,
      user.password,
    );

    if (!isMatchedPassword) {
      throw new UnauthorizedException('password not matched');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async signup(signupInput: SignUpInput): Promise<LoginResponse> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      signupInput.password,
      saltOrRounds,
    );
    const user = await this.prisma.user.create({
      data: {
        username: signupInput.username,
        email: signupInput.email,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async createTokens(userId: number, email: string) {
    const accessToken = await this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '10s',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = await this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const saltOrRounds = 10;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async logout(userId: number): Promise<LogoutResponse> {
    await this.prisma.user.updateMany({
      where: { id: userId, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
    return { loggedOut: true };
  }

  async getNewTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Access denied');
    }

    const isRefreshTokenMatched = await bcrypt.compare(rt, user.refreshToken);

    if (!isRefreshTokenMatched) {
      throw new ForbiddenException('Refresh token not matched');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    return { accessToken, refreshToken, user };
  }
}
