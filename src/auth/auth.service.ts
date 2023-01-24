import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
    
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        try {
            await this.prisma.user.create({
                data: {
                    username, 
                    password: hashedPassword
                }
            });
        } catch (error) {
            if(error.code === 'P2002') {
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const { username, password } = authCredentialsDto;
        const user = await this.prisma.user.findUnique({ where: { username } });

        if(user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 ( Secret + Payload )
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        }  else {
            throw new UnauthorizedException('login failed')
        }
    }

}
