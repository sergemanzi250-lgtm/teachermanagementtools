import { stripHTML } from "@/app/Lib/utils/sanitize";


interface LessonContentProps {
  parsed: Record<string, unknown>;
}

export default function LessonContent({ parsed }: LessonContentProps) {
  const renderValue = (v: unknown): React.ReactNode => {
    if (Array.isArray(v)) return v.join(', ');
    const str = String(v);
    // Check if the string contains HTML tags
    if (/<[^>]*>/.test(str)) {
      return <div dangerouslySetInnerHTML={{ __html: str }} />;
    }
    return stripHTML(str);
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg mt-6">
      <h3 className="text-2xl font-bold mb-4 text-black">Content</h3>
      <table className="w-full border-collapse">
        <tbody>
          {Object.entries(parsed).map(([k, v]) => (
            <tr key={k} className="border-b">
              <td className="font-semibold w-1/4 p-3 bg-gray-50 text-black">{k}</td>
              <td className="p-3 text-black">
                {renderValue(v)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
