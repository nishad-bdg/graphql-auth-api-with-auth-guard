export type JwtPayload = {
  email: string;
  userId: number;
};

export type jwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
