import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Board, BoardStatus } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardsService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getAllBoards(user: User): Promise<Board[]> {
        return this.prisma.board.findMany({ where: { user } });
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        const { title, description } = createBoardDto;

        return this.prisma.board.create({ 
            data: {
                title, 
                description,
                status: BoardStatus.PUBLIC,
                userId: user.id
            },
        });
    }

    async getBoardById(id: number): Promise<Board> {
        const found = await this.prisma.board.findUnique({ where: { id } });
        
        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        return found;
    }

    async deleteBoard(id: number, user: User): Promise<void> {
        const found = await this.getBoardById(id);

        if (found.userId !== user.id) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        await this.prisma.board.delete({ where: { id } });
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        return this.prisma.board.update({
            where: { id },
            data: { status }
        });
    }
}
