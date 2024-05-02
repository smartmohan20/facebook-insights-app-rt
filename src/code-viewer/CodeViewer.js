import React from 'react';

const JsonViewer = ({ data }) => {
  const jsonDataString = JSON.stringify(data, null, 2);

  return (
    <div style={{ width: '100%', height: '300px', overflow: 'auto', whiteSpace: 'nowrap' }}>
      <textarea
        style={{ width: '100%', height: '100%', resize: 'none', fontFamily: 'monospace' }}
        value={jsonDataString}
        readOnly={true}
      />
    </div>
  );
};

export default JsonViewer;
