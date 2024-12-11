import { spawn } from 'child_process';
import chokidar from 'chokidar';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let serverProcess = null;

function startServer() {
  if (serverProcess) {
    serverProcess.kill();
  }

  console.log('\n🔄 Starting server...');
  
  serverProcess = spawn('node', ['server/index.js'], {
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
  });

  serverProcess.on('exit', (code, signal) => {
    if (signal !== 'SIGTERM') {
      console.error(`Server process exited with code ${code}`);
    }
  });
}

// Watch server directory for changes
const watcher = chokidar.watch('server/**/*.{js,mjs,cjs,json}', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  cwd: process.cwd(),
  ignoreInitial: true
});

watcher
  .on('ready', () => {
    console.log('👀 Watching server files for changes...');
    startServer();
  })
  .on('change', (path) => {
    console.log(`\n📝 ${path} changed. Restarting server...`);
    startServer();
  })
  .on('error', error => console.error('Watcher error:', error));

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit();
});