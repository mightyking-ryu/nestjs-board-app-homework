import { Injectable } from '@nestjs/common';
import { BoardStatus } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardsService {
    constructor(private prismaService: PrismaService){}

    async getAllBoards(): Promise<Board[]> {
        return await this.prismaService.board.findMany();
    }

    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        const {title, description} = createBoardDto;

        const board = await this.prismaService.board.create({
            data:{
                title,
                description,
                status: BoardStatus.PUBLIC
            },
        });
        return board;
    }

    async getBoardById(id: number): Promise <Board> {
        return await this.prismaService.board.findUnique({
            where: { id }
        });
    }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.prismaService.board.delete({
            where: { id }
        });
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        return await this.prismaService.board.update({
            where: { id },
            data: { status }
        });
    }
}
