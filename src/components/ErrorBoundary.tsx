import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border-radius: 12px;
  margin: 20px;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: #fc8181;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #c53030;
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #742a2a;
  margin-bottom: 24px;
  max-width: 500px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) => variant === 'primary' ? `
    background: #2E5AAC;
    color: white;
    border: none;

    &:hover {
      background: #1e3a8a;
    }
  ` : `
    background: white;
    color: #2E5AAC;
    border: 2px solid #2E5AAC;

    &:hover {
      background: #f0f4ff;
    }
  `}
`;

const ErrorDetails = styled.details`
  margin-top: 24px;
  text-align: left;
  max-width: 600px;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  color: #742a2a;
  font-size: 14px;

  &:hover {
    color: #c53030;
  }
`;

const ErrorStack = styled.pre`
  margin-top: 12px;
  padding: 16px;
  background: #fff;
  border: 1px solid #fc8181;
  border-radius: 8px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: #742a2a;
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <IconWrapper>
            <AlertTriangle />
          </IconWrapper>
          <Title>Something went wrong</Title>
          <Message>
            An unexpected error occurred. Please try refreshing the page or return to the dashboard.
          </Message>
          <ButtonGroup>
            <Button variant="primary" onClick={this.handleReload}>
              <RefreshCw size={18} />
              Refresh Page
            </Button>
            <Button variant="secondary" onClick={this.handleGoHome}>
              <Home size={18} />
              Go to Dashboard
            </Button>
          </ButtonGroup>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <ErrorSummary>View error details</ErrorSummary>
              <ErrorStack>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </ErrorStack>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
