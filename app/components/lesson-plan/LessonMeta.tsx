import { RebLessonPlan } from '@/app/Lib/types/type';

export default function LessonMeta({ data }: { data: RebLessonPlan }) {
  const items = [
    { label: 'Subject', value: data.subject },
    { label: 'Class', value: data.className },
    { label: 'Format', value: data.format },
    { label: 'Created', value: new Date(data.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {items.map((i) => (
        <div key={i.label} className="bg-gray-50 p-3 border rounded">
          <p className="text-sm text-gray-500">{i.label}</p>
          <p className="font-semibold text-gray-800">{i.value}</p>
        </div>
      ))}
    </div>
  );
}
