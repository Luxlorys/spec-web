'use client';

import { useState } from 'react';
import { History, RotateCcw, Loader2, X } from 'lucide-react';

import { ISpecVersion } from 'shared/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, Button, Badge, Card } from 'shared/ui';
import { formatDate } from 'shared/lib';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: number;
  versions: ISpecVersion[];
  isLoading: boolean;
  onRollback: (targetVersion: number) => void;
  isRollingBack: boolean;
}

export function VersionHistorySidebar({
  isOpen,
  onClose,
  currentVersion,
  versions,
  isLoading,
  onRollback,
  isRollingBack,
}: IProps) {
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  const handleRollbackClick = (version: number) => {
    setSelectedVersion(version);
    setRollbackDialogOpen(true);
  };

  const handleConfirmRollback = () => {
    if (selectedVersion !== null) {
      onRollback(selectedVersion);
      setRollbackDialogOpen(false);
      setSelectedVersion(null);
    }
  };

  const handleCancelRollback = () => {
    setRollbackDialogOpen(false);
    setSelectedVersion(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Rollback Confirmation Card */}
          {rollbackDialogOpen && selectedVersion !== null && (
            <Card className="border-orange-300 bg-orange-50">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-orange-900">Confirm Rollback</h3>
                <button
                  onClick={handleCancelRollback}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-orange-800 mb-4">
                Are you sure you want to rollback to version {selectedVersion}? This will create a
                new version (v{currentVersion + 1}) with the content from version {selectedVersion}.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelRollback} disabled={isRollingBack}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleConfirmRollback} disabled={isRollingBack}>
                  {isRollingBack ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rolling back...
                    </>
                  ) : (
                    'Confirm Rollback'
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Version List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No version history available</p>
              <p className="text-sm mt-2">Version history is created when specs are regenerated</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map(version => (
                <div
                  key={version.id}
                  className={`border rounded-lg p-4 ${
                    version.version === currentVersion
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Version Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={version.version === currentVersion ? 'purple' : 'gray'}
                        className="font-semibold"
                      >
                        v{version.version}
                      </Badge>
                      {version.version === currentVersion && (
                        <Badge variant="blue" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    {version.version < currentVersion && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRollbackClick(version.version)}
                        disabled={isRollingBack || rollbackDialogOpen}
                        className="text-xs"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Rollback
                      </Button>
                    )}
                  </div>

                  {/* Change Description */}
                  <p className="text-sm text-gray-900 mb-2">{version.changeDescription}</p>

                  {/* Metadata */}
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Created: {formatDate(version.createdAt)}</p>
                    <p>By: {version.createdBy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
