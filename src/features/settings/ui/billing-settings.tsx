'use client';

import { Button, Card } from 'shared/ui';

export const BillingSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Billing & Plans</h2>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Card className="border border-primary" padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Pro Plan</h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Current
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              $29/month • Renews on Jan 15, 2025
            </p>
          </div>
          <Button variant="outline" size="sm">
            Change Plan
          </Button>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Payment Method</h3>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded bg-muted">
                <span className="text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Update
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Billing History</h3>
          <div className="space-y-2">
            {[
              { date: 'Dec 15, 2024', amount: '$29.00', status: 'Paid' },
              { date: 'Nov 15, 2024', amount: '$29.00', status: 'Paid' },
              { date: 'Oct 15, 2024', amount: '$29.00', status: 'Paid' },
            ].map(invoice => (
              <div
                key={invoice.date}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{invoice.date}</p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.amount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {invoice.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
