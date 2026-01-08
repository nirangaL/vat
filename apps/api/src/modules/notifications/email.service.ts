import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const emailConfig = this.configService.get('email');

    if (!emailConfig?.smtp?.auth?.user || !emailConfig?.smtp?.auth?.pass) {
      this.logger.warn('Email credentials not configured. Email notifications will not work.');
      return;
    }

    this.transporter = nodemailer.createTransporter(emailConfig.smtp);
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    if (!this.transporter) {
      this.logger.warn('Email transporter not initialized. Skipping email send.');
      return;
    }

    const emailConfig = this.configService.get('email');

    try {
      const info = await this.transporter.sendMail({
        from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string) {
    const subject = 'Welcome to VAT Management System';
    const html = `
      <h1>Welcome ${firstName}!</h1>
      <p>Thank you for registering with VAT Management System.</p>
      <p>You can now start managing your VAT compliance efficiently.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <br/>
      <p>Best regards,</p>
      <p>VAT Management Team</p>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendOTPEmail(to: string, otp: string, firstName: string) {
    const subject = 'Your OTP for VAT Management System';
    const html = `
      <h1>Hello ${firstName}</h1>
      <p>Your One-Time Password (OTP) for login is:</p>
      <h2 style="color: #4A90E2; font-size: 32px; letter-spacing: 5px;">${otp}</h2>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
      <br/>
      <p>Best regards,</p>
      <p>VAT Management Team</p>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, resetToken: string, firstName: string) {
    const subject = 'Password Reset Request';
    const resetUrl = `${this.configService.get('APP_URL')}/reset-password?token=${resetToken}`;
    const html = `
      <h1>Hello ${firstName}</h1>
      <p>We received a request to reset your password.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br/>
      <p>Best regards,</p>
      <p>VAT Management Team</p>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendNotificationEmail(to: string, title: string, message: string) {
    const subject = title;
    const html = `
      <h1>${title}</h1>
      <p>${message}</p>
      <br/>
      <p>Best regards,</p>
      <p>VAT Management Team</p>
    `;

    return this.sendEmail(to, subject, html);
  }
}
