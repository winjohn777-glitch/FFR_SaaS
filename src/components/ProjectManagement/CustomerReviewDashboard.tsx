import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Star,
  Send,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  BarChart3
} from 'lucide-react';
import CustomerReviewService, { ReviewRequest, ReviewStats } from '../../services/CustomerReviewService';

const Container = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  max-width: 100%;
  overflow-x: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 100%;
  overflow-x: auto;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ReviewItem = styled.div<{ status: 'pending' | 'sent' | 'completed' | 'declined' }>`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s;
  border-left: 4px solid ${({ status, theme }) => {
    switch (status) {
      case 'completed': return theme.colors.secondary;
      case 'sent': return theme.colors.primary;
      case 'declined': return theme.colors.accent;
      default: return theme.colors.text.secondary;
    }
  }};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ReviewInfo = styled.div`
  flex: 1;
`;

const CustomerName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const JobName = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ReviewDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusBadge = styled.div<{ status: 'pending' | 'sent' | 'completed' | 'declined' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;

  ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return `
          background-color: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
        `;
      case 'sent':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'declined':
        return `
          background-color: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
        `;
      default:
        return `
          background-color: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  max-width: 100%;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ variant = 'secondary', theme }) => {
    if (variant === 'primary') {
      return `
        background-color: ${theme.colors.primary};
        color: white;
        &:hover { background-color: ${theme.colors.primary}dd; }
      `;
    }
    return `
      background-color: transparent;
      color: ${theme.colors.text.secondary};
      border: 1px solid ${theme.colors.border};
      &:hover { background-color: ${theme.colors.background}; }
    `;
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CustomerReviewDashboard: React.FC = () => {
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const reviewService = CustomerReviewService.getInstance();

  useEffect(() => {
    loadReviewData();
  }, []);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      const requests = await reviewService.getReviewRequests();
      const stats = await reviewService.getReviewStats();

      setReviewRequests(requests);
      setReviewStats(stats);
    } catch (error) {
      console.error('Error loading review data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendReview = async (requestId: string) => {
    try {
      await reviewService.resendReviewRequest(requestId);
      loadReviewData();
      alert('Review request resent successfully!');
    } catch (error) {
      console.error('Error resending review:', error);
      alert('Error resending review request. Please try again.');
    }
  };

  const handleOpenReviewUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={12} />;
      case 'sent': return <Send size={12} />;
      case 'declined': return <AlertCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  if (loading) {
    return (
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Title>
          <Star size={24} />
          Customer Review Dashboard
        </Title>
        <div>Loading review data...</div>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Header>
        <Title>
          <Star size={24} />
          Customer Review Dashboard
        </Title>
        <ActionButton variant="primary" onClick={() => handleOpenReviewUrl('https://g.page/r/CeIjCCW9TYDwEAI/review')}>
          <ExternalLink size={16} />
          View Our Reviews
        </ActionButton>
      </Header>

      {reviewStats && (
        <StatsGrid>
          <StatCard>
            <StatTitle>Total Requests</StatTitle>
            <StatValue>
              <Send size={20} />
              {reviewStats.totalRequests}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Response Rate</StatTitle>
            <StatValue>
              <TrendingUp size={20} />
              {reviewStats.responseRate.toFixed(1)}%
            </StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Average Rating</StatTitle>
            <StatValue>
              <Star size={20} />
              {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : 'N/A'}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Pending Requests</StatTitle>
            <StatValue>
              <Clock size={20} />
              {reviewStats.pendingRequests}
            </StatValue>
          </StatCard>
        </StatsGrid>
      )}

      <ReviewList>
        {reviewRequests.length === 0 ? (
          <EmptyState>
            <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <div>No review requests yet.</div>
            <div>Review requests will appear here when jobs are completed.</div>
          </EmptyState>
        ) : (
          reviewRequests
            .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
            .map((request) => (
              <ReviewItem key={request.id} status={request.status}>
                <ReviewHeader>
                  <ReviewInfo>
                    <CustomerName>{request.customerName}</CustomerName>
                    <JobName>{request.jobName}</JobName>
                    <ReviewDetails>
                      <Calendar size={12} />
                      Completed: {formatDate(request.completionDate)}
                      {request.sentDate && (
                        <>
                          <Send size={12} />
                          Sent: {formatDate(request.sentDate)}
                        </>
                      )}
                      {request.rating && (
                        <>
                          <Star size={12} />
                          {request.rating} stars
                        </>
                      )}
                    </ReviewDetails>
                  </ReviewInfo>
                  <StatusBadge status={request.status}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </StatusBadge>
                </ReviewHeader>

                <ActionButtons>
                  {request.status === 'pending' || request.status === 'sent' ? (
                    <ActionButton onClick={() => handleResendReview(request.id)}>
                      <Send size={12} />
                      Resend Request
                    </ActionButton>
                  ) : null}

                  <ActionButton onClick={() => handleOpenReviewUrl(request.reviewUrl)}>
                    <ExternalLink size={12} />
                    View Review Page
                  </ActionButton>

                  {request.customerEmail && (
                    <ActionButton>
                      <Mail size={12} />
                      Email: {request.customerEmail}
                    </ActionButton>
                  )}

                  {request.customerPhone && (
                    <ActionButton>
                      <Phone size={12} />
                      Phone: {request.customerPhone}
                    </ActionButton>
                  )}
                </ActionButtons>

                {request.reviewText && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontStyle: 'italic'
                  }}>
                    "{request.reviewText}"
                  </div>
                )}
              </ReviewItem>
            ))
        )}
      </ReviewList>
    </Container>
  );
};

export default CustomerReviewDashboard;