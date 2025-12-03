'use client';
import { Button } from '@/app/components/UI';

export default function LessonHeader({ title, subject, className, onExportPDF, onDelete }: { title: string; subject: string; className: string; onExportPDF: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white shadow p-6 rounded-lg mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-gray-600">{subject} • {className}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="success" onClick={onExportPDF}>PDF</Button>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}
