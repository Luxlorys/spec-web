'use client';

import { ReactNode } from 'react';

import { AppSidebar } from 'features/layout';
import { SidebarInset, SidebarProvider } from 'shared/ui';

interface Props {
  children: ReactNode;
}

export default function FeaturesLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
