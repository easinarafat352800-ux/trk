const fs = require('fs');
const path = require('path');

const required = ['package.json', 'server.js', 'local-db.js', 'frontend_with_backend.html', 'render.yaml'];
for (const file of required) {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.error('Missing:', file);
    process.exit(1);
  }
}
console.log('Deployment files OK.');
