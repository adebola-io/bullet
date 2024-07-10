import fs from 'node:fs';
import { exec } from 'node:child_process';

if (fs.existsSync('types')) {
  console.log('Removing types directory...');
  fs.rmSync('types', { recursive: true, force: true });
  console.log('Done!');
}
fs.writeFileSync(
  'index.js',
  fs
    .readFileSync('index.js', 'utf8')
    .replace('/// <reference path="./types/index.d.ts" />', '')
);

exec('npx tsc --project jsconfig.json', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);

  fs.writeFileSync(
    'index.js',
    `/// <reference path="./types/index.d.ts" />
${fs.readFileSync('index.js', 'utf8')}`
  );
});
