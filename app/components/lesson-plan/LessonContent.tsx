import { stripHTML } from "@/app/Lib/utils/sanitize";

interface LessonContentProps {
  parsed: Record<string, unknown>;
}

export default function LessonContent({ parsed }: LessonContentProps) {
  const renderValue = (v: unknown): React.ReactNode => {
    if (Array.isArray(v)) return v.join(', ');
    const str = String(v);
    if (/<[^>]*>/.test(str)) {
      return (
        <div
          className="prose max-w-none [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: str }}
        />
      );
    }
    return stripHTML(str);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-6 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-5">Content</h3>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-100">
            {Object.entries(parsed).map(([k, v]) => (
              <tr key={k} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 w-[5%] bg-gray-50">
                  {k}
                </td>
                <td className="px-4 py-3 text-gray-700 w-[95%]">
                  {renderValue(v)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
