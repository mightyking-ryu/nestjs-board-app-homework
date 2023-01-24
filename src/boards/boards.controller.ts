import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User, Board, BoardStatus } from '@prisma/client';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    private logger = new Logger('Boards');
    constructor(private boardsService: BoardsService) { }

    @Get()
    getAllBoard(
        @GetUser() user: User
    ): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardsService.getAllBoards(user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user:User
    ): Promise<Board> {
        this.logger.verbose(`User ${user.username} creating a new board. 
        Payload: ${JSON.stringify(createBoardDto)} `)
        return this.boardsService.createBoard(createBoardDto, user);
    }

    @Get('/:id')
    getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user:User
    ): Promise<void> {
        return this.boardsService.deleteBoard(id, user);
    }
    
    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }
}
