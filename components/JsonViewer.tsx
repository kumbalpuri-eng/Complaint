
import React from 'react';

interface JsonViewerProps {
  data: object;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <div className="bg-slate-900/70 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
      <pre className="text-xs text-slate-300 p-4 font-mono">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
};

export default JsonViewer;
