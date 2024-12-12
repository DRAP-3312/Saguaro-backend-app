import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth } from '../entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate({ id }: JwtPayload): Promise<Auth> {
    const user = await this.authRepo.findOneBy({ id });

    if (!user) throw new UnauthorizedException('Token invalid');
    if (!user.isActive)
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    return user;
  }
}
