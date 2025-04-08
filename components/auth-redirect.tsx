'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authCheckPerformed = useRef(false);
  const router = useRouter();
  
  useEffect(() => {
    // Prevent multiple authentication checks
    if (authCheckPerformed.current) return;
    authCheckPerformed.current = true;
    
    // Direct check for token presence without using the hook
    const checkAuth = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('token') || 
                      document.cookie.split(';').some(c => c.trim().startsWith('token='));
        
        if (!token) {
          console.log('No token found, redirecting to login');
          setIsAuthenticated(false);
          setIsLoading(false);
          window.location.replace('/auth/login');
          return;
        }

        // Token exists, check with backend only once
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Fetch user data in background without blocking render
        fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${typeof token === 'string' ? token : localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        }).then(response => {
          if (!response.ok) {
            console.log('Invalid token detected, clearing and redirecting');
            localStorage.removeItem('token');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
            window.location.replace('/auth/login');
          }
        }).catch(err => {
          console.error('Error verifying token:', err);
        });
        
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
