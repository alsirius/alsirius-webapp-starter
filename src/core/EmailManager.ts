import nodemailer from 'nodemailer';
import { EmailConfig } from '../types/config';

export class EmailManager {
  private config: EmailConfig;
  private transporter: nodemailer.Transporter | null = null;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      if (this.config.provider === 'smtp') {
        this.transporter = nodemailer.createTransport({
          host: this.config.host,
          port: this.config.port || 587,
          secure: this.config.secure || false,
          auth: this.config.auth,
        });
      } else if (this.config.provider === 'sendgrid') {
        // TODO: Implement SendGrid provider
        throw new Error('SendGrid provider not yet implemented');
      } else if (this.config.provider === 'ses') {
        // TODO: Implement SES provider
        throw new Error('SES provider not yet implemented');
      }

      console.log('Email manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email manager:', error);
      throw error;
    }
  }

  async sendInvitationEmail(email: string, firstName: string, inviteCode: string, inviterName: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    const mailOptions = {
      from: `"${this.config.fromName || 'Alsirius'}" <${this.config.from}>`,
      to: email,
      subject: `You're invited to join Alsirius!`,
      html: this.generateInvitationTemplate(firstName, inviteCode, inviterName),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invitation email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    const mailOptions = {
      from: `"${this.config.fromName || 'Alsirius'}" <${this.config.from}>`,
      to: email,
      subject: 'Verify your email address',
      html: this.generateVerificationTemplate(verificationCode),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    const mailOptions = {
      from: `"${this.config.fromName || 'Alsirius'}" <${this.config.from}>`,
      to: email,
      subject: 'Reset your password',
      html: this.generatePasswordResetTemplate(resetToken),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  private generateInvitationTemplate(firstName: string, inviteCode: string, inviterName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>You're invited to join Alsirius!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .code { background: #e5e7eb; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 You're Invited!</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>${inviterName} has invited you to join Alsirius! We're excited to have you on board.</p>
            <p>To get started, use the invitation code below:</p>
            <div class="code">${inviteCode}</div>
            <p>This code will expire in 7 days, so be sure to use it soon.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Welcome aboard!</p>
            <p>The Alsirius Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Alsirius. All rights reserved.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateVerificationTemplate(verificationCode: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .code { background: #e5e7eb; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>Please use the verification code below to verify your email address:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in 24 hours.</p>
            <p>If you didn't request this verification, you can safely ignore this email.</p>
            <p>Thanks!</p>
            <p>The Alsirius Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Alsirius. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePasswordResetTemplate(resetToken: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset your password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .code { background: #e5e7eb; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>We received a request to reset your password. Use the code below to reset it:</p>
            <div class="code">${resetToken}</div>
            <p>This code will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p>Stay secure!</p>
            <p>The Alsirius Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Alsirius. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
