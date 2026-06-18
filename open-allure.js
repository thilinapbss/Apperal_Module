const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const reportPath = path.join(__dirname, 'allure-report', 'index.html');
const url = 'http://localhost:8000';

// Open browser
const openCommand = os.platform() === 'win32' ? 'start' : 'open';
setTimeout(() => {
  spawn(openCommand, [url], { shell: true });
  console.log(`✓ Opening report at ${url}`);
}, 1000);

// Start HTTP server
const server = spawn('npx', ['http-server', 'allure-report', '-p', '8000'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
