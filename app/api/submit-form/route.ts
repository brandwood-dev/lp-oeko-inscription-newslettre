import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { EmailService } from '@/lib/services/email.service';
import { BrevoService } from '@/lib/services/brevo.service';
import { GoogleSheetsService } from '@/lib/services/sheets.service';

const formatError = (error: unknown) => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
};

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Téléphone invalide'),
  city: z.string().min(2, 'Ville invalide'),
  houseType: z.enum(['maison', 'immeuble'], {
    errorMap: () => ({ message: 'Type de bien invalide' }),
  }),
  message: z.string().optional(),
  rgpdConsent: z.boolean().refine((val) => val === true, {
    message: 'Le consentement RGPD est requis',
  }),
  // Honeypot field for spam detection
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();

    // Check honeypot (if filled, it's a bot)
    if (body.website) {
      console.warn('Spam detected via honeypot field');
      // Return success to avoid revealing the honeypot
      return NextResponse.json(
        { success: true, message: 'Formulaire soumis avec succès' },
        { status: 200 }
      );
    }

    // Validate form data
    const validatedData = formSchema.parse(body);

    // Initialize services
    const emailService = new EmailService();
    const brevoService = new BrevoService();
    const sheetsService = new GoogleSheetsService();

    const formData = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      city: validatedData.city,
      houseType: validatedData.houseType,
      message: validatedData.message || '',
    };

    // Execute all 3 actions in parallel for better performance
    const results = await Promise.allSettled([
      // Action 1: Send email notification
      emailService.sendLeadNotification(formData).catch((error) => {
        console.error('Email service error:', formatError(error));
        throw new Error('Email sending failed');
      }),

      // Action 2: Add to Brevo CRM
      brevoService.addOrUpdateContact(formData).catch((error) => {
        console.error('Brevo service error:', formatError(error));
        throw new Error('Brevo contact creation failed');
      }),

      // Action 3: Add to Google Sheets directly
      sheetsService.addLead(formData).catch((error) => {
        console.error('Google Sheets service error:', formatError(error));
        throw new Error('Google Sheets failed');
      }),
    ]);

    // Log results for debugging
    const errors: string[] = [];
    results.forEach((result, index) => {
      const serviceName = ['Email', 'Brevo', 'Google Sheets'][index];
      if (result.status === 'rejected') {
        const reason = formatError(result.reason);
        errors.push(`${serviceName}: ${reason}`);
        console.error(`❌ ${serviceName} failed: ${reason}`);
      } else {
        console.log(`✅ ${serviceName} success`);
      }
    });

    // If all services failed, return error
    if (errors.length === 3) {
      return NextResponse.json(
        {
          success: false,
          message: 'Erreur lors de l\'envoi du formulaire. Veuillez réessayer.',
          errors,
        },
        { status: 500 }
      );
    }

    // If at least one service succeeded, consider it a success
    // (partial failures are logged but don't block the user)
    return NextResponse.json(
      {
        success: true,
        message: 'Formulaire soumis avec succès',
        warnings: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Form submission error:', formatError(error));

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Données du formulaire invalides',
          errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer.',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const emailService = new EmailService();
  const brevoService = new BrevoService();
  const sheetsService = new GoogleSheetsService();

  const [emailOk, brevoOk, sheetsOk] = await Promise.all([
    emailService.verifyConnection(),
    brevoService.verifyApiKey(),
    sheetsService.verifyAccess(),
  ]);

  return NextResponse.json({
    status: 'ok',
    services: {
      email: emailOk ? 'connected' : 'disconnected',
      brevo: brevoOk ? 'connected' : 'disconnected',
      googleSheets: sheetsOk ? 'connected' : 'disconnected',
    },
    timestamp: new Date().toISOString(),
  });
}
