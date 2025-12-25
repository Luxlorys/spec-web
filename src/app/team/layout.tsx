'use client';

import { ReactNode } from 'react';

import { AppSidebar } from 'features/layout/ui/app-sidebar';
import { SidebarInset, SidebarProvider } from 'shared/ui/sidebar';

interface Props {
  children: ReactNode;
}

export default function TeamLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
