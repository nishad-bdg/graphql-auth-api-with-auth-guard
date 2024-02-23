import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginResponse } from './dto/login-response';
import { SignUpInput } from './dto/signup.input';
import { SigninInput } from './dto/signin.input';
import { LogoutResponse } from './dto/logout-response';
import { Public } from './decorators/public.decorator';
import { NewTokensResponse } from './dto/newTokensResponse';
import { CurrentUserId } from './decorators/currentUserId.decorator';
import { CurrentUser } from './decorators/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  signup(@Args('signupInput') signupInput: SignUpInput) {
    return this.authService.signup(signupInput);
  }
  @Public()
  @Mutation(() => LoginResponse)
  signin(@Args('signininput') singinInput: SigninInput) {
    return this.authService.signin(singinInput);
  }

  @Mutation(() => LogoutResponse)
  logout(@Args('id', { type: () => Int }) id: number) {
    return this.authService.logout(id);
  }

  @Query(() => String)
  hello() {
    return 'Hello world';
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensResponse)
  getNewTokens(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }
}
