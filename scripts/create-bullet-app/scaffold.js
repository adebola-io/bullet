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
    '@adbl/bullet': 'latest',
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
    message: chalk.magenta('Which styling language would you like to use?'),
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
    type: 'confirm',
    name: 'useCells',
    message: chalk.italic.green(
      'Add @adbl/cells for fine-grained reactivity? ✨'
    ),
    default: true,
  },
  {
    type: 'input',
    name: 'namespace',
    message: chalk.magenta(
      'Specify a namespace for your custom elements (leave empty for default):'
    ),
    default: '',
  },
  {
    type: 'confirm',
    name: 'useCartridge',
    message: chalk.magenta(
      '(Experimental) Do you want to prerender pages on the server?'
    ),
    default: false,
    when: (answers) => answers.useRouter,
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
    createBulletIcon(projectDir),
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

  if (answers.useCartridge) {
    await createCartridgeConfig(projectDir, answers);
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
    <link rel="icon" type="image/svg+xml" href="/bullet.svg" />
    <link rel="stylesheet" href="/source/styles/base.${styleExtension}">
     <!-- app-head -->
  </head>
  <body>
    <div id="app">
      <!-- app-html -->
    </div>
    <script type="module" src="/source/main.${extension}"></script>
  </body>
</html>
  `.trim();

  await fs.writeFile(path.join(projectDir, 'index.html'), content);
}

async function createBulletIcon(projectDir) {
  const icon = `<svg width="191" height="191" viewBox="0 0 191 191" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_7_2)">
        <g clip-path="url(#clip1_7_2)">
            <rect x="4" y="4" width="183" height="183" rx="32.1636" fill="url(#paint0_linear_7_2)" />
            <line x1="244.452" y1="12.1822" x2="17.9893" y2="238.645" stroke="white" stroke-width="14" />
            <line x1="148.412" y1="-22.2431" x2="-78.0502" y2="204.219" stroke="white" stroke-width="14" />
            <ellipse cx="31.7881" cy="167.788" rx="49.349" ry="49.3467" transform="rotate(134.826 31.7881 167.788)"
                fill="white" />
        </g>
        <rect x="9.435" y="9.435" width="172.13" height="172.13" rx="26.7286" stroke="white" stroke-width="10.87" />
    </g>
    <rect x="2" y="2" width="187" height="187" rx="34.15" stroke="#355FAC" stroke-width="4" />
    <defs>
        <linearGradient id="paint0_linear_7_2" x1="95.5" y1="4" x2="95.5" y2="187" gradientUnits="userSpaceOnUse">
            <stop stop-color="#538ACA" />
            <stop offset="1" stop-color="#04187C" />
        </linearGradient>
        <clipPath id="clip0_7_2">
            <rect x="4" y="4" width="183" height="183" rx="32.15" fill="white" />
        </clipPath>
        <clipPath id="clip1_7_2">
            <rect x="4" y="4" width="183" height="183" rx="32.1636" fill="white" />
        </clipPath>
    </defs>
</svg>`;
  await fs.writeFile(path.join(projectDir, 'public', 'bullet.svg'), icon);
}

async function createViteConfig(projectDir, answers) {
  const extension = answers.language === 'TypeScript' ? 'ts' : 'js';
  const content = `
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  ${!answers.useCartridge ? 'plugins: [bullet()],\n' : ''}
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
`;

  if (answers.useTailwind) {
    content += `import tailwindStyles from './styles/tailwind.${styleExtension}?inline';\n`;
  }

  content += `

export const { createElement } = setup({
  ${answers.namespace ? `namespace: "${answers.namespace}",` : ''}
  styles: css([
    ${answers.useTailwind ? 'tailwindStyles,\n    ' : ''}sharedStyles
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
  --background-color: #ffffff;
  --text-color: #000000;
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

a {
  color: var(--primary-color);
  text-decoration: none;
}
  `.trim();

  await fs.writeFile(
    path.join(projectDir, `source/styles/base.${extension}`),
    baseContent
  );

  await fs.writeFile(
    path.join(projectDir, `source/styles/shared.${extension}`),
    `/* Shared styles */
.gradient-text {
  background: linear-gradient(to bottom right, #000000 60%, #000033 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}    
`
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
 * @param {{ language: string; useRouter: any; useCartridge: any; }} answers
 */
async function createMainFile(projectDir, answers) {
  const extension = answers.language === 'TypeScript' ? 'ts' : 'js';
  let content = `
/// <reference types="vite/client" />

`;

  if (answers.useRouter) {
    if (answers.useCartridge) {
      content += `
import { define } from './router'; // Define the router without attaching to the DOM
const router = define();
    `;
    } else {
      content += `
import { define } from './router';
const router = define();
document.getElementById('app')?.appendChild(router.Outlet());
      `;
    }
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

export function define() {
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
  return createWebRouter({ routes });
}
  `.trim();

  await fs.writeFile(
    path.join(projectDir, `source/router.${extension}`),
    content
  );

  // Create home view structure
  await createViewStructure(projectDir, 'home', answers);
}

async function createViewStructure(projectDir, viewName, answers) {
  await createComponentStructure(projectDir, viewName, true, answers);
}

async function createAppComponent(projectDir, answers) {
  if (answers.useRouter) return; // Only create App component if not using router
  await createComponentStructure(projectDir, 'App', false, answers);
}

async function createComponentStructure(
  projectDir,
  componentName,
  isView,
  answers
) {
  const extension = answers.language === 'TypeScript' ? 'tsx' : 'jsx';
  const styleExtension = answers.cssPreprocessor === 'SCSS' ? 'scss' : 'css';

  const componentDir = isView
    ? path.join(projectDir, `source/pages/${componentName}`)
    : path.join(projectDir, 'source');
  await fs.mkdir(componentDir, { recursive: true });

  let content = `
import { createElement } from '@/setup';
`;

  if (!answers.useTailwind) {
    content += `
import { css } from "@adbl/bullet";
import styles from './${
      isView ? 'styles' : componentName
    }.${styleExtension}?inline';
`;
  }

  content += `
   
export ${isView ? 'default' : `const ${componentName} =`} createElement({
  tag: '${componentName.toLowerCase()}-${isView ? 'view' : 'root'}',
  ${answers.useTailwind ? '' : 'styles: css(styles),'}
  render: () => (
    <div class="${
      answers.useTailwind
        ? 'min-h-screen flex items-center justify-center'
        : `${componentName.toLowerCase()}-${isView ? 'view' : ''}`
    }">
      <main ${
        answers.useTailwind ? 'class="max-w-7xl mx-auto p-8 text-center"' : ''
      }>
        <img src="/bullet.svg" alt="Bullet Logo" class="mb-4" />
        <h1 ${
          answers.useTailwind ? 'class="text-5xl font-bold mb-4"' : ''
        }><span class="gradient-text">bullet.</span></h1>
        <p ${answers.useTailwind ? 'class="mb-8"' : ''}>${
    isView
      ? `You're viewing the ${capitalizeFirstLetter(componentName)} page`
      : "You're all set to start building amazing things!"
  }</p>
        <p class="${answers.useTailwind ? 'text-gray-600' : 'read-the-docs'}">
          Check out the <a href="https://github.com/adebola-io/bullet" target="_blank" rel="noopener noreferrer" ${
            answers.useTailwind ? 'class="text-blue-600"' : ''
          }>Bullet documentation</a> ${
    isView ? 'to learn more' : 'to get started.'
  }
        </p>
      </main>
    </div>
  ),
});
  `;

  await fs.writeFile(
    path.join(componentDir, `${isView ? 'index' : componentName}.${extension}`),
    content
  );

  if (!answers.useTailwind) {
    const stylesContent = `
.${componentName.toLowerCase()}-${isView ? 'view' : ''} {
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

  .read-the-docs {
    color: #888;
  }

  a {
    color: #646cff;
    text-decoration: inherit;
  }
}
`;

    await fs.writeFile(
      path.join(
        componentDir,
        `${isView ? 'styles' : componentName}.${styleExtension}`
      ),
      stylesContent
    );
  }

  if (isView) {
    const routesContent = `
import { defineRoutes, lazy } from '@adbl/bullet';

export const ${componentName}Routes = defineRoutes([
  {
    name: '${capitalizeFirstLetter(componentName)} View',
    path: '/${componentName}',
    component: lazy(() => import('./index')),
  },
]);
  `.trim();

    const extensionBase = answers.language === 'TypeScript' ? 'ts' : 'js';
    await fs.writeFile(
      path.join(componentDir, `routes.${extensionBase}`),
      routesContent
    );
  }
}

async function createPackageJson(projectDir, answers) {
  const content = {
    name: answers.projectName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: answers.useCartridge ? 'cartridge dev' : 'vite',
      build: answers.useCartridge ? 'cartridge build' : 'vite build',
      preview: answers.useCartridge ? 'cartridge start' : 'vite preview',
    },
    dependencies: {
      ...CONFIG.dependencies,
    },
    devDependencies: {
      vite: CONFIG.devDependencies.vite,
    },
  };

  if (answers.useCells) {
    content.dependencies['@adbl/cells'] = 'latest';
  }

  if (answers.useCartridge) {
    content.dependencies['@adbl/cartridge'] = 'latest';
  }

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

async function createCartridgeConfig(projectDir, answers) {
  const extension = answers.language === 'TypeScript' ? 'ts' : 'js';
  const content = {
    port: 3145,
    base: '/',
    router: `source/router.${extension}`,
  };

  await fs.writeFile(
    path.join(projectDir, 'cartridge.config.json'),
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
