import apiClient from './apiCLient';
import { Linking } from 'react-native';

export interface ReportOptions {
  format: 'pdf' | 'image';
  dateRange?: {
    start: Date;
    end: Date;
  };
  bookId?: string;
  template?: string;
  includeCharts?: boolean;
}

export interface GeneratedReport {
  id: string;
  fileUrl: string;
  downloadUrl: string;
  format: string;
  createdAt: Date | string;
}

class ReportService {
  // Generate beautiful report
  async generateReport(options: ReportOptions): Promise<GeneratedReport | null> {
    try {
      const response = await apiClient.post('/reports/generate', {
        ...options,
        dateRange: options.dateRange ? {
          start: options.dateRange.start.toISOString(),
          end: options.dateRange.end.toISOString(),
        } : undefined,
      });
      if (response.data.success) {
        const report = response.data.data;
        return {
          ...report,
          createdAt: new Date(report.createdAt),
        };
      }
      return null;
    } catch (error) {
      console.error('Error generating report:', error);
      return null;
    }
  }

  // Download report
  async downloadReport(reportId: string): Promise<void> {
    try {
      const baseUrl = apiClient.defaults.baseURL || '';
      const downloadUrl = `${baseUrl}/reports/${reportId}/download`;
      
      const supported = await Linking.canOpenURL(downloadUrl);
      if (supported) {
        await Linking.openURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  }

  // Share report
  async shareReport(reportId: string): Promise<string | null> {
    try {
      const response = await apiClient.post(`/reports/${reportId}/share`);
      if (response.data.success) {
        return response.data.data.shareUrl;
      }
      return null;
    } catch (error) {
      console.error('Error sharing report:', error);
      return null;
    }
  }
}

export const reportService = new ReportService();

