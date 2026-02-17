#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');
const { execSync } = require('child_process');

const homedir = os.homedir();

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

function clearScreen() {
    process.stdout.write('\x1Bc');
}

function showBanner() {
    console.log('\x1b[36m%s\x1b[0m', '==========================================');
    console.log('\x1b[36m%s\x1b[0m', '   Gestor de Skill NotebookLM MCP');
    console.log('\x1b[36m%s\x1b[0m', '==========================================');
    console.log('Sistema Operativo detectado:', os.platform());
    console.log('');
}

function promptOptions() {
    console.log('¿Qué te gustaría hacer?');
    console.log('1. \x1b[32mInstalar\x1b[0m Skill');
    console.log('2. \x1b[31mDesinstalar\x1b[0m Skill');
    console.log('3. Salir');
    console.log('');

    rl.question('Selecciona una opción (1-3): ', (option) => {
        if (option.trim() === '1') {
            handleInstall();
        } else if (option.trim() === '2') {
            handleUninstall();
        } else {
            console.log('Saliendo...');
            rl.close();
            process.exit(0);
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
            console.log(`\n\x1b[32m✔ ÉXITO: Skill instalado en ${destPath}\x1b[0m`);

            // Verificar configuración MCP
            console.log('\n--- SIGUIENTES PASOS ---');
            console.log('1. Asegúrate de tener el servidor Python instalado: pip install notebooklm-mcp-server');
            console.log('2. Ejecuta la autenticación: notebooklm-mcp-auth');

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
showBanner();
promptOptions();
