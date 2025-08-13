import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="relative group">
      <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
        {children}
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
      >
        {isCopied ? (
          <>
            <Check size={16} className="mr-1" />
            Copied
          </>
        ) : (
          <Copy size={16} />
        )}
      </button>
    </div>
  );
};

export default CodeBlock;
