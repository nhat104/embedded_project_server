import { Body, Controller, Post, Get, Patch, Delete, Req } from '@nestjs/common';
import { Param, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger/dist/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ConfirmResponse } from 'src/common/classes/confirm-response.class';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateHomeDto } from './dto/create-home.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { HomeService } from './home.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/homes')
export class HomeController {
    constructor(
        private homeService: HomeService
    ) { }
    @Post()
    @ApiBody({ type: CreateHomeDto })
    @ApiTags('[HOME] Create new home')
    async createHome(@Req() req, @Body() data: CreateHomeDto): Promise<ConfirmResponse> {
        return await this.homeService.createHome(req.user.id, data);
    }

    @Get()
    @ApiTags('[HOME] Get my all homes')
    async getHomes(@Req() req): Promise<ConfirmResponse> {
        return await this.homeService.getHomes(req.user.id);
    }

    @Patch(':id/invite-member')
    @ApiBody({ type: AddMemberDto })
    @ApiTags('[HOME] Invite new member')
    async addMember(@Req() req, @Param('id') id: string, @Body() data: AddMemberDto): Promise<ConfirmResponse> {
        return await this.homeService.addMember(req.user.id, id, data);
    }

    @Patch(':id/remove-member')
    @ApiBody({ type: RemoveMemberDto })
    @ApiTags('[HOME] Remove member')
    async removeMember(@Req() req, @Param('id') id: string, @Body() data: RemoveMemberDto): Promise<ConfirmResponse> {
        return await this.homeService.removeMember(req.user.id, id, data);
    }

    @Get(':id')
    @ApiTags('[HOME] Get home information')
    async getHome(@Req() req, @Param('id') id: string): Promise<ConfirmResponse> {
        return await this.homeService.getHome(req.user.id, id);
    }

    @Delete(':id')
    @ApiTags('[HOME] Delete home')
    async deleteHome(@Req() req, @Param('id') id: string) {
        return await this.homeService.deleteHome(req.user.id, id);
    }
}
