'use client';

import { AuthRedirect } from '@/components/auth-redirect';

export function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthRedirect>
      {children}
    </AuthRedirect>
  );
}
