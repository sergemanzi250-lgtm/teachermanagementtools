'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { getUserLessonPlans } from '@/app/Lib/firebase/firestore';
import { Card, CardHeader, Badge, Button } from './UI';
import { LoadingSpinner } from './Loading';
import { showErrorToast } from '@/app/Lib/utils/toast';

interface DashboardItemProps {
  id: string;
  title: string;
  format: string;
  createdAt: Date;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onExport?: (id: string) => void;
}

export function DashboardItem({ id, title, format, createdAt, onEdit, onDelete, onExport }: DashboardItemProps) {
  const formatBadgeVariant = format === 'REB' ? 'info' : format === 'RTB' ? 'success' : 'warning';
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card hover className="mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-lg">{title}</h4>
            <Badge label={format} variant={formatBadgeVariant} />
          </div>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => onEdit(id)}
            >
              Edit
            </Button>
          )}
          {onExport && (
            <Button
              variant="success"
              size="small"
              onClick={() => onExport(id)}
            >
              Export
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="small"
              onClick={() => onDelete(id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

interface DashboardListProps {
  collectionName: string;
  title: string;
  fetchFunction: (userId: string) => Promise<Record<string, unknown>[]>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onExport?: (id: string, data: Record<string, unknown>) => void;
}

export function DashboardList({
  title,
  fetchFunction,
  onEdit,
  onDelete,
  onExport,
}: DashboardListProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const data = await fetchFunction(user.id);
        setItems(data);
      } catch (error) {
        showErrorToast(error instanceof Error ? error.message : 'Failed to load items');
      } finally {
        setIsLoading(false);
      }
    }

    loadItems();
  }, [user?.id, fetchFunction]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {title.toLowerCase()} yet</p>
          <p className="text-gray-400 text-sm">Create your first one to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      <div>
        {items.map((item) => (
          <DashboardItem
            key={item.id as string}
            id={item.id as string}
            title={(item.title || item.subject || 'Untitled') as string}
            format={(item.format || 'Standard') as string}
            createdAt={item.createdAt ? new Date(item.createdAt as string) : new Date()}
            onEdit={onEdit}
            onDelete={() => onDelete && onDelete(item.id as string)}
            onExport={() => onExport && onExport(item.id as string, item)}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardList;
