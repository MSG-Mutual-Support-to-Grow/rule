interface Props { data: unknown; }
export default function OutputViewer({ data }: Props) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold">Parsed Output</h3>
        <div className="space-x-2">
          <button className="btn-blue">Export CSV</button>
          <button className="btn-green">Export JSON</button>
        </div>
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}