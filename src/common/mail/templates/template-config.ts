import { BadRequestException } from '@nestjs/common';
import { EmailTemplates } from "./template.enum";

export interface TemplateConfig {
  required: string[];
  optional?: string[];
}

export const templateVariables: Record<EmailTemplates, TemplateConfig> = {
  [EmailTemplates.PASSWORD_RESET]: { required: ['reset_url', 'user'] }
};

export const emailSubjects: Record<EmailTemplates, string> = {
    [EmailTemplates.PASSWORD_RESET]: "Reset Your Password",
  };

export function validateTemplateVariables(template: EmailTemplates, variables: Record<string, string>) {
  const { required } = templateVariables[template];
  const missingVars = required.filter((key) => !(key in variables));

  if (missingVars.length > 0) {
    throw new BadRequestException(`Missing required variables: ${missingVars.join(', ')}`);
  }
}
