
import React from "react";
import Navbar from "./components/Navbar";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
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
                ].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-indigo max-w-none">
              {/* Introduction */}
              <section id="introduction" className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h1>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-gray-900">RULE</strong> (Resume Understanding Language Engine) is an AI-powered platform
                    designed to intelligently analyze resumes. It supports OCR, native PDF parsing, and
                    integrates with modern LLMs to deliver structured outputs tailored for candidate-job
                    matching.
                  </p>
                </div>
              </section>

              {/* For Whom */}
              <section id="for-whom" className="mb-12">
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
              <section id="features" className="mb-12">
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
              <section id="architecture" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Architecture & Workflow</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <ol className="space-y-3 list-decimal list-inside">
                    <li className="text-gray-700">Resume Upload (single or batch)</li>
                    <li className="text-gray-700">Native Text Extraction or OCR fallback</li>
                    <li className="text-gray-700">Prompt-based LLM Parsing</li>
                    <li className="text-gray-700">Structured JSON Output</li>
                    <li className="text-gray-700">UI display or export (CSV, JSON)</li>
                  </ol>
                </div>
              </section>

              {/* Tech Stack */}
              <section id="tech-stack" className="mb-12">
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
              <section id="quick-start" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">Run RULE locally using Docker:</p>
                  <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                    <div>git clone https://github.com/dharshan-kumarj/rule</div>
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
              <section id="setup-options" className="mb-12">
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
              <section id="configuration" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuration</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">Create a <code className="bg-gray-200 px-1 rounded">.env</code> file:</p>
                  <div className="bg-gray-800 text-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                    MISTRAL_API_KEY="sk-or-v1-your-openrouter-mistral-api-key-here"
                  </div>
                  <p className="text-gray-700">
                    Customize parsing logic in <code className="bg-gray-200 px-1 rounded">parse_resume_llm.py</code> to adapt analysis.
                  </p>
                </div>
              </section>

              {/* API Documentation */}
              <section id="api-documentation" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">API Documentation</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                    <div>POST /upload-resume/</div>
                    <div>Content-Type: multipart/form-data</div>
                    <br />
                    <div>file: resume.pdf</div>
                    <br />
                    <div>Response: &#123; structured JSON with candidate analysis &#125;</div>
                  </div>
                </div>
              </section>

              {/* Project Structure */}
              <section id="project-structure" className="mb-12">
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
              <section id="scripts" className="mb-12">
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
              <section id="troubleshooting" className="mb-12">
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
              <section id="faq" className="mb-12">
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
                    <p className="text-gray-700 mt-1">A: Any Model of our wish but by default we use Mistral via OpenRouter</p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Q: Is OCR accurate?</p>
                    <p className="text-gray-700 mt-1">A: Yes, with Tesseract OCR by Google</p>
                  </div>
                </div>
              </section>

              {/* Contributors */}
              <section id="contributors" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contributors</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <ul className="space-y-2">
                    <li><a href="https://github.com/dharshan-kumarj" className="text-indigo-600 hover:text-indigo-800">@dharshan-kumarj</a></li>
                    <li><a href="https://github.com/ronnie-allen" className="text-indigo-600 hover:text-indigo-800">@ronnie-allen</a></li>
                    <li><a href="https://github.com/Aparna0224" className="text-indigo-600 hover:text-indigo-800">@Aparna0224</a></li>
                    <li><a href="https://github.com/Franz-kingstein" className="text-indigo-600 hover:text-indigo-800">@Franz-kingstein</a></li>
                    <li><a href="https://github.com/Danishprabhu04" className="text-indigo-600 hover:text-indigo-800">@Danishprabhu04</a></li>
                    <li><a href="https://github.com/BaluK345" className="text-indigo-600 hover:text-indigo-800">@BaluK345</a></li>
                    <li><a href="https://github.com/ThirupathiS-45" className="text-indigo-600 hover:text-indigo-800">@ThirupathiS-45</a></li>
                  </ul>
                </div>
              </section>

              {/* License */}
              <section id="license" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">License</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700">
                    RULE is licensed under the <strong className="text-gray-900">MIT License</strong> — allowing commercial use,
                    modifications, distribution, and private use. Liability and warranty are not included.
                  </p>
                </div>
              </section>

              {/* Contributing */}
              <section id="contributing" className="mb-12">
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
