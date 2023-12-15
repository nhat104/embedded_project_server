import { forwardRef, Module } from '@nestjs/common';
import { RequestMemberModule } from 'src/request-member/request-member.module';
import { CronJobService } from './cron-job.service';

@Module({
  imports: [
    forwardRef(() => RequestMemberModule)
  ],
  providers: [CronJobService]
})
export class CronJobModule { }
