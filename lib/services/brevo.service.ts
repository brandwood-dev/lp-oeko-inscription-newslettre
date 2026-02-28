import { ContactsApi, AccountApi, CreateContact } from '@getbrevo/brevo';
import { EmailData } from './email.service';

export class BrevoService {
  private apiInstance: ContactsApi;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';

    // Configure API key for all requests
    this.apiInstance = new ContactsApi();
    this.apiInstance.setApiKey(0, this.apiKey);
  }

  async addOrUpdateContact(data: EmailData, sourceUrl?: string): Promise<void> {
    const listId = Number(process.env.BREVO_LIST_ID);

    if (!listId) {
      throw new Error('BREVO_LIST_ID is not configured');
    }

    // Format phone number for Brevo (remove spaces, add +33 for French numbers)
    const formatPhoneForBrevo = (phone: string): string => {
      // Remove all spaces, dots, and hyphens
      let cleaned = phone.replace(/[\s.\-()]/g, '');

      // If starts with 0, replace with +33
      if (cleaned.startsWith('0')) {
        cleaned = '+33' + cleaned.substring(1);
      }
      // If doesn't start with +, add +33
      else if (!cleaned.startsWith('+')) {
        cleaned = '+33' + cleaned;
      }

      return cleaned;
    };

    // Use provided sourceUrl or default to the original value
    const source = sourceUrl || 'LP RAVALEMENT DE FAÇADE 2026';

    // First attempt: Try with all custom attributes
    const createContactWithCustom = new CreateContact();
    createContactWithCustom.email = data.email;
    createContactWithCustom.attributes = {
      FIRSTNAME: data.name.split(' ')[0] || '',
      LASTNAME: data.name.split(' ').slice(1).join(' ') || '',
      SMS: formatPhoneForBrevo(data.phone),
      // Custom attributes - these must exist in Brevo account
      VILLE: data.city,
      TYPE_BIEN: data.houseType === 'maison' ? 'Maison individuelle' : 'Immeuble',
      MESSAGE: data.message || '',
      SOURCE: source,
    };
    createContactWithCustom.listIds = [listId];
    createContactWithCustom.updateEnabled = true;

    try {
      await this.apiInstance.createContact(createContactWithCustom);
      console.log('✅ Brevo contact created/updated successfully with all attributes');
      console.log(`   Email: ${data.email}, Name: ${data.name}`);
      return;
    } catch (error: any) {
      // If contact already exists, that's OK
      if (error.response?.body?.code === 'duplicate_parameter') {
        console.log('✅ Contact already exists in Brevo, updated successfully');
        console.log(`   Email: ${data.email}`);
        return;
      }

      // Log detailed error information for debugging
      console.error('❌ Brevo API error with custom attributes:', {
        email: data.email,
        message: error.message,
        code: error.response?.body?.code || error.code,
        body: error.response?.body,
        statusCode: error.statusCode || error.status,
      });

      // Check if it's a missing attribute error - try again with standard attributes only
      const errorMessage = error.response?.body?.message || error.message || '';
      const statusCode = error.statusCode || error.status || 0;
      const is400Error = errorMessage.includes('400') || statusCode === 400;

      if (errorMessage.toLowerCase().includes('attribute') ||
          errorMessage.toLowerCase().includes('invalid') ||
          is400Error) {

        console.log('⚠️  Custom attributes not available, retrying with standard attributes only...');

        // Second attempt: Use only standard Brevo attributes
        const createContactStandard = new CreateContact();
        createContactStandard.email = data.email;
        createContactStandard.attributes = {
          FIRSTNAME: data.name.split(' ')[0] || '',
          LASTNAME: data.name.split(' ').slice(1).join(' ') || '',
          SMS: formatPhoneForBrevo(data.phone),
        };
        createContactStandard.listIds = [listId];
        createContactStandard.updateEnabled = true;

        try {
          await this.apiInstance.createContact(createContactStandard);
          console.log('✅ Brevo contact created/updated with standard attributes (custom attributes skipped)');
          console.log(`   Email: ${data.email}, Name: ${data.name}`);
          console.log('ℹ️  To use custom attributes, create them at: https://app.brevo.com/settings/contact-attributes');
          console.log('ℹ️  Required attributes: VILLE, TYPE_BIEN, MESSAGE, SOURCE (all type: Text)');
          return;
        } catch (retryError: any) {
          if (retryError.response?.body?.code === 'duplicate_parameter') {
            console.log('✅ Contact already exists in Brevo, updated with standard attributes');
            console.log(`   Email: ${data.email}`);
            return;
          }
          console.error('❌ Brevo API error even with standard attributes:', {
            email: data.email,
            error: retryError.message,
            code: retryError.response?.body?.code,
            body: retryError.response?.body,
          });
          throw new Error(`Failed to create contact even with standard attributes: ${retryError.message}`);
        }
      }

      // For other errors, throw
      throw new Error(`Failed to add/update contact in Brevo: ${error.message}`);
    }
  }

  async verifyApiKey(): Promise<boolean> {
    try {
      const accountApi = new AccountApi();
      accountApi.setApiKey(0, this.apiKey);
      await accountApi.getAccount();
      return true;
    } catch (error) {
      console.error('Brevo API key verification error:', error);
      return false;
    }
  }

  async verifyListExists(): Promise<boolean> {
    try {
      const listId = Number(process.env.BREVO_LIST_ID);
      if (!listId) {
        return false;
      }

      const listsApi = new ContactsApi();
      listsApi.setApiKey(0, this.apiKey);
      await listsApi.getList(listId);
      return true;
    } catch (error) {
      console.error('Brevo list verification error:', error);
      return false;
    }
  }
}
