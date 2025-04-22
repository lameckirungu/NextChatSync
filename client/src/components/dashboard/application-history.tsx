import { formatDate } from '@/lib/utils';
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { getStatusColor, getStatusText } from '@/lib/utils';

interface HistoryItem {
  id: number;
  status: string;
  notes?: string;
  created_at: string;
}

interface ApplicationHistoryProps {
  history: HistoryItem[];
}

export function ApplicationHistory({ history }: ApplicationHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        No application history available
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-slate-800">Application History</h4>
      <div className="mt-3 border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-slate-200">
            {history.map((item) => {
              const statusColors = getStatusColor(item.status);
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                      {getStatusText(item.status)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {item.notes || 'No notes provided'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
