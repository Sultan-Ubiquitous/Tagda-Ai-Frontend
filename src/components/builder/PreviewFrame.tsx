import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

  async function main() {
    // Install dependencies
    const installProcess = await webContainer.spawn('npm', ['install']);
    
    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log(data);
      }
    }));

    // Wait for install to complete
    const installExitCode = await installProcess.exit;
    
    if (installExitCode !== 0) {
      console.error('Installation failed');
      return;
    }

    console.log('Installation complete');

    // Set up server-ready listener BEFORE starting the server
    webContainer.on('server-ready', (port, url) => {
      console.log('Server ready on port:', port);
      console.log('Server URL:', url);
      setUrl(url);
    });

    console.log('Starting dev server...');
    
    // Start the dev server (don't await - it's a long-running process)
    const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
    
    // Optional: pipe output to see what's happening
    devProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log(data);
      }
    }));
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && (
        <div className="text-center">
          <p className="mb-2">Loading...</p>
        </div>
      )}
      {url && <iframe width="100%" height="100%" src={url} />}
    </div>
  );
}