import nodemailer from 'nodemailer';

export interface EmailData {
  name: string;
  email: string;
  phone: string;
  city: string;
  houseType: string;
  message: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.BREVO_SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD,
      },
    });
  }

  async sendLeadNotification(data: EmailData): Promise<void> {
    const emailTo = process.env.EMAIL_TO || 'contact@oeko.fr';

    console.log('📧 ===== EMAIL SERVICE =====');
    console.log('📧 Recipient(s):', emailTo);
    console.log('📧 From:', process.env.BREVO_SMTP_USER);
    console.log('📧 Lead Name:', data.name);
    console.log('📧 Lead Email:', data.email);
    console.log('📧 Lead Phone:', data.phone);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #352c5b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #352c5b; display: block; margin-bottom: 5px; }
          .value { color: #2a2a2a; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🏠 LP RAVALEMENT DE FAÇADE 2026</h1>
            <p style="margin: 10px 0 0 0;">Nouveau lead reçu</p>
          </div>

          <div class="content">
            <div class="field">
              <span class="label">👤 Nom complet</span>
              <div class="value">${data.name}</div>
            </div>

            <div class="field">
              <span class="label">📧 Email</span>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>

            <div class="field">
              <span class="label">📞 Téléphone</span>
              <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
            </div>

            <div class="field">
              <span class="label">📍 Ville / Code postal</span>
              <div class="value">${data.city}</div>
            </div>

            <div class="field">
              <span class="label">🏡 Type de bien</span>
              <div class="value">${data.houseType === 'maison' ? 'Maison individuelle' : 'Immeuble'}</div>
            </div>

            ${data.message ? `
            <div class="field">
              <span class="label">💬 Message</span>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>Email envoyé automatiquement depuis la Landing Page OEKO</p>
            <p>Date : ${new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
LP RAVALEMENT DE FAÇADE 2026
Nouveau lead reçu

Nom complet : ${data.name}
Email : ${data.email}
Téléphone : ${data.phone}
Ville / Code postal : ${data.city}
Type de bien : ${data.houseType === 'maison' ? 'Maison individuelle' : 'Immeuble'}
${data.message ? `\nMessage :\n${data.message}` : ''}

---
Date : ${new Date().toLocaleString('fr-FR')}
    `.trim();

    try {
      const info = await this.transporter.sendMail({
        from: '"OEKO LP Ravalement" <reseaux@oeko.fr>',
        to: emailTo,
        subject: 'LP RAVALEMENT DE FAÇADE 2026 - Nouveau lead',
        text: textContent,
        html: htmlContent,
      });

      console.log('✅ ===== EMAIL SENT SUCCESSFULLY =====');
      console.log('✅ Message ID:', info.messageId);
      console.log('✅ Response:', info.response);
      console.log('✅ Accepted:', info.accepted);
      console.log('✅ Rejected:', info.rejected);
      console.log('✅ Email sent to:', emailTo);
      console.log('✅ CHECK YOUR INBOX at ounifisamiritdsi@gmail.com');
      console.log('✅ Check spam folder if not in inbox!');
      console.log('✅ =====================================');
    } catch (error: any) {
      console.error('❌ ===== EMAIL SENDING FAILED =====');
      console.error('❌ Error:', error.message);
      console.error('❌ Details:', error);
      console.error('❌ ==================================');
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection error:', error);
      return false;
    }
  }
}
