import React from 'react';

const sections: [string, string][] = [
  ['cover', 'Cover / Title'],
  ['introduction', '1. Introduction'],
  ['folders', '2. File & Folder Descriptions'],
  ['pipeline', '3. Steps in the Pipeline'],
  ['advantages', '4. Advantages of the System'],
  ['future', '5. Future Improvements'],
  ['faq', '6. Frequently Asked Questions'],
];

export default function Sidebar() {
  return (
<aside className="w-64 h-screen bg-gradient-to-b from-white to-violet-200 backdrop-blur-md border-r border-gray-200 shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">Documentation</h2>
      <nav className="flex flex-col space-y-2 text-sm font-medium text-gray-700">
  {sections.map(([id, label]) => (
    <div
      key={id}
      className="rounded-lg border border-gray-200 bg-white/30 px-3 py-2 hover:border-violet-400 transition"
    >
      <a
        href={`#${id}`}
        className="block w-full hover:text-violet-700"
      >
        {label}
      </a>
    </div>
  ))}
</nav>

    </aside>
  );
}
