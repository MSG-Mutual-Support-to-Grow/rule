import Sidebar from './components/Sidebar';
import Section from './components/Section';

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />

       <main className="flex-1 overflow-y-auto p-10 space-y-16 bg-gradient-to-b from-white to-violet-200">
        <Section id="cover" title="Cover / Title">
          <h1 className="text-3xl font-bold">Project Proposal: Resume Understanding Language Engine</h1>
          <p className="mt-1 text-lg">AI-Powered Resume Parsing and Analysis System</p>
          <p className="text-sm mt-1">Date: 30/06/2025</p>
          <p className="mt-4 font-semibold">Team Members:</p>
          <ul className="list-disc ml-6">
            <li>Dharshan Kumar J – Backend Software Developer</li>
            <li>Ronnie A. Jeffrey – Systems Architect</li>
            <li>Danish Prabu – Backend Developer</li>
            <li>Aparna – UX Researcher</li>
            <li>Franz Kingstein N – OCR & Data Engineer</li>
          </ul>
        </Section>

        <Section id="introduction" title="1. Introduction">
          <p>Resume Parser is a comprehensive platform built to revolutionize how organizations handle resume screening and processing. Leveraging state-of-the-art Optical Character Recognition (OCR), Natural Language Processing (NLP), and Large Language Models (LLMs), our system bridges the gap between unstructured resume data and actionable insights.</p>
          <p className="mt-3">Recruiters often face hundreds, sometimes thousands, of applications for a single job role. Manually filtering these resumes is time-consuming, prone to bias, and inefficient. Our Resume Parser automates this task by reading and analyzing resumes, whether scanned or digitally generated, to produce structured summaries.</p>
          <p className="mt-3">The core innovation lies in combining traditional data extraction with modern LLM-based understanding. The system can identify and extract names, contact information, work experience, education, skills, certifications, and more. Furthermore, it goes beyond basic parsing by generating summaries, fit scores, and even job-role matching suggestions.</p>
          <p className="mt-3">Our system is also modular, scalable, and extensible. Each major component—text extraction, analysis, rendering, and output—is built independently, allowing upgrades and replacements without affecting other parts. This makes it ideal for enterprise-level deployment.</p>
          <p className="mt-3">With a commitment to security, the platform ensures all sensitive data is encrypted, stored securely, and access is strictly controlled. It supports integrations with popular ATS platforms and HR tools, making deployment and adoption straightforward for any organization.</p>
        </Section>

        <Section id="folders" title="2. File & Folder Descriptions">
          <p>The system’s architecture is built for clarity and modularity. Each folder has a specific responsibility and is loosely coupled with others.</p>
          <ul className="list-disc ml-6 mt-4 space-y-3">
            <li><strong>text_extract/</strong>: Contains Python modules and scripts for reading PDF files, running OCR (via EasyOCR), and preprocessing documents before parsing.</li>
            <li><strong>llm_prompts/</strong>: Stores reusable prompt templates and LLM configuration files. This abstraction allows switching between OpenAI, Mistral, or custom local LLMs.</li>
            <li><strong>analyze_resume/</strong>: Transforms raw extracted text into structured data using regex rules, NLP heuristics, and LLM-based classification. This is the intelligence core of the system.</li>
            <li><strong>outputs/</strong>: JSON files generated from the parsed resumes. These are indexed by timestamps and include versioning metadata, making audits easier.</li>
            <li><strong>frontend/</strong>: The React-based front-end application built with Vite and styled using Tailwind CSS. It supports resume uploads, previews, and JSON viewing.</li>
          </ul>
        </Section>

        <Section id="pipeline" title="3. Steps in the Pipeline">
          <p>The system processes each resume through a robust pipeline composed of four main stages:</p>
          <ol className="list-decimal ml-6 mt-3 space-y-2">
            <li><strong>Input:</strong> User uploads a PDF resume via the web interface. The system checks if the file is a native PDF or scanned image-based PDF.</li>
            <li><strong>Extraction:</strong> Based on PDF type, either pdfplumber or EasyOCR is used. OCR-based files are preprocessed to improve clarity, including grayscale conversion, binarization, and noise removal.</li>
            <li><strong>LLM Analysis:</strong> The clean text is passed to a language model (e.g., Mistral-7B) using structured prompts. The LLM extracts semantic features like skills, job roles, project domains, durations, and leadership indicators.</li>
            <li><strong>Output:</strong> A structured JSON file is generated and shown on the UI. It includes metadata such as extracted fields, confidence scores, timestamp, and version numbers.</li>
          </ol>
        </Section>

        <Section id="advantages" title="4. Advantages of the System">
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li><strong>Accuracy:</strong> Our multi-layered approach ensures higher accuracy in parsing resumes from diverse sources, including images with poor quality.</li>
            <li><strong>Scalability:</strong> Can process hundreds of resumes concurrently using batch workers and asynchronous pipelines.</li>
            <li><strong>LLM Adaptability:</strong> Supports plug-and-play integration of LLM providers. Swap out Mistral for Claude or DeepSeek with minimal code changes.</li>
            <li><strong>Modularity:</strong> Each component—OCR, Prompting, Parsing—is isolated and versioned.</li>
            <li><strong>Structured Output:</strong> JSON format ensures compatibility with modern ATS and HR tools.</li>
            <li><strong>Insightful Summaries:</strong> Generates summaries that help recruiters assess cultural fit and role alignment, not just keyword matches.</li>
          </ul>
        </Section>

        <Section id="future" title="5. Future Improvements">
          <p className="mb-2">The following improvements are under active development and represent strategic directions for the product roadmap:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Batch Uploads:</strong> A dashboard that supports multi-resume uploads, job-based segregation, and background processing.</li>
            <li><strong>Interactive Resume Feedback:</strong> Allow candidates to get real-time suggestions to improve their resumes based on industry standards.</li>
            <li><strong>Multi-language Support:</strong> Add OCR and parsing support for Hindi, French, German, and Spanish resumes.</li>
            <li><strong>Enterprise Analytics Dashboard:</strong> Metrics for recruiters such as most common skills, education trends, and hiring pipeline bottlenecks.</li>
            <li><strong>AI-based Scoring:</strong> Combine job descriptions and resume scores to recommend top candidates automatically.</li>
            <li><strong>Fine-tuned OCR:</strong> Train OCR on specific Indian university formats, noisy scans, and handwritten CVs.</li>
          </ul>
        </Section>

        <Section id="faq" title="6. Frequently Asked Questions (FAQ)">
          <dl className="ml-6 space-y-3">
            <dt><strong>What file formats are supported?</strong></dt>
            <dd>Currently only PDF. DOCX and image formats will be supported in the next release.</dd>

            <dt><strong>How are scanned resumes handled?</strong></dt>
            <dd>With OCR (EasyOCR) + preprocessing techniques such as thresholding and denoising.</dd>

            <dt><strong>Is the system compatible with ATS platforms?</strong></dt>
            <dd>Yes. The structured JSON output integrates seamlessly with Greenhouse, Lever, and other major ATS.</dd>

            <dt><strong>Can the parser understand resumes in non-English languages?</strong></dt>
            <dd>Currently limited to English. Multilingual support is on the roadmap.</dd>

            <dt><strong>What security practices are followed?</strong></dt>
            <dd>Role-based access control, encryption at rest and in transit, audit logging, and GDPR compliance.</dd>

            <dt><strong>Can the system match resumes to job descriptions?</strong></dt>
            <dd>Yes. A prompt-based job-role alignment module scores candidates against uploaded job descriptions.</dd>
          </dl>
        </Section>
      </main>
    </div>
  );
}
