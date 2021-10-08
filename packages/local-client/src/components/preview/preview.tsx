import React, { useRef } from 'react';
import { useEffect } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  bundlingError: string;
}

const html = `
    <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime error</h4>' + err + '</div>';
          console.error(err);
        }

        // for async errors
        window.addEventListener('error', (event) => {
          // make sure the browser doesn't print error
          event.preventDefault();
          handleError(event.error);
        })

        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch(err) {
            handleError(err)
          }
        }, false)
      </script>
    </body>
    </html>
  `;

export const Preview: React.FC<PreviewProps> = ({ code, bundlingError }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    iframeRef.current.srcdoc = html;
    setTimeout(
      () => iframeRef.current?.contentWindow?.postMessage(code, '*'),
      50
    );
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframeRef}
        srcDoc={html}
        title="preview"
        sandbox="allow-scripts"
      />

      {bundlingError && <div className="preview-error">{bundlingError}</div>}
    </div>
  );
};
