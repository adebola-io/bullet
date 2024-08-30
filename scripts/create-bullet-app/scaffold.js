#!/usr/bin/env node
/// <reference types="node" />

import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import semver from 'semver';
import { createPromptModule } from 'inquirer';
import readline from 'node:readline';
import process from 'node:process';
import gradient from 'gradient-string';

// Configuration
const CONFIG = {
  minNodeVersion: '14.0.0',
  directories: [
    'public',
    'public/icons',
    'source',
    'source/styles',
    'source/components',
  ],
  dependencies: {
    '@adbl/bullet': '^0.0.22',
    '@adbl/cells': '^0.0.2',
  },
  devDependencies: {
    vite: '^5.4.1',
    typescript: '^5.5.2',
    tailwindcss: '^3.4.10',
    autoprefixer: '^10.4.20',
    postcss: '^8.4.4',
    sass: '^1.72.0',
  },
};

const args = process.argv.slice(2);

/** @type {any} */
const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: chalk.magenta('What is the name of your project?'),
    default: 'my-bullet-app',
    validate: (input) =>
      /^[a-z0-9-]+$/.test(input) ||
      chalk.red(
        'Project name can only contain lowercase letters, numbers, and hyphens'
      ),
    when: () => args.length === 0 || args.every((arg) => arg.startsWith('-')), // Only ask if not provided as an argument
  },
  {
    type: 'confirm',
    name: 'useTailwind',
    message: chalk.magenta('Do you want to use Tailwind CSS?'),
    default: true,
  },
  {
    type: 'list',
    name: 'cssPreprocessor',
    message: chalk.magenta('Which CSS preprocessor would you like to use?'),
    choices: ['SCSS', 'CSS'],
    default: 'SCSS',
  },
  {
    type: 'list',
    name: 'language',
    message: chalk.magenta('Which language would you like to use?'),
    choices: ['TypeScript', 'JavaScript'],
    default: 'TypeScript',
  },
  {
    type: 'confirm',
    name: 'useRouter',
    message: chalk.magenta('Do you want to use the Bullet router?'),
    default: true,
  },
  {
    type: 'input',
    name: 'namespace',
    message: chalk.magenta(
      'Specify an app namespace (leave empty for default):'
    ),
    default: '',
  },
];

async function main() {
  let projectDir;
  try {
    checkNodeVersion();

    // Check for -y flag
    const skipInitialPrompt = process.argv.includes('-y');

    if (!skipInitialPrompt) {
      await displayWelcomeBanner();
    }

    // Get project name from command line argument or prompt
    const projectName = args.find((arg) => !arg.startsWith('-'));

    /** @type {Record<string, any>} */
    const answers = {};
    const questionsToAsk = questions;

    if (projectName) {
      // If project name is provided as an argument, skip the project name question
      console.log(chalk.cyan(`Using project name: ${projectName}`));
      answers.projectName = projectName;
    }

    // Create a custom prompt module that suppresses output
    const prompt = createPromptModule({ output: process.stdout });
    // Use the custom prompt for all questions
    for (const [key, value] of Object.entries(await prompt(questionsToAsk))) {
      answers[key] = value;
    }

    projectDir = path.join(process.cwd(), answers.projectName);

    const spinner = ora({
      text: 'Creating project structure...',
      spinner: 'aesthetic',
      color: 'cyan',
    }).start();

    await createProjectStructure(projectDir, answers);
    await initializeGit(projectDir);

    spinner.succeed(
      chalk.green(`Project ${answers.projectName} created successfully!`)
    );

    displayCompletionMessage(answers.projectName);
  } catch (error) {
    if (error.isTtyError) {
      console.error(
        chalk.red("Prompt couldn't be rendered in the current environment")
      );
    } else if (error.name === 'UserQuitError') {
      console.log(chalk.yellow('\nProject creation cancelled.'));
    } else {
      console.error(chalk.red('An error occurred:'), error);
    }
    await cleanupProject(projectDir);
  }
}

function checkNodeVersion() {
  const currentVersion = process.version;
  if (semver.lt(currentVersion, CONFIG.minNodeVersion)) {
    throw new Error(
      `Node.js version ${CONFIG.minNodeVersion} or higher is required. Current version: ${currentVersion}`
    );
  }
}

async function createProjectStructure(projectDir, answers) {
  await fs.mkdir(projectDir, { recursive: true });

  for (const dir of CONFIG.directories) {
    await fs.mkdir(path.join(projectDir, dir), { recursive: true });
  }

  if (answers.useRouter) {
    await fs.mkdir(path.join(projectDir, 'source/pages'), { recursive: true });
  }

  await Promise.all([
    createIndexHtml(projectDir, answers),
    createViteConfig(projectDir, answers),
    createSetupFile(projectDir, answers),
    createStyleFiles(projectDir, answers),
    createMainFile(projectDir, answers),
    createRouterFile(projectDir, answers),
    createPackageJson(projectDir, answers),
    createAppComponent(projectDir, answers),
    createConfigFile(projectDir, answers),
  ]);

  if (answers.useTailwind) {
    await createPostcssConfig(projectDir);
  }
}

async function initializeGit(projectDir) {
  try {
    execSync('git init', { cwd: projectDir, stdio: 'ignore' });
    await fs.writeFile(
      path.join(projectDir, '.gitignore'),
      'node_modules\ndist\n.DS_Store'
    );
  } catch (error) {
    console.warn(
      chalk.yellow(
        'Failed to initialize git repository. You can do it manually later.'
      )
    );
  }
}

async function cleanupProject(projectDir) {
  if (projectDir) {
    try {
      await fs.rm(projectDir, { recursive: true, force: true });
      console.log(
        chalk.yellow('Cleaned up partially created project directory.')
      );
    } catch (error) {
      console.error(chalk.red('Failed to clean up project directory:'), error);
    }
  }
}

async function createIndexHtml(projectDir, answers) {
  const extension = answers.language === 'TypeScript' ? 'ts' : 'js';
  const styleExtension = answers.cssPreprocessor === 'SCSS' ? 'scss' : 'css';
  const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bullet App</title>
    <link rel="stylesheet" href="/source/styles/base.${styleExtension}">
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/source/main.${extension}"></script>
  </body>
</html>
  `.trim();

  await fs.writeFile(path.join(projectDir, 'index.html'), content);
}

async function createViteConfig(projectDir, answers) {
  const extension = answers.language === 'TypeScript' ? 'ts' : 'js';
  const content = `
import { defineConfig } from 'vite';
import { bullet } from '@adbl/bullet/library/plugin';
import path from 'node:path';

export default defineConfig({
  plugins: [bullet()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './source'),
    },
  },
});
  `.trim();

  await fs.writeFile(
    path.join(projectDir, `vite.config.${extension}`),
    content.trim()
  );
}

async function createPostcssConfig(projectDir) {
  const content = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  await fs.writeFile(
    path.join(projectDir, 'postcss.config.js'),
    content.trim()
  );
}

async function createSetupFile(projectDir, answers) {
  const extension = answers.language === 'TypeScript' ? 'ts' : 'js';
  const styleExtension = answers.cssPreprocessor === 'SCSS' ? 'scss' : 'css';
  let content = `
import { setup, css } from "@adbl/bullet";
import sharedStyles from "./styles/shared.${styleExtension}?inline";
import animations from "./styles/animations.${styleExtension}?inline";
`;

  if (answers.useTailwind) {
    content += `import tailwindStyles from './styles/tailwind.${styleExtension}?inline';\n`;
  }

  content += `

export const { createElement } = setup({
  ${answers.namespace ? `namespace: "${answers.namespace}",` : ''}
  styles: css([
    ${answers.useTailwind ? 'tailwindStyles, ' : ''}
    sharedStyles,
    animations
  ])
});
`;

  await fs.writeFile(
    path.join(projectDir, `source/setup.${extension}`),
    content.trim()
  );
}

async function createStyleFiles(projectDir, answers) {
  const extension = answers.cssPreprocessor === 'SCSS' ? 'scss' : 'css';

  // Create base styles file
  const baseContent = `
:root {
  --primary-color: #646cff;
  --background-color: #242424;
  --text-color: rgba(255, 255, 255, 0.87);
  --font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

body {
  font-family: var(--font-family);
  line-height: 1.5;
  font-weight: 400;
  color: var(--text-color);
  background-color: var(--background-color);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}
  `.trim();

  await fs.writeFile(
    path.join(projectDir, `source/styles/base.${extension}`),
    baseContent
  );

  await fs.writeFile(
    path.join(projectDir, `source/styles/shared.${extension}`),
    '/* Shared styles */\n'
  );

  const animationsContent = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); }
  to { transform: translateY(0); }
}

@keyframes underlineExpand {
  from { width: 0; }
  to { width: 100%; }
}

.animate-fade-up {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards, slideIn 0.5s ease-out forwards;
}

.animate-underline {
  position: relative;
  display: inline-block;
}

.animate-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 2px;
  width: 0;
  background-color: currentColor;
  animation: underlineExpand 0.5s ease-out 0.3s forwards;
  transform: translateY(6px);
}
  `;

  await fs.writeFile(
    path.join(projectDir, `source/styles/animations.${extension}`),
    animationsContent
  );

  if (answers.useTailwind) {
    const tailwindContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

    await fs.writeFile(
      path.join(projectDir, `source/styles/tailwind.${extension}`),
      tailwindContent.trim()
    );

    const tailwindConfigContent = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./source/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    await fs.writeFile(
      path.join(projectDir, 'tailwind.config.js'),
      tailwindConfigContent.trim()
    );
  }
}

/**
 * @param {string} projectDir
 * @param {{ language: string; useRouter: any; }} answers
 */
async function createMainFile(projectDir, answers) {
  const extension = answers.language === 'TypeScript' ? 'ts' : 'js';
  let content = `
/// <reference types="vite/client" />

`;

  if (answers.useRouter) {
    content += `
import router from './router';

document.getElementById('app')?.appendChild(router.Outlet());
    `;
  } else {
    content += `
import { App } from './App';

document.getElementById('app')?.appendChild(App());
    `;
  }

  await fs.writeFile(
    path.join(projectDir, `source/main.${extension}`),
    content.trim()
  );
}

async function createRouterFile(projectDir, answers) {
  if (!answers.useRouter) {
    return;
  }

  const extension = answers.language === 'TypeScript' ? 'ts' : 'js';
  const content = `
import { createWebRouter } from '@adbl/bullet';
import { homeRoutes } from './pages/home/routes';

const routes = [
  {
    name: 'App',
    path: '/',
    redirect: '/home',
    children: [
      ...homeRoutes,
    ],
  },
];

export default createWebRouter({ routes });
  `.trim();

  await fs.writeFile(
    path.join(projectDir, `source/router.${extension}`),
    content
  );

  // Create home view structure
  await createViewStructure(projectDir, 'home', answers);
}

async function createViewStructure(projectDir, viewName, answers) {
  const extension = answers.language === 'TypeScript' ? 'tsx' : 'jsx';
  const styleExtension = answers.cssPreprocessor === 'SCSS' ? 'scss' : 'css';

  const viewDir = path.join(projectDir, `source/pages/${viewName}`);
  await fs.mkdir(viewDir, { recursive: true });

  let indexContent = `
import { createElement } from '@/setup';
`;

  if (!answers.useTailwind) {
    indexContent += `
import { css } from "@adbl/bullet";
import styles from './styles.${styleExtension}?inline';
`;
  }

  indexContent += `
   
export default createElement({
  tag: '${viewName}-view',
  ${answers.useTailwind ? '' : 'styles: css(styles),'}
  render: () => (
    <div class="${
      answers.useTailwind
        ? 'min-h-screen flex items-center justify-center'
        : `${viewName}-view`
    }">
      <main class="${
        answers.useTailwind ? 'max-w-7xl mx-auto p-8 text-center' : ''
      }">
        <h1 class="${
          answers.useTailwind ? 'text-5xl font-bold mb-4' : ''
        } animate-fade-up">
          <span class="animate-underline">Welcome to Your Bullet App</span>
        </h1>
        <p class="${
          answers.useTailwind ? 'mb-8' : ''
        } animate-fade-up" style="animation-delay: 0.2s;">You're viewing the ${capitalizeFirstLetter(
    viewName
  )} page</p>
        <div class="${
          answers.useTailwind ? 'mb-8' : 'card'
        } animate-fade-up" style="animation-delay: 0.4s;">
          <button 
            type="button"
            onClick={() => alert('Bullet is awesome!')}
            class="${
              answers.useTailwind
                ? 'bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors'
                : ''
            }"
          >
            Click me
          </button>
        </div>
        <p class="${
          answers.useTailwind ? 'text-gray-500' : 'read-the-docs'
        } animate-fade-up" style="animation-delay: 0.6s;">
          Check out the <a href="https://github.com/adebola-io/bullet" target="_blank" rel="noopener noreferrer" class="${
            answers.useTailwind ? 'text-blue-500' : ''
          } animate-underline">Bullet documentation</a> to learn more
        </p>
      </main>
    </div>
  ),
});
  `.trim();

  await fs.writeFile(path.join(viewDir, `index.${extension}`), indexContent);

  if (!answers.useTailwind) {
    const stylesContent = `
.${viewName}-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
    margin-bottom: 1rem;
  }

  .card {
    padding: 2em;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    color: #ffffff;
    cursor: pointer;
    transition: border-color 0.25s;
  }

  button:hover {
    border-color: #646cff;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  .read-the-docs {
    color: #888;
    margin-top: 2rem;
  }

  a {
    color: #646cff;
    text-decoration: inherit;
  }
}
`;

    await fs.writeFile(
      path.join(viewDir, `styles.${styleExtension}`),
      stylesContent
    );
  }

  const routesContent = `
import { defineRoutes, lazy } from '@adbl/bullet';

export const homeRoutes = defineRoutes([
  {
    name: 'Home View',
    path: '/home',
    component: lazy(() => import('./index')),
  },
]);
  `.trim();

  const extensionBase = answers.language === 'TypeScript' ? 'ts' : 'js';
  await fs.writeFile(
    path.join(viewDir, `routes.${extensionBase}`),
    routesContent
  );
}

async function createPackageJson(projectDir, answers) {
  const content = {
    name: answers.projectName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies: CONFIG.dependencies,
    devDependencies: {
      vite: CONFIG.devDependencies.vite,
    },
  };

  if (answers.language === 'TypeScript') {
    content.devDependencies.typescript = CONFIG.devDependencies.typescript;
  }

  if (answers.useTailwind) {
    content.devDependencies.tailwindcss = CONFIG.devDependencies.tailwindcss;
    content.devDependencies.autoprefixer = CONFIG.devDependencies.autoprefixer;
    content.devDependencies.postcss = CONFIG.devDependencies.postcss;
  }

  if (answers.cssPreprocessor === 'SCSS') {
    content.devDependencies.sass = CONFIG.devDependencies.sass;
  }

  await fs.writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(content, null, 2)
  );
}

async function createAppComponent(projectDir, answers) {
  if (answers.useRouter) return; // Only create App component if not using router

  const extension = answers.language === 'TypeScript' ? 'tsx' : 'jsx';
  const styleExtension = answers.cssPreprocessor === 'SCSS' ? 'scss' : 'css';

  let content = `
import { createElement } from '@/setup';
`;

  if (!answers.useTailwind) {
    content += `import styles from './App.${styleExtension}';\n`;
  }

  content += `
  
export const App = createElement({
  tag: 'app-root',
  ${answers.useTailwind ? '' : 'styles,'}
  render: () => (
    <div class="${
      answers.useTailwind
        ? 'min-h-screen flex items-center justify-center'
        : 'app'
    }">
      <main class="${
        answers.useTailwind ? 'max-w-7xl mx-auto p-8 text-center' : ''
      }">
        <h1 class="${
          answers.useTailwind ? 'text-5xl font-bold mb-4' : ''
        } animate-fade-up">
          <span class="animate-underline">Welcome to Your Bullet App</span>
        </h1>
        <p class="${
          answers.useTailwind ? 'mb-8' : ''
        } animate-fade-up" style="animation-delay: 0.2s;">You're all set to start building amazing things!</p>
        <div class="${
          answers.useTailwind ? 'mb-8' : 'card'
        } animate-fade-up" style="animation-delay: 0.4s;">
          <button 
            type="button"
            onClick={() => alert('Bullet is awesome!')}
            class="${
              answers.useTailwind
                ? 'bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors'
                : ''
            }"
          >
            Click me
          </button>
        </div>
        <p class="${
          answers.useTailwind ? 'text-gray-500' : 'read-the-docs'
        } animate-fade-up" style="animation-delay: 0.6s;">
          Check out the <a href="https://github.com/adebola-io/bullet" target="_blank" rel="noopener noreferrer" class="${
            answers.useTailwind ? 'text-blue-500' : ''
          } animate-underline">Bullet documentation</a> to get started
        </p>
      </main>
    </div>
  ),
});
  `.trim();

  await fs.writeFile(path.join(projectDir, `source/App.${extension}`), content);

  if (!answers.useTailwind) {
    const stylesContent = `
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #ffffff;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.read-the-docs {
  color: #888;
  margin-top: 2rem;
}

a {
  color: #646cff;
  text-decoration: inherit;
}
  `.trim();

    await fs.writeFile(
      path.join(projectDir, `source/App.${styleExtension}`),
      stylesContent
    );
  }
}

async function createConfigFile(projectDir, answers) {
  const isTypeScript = answers.language === 'TypeScript';
  const fileName = isTypeScript ? 'tsconfig.json' : 'jsconfig.json';
  const content = {
    compilerOptions: {
      target: 'ESNext',
      useDefineForClassFields: true,
      module: 'ESNext',
      lib: ['ESNext', 'DOM', 'DOM.Iterable'],
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      jsx: 'preserve',
      types: ['@adbl/bullet/library/jsx-runtime'],
      baseUrl: '.',
      paths: {
        '@/*': ['./source/*'],
      },
    },
    include: ['source'],
  };

  if (isTypeScript) {
    content.compilerOptions.skipLibCheck = true;
  }

  await fs.writeFile(
    path.join(projectDir, fileName),
    JSON.stringify(content, null, 2)
  );
}

async function displayWelcomeBanner() {
  const renderBanner = (width) => {
    console.clear();
    const bannerWidth = width - 2;
    const content = 'BULLET CLI v0.0.1';
    const paddingSize = Math.max(
      0,
      Math.floor((bannerWidth - content.length) / 2)
    );
    const padding = ' '.repeat(paddingSize);

    console.log(chalk.cyan(`┌${'─'.repeat(bannerWidth)}┐`));
    console.log(chalk.cyan(`│${' '.repeat(bannerWidth)}│`));
    console.log(
      chalk.cyan('│') +
        padding +
        gradient('orange', 'pink')(content) +
        padding +
        (bannerWidth % 2 !== content.length % 2 ? ' ' : '') +
        chalk.cyan('│')
    );
    console.log(chalk.cyan(`│${' '.repeat(bannerWidth)}│`));
    console.log(chalk.cyan(`└${'─'.repeat(bannerWidth)}┘\n`));

    console.log(
      chalk.bold.blue('Welcome to the Bullet Project Scaffolding Tool ✨\n')
    );
  };

  renderBanner(process.stdout.columns || 80);

  // Watch for terminal resize events
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  return new Promise(
    /** @type {() => void} */ (resolve) => {
      process.stdout.on('resize', () => {
        renderBanner(process.stdout.columns || 80);
      });

      // Handle Ctrl+C
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\nProcess terminated. Exiting...'));
        process.exit(0);
      });

      // Wait for user input to continue
      process.stdin.on('keypress', (str, key) => {
        if (key.name === 'return' || key.name === 'enter') {
          cleanup();
          resolve();
        } else if (key.ctrl && key.name === 'c') {
          console.log(chalk.yellow('\nProcess terminated. Exiting...'));
          process.exit(0);
        }
      });

      console.log(chalk.yellow('Press Enter to continue or Ctrl+C to exit...'));
    }
  );
}

function cleanup() {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
  process.stdin.removeAllListeners('keypress');
  process.stdout.removeAllListeners('resize');
  process.removeAllListeners('SIGINT');
}

function displayCompletionMessage(projectName) {
  console.log(chalk.green('\n✨ Your project is ready! ✨'));
  console.log(chalk.yellow('\nNext steps:'));
  console.log(chalk.cyan('1. Navigate to your project folder:'));
  console.log(chalk.white(`   cd ${projectName}`));
  console.log(chalk.cyan('2. Install project dependencies:'));
  console.log(chalk.white('   npm install'));
  console.log(chalk.cyan('3. Start the development server:'));
  console.log(chalk.white('   npm run dev'));
  console.log(chalk.cyan('4. Open your browser and visit:'));
  console.log(chalk.white('   http://localhost:5173'));
  console.log(
    chalk.cyan(`5. Begin editing your project files in the 'source' directory`)
  );
  console.log(chalk.cyan('6. To build for production, run:'));
  console.log(chalk.white('   npm run build'));
  console.log(chalk.blue('\nHappy coding with Bullet! 🚀'));
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

main().catch(() => process.exit(1));
