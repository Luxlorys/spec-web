'use client';

import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from 'shared/ui/sidebar';
import { AppSidebar } from 'features/layout/ui/app-sidebar';

interface Props {
  children: ReactNode;
}

export default function SettingsLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
