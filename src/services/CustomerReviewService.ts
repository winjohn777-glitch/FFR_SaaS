import apiClient from './ApiClient';

interface ReviewRequest {
  id: string;
  jobId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  jobName: string;
  completionDate: string;
  requestDate: string;
  status: 'pending' | 'sent' | 'completed' | 'declined';
  reviewUrl: string;
  method: 'email' | 'sms' | 'both';
  sentDate?: string;
  responseDate?: string;
  rating?: number;
  reviewText?: string;
}

interface ReviewStats {
  totalRequests: number;
  totalResponses: number;
  averageRating: number;
  responseRate: number;
  pendingRequests: number;
  recentReviews: ReviewRequest[];
}

class CustomerReviewService {
  private static instance: CustomerReviewService;
  private readonly googleReviewUrl = 'https://g.page/r/CeIjCCW9TYDwEAI/review';

  private constructor() {}

  static getInstance(): CustomerReviewService {
    if (!CustomerReviewService.instance) {
      CustomerReviewService.instance = new CustomerReviewService();
    }
    return CustomerReviewService.instance;
  }

  // Request review when job is completed
  async requestReview(jobId: string, job: any, customer: any): Promise<ReviewRequest> {
    const reviewRequest: ReviewRequest = {
      id: `REV-${Date.now()}`,
      jobId,
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      jobName: job.name,
      completionDate: new Date().toISOString().split('T')[0],
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      reviewUrl: this.googleReviewUrl,
      method: customer.email ? 'both' : 'sms'
    };

    // Save to database
    try {
      const result = await apiClient.post('/api/review-requests', reviewRequest);
      if (result.error) {
        console.error('Failed to save review request:', result.error);
        // Fall back to in-memory storage for now
        console.log('📝 Review request created (in-memory fallback):', reviewRequest);
      } else {
        console.log('📝 Review request created and saved to database:', reviewRequest);
      }
    } catch (error) {
      console.error('Database save failed, using fallback:', error);
      console.log('📝 Review request created (fallback):', reviewRequest);
    }

    // Auto-send if email/phone available
    if (customer.email || customer.phone) {
      await this.sendReviewRequest(reviewRequest.id);
    }

    return reviewRequest;
  }

  // Send review request via email/SMS
  async sendReviewRequest(requestId: string): Promise<boolean> {
    // TODO: Get request from database instead of localStorage
    let request: ReviewRequest | undefined;

    try {
      const result = await apiClient.get<ReviewRequest>(`/api/review-requests/${requestId}`);
      if (result.data) {
        request = result.data;
      } else {
        console.error('Failed to load review request from database:', result.error);
        // Fallback to localStorage temporarily
        const requests = this.getReviewRequests();
        request = requests.find(r => r.id === requestId);
      }
    } catch (error) {
      console.error('Database fetch failed, using localStorage fallback:', error);
      const requests = this.getReviewRequests();
      request = requests.find(r => r.id === requestId);
    }

    if (!request) {
      throw new Error('Review request not found');
    }

    try {
      // In production, this would integrate with email/SMS service
      console.log('📧 Sending review request to:', request.customerName);
      console.log('📧 Review URL:', request.reviewUrl);

      // Simulate sending (in real implementation, use SendGrid, Twilio, etc.)
      const emailContent = this.generateEmailContent(request);
      const smsContent = this.generateSMSContent(request);

      // Log the content for demo purposes
      console.log('📧 Email Content:', emailContent);
      console.log('📱 SMS Content:', smsContent);

      // Update request status
      request.status = 'sent';
      request.sentDate = new Date().toISOString();

      // Save updated status to database
      try {
        await apiClient.put(`/api/review-requests/${requestId}`, {
          status: request.status,
          sentDate: request.sentDate
        });
        console.log('Review request status updated in database');
      } catch (error) {
        console.error('Failed to update review request status in database:', error);
        // Fallback to localStorage for now
        const requests = this.getReviewRequests();
        const index = requests.findIndex(r => r.id === requestId);
        if (index >= 0) {
          requests[index] = request;
          this.saveReviewRequests(requests);
        }
      }

      // Show success message
      this.showReviewRequestNotification(request);

      return true;
    } catch (error) {
      console.error('Failed to send review request:', error);
      return false;
    }
  }

  // Generate personalized email content
  private generateEmailContent(request: ReviewRequest): string {
    return `
Subject: How was your roofing experience with Florida First Roofing?

Dear ${request.customerName},

Thank you for choosing Florida First Roofing for your recent project: ${request.jobName}.

We hope you're thrilled with the quality of our work and the professionalism of our team. Your feedback is incredibly valuable to us and helps other homeowners in Florida make informed decisions about their roofing needs.

Would you mind taking 2 minutes to share your experience by leaving us a Google review?

👉 Leave a Review: ${request.reviewUrl}

Your honest feedback helps us:
• Improve our services
• Help other Florida homeowners find quality roofing
• Recognize our hardworking team members

If you have any concerns or questions about your project, please don't hesitate to reach out to us directly at 321-301-4512.

Thank you for your business and for taking the time to share your experience!

Best regards,
The Florida First Roofing Team
📧 Contact: 321-301-4512
🏠 Licensed, Bonded & Insured | License #CCC1336561
`;
  }

  // Generate SMS content
  private generateSMSContent(request: ReviewRequest): string {
    return `Hi ${request.customerName.split(' ')[0]}! Thanks for choosing Florida First Roofing for ${request.jobName}. Would you mind leaving us a quick Google review? It helps other FL homeowners find quality roofing: ${request.reviewUrl} - FFR Team`;
  }

  // Show in-app notification
  private showReviewRequestNotification(request: ReviewRequest): void {
    // In production, this would show a toast notification
    console.log(`✅ Review request sent to ${request.customerName} via ${request.method}`);
  }

  // Get all review requests
  getReviewRequests(): ReviewRequest[] {
    try {
      // TODO: Replace with database fetch when API endpoint is available
      // For now, return empty array as this should be replaced with database calls
      console.log('⚠️  getReviewRequests: Using localStorage fallback - TODO: Implement database API');
      const requests = localStorage.getItem('customer-review-requests');
      return requests ? JSON.parse(requests) : [];
    } catch (error) {
      console.error('Error loading review requests:', error);
      return [];
    }
  }

  // Save review requests (deprecated - use API calls instead)
  private saveReviewRequests(requests: ReviewRequest[]): void {
    console.log('⚠️  saveReviewRequests: This method is deprecated. Use individual API calls instead.');
    localStorage.setItem('customer-review-requests', JSON.stringify(requests));
  }

  // Get review requests for specific job
  async getJobReviewRequests(jobId: string): Promise<ReviewRequest[]> {
    try {
      const result = await apiClient.get<ReviewRequest[]>(`/api/review-requests/job/${jobId}`);
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch job review requests:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for job review requests');
        return this.getReviewRequests().filter(r => r.jobId === jobId);
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for job review requests');
      return this.getReviewRequests().filter(r => r.jobId === jobId);
    }
  }

  // Get review requests for specific customer
  async getCustomerReviewRequests(customerId: string): Promise<ReviewRequest[]> {
    try {
      const result = await apiClient.get<ReviewRequest[]>(`/api/review-requests/customer/${customerId}`);
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch customer review requests:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for customer review requests');
        return this.getReviewRequests().filter(r => r.customerId === customerId);
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for customer review requests');
      return this.getReviewRequests().filter(r => r.customerId === customerId);
    }
  }

  // Update review request status
  async updateReviewRequest(requestId: string, updates: Partial<ReviewRequest>): Promise<void> {
    try {
      // Add responseDate if marking as completed
      if (updates.status === 'completed' && !updates.responseDate) {
        updates.responseDate = new Date().toISOString();
      }

      const result = await apiClient.put(`/api/review-requests/${requestId}`, updates);
      if (result.error) {
        console.error('Failed to update review request in database:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for updating review request');
        this.updateReviewRequestFallback(requestId, updates);
      } else {
        console.log('Review request updated in database successfully');
      }
    } catch (error) {
      console.error('Database update failed:', error);
      console.log('⚠️  Using localStorage fallback for updating review request');
      this.updateReviewRequestFallback(requestId, updates);
    }
  }

  // Fallback method for localStorage updates
  private updateReviewRequestFallback(requestId: string, updates: Partial<ReviewRequest>): void {
    const requests = this.getReviewRequests();
    const index = requests.findIndex(r => r.id === requestId);

    if (index >= 0) {
      requests[index] = { ...requests[index], ...updates };
      if (updates.status === 'completed' && !requests[index].responseDate) {
        requests[index].responseDate = new Date().toISOString();
      }
      this.saveReviewRequests(requests);
    }
  }

  // Get review statistics
  async getReviewStats(): Promise<ReviewStats> {
    try {
      const result = await apiClient.get<ReviewStats>('/api/review-requests/stats');
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch review stats from database:', result.error);
        // Fallback to localStorage calculation
        console.log('⚠️  Using localStorage fallback for review stats');
        return this.getReviewStatsFallback();
      }
    } catch (error) {
      console.error('Database stats fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for review stats');
      return this.getReviewStatsFallback();
    }
  }

  // Fallback method for localStorage stats calculation
  private getReviewStatsFallback(): ReviewStats {
    const requests = this.getReviewRequests();
    const responses = requests.filter(r => r.status === 'completed');
    const ratings = responses.filter(r => r.rating).map(r => r.rating!);

    return {
      totalRequests: requests.length,
      totalResponses: responses.length,
      averageRating: ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0,
      responseRate: requests.length > 0 ? (responses.length / requests.length) * 100 : 0,
      pendingRequests: requests.filter(r => r.status === 'pending' || r.status === 'sent').length,
      recentReviews: requests
        .filter(r => r.status === 'completed')
        .sort((a, b) => new Date(b.responseDate!).getTime() - new Date(a.responseDate!).getTime())
        .slice(0, 5)
    };
  }

  // Resend review request
  async resendReviewRequest(requestId: string): Promise<boolean> {
    try {
      // Reset status in database
      const result = await apiClient.put(`/api/review-requests/${requestId}`, {
        status: 'pending',
        sentDate: null
      });

      if (result.error) {
        console.error('Failed to reset review request status:', result.error);
        // Fallback to localStorage
        const requests = this.getReviewRequests();
        const request = requests.find(r => r.id === requestId);
        if (!request) return false;

        request.status = 'pending';
        request.sentDate = undefined;
        this.saveReviewRequests(requests);
      }

      return await this.sendReviewRequest(requestId);
    } catch (error) {
      console.error('Failed to resend review request:', error);
      return false;
    }
  }

  // Mark review as completed (called when we know customer left a review)
  async markReviewCompleted(requestId: string, rating?: number, reviewText?: string): Promise<void> {
    await this.updateReviewRequest(requestId, {
      status: 'completed',
      rating,
      reviewText,
      responseDate: new Date().toISOString()
    });
  }

  // Get pending review requests (for dashboard/notifications)
  async getPendingRequests(): Promise<ReviewRequest[]> {
    try {
      const result = await apiClient.get<ReviewRequest[]>('/api/review-requests/pending');
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch pending requests from database:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for pending requests');
        return this.getReviewRequests().filter(r => r.status === 'pending' || r.status === 'sent');
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for pending requests');
      return this.getReviewRequests().filter(r => r.status === 'pending' || r.status === 'sent');
    }
  }

  // Generate review request summary for job completion
  async generateJobCompletionSummary(jobId: string): Promise<string> {
    const requests = await this.getJobReviewRequests(jobId);

    if (requests.length === 0) {
      return 'No review requests for this job.';
    }

    const latest = requests[requests.length - 1];

    switch (latest.status) {
      case 'pending':
        return `Review request created for ${latest.customerName}. Ready to send.`;
      case 'sent':
        return `Review request sent to ${latest.customerName} on ${latest.sentDate?.split('T')[0]}. Waiting for response.`;
      case 'completed':
        return `Review completed! ${latest.customerName} left a ${latest.rating ? latest.rating + '-star' : ''} review.`;
      case 'declined':
        return `Customer ${latest.customerName} declined to leave a review.`;
      default:
        return 'Review request status unknown.';
    }
  }

  // Get overdue review requests (sent more than 7 days ago)
  async getOverdueRequests(): Promise<ReviewRequest[]> {
    try {
      const result = await apiClient.get<ReviewRequest[]>('/api/review-requests/overdue');
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch overdue requests from database:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for overdue requests');
        return this.getOverdueRequestsFallback();
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for overdue requests');
      return this.getOverdueRequestsFallback();
    }
  }

  // Fallback method for localStorage overdue calculation
  private getOverdueRequestsFallback(): ReviewRequest[] {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.getReviewRequests().filter(r =>
      r.status === 'sent' &&
      r.sentDate &&
      new Date(r.sentDate) < sevenDaysAgo
    );
  }

  // Generate review request email for manual sending
  async generateReviewRequestEmail(requestId: string): Promise<{ subject: string; body: string; to: string } | null> {
    let request: ReviewRequest | undefined;

    try {
      const result = await apiClient.get<ReviewRequest>(`/api/review-requests/${requestId}`);
      if (result.data) {
        request = result.data;
      } else {
        // Fallback to localStorage
        request = this.getReviewRequests().find(r => r.id === requestId);
      }
    } catch (error) {
      // Fallback to localStorage
      request = this.getReviewRequests().find(r => r.id === requestId);
    }

    if (!request || !request.customerEmail) {
      return null;
    }

    return {
      subject: `How was your roofing experience with Florida First Roofing?`,
      body: this.generateEmailContent(request),
      to: request.customerEmail
    };
  }

  // Export review data for reporting
  async exportReviewData(): Promise<string> {
    try {
      const result = await apiClient.get<ReviewRequest[]>('/api/review-requests');
      const requests = result.data || this.getReviewRequests(); // Fallback to localStorage

      const csvHeader = 'Date,Customer,Job,Status,Rating,Method,Review URL\n';
      const csvData = requests.map(r =>
        `${r.requestDate},"${r.customerName}","${r.jobName}",${r.status},${r.rating || ''},${r.method},${r.reviewUrl}`
      ).join('\n');

      return csvHeader + csvData;
    } catch (error) {
      console.error('Failed to export review data from database:', error);
      // Fallback to localStorage
      const requests = this.getReviewRequests();
      const csvHeader = 'Date,Customer,Job,Status,Rating,Method,Review URL\n';
      const csvData = requests.map(r =>
        `${r.requestDate},"${r.customerName}","${r.jobName}",${r.status},${r.rating || ''},${r.method},${r.reviewUrl}`
      ).join('\n');

      return csvHeader + csvData;
    }
  }
}

export default CustomerReviewService;
export type { ReviewRequest, ReviewStats };