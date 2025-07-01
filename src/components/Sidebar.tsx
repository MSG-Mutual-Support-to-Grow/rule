import React, { useState } from 'react';

const sections: [string, string][] = [
  ['cover', 'Cover / Title'],
  ['introduction', '1. Introduction'],
  ['folders', '2. File & Folder Descriptions'],
  ['snapshots', '3.Snapshots'],
  ['pipeline', '4. Steps in the Pipeline'],
  ['advantages', '5. Advantages of the System'],
  ['future', '6. Future Improvements'],
  ['faq', '7. Frequently Asked Questions'],
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow z-50 p-1 flex justify-between items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="text-violet-600 font-semibold px-3 py-1 border border-violet-300 rounded-md"
        >
          Menu
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gradient-to-b from-white to-violet-200 backdrop-blur-md border-r border-gray-200 shadow-md p-6 space-y-4 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        {/* Close button only on mobile */}
        <div className="md:hidden flex justify-end mb-2">
          <button
            onClick={() => setIsOpen(false)}
            className="text-sm text-gray-600 hover:text-violet-600"
          >
            ✕ Close
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
          Documentation
        </h2>

        <nav className="flex flex-col space-y-2 text-sm font-medium text-gray-700">
          {sections.map(([id, label]) => (
            <div
              key={id}
              className="rounded-lg border border-gray-200 bg-white/30 px-3 py-2 hover:border-violet-400 transition"
            >
              <a
                href={`#${id}`}
                className="block w-full hover:text-violet-700"
                onClick={() => setIsOpen(false)} // auto-close drawer
              >
                {label}
              </a>
            </div>
          ))}
        </nav>
      </div>

      {/* Background overlay (optional) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
