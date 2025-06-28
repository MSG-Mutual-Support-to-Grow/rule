import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  data: any;
}

export default function OutputViewer({ data }: Props) {
  if (!data) return null;

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parsed_resume.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const flat = {
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      total_experience_years: data.total_experience_years,
      leadership_signals: data.leadership_signals,
      leadership_justification: data.leadership_justification,
      candidate_fit_summary: data.candidate_fit_summary,
    };
    const csv =
      Object.keys(flat).join(",") + "\n" + Object.values(flat).join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parsed_resume.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-10 space-y-6 bg-white rounded-lg shadow-lg p-6 text-black">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Candidate Summary</h2>
        <div className="space-x-2">
          <Button onClick={handleExportCSV} variant="outline">
            Export CSV
          </Button>
          <Button onClick={handleExportJSON}>Export JSON</Button>
        </div>
      </div>

      {/* Highlighted Info */}
      <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
        <p><strong>Total Experience:</strong> {data.total_experience_years} years</p>
        <p><strong>Leadership:</strong> {data.leadership_signals ? "Yes" : "No"}</p>
        <div className="col-span-2">
          <strong>Leadership Justification:</strong>
          <p className="text-gray-700 mt-1">{data.leadership_justification}</p>
        </div>
        <div className="col-span-2">
          <strong>Candidate Fit Summary:</strong>
          <p className="text-gray-700 mt-1">{data.candidate_fit_summary}</p>
        </div>
      </div>

      <div className="text-right text-sm text-gray-500">
        Full resume data available via export
      </div>
    </div>
  );
}
