import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { EmailTemplates } from './templates/template.enum';
import { emailSubjects, validateTemplateVariables } from './templates/template-config';

@Injectable()
export class MailService {
  private readonly mailerSend: MailerSend;
  private readonly senderEmail: string;
  private readonly senderName: string;

  constructor(private readonly configService: ConfigService) {
    this.mailerSend = new MailerSend({
      apiKey: this.configService.getOrThrow('MAIL_API_KEY'),
    });
    this.senderEmail = this.configService.getOrThrow('MAIL_FROM');
    this.senderName = this.configService.getOrThrow('MAIL_FROM_NAME');
  }

  async sendTemplateEmail(
    template: EmailTemplates,
    email: string,
    name: string,
    variables: Record<string, string>
  ): Promise<void> {
    validateTemplateVariables(template, variables); 
    await this.sendEmail(template, email, name, variables);
  }

  private async sendEmail(
    templateId: EmailTemplates,
    recipientEmail: string,
    recipientName: string,
    variables: Record<string, string>
  ): Promise<void> {
    const sentFrom = new Sender(this.senderEmail, this.senderName);
    const recipient = new Recipient(recipientEmail, recipientName);
    const subject = emailSubjects[templateId];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo([recipient])
      .setTemplateId(templateId)
      .setSubject(subject)
      .setPersonalization([{ email: recipientEmail, data: variables }]);

    await this.mailerSend.email.send(emailParams);
  }
}
