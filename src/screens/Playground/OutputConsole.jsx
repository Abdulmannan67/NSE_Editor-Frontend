import React from 'react';
import { Console, Header } from './InputConsole';
import { BiExport } from 'react-icons/bi';

const OutputConsole = ({ logs, applicationId, jobId, isSubmitting, language }) => {
  const YARN_UI_BASE_URL = 'http://localhost:8088';

  const viewYarnApplication = () => {
    if (applicationId) {
      const yarnUrl = `${YARN_UI_BASE_URL}/cluster/app/${applicationId}`;
      window.open(yarnUrl, '_blank');
    }
  };

  let parsedData = null;
  let parsingError = null;

  // Parse Hive/Impala output if applicable
  if (logs.length > 0 && (language === 'Impala' || language === 'hiveQL')) {
    try {
      parsedData = parseBeelineTable(logs[0]); // Parse the single log entry
    } catch (err) {
      parsingError = err.message;
    }
  }

  return (
    <Console>
      <Header>
      {applicationId ? (
  <span 
    style={{ cursor: 'pointer', marginRight: '10px' }} 
    onClick={viewYarnApplication}
  >
    <BiExport /> View YARN Application
  </span>
) : (
  <>
    <BiExport />Output
  </>
)}

        
          
        
      </Header>

      <div
        style={{
          padding: '10px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          maxHeight: '500px',
          overflowY: 'auto',
          maxWidth: '100%', // Constrain width to parent
          overflowX: 'auto', // Enable horizontal scrolling
          wordBreak: 'break-word', // Break long words if needed
        }}
      >
        {logs.length > 0 ? (
          language === 'Impala' || language === 'hiveQL' ? (
            parsedData ? (
              <div style={{ overflowX: 'auto' }}>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {parsedData.headers.map((header, index) => (
                        <th key={index} style={{ padding: '8px', background: '#444', color: '#fff' }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex} style={{ padding: '8px', textAlign: 'center' }}>
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ color: log.startsWith('Error:') ? 'red' : 'inherit' }}>
                  {log}
                </div>
              ))
            )
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ color: log.startsWith('[ERROR]') || log.startsWith('Error:') ? 'red' : 'inherit' }}>
                {log}
              </div>
            ))
          )
        ) : isSubmitting ? (
          'Running...'
        ) : (
          'No output yet'
        )}
      </div>
    </Console>
  );
};

// Function to parse Beeline/Impala output
const parseBeelineTable = (output) => {
  if (!output || typeof output !== 'string' || output.trim() === '') throw new Error('Invalid output');

  const lines = output.split('\n').map(line => line.trim()).filter(line => line);
  const headerIndex = lines.findIndex(line => line.startsWith('|') || line.startsWith('+'));
  if (headerIndex === -1 || headerIndex + 1 >= lines.length) throw new Error('No table structure');

  const headerLine = lines[headerIndex].startsWith('+') ? lines[headerIndex + 1] : lines[headerIndex];
  const headers = headerLine
    .split('|')
    .map(h => h.trim())
    .filter(h => h);

  const dataRows = lines.slice(headerIndex + (lines[headerIndex].startsWith('+') ? 3 : 2), -1).filter(row => !row.startsWith('+'));
  if (dataRows.length === 0) throw new Error('No data found');

  const tableData = dataRows.map(row => {
    const values = row.split('|').map(v => v.trim()).filter(v => v);
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });

  return { headers, tableData };
};

export default OutputConsole;