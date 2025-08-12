import React, { useState } from "react";
import RuleLogo from "../public/images/rule-logo.png";
import Navbar from "./components/Navbar";
import arch from "../public/images/RULE.svg";

export default function DocsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar for mobile
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hamburger Button for Mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden block mb-4 px-4 py-2 text-gray-700 bg-gray-100 rounded-md font-medium"
          >
            {isSidebarOpen ? 'Close Menu' : '☰ List of Sections'}
          </button>

          {/* Sidebar Navigation */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              isSidebarOpen ? "block" : "hidden"
            } lg:block fixed inset-0 z-50 bg-white w-full lg:static lg:z-auto lg:bg-transparent p-6 lg:p-0 overflow-y-auto`}
          >
            {/* Close Button for Mobile */}
            {isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 lg:hidden text-gray-600"
              >
                ✕
              </button>
            )}

            <div className="lg:sticky lg:top-24">
              <nav className="space-y-1">
                {[
                  "Introduction",
                  "For Whom",
                  "Features",
                  "Architecture",
                  "Tech Stack",
                  "Quick Start",
                  "Setup Options",
                  "Configuration",
                  "API Documentation",
                  "Project Structure",
                  "Scripts",
                  "Troubleshooting",
                  "FAQ",
                  "Contributors",
                  "License",
                  "Contributing"
                ].map((item) => {
                  const id = item.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <a
                      key={item}
                      href={`#${id}`}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                        setIsSidebarOpen(false); // Close sidebar after clicking
                      }}
                    >
                      {item}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Overlay when sidebar is open on mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-indigo max-w-none">
              {/* Introduction */}
              <section id="introduction" className="mb-12 scroll-mt-20">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h1>
                <div className="border border-gray-200 rounded-lg p-6 text-justify">
                  <div className="flex justify-center my-8">
                    <img
                      src={RuleLogo}
                      alt="RULE Logo"
                      className="w-116 h-auto rounded-lg shadow-md"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    <strong className="text-gray-900">RULE</strong> (Resume Understanding Language Engine) is an AI-powered platform
                    designed to intelligently analyze resumes. It supports OCR, native PDF parsing, and
                    integrates with modern LLMs to deliver structured outputs tailored for candidate-job
                    matching.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Our project is a dynamic Large Language Model (LLM) integration framework designed to make AI model selection and usage simple, flexible, and developer-friendly. Instead of locking developers into a single provider, we built a system where multiple AI model providers — such as OpenAI, OpenRouter, and Ollama can be accessed through a single, unified interface. This makes it easy for applications to switch between models or try out new ones without having to rewrite large portions of code.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    The core idea is to handle all model routing and API interactions in a modular way. Each provider has its own handler that knows how to communicate with the specific API, while a central provider_router automatically selects and initializes the right provider based on the model and API key given by the user. This means that from the frontend, a user can simply choose their preferred model, enter their API key, and start using it — without needing to understand the technical differences between providers.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Ultimately, this project aims to simplify AI adoption by hiding the complexities of different APIs and enabling dynamic, on-the-fly provider switching.
                  </p>
                  {/* GitHub Icon Link */}
                  <div className="mt-8 flex justify-center">
                    <a
                      href="https://github.com/MSG-Mutual-Support-to-Grow/rule"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-lg font-medium">View on GitHub</span>
                    </a>
                  </div>
                </div>
              </section>

              {/* For Whom */}
              <section id="for-whom" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">For Whom This Product Is Made</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      RULE is specifically designed for HR professionals, recruiters, and hiring managers who need to efficiently evaluate and screen resumes. It helps you:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700"><strong>Check resumes</strong> against provided job descriptions to find the best matches</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700"><strong>Automate candidate screening</strong> by comparing qualifications, skills, and experience</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700"><strong>Save time</strong> by quickly identifying top candidates from large applicant pools</p>
                      </li>
                    </ul>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Advanced LLM Integration</h3>
                      <p className="text-blue-800">
                        RULE offers the flexibility to use different Large Language Models (LLMs) from various providers,
                        allowing you to choose the best AI model for your specific hiring needs and requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section id="features" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">AI-Powered Resume Parsing & Candidate Evaluation</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">Native and Scanned PDF Support (via OCR)</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">Real-Time Processing with Export Options</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">Job Matching and Eligibility Feedback</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">Key Skills Extraction and Role Fit Analysis</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">Modern UI with Live Upload & Output</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">API-First Design for Custom Integrations</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">Docker-Ready for Easy Deployment</p>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Architecture */}
              <section id="architecture" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Architecture & Workflow</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col items-center mb-8">
                    <img
                      src={arch}
                      alt="RULE Architecture"
                      className="w-128 h-auto rounded-lg shadow-md"
                    />
                  </div>
                  <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
                    RULE follows a modular architecture that processes resumes through multiple stages,
                    from initial parsing to final structured output. The system is designed for scalability
                    and flexibility, supporting various input formats and AI models.
                  </p>
                  <ol className="space-y-6 mb-8">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">1</div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">Resume Upload (single or batch)</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Users can upload individual resumes or process multiple files simultaneously through the intuitive interface or API.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">2</div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">Native Text Extraction or OCR fallback</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          The system first attempts native PDF text extraction, falling back to advanced OCR for scanned documents.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">3</div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">Prompt-based LLM Parsing</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Structured prompts guide the AI model to extract and analyze key information from the resume content.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">4</div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">Structured JSON Output</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          The parsed information is formatted into a standardized JSON structure for easy processing and integration.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">5</div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">UI display or export (CSV, JSON)</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Results are presented in the dashboard or can be exported in various formats for further analysis.
                        </p>
                      </div>
                    </li>
                  </ol>
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 text-center">System Benefits</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-800 text-sm">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">•</div>
                        <span className="ml-2">Modular design for easy maintenance</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">•</div>
                        <span className="ml-2">Scalable for high-volume processing</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">•</div>
                        <span className="ml-2">Flexible AI model integration</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Tech Stack */}
              <section id="tech-stack" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tech Stack</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700">React 19, TypeScript, Vite</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700">Tailwind CSS, ShadCN UI, Framer Motion</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700">Lucide Icons</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Backend:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700">FastAPI, Python 3.10+</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700">PDFPlumber, EasyOCR</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700">OpenRouter (Mistral), OpenAI</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Infrastructure:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700">Docker & Docker Compose</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                        <p className="ml-3 text-gray-700">UV for Python dependency management</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Quick Start */}
              <section id="quick-start" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">Run RULE locally using Docker:</p>
                  <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                    <div>git clone https://github.com/MSG-Mutual-Support-to-Grow/rule.git</div>
                    <div>cd rule</div>
                    <div>docker-compose up --build</div>
                  </div>
                  <p className="text-gray-700">
                    Access the frontend at <code className="bg-gray-200 px-1 rounded">localhost:5173</code> and backend docs at
                    <code className="bg-gray-200 px-1 rounded ml-1">localhost:8000/docs</code>
                  </p>
                </div>
              </section>

              {/* Setup Options */}
              <section id="setup-options" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Setup Options</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Docker Commands</h3>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>docker-compose up</div>
                      <div>docker-compose up -d</div>
                      <div>docker-compose down</div>
                      <div>docker-compose logs -f backend</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Manual Setup (Backend)</h3>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>uv add -r requirements.txt</div>
                      <div>uv run uvicorn backend.api.main:app --reload</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Manual Setup (Frontend)</h3>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>cd frontend</div>
                      <div>npm install</div>
                      <div>npm run dev</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Configuration */}
              <section id="configuration" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuration</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-6">
                    RULE introduces a powerful concept called <strong>BYOL (Bring Your Own LLM)</strong>, allowing users to integrate and switch between different Large Language Models (LLMs) seamlessly — all from the UI.
                  </p>
                  <p className="text-gray-700 mb-6">
                    Instead of managing API keys via <code>.env</code> files, RULE enables dynamic configuration through the application settings:
                  </p>
                  <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
                    <li>Navigate to <strong>Settings → LLM Providers</strong> in the UI.</li>
                    <li>Select your preferred LLM provider (e.g., OpenAI, OpenRouter, Ollama).</li>
                    <li>Enter your API key and model name.</li>
                    <li>Save your configuration — it will be stored as a JSON file in your local directory.</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    Every time you update your settings, the configuration is <strong>dynamically saved</strong> and instantly applied across the system. This eliminates the need for restarts or manual file edits.
                  </p>
                  <p className="text-gray-700 mb-6">
                    This approach enables:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    <li>Real-time model switching</li>
                    <li>No code changes required</li>
                    <li>Secure, user-specific credentials</li>
                    <li>Easy sharing and versioning of configurations</li>
                  </ul>
                  {/* GIF Placeholder */}
                  <div className="flex justify-center my-8">
                    <img
                      src="/assets/config-demo.gif"
                      alt="Configuration UI Demo"
                      className="rounded-lg shadow-lg border max-w-full h-auto"
                    />
                  </div>
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Tip</h3>
                    <p className="text-green-800">
                      You can have multiple configurations for different use cases (e.g., dev, production) and switch between them instantly.
                    </p>
                  </div>
                </div>
              </section>

              {/* API Documentation */}
              <section id="api-documentation" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">API Documentation</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-6">
                    All endpoints are prefixed with <code className="bg-gray-100 px-1 rounded font-mono">/api</code> and return JSON responses.
                  </p>
                  {/* Resume Processing Endpoints */}
                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Resume Processing Endpoints</h3>
                  {/* Upload and Analyze Single Resume */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">1. Upload and Analyze Single Resume</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      POST /api/upload-resume/
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Upload and analyze a single PDF resume against the current job description.</p>
                    <p className="text-gray-700 mb-3"><strong>Request:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 ml-4 mb-3">
                      <li><strong>Content-Type:</strong> <code className="bg-gray-100 px-1 rounded">multipart/form-data</code></li>
                      <li><strong>Parameters:</strong>
                        <ul className="list-disc list-inside ml-5 mt-1">
                          <li><code>file</code> (required): PDF file upload</li>
                        </ul>
                      </li>
                    </ul>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-3">
                      {`{
  "success": true,
  "resume_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "filename": "john_doe_resume.pdf",
  "full_name": "John Doe",
  "email": "john.doe@email.com",
  "phone_number": "+1-555-0123",
  "total_experience_years": 5,
  "fit_score": 8,
  "fit_score_reason": "Strong technical background matching Python and FastAPI requirements",
  "eligibility_status": "Eligible",
  "eligibility_reason": "Candidate has 5+ years of relevant experience",
  "candidate_fit_summary": "Excellent match with strong technical skills",
  "skills": {
    "Python": {"source": "Professional", "years": 5},
    "FastAPI": {"source": "Professional", "years": 2},
    "Docker": {"source": "Professional", "years": 3}
  },
  "projects": [
    {
      "name": "E-commerce API Platform",
      "tech_stack": "Python, FastAPI, PostgreSQL, Docker",
      "description": "Built scalable REST API serving 10,000+ concurrent users"
    }
  ],
  "education": "B.S. Computer Science, Stanford University, 2018",
  "leadership_signals": true,
  "leadership_justification": "Led development team of 5 engineers for 2 years",
  "work_experience_raw": "Software Engineer at TechCorp (2019-2024)...",
  "job_description": "We are seeking a Senior Backend Developer..."
}`}
                    </pre>
                    <p className="text-gray-700 mb-2"><strong>Error Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "error": "Only PDF files are accepted",
  "resume_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "trace": "Detailed error traceback..."
}`}
                    </pre>
                  </div>
                  {/* Batch Resume Processing */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">2. Batch Resume Processing</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      POST /api/upload-resume-batch/
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Upload and process multiple PDF resumes simultaneously, returning a ranked list of candidates.</p>
                    <p className="text-gray-700 mb-3"><strong>Request:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 ml-4 mb-3">
                      <li><strong>Content-Type:</strong> <code className="bg-gray-100 px-1 rounded">multipart/form-data</code></li>
                      <li><strong>Parameters:</strong>
                        <ul className="list-disc list-inside ml-5 mt-1">
                          <li><code>files[]</code> (required): Multiple PDF file uploads</li>
                        </ul>
                      </li>
                    </ul>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "total_processed": 5,
  "successful_analyses": 4,
  "failed_analyses": 1,
  "job_description": "We are seeking a Senior Backend Developer...",
  "ranked_resumes": [
    {
      "resume_id": "abc123",
      "filename": "candidate1.pdf",
      "candidate_name": "Jane Smith",
      "fit_score": 9,
      "fit_score_reason": "Perfect match for all technical requirements",
      "total_experience": "7 years",
      "key_skills": ["Python", "FastAPI", "AWS", "Docker"],
      "eligibility_status": "Highly Eligible"
    },
    {
      "resume_id": "def456",
      "filename": "candidate2.pdf",
      "candidate_name": "John Doe",
      "fit_score": 8,
      "fit_score_reason": "Strong technical background with minor gaps",
      "total_experience": "5 years",
      "key_skills": ["Python", "Django", "PostgreSQL"],
      "eligibility_status": "Eligible"
    }
  ],
  "failed_files": [
    {
      "filename": "corrupted_resume.pdf",
      "error": "Unable to extract text from PDF - file may be corrupted"
    }
  ]
}`}
                    </pre>
                  </div>
                  {/* Get Analysis Results */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">3. Get Analysis Results</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      GET /api/get-analysis/(resume_id)
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Retrieve detailed analysis results for a specific resume by its ID.</p>
                    <p className="text-gray-700 mb-3"><strong>Parameters:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 ml-4 mb-3">
                      <li><code>resume_id</code> (path): UUID of the resume analysis</li>
                    </ul>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "resume_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "analysis": {
    "full_name": "John Doe",
    "fit_score": 8,
    "detailed_analysis": "...",
    "processed_at": "2024-01-15T10:30:00Z"
  }
}`}
                    </pre>
                  </div>
                  {/* Job Description Management */}
                  <h3 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Job Description Management</h3>
                  {/* Save Job Description */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">4. Save Job Description</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      POST /api/save-job-description/
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Save or update the job description that will be used for resume analysis.</p>
                    <p className="text-gray-700 mb-2"><strong>Request:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-3">
                      {`{
  "job_description": "We are seeking a Senior Backend Developer with 5+ years of experience in Python, FastAPI, and cloud technologies. The ideal candidate should have experience with microservices architecture, database design, and team leadership."
}`}
                    </pre>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "message": "Job description saved successfully",
  "job_description": "We are seeking a Senior Backend Developer...",
  "saved_at": "2024-01-15T10:30:00Z"
}`}
                    </pre>
                  </div>
                  {/* Get Current Job Description */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">5. Get Current Job Description</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      GET /api/get-job-description/
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Retrieve the currently configured job description.</p>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "job_description": "We are seeking a Senior Backend Developer with 5+ years of experience...",
  "last_updated": "2024-01-15T10:30:00Z"
}`}
                    </pre>
                  </div>
                  {/* LLM Provider Management */}
                  <h3 className="text-xl font-semibold text-gray-900 mt-10 mb-4">LLM Provider Management</h3>
                  {/* Get Available Providers */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">6. Get Available Providers</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      GET /api/llm/providers
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> List all available LLM providers and their current status.</p>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "available_providers": [
    {
      "name": "ollama",
      "status": "available",
      "models": ["llama3.2", "codellama", "mistral"],
      "base_url": "http://localhost:11434",
      "requires_api_key": false
    },
    {
      "name": "openrouter",
      "status": "configured",
      "models": ["gpt-4", "claude-3", "mixtral"],
      "base_url": "https://openrouter.ai/api/v1/chat/completions",
      "requires_api_key": true
    }
  ],
  "current_provider": "ollama"
}`}
                    </pre>
                  </div>
                  {/* Get Current LLM Configuration */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">7. Get Current LLM Configuration</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      GET /api/llm/config
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Get the current LLM provider configuration.</p>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "provider": "ollama",
  "model": "llama3.2",
  "api_key": null,
  "base_url": "http://localhost:11434",
  "status": "connected",
  "last_updated": "2024-01-15T10:30:00Z"
}`}
                    </pre>
                  </div>
                  {/* Configure LLM Provider */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">8. Configure LLM Provider</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      POST /api/llm/config
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Switch LLM provider or update configuration settings.</p>
                    <p className="text-gray-700 mb-2"><strong>Request:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-3">
                      {`{
  "provider": "openrouter",
  "model": "mistralai/mistral-7b-instruct",
  "api_key": "sk-or-v1-your-api-key-here",
  "base_url": "https://openrouter.ai/api/v1/chat/completions"
}`}
                    </pre>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "message": "LLM provider configured successfully",
  "config": {
    "provider": "openrouter",
    "model": "mistralai/mistral-7b-instruct",
    "api_key": "sk-or-v1-***",
    "base_url": "https://openrouter.ai/api/v1/chat/completions",
    "status": "connected"
  }
}`}
                    </pre>
                  </div>
                  {/* Test LLM Connection */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">9. Test LLM Connection</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      POST /api/llm/prompt
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Send a test prompt to the current LLM provider to verify connection.</p>
                    <p className="text-gray-700 mb-2"><strong>Request:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-3">
                      {`{
  "prompt": "Hello, please respond with 'Connection successful' if you can process this message."
}`}
                    </pre>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "response": "Connection successful",
  "provider": "ollama",
  "model": "llama3.2",
  "response_time_ms": 1250
}`}
                    </pre>
                  </div>
                  {/* Get Available Models for Provider */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">10. Get Available Models for Provider</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      GET /api/llm/models/(provider)
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Get list of available models for a specific provider.</p>
                    <p className="text-gray-700 mb-3"><strong>Parameters:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 ml-4 mb-3">
                      <li><code>provider</code> (path): Provider name (e.g., "ollama", "openrouter")</li>
                    </ul>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "provider": "ollama",
  "models": [
    {
      "name": "llama3.2",
      "size": "7B",
      "description": "Meta's latest Llama model"
    },
    {
      "name": "codellama",
      "size": "13B",
      "description": "Specialized for code generation"
    }
  ]
}`}
                    </pre>
                  </div>
                  {/* Fix Configuration Issues */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">11. Fix Configuration Issues</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      POST /api/llm/fix-config
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Automatically attempt to fix common LLM configuration issues.</p>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "message": "Configuration issues resolved",
  "fixes_applied": [
    "Updated Ollama base URL to correct endpoint",
    "Validated API key format"
  ],
  "current_config": {
    "provider": "ollama",
    "status": "connected"
  }
}`}
                    </pre>
                  </div>
                  {/* Validate Configuration */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">12. Validate Configuration</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      POST /api/llm/validate-config
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Validate the current LLM configuration without making changes.</p>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "valid": true,
  "provider": "ollama",
  "issues": [],
  "recommendations": [
    "Consider updating to latest model version"
  ]
}`}
                    </pre>
                  </div>
                  {/* Reset LLM Configuration */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">13. Reset LLM Configuration</h4>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                      POST /api/llm/reset
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Description:</strong> Reset LLM configuration to default settings.</p>
                    <p className="text-gray-700 mb-2"><strong>Response:</strong></p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "message": "Configuration reset to defaults",
  "config": {
    "provider": "ollama",
    "model": "llama3.2",
    "base_url": "http://localhost:11434"
  }
}`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* Project Structure */}
              <section id="project-structure" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Structure</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                    <div>rule/</div>
                    <div>├── backend/</div>
                    <div>│   └── api/, modules/, pipelines/</div>
                    <div>├── frontend/</div>
                    <div>│   └── components/, pages/, lib/</div>
                    <div>├── docker-compose.yml, Dockerfile.*</div>
                    <div>├── README.md, requirements.txt</div>
                  </div>
                </div>
              </section>

              {/* Scripts */}
              <section id="scripts" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Scripts</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend:</h3>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>npm run dev</div>
                      <div>npm run build</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Backend:</h3>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>uv run uvicorn backend.api.main:app --reload</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Docker:</h3>
                    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>docker-compose up --build</div>
                      <div>docker-compose logs -f frontend</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Troubleshooting */}
              <section id="troubleshooting" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">Port Conflicts: Kill process on 5173 or 8000</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">OCR Accuracy: Ensure scanned PDFs are high resolution</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-indigo-600 mt-0.5">•</div>
                      <p className="ml-3 text-gray-700">Docker Issues: Use <code className="bg-gray-200 px-1 rounded">docker system prune</code></p>
                    </li>
                  </ul>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-gray-900 font-medium">Q: What file formats are supported?</p>
                    <p className="text-gray-700 mt-1">A: PDF only</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-gray-900 font-medium">Q: File size limit?</p>
                    <p className="text-gray-700 mt-1">A: 10MB</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-gray-900 font-medium">Q: Which AI models are used?</p>
                    <p className="text-gray-700 mt-1">A: Any model of your choice via BYOL — default is Mistral via OpenRouter</p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Q: Is OCR accurate?</p>
                    <p className="text-gray-700 mt-1">A: Yes, with Tesseract OCR by Google</p>
                  </div>
                </div>
              </section>

              {/* Contributors */}
              <section id="contributors" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contributors</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <ul className="space-y-2">
                    <li><a href="https://github.com/dharshan-kumarj" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">@dharshan-kumarj</a></li>
                    <li><a href="https://github.com/ronnie-allen" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">@ronnie-allen</a></li>
                    <li><a href="https://github.com/Aparna0224" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">@Aparna0224</a></li>
                    <li><a href="https://github.com/Franz-kingstein" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">@Franz-kingstein</a></li>
                    <li><a href="https://github.com/Danishprabhu04" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">@Danishprabhu04</a></li>
                    <li><a href="https://github.com/BaluK345" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">@BaluK345</a></li>
                    <li><a href="https://github.com/ThirupathiS-45" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">@ThirupathiS-45</a></li>
                  </ul>
                </div>
              </section>

              {/* License */}
              <section id="license" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">License</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700">
                    RULE is licensed under the <strong className="text-gray-900">MIT License</strong> — allowing commercial use,
                    modifications, distribution, and private use. Liability and warranty are not included.
                  </p>
                </div>
              </section>

              {/* Contributing */}
              <section id="contributing" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contributing</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <ol className="space-y-3 list-decimal list-inside">
                    <li className="text-gray-700">Fork the repo and create a feature branch</li>
                    <li className="text-gray-700">Make your changes, test, and commit</li>
                    <li className="text-gray-700">Push your branch and open a pull request</li>
                  </ol>
                  <p className="text-gray-700 mt-4">
                    Follow coding guidelines and update documentation for new features.
                  </p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}