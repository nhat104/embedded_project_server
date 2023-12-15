import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetRequestsDto } from './dto/get-requests.dto';
import { ReplyRequestDto } from './dto/reply-request.dto';
import { RequestMemberService } from './request-member.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/request-member')
export class RequestMemberController {
    constructor(
        private requestMemberService: RequestMemberService
    ) { }
    @Get()
    @ApiTags('[REQUEST-MEMBER] Get all my requests')
    async getRequests(@Req() req, @Query() query: GetRequestsDto) {
        return await this.requestMemberService.getRequests(req.user.id, query);
    }

    @Patch(':id')
    @ApiBody({ type: ReplyRequestDto })
    @ApiTags('[REQUEST-MEMBER] Reply request member')
    async replyRequest(@Req() req, @Param('id') id: string, @Body() data: ReplyRequestDto) {
        return await this.requestMemberService.replyRequest(req.user.id, id, data);
    }
}
