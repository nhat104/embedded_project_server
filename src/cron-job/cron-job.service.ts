import { forwardRef, Injectable, Inject, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StatusRequest } from 'src/request-member/enum/status-request.enum';
import { RequestMemberService } from 'src/request-member/request-member.service';

@Injectable()
export class CronJobService {
    private readonly logger = new Logger(CronJobService.name);
    constructor(
        @Inject(forwardRef(() => RequestMemberService))
        private requestMemberService: RequestMemberService,
    ) { }

    @Cron('*/30 * * * *')
    async checkExpiredRequest() {
        const expiredRequests = await this.requestMemberService.getExpiredRequest();
        for (const request of expiredRequests) {
            request.status = StatusRequest.EXPIRED;
            await request.save()
        }
    }
}
