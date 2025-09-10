import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, Award, Download, RefreshCw, Calendar, Filter } from "lucide-react";
import { getAnalyticsMetrics, getCandidateAnalytics, getSkillsAnalysis, getDashboardSummary, exportAnalyticsData } from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import BlurText from "../blocks/BlurText";
import toast from "react-hot-toast";

interface AnalyticsData {
  total_candidates: number;
  average_fit_score: number;
  eligibility_rate: number;
  top_skills: Array<{
    skill: string;
    count: number;
    percentage: number;
  }>;
  experience_distribution: Record<string, number>;
  skills_distribution: Record<string, number>;
  geographic_distribution: Record<string, number>;
}

interface CandidateData {
  resume_id: string;
  filename: string;
  full_name: string | null;
  fit_score: number;
  eligibility_status: string;
  skills_count: number;
  experience_years: number | null;
  location: string | null;
  education_level: string | null;
  processed_at: string;
}

interface DashboardSummary {
  key_metrics: {
    total_candidates: number;
    average_fit_score: number;
    eligibility_rate: number;
    top_skill: string;
  };
  charts_data: {
    experience_distribution: Record<string, number>;
    eligibility_distribution: Record<string, number>;
    top_skills: Array<{
      skill: string;
      count: number;
      percentage: number;
    }>;
  };
  time_range: string;
  generated_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [skillsAnalysis, setSkillsAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [metricsRes, candidatesRes, dashboardRes, skillsRes] = await Promise.all([
        getAnalyticsMetrics(timeRange),
        getCandidateAnalytics(timeRange, 50, 0, "fit_score", "desc"),
        getDashboardSummary(timeRange),
        getSkillsAnalysis(timeRange, 10)
      ]);

      if (metricsRes.success) setAnalyticsData(metricsRes.data);
      if (candidatesRes.success) setCandidates(candidatesRes.data.candidates);
      if (dashboardRes.success) setDashboardSummary(dashboardRes.data);
      if (skillsRes.success) setSkillsAnalysis(skillsRes.data);

    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv' = 'json') => {
    try {
      const response = await exportAnalyticsData(timeRange, format);
      if (response.success) {
        const data = response.data.data;
        const blob = new Blob([format === 'json' ? JSON.stringify(data, null, 2) : data], {
          type: format === 'json' ? 'application/json' : 'text/csv'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_export_${timeRange}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Analytics data exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      toast.error("Failed to export analytics data");
    }
  };

  const formatTimeRange = (range: string) => {
    const formats: Record<string, string> = {
      today: "Today",
      week: "This Week",
      month: "This Month",
      quarter: "This Quarter",
      year: "This Year",
      all_time: "All Time"
    };
    return formats[range] || range;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleAnimationComplete = () => {
    console.log("Analytics title animation completed!");
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center">
        <BlurText
          text="Analytics Dashboard"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-5xl md:text-6xl mb-6 text-black"
        />

        <p className="text-lg text-gray-700 max-w-xl mb-8">
          Comprehensive insights into your resume processing and candidate analysis
        </p>

        {/* Time Range Selector */}
        <div className="mb-8">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48 bg-black backdrop-blur-sm border-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            onClick={loadAnalyticsData}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md transition-all duration-200"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
          <Button
            onClick={() => handleExport('json')}
            variant="outline"
            className="bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 transition-all duration-200 shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            onClick={() => handleExport('csv')}
            variant="outline"
            className="bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 transition-all duration-200 shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Key Metrics Cards */}
        {dashboardSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full max-w-6xl">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardSummary.key_metrics.total_candidates}</div>
                <p className="text-xs text-muted-foreground">
                  {formatTimeRange(dashboardSummary.time_range)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Fit Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardSummary.key_metrics.average_fit_score.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Out of 10.0</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eligibility Rate</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardSummary.key_metrics.eligibility_rate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Candidates eligible</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Skill</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">{dashboardSummary.key_metrics.top_skill}</div>
                <p className="text-xs text-muted-foreground">Most common skill</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <div className="w-full max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Experience Distribution Chart */}
                {dashboardSummary && (
                  <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Experience Distribution</CardTitle>
                      <CardDescription>Years of experience breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={Object.entries(dashboardSummary.charts_data.experience_distribution).map(([key, value]) => ({ name: key, value }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Top Skills Chart */}
                {dashboardSummary && (
                  <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Top Skills</CardTitle>
                      <CardDescription>Most common skills among candidates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardSummary.charts_data.top_skills}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="skill" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Candidates Tab */}
            <TabsContent value="candidates">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Candidate Analytics</CardTitle>
                  <CardDescription>Detailed view of processed candidates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Fit Score</TableHead>
                        <TableHead>Eligibility</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Processed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate) => (
                        <TableRow key={candidate.resume_id}>
                          <TableCell className="font-medium">
                            {candidate.full_name || candidate.filename}
                          </TableCell>
                          <TableCell>
                            <Badge variant={candidate.fit_score >= 7 ? "default" : "secondary"}>
                              {candidate.fit_score}/10
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={candidate.eligibility_status === 'Eligible' ? "default" : "secondary"}>
                              {candidate.eligibility_status}
                            </Badge>
                          </TableCell>
                          <TableCell>{candidate.skills_count}</TableCell>
                          <TableCell>{candidate.experience_years ? `${candidate.experience_years} years` : 'N/A'}</TableCell>
                          <TableCell>{candidate.location || 'N/A'}</TableCell>
                          <TableCell>{new Date(candidate.processed_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Analysis Tab */}
            <TabsContent value="skills">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {skillsAnalysis && (
                  <>
                    <Card className="bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Skills Overview</CardTitle>
                        <CardDescription>Comprehensive skills analysis</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Unique Skills:</span>
                          <span className="font-semibold">{skillsAnalysis.unique_skills_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Skills per Candidate:</span>
                          <span className="font-semibold">{skillsAnalysis.average_skills_per_candidate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Skill Mentions:</span>
                          <span className="font-semibold">{skillsAnalysis.total_skill_mentions}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {Array.isArray(skillsAnalysis.top_skills) && skillsAnalysis.top_skills.length > 0 && (
                      <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle>Top Skills Distribution</CardTitle>
                          <CardDescription>Most frequently mentioned skills</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={Array.isArray(skillsAnalysis?.top_skills) ? skillsAnalysis.top_skills : []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry: any) => `${entry.skill}: ${entry.percentage?.toFixed(1) ?? 0}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {Array.isArray(skillsAnalysis?.top_skills) && skillsAnalysis.top_skills.map((_: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData && (
                  <>
                    <Card className="bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Key Insights</CardTitle>
                        <CardDescription>AI-powered insights from your data</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900">Candidate Quality</h4>
                          <p className="text-blue-700 text-sm">
                            {analyticsData.average_fit_score >= 7
                              ? "Excellent candidate pool with high average fit scores"
                              : analyticsData.average_fit_score >= 5
                              ? "Good candidate quality with room for improvement"
                              : "Consider refining job requirements or expanding candidate search"
                            }
                          </p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-900">Skills Distribution</h4>
                          <p className="text-green-700 text-sm">
                            Top skill: <strong>{analyticsData.top_skills[0]?.skill || 'N/A'}</strong>
                            ({analyticsData.top_skills[0]?.percentage.toFixed(1) || 0}% of candidates)
                          </p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-semibold text-purple-900">Experience Profile</h4>
                          <p className="text-purple-700 text-sm">
                            Most candidates have {Object.entries(analyticsData.experience_distribution)
                              .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown'} experience
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                        <CardDescription>Suggestions to improve your hiring process</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {analyticsData.eligibility_rate < 50 && (
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <h4 className="font-semibold text-yellow-900">Low Eligibility Rate</h4>
                            <p className="text-yellow-700 text-sm">
                              Consider adjusting job requirements or expanding candidate criteria to increase the eligible pool.
                            </p>
                          </div>
                        )}

                        {analyticsData.top_skills.length > 0 && (
                          <div className="p-4 bg-indigo-50 rounded-lg">
                            <h4 className="font-semibold text-indigo-900">Skills Focus</h4>
                            <p className="text-indigo-700 text-sm">
                              Emphasize {analyticsData.top_skills.slice(0, 3).map(s => s.skill).join(', ')} in your job postings.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
