import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    a.download = "resume_analysis.json";
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
      eligibility_status: data.eligibility_status,
      candidate_fit_summary: data.candidate_fit_summary,
    };
    const csv =
      Object.keys(flat).join(",") + "\n" + Object.values(flat).join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6 text-black">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">AI Resume Analysis</h2>
        <div className="space-x-2">
          <Button onClick={handleExportCSV} variant="outline">
            Export CSV
          </Button>
          <Button onClick={handleExportJSON}>Export JSON</Button>
        </div>
      </div>

      {/* Candidate Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <p><strong>Name:</strong> {data.full_name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Phone:</strong> {data.phone_number}</p>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Status - Most Important for Companies */}
      <Card className={`border-2 ${data.eligibility_status === 'Eligible' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className={`${data.eligibility_status === 'Eligible' ? 'text-green-700' : 'text-red-700'}`}>
            Eligibility Status: {data.eligibility_status}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{data.eligibility_reason}</p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Experience & Leadership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>Total Experience:</strong> {data.total_experience_years} years</p>
            <p><strong>Leadership Signals:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${data.leadership_signals ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {data.leadership_signals ? "Yes" : "No"}
              </span>
            </p>
            <div>
              <strong>Leadership Assessment:</strong>
              <p className="text-gray-700 mt-1 text-sm">{data.leadership_justification}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Fit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-sm">{data.candidate_fit_summary}</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Summary */}
      {data.skills && Object.keys(data.skills).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.skills).map(([skill, details]: [string, any]) => (
                <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill} {details.years && `(${details.years})`}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Experience */}
      {data.roles && data.roles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.roles.map((role: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">{role.title}</h4>
                  <p className="text-gray-600">{role.company}</p>
                  <p className="text-sm text-gray-500">{role.years} years</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notable Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.projects.map((project: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <h4 className="font-semibold">{project.name}</h4>
                  {project.tech_stack && project.tech_stack !== "N/A" && (
                    <p className="text-sm text-blue-600 mt-1">
                      <strong>Tech Stack:</strong> {Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack}
                    </p>
                  )}
                  <p className="text-gray-700 text-sm mt-2">{project.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-right text-sm text-gray-500">
        Complete analysis data available via export
      </div>
    </div>
  );
}
