import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mailer.dto';
import { tryCatch } from 'src/common/utils/catch-error_or_data.util';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(createMailDto: CreateMailDto) {
    try {
      const response = await this.mailerService.sendMail({
        from: createMailDto.from,
        to: createMailDto.to,
        subject: createMailDto.subject,
        html: createMailDto.body,
      });

      this.logger.log('Email Sent', '', JSON.stringify(response));
    } catch (error) {
      this.logger.error(
        'Email not sent',
        '',
        JSON.stringify({
          from: createMailDto.from,
          to: createMailDto.to,
          subject: createMailDto.subject,
          html: createMailDto.body,
        }),
      );
    }
  }
}
