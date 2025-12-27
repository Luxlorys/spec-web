import { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';

import { cn } from 'shared/lib';
import { TanStackQueryProvider, ToasterProvider } from 'shared/providers';

import 'app/styles/global.css';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SpecFlow | Feature Specification Tool',
  description:
    'Transform your feature requests into comprehensive specifications with AI-powered assistance.',
};

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background text-foreground antialiased',
          urbanist.className,
        )}
      >
        <TanStackQueryProvider>
          {children}
          <ToasterProvider />
        </TanStackQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
