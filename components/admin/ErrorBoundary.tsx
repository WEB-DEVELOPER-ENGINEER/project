'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, Button, Box, Typography } from '@mui/material'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="400px"
          p={4}
        >
          <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            {process.env.NODE_ENV === 'development' && (
              <details>
                <summary>Error Details (Development Only)</summary>
                <pre style={{ fontSize: '12px', overflow: 'auto', marginTop: '8px' }}>
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </Alert>
          <Button variant="contained" onClick={this.handleRetry}>
            Retry
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default AdminErrorBoundary
