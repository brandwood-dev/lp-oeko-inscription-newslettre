import { google } from 'googleapis';
import { EmailData } from './email.service';

export class GoogleSheetsService {
  private sheets;
  private auth;

  constructor() {
    const credentials = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || '{}'
    );

    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async addLead(data: EmailData): Promise<void> {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID is not configured');
    }

    const timestamp = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const houseTypeLabel = data.houseType === 'maison'
      ? 'Maison individuelle'
      : 'Immeuble';

    const values = [
      [
        timestamp,
        data.name,
        data.email,
        data.phone,
        data.city,
        houseTypeLabel,
        data.message || '',
      ],
    ];

    try {
      // Check if sheet exists, if not create it with headers
      await this.ensureSheetExists(spreadsheetId);

      // Append the data
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A:G',
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error('Google Sheets API error:', error);
      throw new Error('Failed to add lead to Google Sheets');
    }
  }

  private async ensureSheetExists(spreadsheetId: string): Promise<void> {
    try {
      // Try to get the first row to check if headers exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A1:G1',
      });

      // If no data, add headers
      if (!response.data.values || response.data.values.length === 0) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'A1:G1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [
              [
                'Date',
                'Nom complet',
                'Email',
                'Téléphone',
                'Ville/Code postal',
                'Type de bien',
                'Message',
              ],
            ],
          },
        });
      }
    } catch (error) {
      console.error('Error checking/creating sheet headers:', error);
      // Continue anyway, the append will work even without headers
    }
  }

  async verifyAccess(): Promise<boolean> {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      if (!spreadsheetId) {
        return false;
      }

      await this.sheets.spreadsheets.get({
        spreadsheetId,
      });

      return true;
    } catch (error) {
      console.error('Google Sheets access error:', error);
      return false;
    }
  }
}
