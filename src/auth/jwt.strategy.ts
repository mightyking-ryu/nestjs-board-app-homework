import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private prisma: PrismaService
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const { username } = payload;
        const user: User = await this.prisma.user.findUnique({ where: { username } });

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}