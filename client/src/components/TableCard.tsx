import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertCircle } from 'lucide-react';
import type { Table, TableStatus } from '@/lib/types';

const statusStyles: Record<TableStatus, string> = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  occupied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  needsAttention: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

interface TableCardProps {
  table: Table;
  onClick?: () => void;
}

export function TableCard({ table, onClick }: TableCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      className={`cursor-pointer transition-transform hover:scale-[1.02] ${
        table.status === 'needsAttention' ? 'ring-2 ring-red-500' : ''
      }`}
      onClick={onClick}
      data-testid={`card-table-${table.number}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{table.number}</span>
            {table.status === 'needsAttention' && (
              <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
            )}
          </div>
          <Badge className={statusStyles[table.status]}>
            {t(table.status)}
          </Badge>
        </div>

        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{table.capacity}</span>
        </div>
      </CardContent>
    </Card>
  );
}
