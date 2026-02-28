import * as brevo from '@getbrevo/brevo';

interface ContactData {
  // OBLIGATOIRES
  nom: string;
  prenom: string;
  email: string;
  accepteCGU: boolean;
  accepteMarketing: boolean;

  // OPTIONNELS
  adresse?: string;
  codePostal?: string;
  ville?: string;
  telephonePortable?: string;
  telephoneDomicile?: string;
}

export class BrevoContactService {
  private apiInstance: brevo.ContactsApi;
  private apiKey: string;
  private listId: number;
  private marketingListId: number | null;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
    this.listId = parseInt(process.env.BREVO_LIST_ID || '0', 10);
    this.marketingListId = process.env.BREVO_MARKETING_LIST_ID
      ? parseInt(process.env.BREVO_MARKETING_LIST_ID, 10)
      : null;

    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY is not configured');
    }

    if (!this.listId) {
      throw new Error('BREVO_LIST_ID is not configured');
    }

    // Configure Brevo API
    this.apiInstance = new brevo.ContactsApi();
    this.apiInstance.setApiKey(0, this.apiKey);
  }

  /**
   * Add or update a contact in Brevo
   */
  async addOrUpdateContact(data: ContactData, sourceUrl: string = 'http://localhost:3000'): Promise<void> {
    try {
      // Prepare contact attributes
      const attributes: Record<string, any> = {
        NOM: data.nom,
        PRENOM: data.prenom,
        ADRESSE: data.adresse || '',
        CODE_POSTAL: data.codePostal || '',
        VILLE: data.ville || '',
        TEL_PORTABLE: data.telephonePortable || '',
        TEL_DOMICILE: data.telephoneDomicile || '',
        ACCEPTE_CGU: data.accepteCGU,
        ACCEPTE_MARKETING: data.accepteMarketing,
        DATE_INSCRIPTION: new Date().toISOString().split('T')[0],
        SOURCE: sourceUrl,
      };

      // Prepare list IDs
      const listIds: number[] = [this.listId];

      // Add to marketing list if consent given
      if (data.accepteMarketing && this.marketingListId) {
        listIds.push(this.marketingListId);
      }

      // Create contact request
      const createContact = new brevo.CreateContact();
      createContact.email = data.email;
      createContact.attributes = attributes;
      createContact.listIds = listIds;
      createContact.updateEnabled = true; // Update if already exists
      createContact.emailBlacklisted = false;
      createContact.smsBlacklisted = false;

      // Create or update contact
      await this.apiInstance.createContact(createContact);

      console.log(`✅ Brevo: Contact ${data.email} added/updated successfully`);
    } catch (error: any) {
      // If contact already exists (code 400), try to update
      if (error.status === 400 && error.response?.body?.code === 'duplicate_parameter') {
        console.log(`⚠️  Contact ${data.email} already exists, updating...`);
        await this.updateExistingContact(data, sourceUrl);
      } else {
        console.error('❌ Brevo error:', error);
        throw new Error(`Failed to add contact to Brevo: ${error.message}`);
      }
    }
  }

  /**
   * Update an existing contact
   */
  private async updateExistingContact(data: ContactData, sourceUrl: string = 'http://localhost:3000'): Promise<void> {
    try {
      const attributes: Record<string, any> = {
        NOM: data.nom,
        PRENOM: data.prenom,
        ADRESSE: data.adresse || '',
        CODE_POSTAL: data.codePostal || '',
        VILLE: data.ville || '',
        TEL_PORTABLE: data.telephonePortable || '',
        TEL_DOMICILE: data.telephoneDomicile || '',
        ACCEPTE_CGU: data.accepteCGU,
        ACCEPTE_MARKETING: data.accepteMarketing,
        DATE_MAJ: new Date().toISOString().split('T')[0],
        SOURCE: sourceUrl,
      };

      const listIds: number[] = [this.listId];
      if (data.accepteMarketing && this.marketingListId) {
        listIds.push(this.marketingListId);
      }

      const updateContact = new brevo.UpdateContact();
      updateContact.attributes = attributes;
      updateContact.listIds = listIds;
      updateContact.emailBlacklisted = false;
      updateContact.smsBlacklisted = false;

      await this.apiInstance.updateContact(data.email, updateContact);

      console.log(`✅ Brevo: Contact ${data.email} updated successfully`);
    } catch (error: any) {
      console.error('❌ Brevo update error:', error);
      throw new Error(`Failed to update contact in Brevo: ${error.message}`);
    }
  }

  /**
   * Verify API connection
   */
  async verifyApiKey(): Promise<boolean> {
    try {
      const apiAccountInstance = new brevo.AccountApi();
      await apiAccountInstance.getAccount();
      console.log('✅ Brevo API key is valid');
      return true;
    } catch (error) {
      console.error('❌ Brevo API key is invalid:', error);
      return false;
    }
  }

  /**
   * Get contact by email
   */
  async getContactByEmail(email: string): Promise<any> {
    try {
      const contact = await this.apiInstance.getContactInfo(email);
      return contact;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
