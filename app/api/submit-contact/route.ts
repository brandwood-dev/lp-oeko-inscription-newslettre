import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BrevoContactService } from '@/lib/services/brevo-contact.service';

// Validation schema
const contactFormSchema = z.object({
  // OBLIGATOIRES (au moins 1 caractère)
  nom: z.string().min(1, 'Le nom est obligatoire'),
  prenom: z.string().min(1, 'Le prénom est obligatoire'),
  email: z.string().email('Email invalide'),
  accepteCGU: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les CGU',
  }),

  // OPTIONNELS
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  telephonePortable: z.string().optional(),
  telephoneDomicile: z.string().optional(),
  accepteMarketing: z.boolean(),

  // Honeypot field for spam detection
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'URL d'origine pour la SOURCE
    const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:3000';
    const sourceUrl = origin.replace(/\/$/, ''); // Enlever le / final si présent

    // Parse request body
    const body = await request.json();

    // Check honeypot (if filled, it's a bot)
    if (body.website) {
      console.warn('⚠️  Spam detected via honeypot field');
      // Return success to avoid revealing the honeypot
      return NextResponse.json(
        { success: true, message: 'Formulaire soumis avec succès' },
        { status: 200 }
      );
    }

    // Validate form data
    const validatedData = contactFormSchema.parse(body);

    // Initialize Brevo service
    const brevoService = new BrevoContactService();

    // Add contact to Brevo avec l'URL source
    await brevoService.addOrUpdateContact(validatedData, sourceUrl);

    console.log(`✅ Contact ${validatedData.email} processed successfully`);

    return NextResponse.json(
      {
        success: true,
        message: 'Formulaire soumis avec succès',
        contact: {
          email: validatedData.email,
          addedToMarketing: validatedData.accepteMarketing,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Form submission error:', error);

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
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const brevoService = new BrevoContactService();
    const isValid = await brevoService.verifyApiKey();

    return NextResponse.json({
      status: 'ok',
      brevo: isValid ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      brevo: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
