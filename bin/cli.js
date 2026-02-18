#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');
const { execSync } = require('child_process');

const homedir = os.homedir();

// Detectar argumentos
const args = process.argv.slice(2);
const isHelpRequested = args.includes('--help') || args.includes('-h');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const SKILL_FILENAME = 'SKILL.md';
const SKILL_DIRNAME = 'notebooklm-mcp';

// Archivo fuente (al instalar)
const SKILL_SOURCE = path.join(__dirname, '..', SKILL_FILENAME);

// Rutas de destino
const PROJECT_DIR = process.cwd();
const PROJECT_SKILL_PATH = path.join(PROJECT_DIR, '.agent', 'skills', SKILL_DIRNAME, SKILL_FILENAME);
const GLOBAL_SKILL_PATH = path.join(homedir, '.agent', 'skills', SKILL_DIRNAME, SKILL_FILENAME);

function showHelp() {
    console.log(`
\x1b[36m==========================================\x1b[0m
\x1b[36m   Gestor de Skill NotebookLM MCP\x1b[0m
\x1b[36m==========================================\x1b[0m

\x1b[1mUSO:\x1b[0m
  notebooklm [opción]

\x1b[1mOPCIONES:\x1b[0m
  (sin argumentos)  Abre el menú interactivo
  --help, -h        Muestra esta ayuda
  --version, -v     Muestra la versión

\x1b[1mEJEMPLOS:\x1b[0m
  notebooklm          # Abre el instalador interactivo
  notebooklm --help   # Muestra esta ayuda

\x1b[1mÚSO:\x1b[0m
1. \x1b[32mInstalar\x1b[0m el skill en tu entorno
2. \x1b[31mDesinstalar\x1b[0m el skill si es necesario

El skill se instalará en una de estas ubicaciones:
  • Proyecto: ${PROJECT_SKILL_PATH}
  • Global: ${GLOBAL_SKILL_PATH}

    `);
    process.exit(0);
}

function clearScreen() {
    process.stdout.write('\x1Bc');
}

function showBanner() {
    console.log('');
    console.log('\x1b[36m%s\x1b[0m', '==========================================');
    console.log('\x1b[36m%s\x1b[0m', '   Gestor de Skill NotebookLM MCP');
    console.log('\x1b[36m%s\x1b[0m', '==========================================');
    console.log('');
    console.log('Sistema Operativo detectado:', os.platform());
    console.log('');
}

function showPostInstallMessage() {
    console.log('\x1b[32m%s\x1b[0m', '✔ ¡Bienvenido al Gestor de Skill NotebookLM MCP!');
    console.log('');
    console.log('Este herramienta te ayudará a instalar el skill en tu entorno de IA.');
    console.log('');
}

function promptOptions() {
    console.log('\x1b[1mOpciones disponibles:\x1b[0m');
    console.log('');
    console.log('  1. \x1b[32m✓ Instalar\x1b[0m Skill');
    console.log('     Instala el skill en tu entorno (proyecto o global)');
    console.log('');
    console.log('  2. \x1b[31m✗ Desinstalar\x1b[0m Skill');
    console.log('     Remove el skill de tu entorno');
    console.log('');
    console.log('  3. \x1b[33mℹ Ayuda\x1b[0m');
    console.log('     Muestra información de uso');
    console.log('');
    console.log('  4. \x1b[90mSalir\x1b[0m');
    console.log('     Cierra el programa');
    console.log('');

    rl.question('Selecciona una opción (1-4): ', (option) => {
        const opt = option.trim();
        if (opt === '1') {
            handleInstall();
        } else if (opt === '2') {
            handleUninstall();
        } else if (opt === '3') {
            showHelp();
        } else if (opt === '4') {
            console.log('');
            console.log('\x1b[33mHasta luego!\x1b[0m');
            rl.close();
            process.exit(0);
        } else {
            console.log('\x1b[31m✗ Opción inválida. Intenta de nuevo.\x1b[0m');
            console.log('');
            promptOptions();
        }
    });
}

function handleInstall() {
    console.log('\n--- INSTALACIÓN ---');
    console.log('¿Dónde deseas instalar el skill?');
    console.log(`1. Nivel Proyecto (${PROJECT_SKILL_PATH})`);
    console.log(`2. Nivel Global   (${GLOBAL_SKILL_PATH})`);

    rl.question('Selecciona destino (1 o 2): ', (target) => {
        let destPath = '';

        if (target.trim() === '1') {
            destPath = PROJECT_SKILL_PATH;
        } else if (target.trim() === '2') {
            destPath = GLOBAL_SKILL_PATH;
        } else {
            console.log('Selección inválida.');
            rl.close();
            return;
        }

        const destDir = path.dirname(destPath);

        try {
            if (!fs.existsSync(destDir)) {
                console.log(`Creando directorio: ${destDir}`);
                fs.mkdirSync(destDir, { recursive: true });
            }

            if (!fs.existsSync(SKILL_SOURCE)) {
                throw new Error(`Archivo fuente no encontrado en ${SKILL_SOURCE}`);
            }

            fs.copyFileSync(SKILL_SOURCE, destPath);
            console.log(`\n\x1b[32m✔ ÉXITO: Skill instalado correctamente\x1b[0m`);
            console.log(`\nUbicación: ${destPath}`);

            // Verificar configuración MCP
            console.log('\n--- SIGUIENTES PASOS ---');
            console.log('1. Asegúrate de tener el servidor Python instalado:');
            console.log('   \x1b[36mpip install notebooklm-mcp-server\x1b[0m');
            console.log('');
            console.log('2. Recarga tu agente de IA para que reconozca el nuevo skill');
            console.log('');
            console.log('3. Para más información, consulta SKILL.md');
            console.log('');

        } catch (err) {
            console.error(`\x1b[31m✖ Error: ${err.message}\x1b[0m`);
        } finally {
            rl.close();
        }
    });
}

function handleUninstall() {
    console.log('\n--- DESINSTALACIÓN ---');
    console.log('¿Qué instalación deseas eliminar?');

    const projectExists = fs.existsSync(PROJECT_SKILL_PATH);
    const globalExists = fs.existsSync(GLOBAL_SKILL_PATH);

    if (!projectExists && !globalExists) {
        console.log('\x1b[33mNo se encontraron instalaciones para eliminar.\x1b[0m');
        rl.close();
        return;
    }

    if (projectExists) console.log(`1. Nivel Proyecto (${PROJECT_SKILL_PATH})`);
    else console.log('1. Nivel Proyecto (No instalado)');

    if (globalExists) console.log(`2. Nivel Global   (${GLOBAL_SKILL_PATH})`);
    else console.log('2. Nivel Global   (No instalado)');

    rl.question('Selecciona objetivo a eliminar (1 o 2): ', (target) => {
        let targetPath = '';

        if (target.trim() === '1') {
            if (!projectExists) { console.log('No está instalado allí.'); rl.close(); return; }
            targetPath = PROJECT_SKILL_PATH;
        } else if (target.trim() === '2') {
            if (!globalExists) { console.log('No está instalado allí.'); rl.close(); return; }
            targetPath = GLOBAL_SKILL_PATH;
        } else {
            console.log('Selección inválida.');
            rl.close();
            return;
        }

        try {
            fs.unlinkSync(targetPath);
            console.log(`\n\x1b[32m✔ ÉXITO: Archivo de skill eliminado.\x1b[0m`);

            // Opcional: eliminar directorio padre si está vacío
            const parentDir = path.dirname(targetPath);
            if (fs.readdirSync(parentDir).length === 0) {
                fs.rmdirSync(parentDir);
                console.log(`  Limpiado directorio vacío: ${parentDir}`);
            }

        } catch (err) {
            console.error(`\x1b[31m✖ Error: ${err.message}\x1b[0m`);
        } finally {
            rl.close();
        }
    });
}

// Iniciar
if (isHelpRequested) {
    showHelp();
}

showBanner();
showPostInstallMessage();
promptOptions();
