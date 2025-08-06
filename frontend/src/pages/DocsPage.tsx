import React from "react";
import Sidebar from "../components/layout/Sidebar";
import BlurText from "../blocks/BlurText";

export default function DocsPage() {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden text-white flex">
      {/* Shared Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Docs Content */}
      <main className="flex-1 flex flex-col px-8 py-0 overflow-y-auto relative">
        {/* Navigation Bar */}
        <nav className="border-gray-200 bg-white/95 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 w-full">
          <div className="flex flex-wrap items-center justify-between p-4 ml-64">
            <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="self-center text-2xl font-bold whitespace-nowrap text-gray-900">RULE</span>
            </a>
            <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-600 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors" aria-controls="navbar-solid-bg" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
            <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
              <ul className="flex flex-col font-medium mt-4 rounded-lg bg-white md:space-x-6 md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                {[
                  "Introduction",
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
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block py-2 px-3 text-gray-700 rounded hover:bg-violet-50 md:hover:bg-transparent md:border-0 md:hover:text-violet-700 md:p-0 transition-colors font-medium text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="w-full pt-24 flex justify-center">
          <BlurText
            text="RULE Documentation"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-5xl mb-8 text-violet-600 font-bold text-center"
          />
        </div>

        <div className="w-full space-y-8 text-gray-800">
          {/* Content Sections */}
          <Section id="introduction" title="Introduction">
            <p>
              <strong>RULE</strong> (Resume Understanding Language Engine) is an AI-powered platform
              designed to intelligently analyze resumes. It supports OCR, native PDF parsing, and
              integrates with modern LLMs to deliver structured outputs tailored for candidate-job
              matching.
            </p>
          </Section>

          <Section id="features" title="Features">
            <ul className="list-disc list-inside space-y-1">
              <li>AI-Powered Resume Parsing & Candidate Evaluation</li>
              <li>Native and Scanned PDF Support (via OCR)</li>
              <li>Real-Time Processing with Export Options</li>
              <li>Job Matching and Eligibility Feedback</li>
              <li>Key Skills Extraction and Role Fit Analysis</li>
              <li>Modern UI with Live Upload & Output</li>
              <li>API-First Design for Custom Integrations</li>
              <li>Docker-Ready for Easy Deployment</li>
            </ul>
          </Section>

          <Section id="architecture" title="Architecture & Workflow">
            <ol className="list-decimal list-inside space-y-1">
              <li>Resume Upload (single or batch)</li>
              <li>Native Text Extraction or OCR fallback</li>
              <li>Prompt-based LLM Parsing</li>
              <li>Structured JSON Output</li>
              <li>UI display or export (CSV, JSON)</li>
            </ol>
          </Section>

          <Section id="tech-stack" title="Tech Stack">
            <p className="font-semibold">Frontend:</p>
            <ul className="list-disc list-inside">
              <li>React 19, TypeScript, Vite</li>
              <li>Tailwind CSS, ShadCN UI, Framer Motion</li>
              <li>Lucide Icons</li>
            </ul>
            <p className="font-semibold mt-4">Backend:</p>
            <ul className="list-disc list-inside">
              <li>FastAPI, Python 3.10+</li>
              <li>PDFPlumber, EasyOCR</li>
              <li>OpenRouter (Mistral), OpenAI</li>
            </ul>
            <p className="font-semibold mt-4">Infrastructure:</p>
            <ul className="list-disc list-inside">
              <li>Docker & Docker Compose</li>
              <li>UV for Python dependency management</li>
            </ul>
          </Section>

          <Section id="quick-start" title="Quick Start">
            <p className="mb-2">Run RULE locally using Docker:</p>
            <CodeBlock>
              git clone https://github.com/dharshan-kumarj/rule
              cd rule
              docker-compose up --build
            </CodeBlock>
            <p className="mt-2">
              Access the frontend at <code>localhost:5173</code> and backend docs at
              <code>localhost:8000/docs</code>
            </p>
          </Section>

          <Section id="setup-options" title="Setup Options">
            <h3 className="font-semibold">Docker Commands</h3>
            <CodeBlock>
              docker-compose up
              docker-compose up -d
              docker-compose down
              docker-compose logs -f backend
            </CodeBlock>
            <h3 className="font-semibold mt-4">Manual Setup (Backend)</h3>
            <CodeBlock>
              uv add -r requirements.txt
              uv run uvicorn backend.api.main:app --reload
            </CodeBlock>
            <h3 className="font-semibold mt-4">Manual Setup (Frontend)</h3>
            <CodeBlock>
              cd frontend
              npm install
              npm run dev
            </CodeBlock>
          </Section>

          <Section id="configuration" title="Configuration">
            <p>Create a <code>.env</code> file:</p>
            <CodeBlock>
              MISTRAL_API_KEY="sk-or-v1-your-openrouter-mistral-api-key-here"
            </CodeBlock>
            <p className="mt-2">
              Customize parsing logic in <code>parse_resume_llm.py</code> to adapt analysis.
            </p>
          </Section>

          <Section id="api-documentation" title="API Documentation">
            <CodeBlock>{`POST /upload-resume/
Content-Type: multipart/form-data

file: resume.pdf

Response: { structured JSON with candidate analysis }`}</CodeBlock>
          </Section>

          <Section id="project-structure" title="Project Structure">
            <CodeBlock>{`rule/
├── backend/
│   └── api/, modules/, pipelines/
├── frontend/
│   └── components/, pages/, lib/
├── docker-compose.yml, Dockerfile.*
├── README.md, requirements.txt`}</CodeBlock>
          </Section>

          <Section id="scripts" title="Available Scripts">
            <p className="font-semibold">Frontend:</p>
            <CodeBlock>
              npm run dev
              npm run build
            </CodeBlock>
            <p className="font-semibold mt-4">Backend:</p>
            <CodeBlock>
              uv run uvicorn backend.api.main:app --reload
            </CodeBlock>
            <p className="font-semibold mt-4">Docker:</p>
            <CodeBlock>
              docker-compose up --build
              docker-compose logs -f frontend
            </CodeBlock>
          </Section>

          <Section id="troubleshooting" title="Troubleshooting">
            <ul className="list-disc list-inside space-y-2">
              <li>Port Conflicts: Kill process on 5173 or 8000</li>
              <li>OCR Accuracy: Ensure scanned PDFs are high resolution</li>
              <li>Docker Issues: Use <code>docker system prune</code></li>
            </ul>
          </Section>

          <Section id="faq" title="FAQ">
            <ul className="space-y-2">
              <li><strong>Q:</strong> What file formats are supported? <strong>A:</strong> PDF only</li>
              <li><strong>Q:</strong> File size limit? <strong>A:</strong> 10MB</li>
              <li><strong>Q:</strong> Which AI models are used? <strong>A:</strong> Any Model of our wish but by default we use Mistral via OpenRouter</li>
              <li><strong>Q:</strong> Is OCR accurate? <strong>A:</strong> Yes, with Tesseract OCR by Google</li>
            </ul>
          </Section>

          <Section id="contributors" title="Contributors">
            <ul className="list-disc list-inside">
              <li><a href="https://github.com/dharshan-kumarj">@dharshan-kumarj</a></li>
              <li><a href="https://github.com/ronnie-allen">@ronnie-allen</a></li>
              <li><a href="https://github.com/Aparna0224">@Aparna0224</a></li>
              <li><a href="https://github.com/Franz-kingstein">@Franz-kingstein</a></li>
              <li><a href="https://github.com/Danishprabhu04">@Danishprabhu04</a></li>
              <li><a href="https://github.com/Danishprabhu04">@Danishprabhu04</a></li>
              <li><a href="https://github.com/BaluK345">@BaluK345</a></li>
              <li><a href="https://github.com/ThirupathiS-45">@ThirupathiS-45</a></li>
            </ul>
          </Section>

          <Section id="license" title="License">
            <p>
              RULE is licensed under the <strong>MIT License</strong> — allowing commercial use,
              modifications, distribution, and private use. Liability and warranty are not included.
            </p>
          </Section>

          <Section id="contributing" title="Contributing">
            <ol className="list-decimal list-inside">
              <li>Fork the repo and create a feature branch</li>
              <li>Make your changes, test, and commit</li>
              <li>Push your branch and open a pull request</li>
            </ol>
            <p className="mt-2">Follow coding guidelines and update documentation for new features.</p>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <h2 className="text-3xl font-bold mb-6 text-black border-b-2 border-violet-600 pb-3">{title}</h2>
      <div className="text-gray-700 leading-relaxed text-lg">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-white/90 backdrop-blur-sm text-sm p-6 rounded-xl overflow-x-auto text-gray-800 border border-gray-200 shadow-sm">
      <code className="font-mono">{children}</code>
    </pre>
  );
}
