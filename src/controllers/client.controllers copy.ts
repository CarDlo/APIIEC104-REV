// Importar módulos necesarios
import { Request, Response } from 'express';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

// Rutas al entorno virtual y al archivo main.py
const PYTHON_SCRIPT_PATH = path.resolve(__dirname, '../../python/main.py'); // Ajuste a la carpeta raíz
const VENV_PATH_WINDOWS = path.resolve(__dirname, '../../python/venv/Scripts/python.exe'); // Ajuste a la carpeta raíz
const VENV_PATH_UNIX = path.resolve(__dirname, '../../python/venv/bin/python'); // Ajuste a la carpeta raíz

// Función para ejecutar el script de Python
const executePythonScript = (args: string[], res: Response): void => {
  const isWindows: boolean = process.platform === 'win32';
  const pythonExecutable: string = isWindows ? VENV_PATH_WINDOWS : VENV_PATH_UNIX;

  // Validar rutas antes de ejecutar el comando
  if (!pythonExecutable || !PYTHON_SCRIPT_PATH) {
    res.status(500).send('Python executable or script path is invalid.');
    return;
  }

  const command: string = `${pythonExecutable} ${PYTHON_SCRIPT_PATH} ${args.join(' ')}`;
  console.log('Executing command:', command);

  const childProcess: ChildProcessWithoutNullStreams = spawn(command, { shell: true });

  let stdoutData = ''; // Acumular datos de stdout
  let stderrData = ''; // Acumular datos de stderr
  let responseSent = false;

  childProcess.stdout.on('data', (data: Buffer) => {
    console.log(`STDOUT: ${data.toString()}`);
    stdoutData += data.toString();
  });

  childProcess.stderr.on('data', (data: Buffer) => {
    console.error(`STDERR: ${data.toString()}`);
    stderrData += data.toString();
  });

  childProcess.on('close', (code: number) => {
    console.log(`Process exited with code ${code}`);
    if (!responseSent) {
      responseSent = true;
      if (code === 0) {
        try {
          // Intenta parsear stdout como JSON
          const jsonResponse = JSON.parse(stdoutData);
          res.status(200).json(jsonResponse);
        } catch {
          // Si no es JSON, envía como texto
          res.status(200).send(stdoutData);
        }
      } else {
        res.status(500).json({
          error: `Process failed with exit code ${code}`,
          stderr: stderrData,
        });
      }
    }
  });

  childProcess.on('error', (error: Error) => {
    console.error(`Process error: ${error.message}`);
    if (!responseSent) {
      responseSent = true;
      res.status(500).json({ error: `Process failed: ${error.message}` });
    }
  });
};

// Controlador para iniciar una planta
export const startPlant = (req: Request, res: Response): void => {
  const { plantName } = req.params;

  if (!plantName) {
    res.status(400).json({ error: 'Plant name is required' });
    return;
  }

  executePythonScript(['start', plantName], res);
};

// Controlador para detener una planta
export const stopPlant = (req: Request, res: Response): void => {
  const { plantName } = req.params;

  if (!plantName) {
    res.status(400).json({ error: 'Plant name is required' });
    return;
  }

  executePythonScript(['stop', plantName], res);
};

// Controlador para reiniciar una planta
export const restartPlant = (req: Request, res: Response): void => {
  const { plantName } = req.params;

  if (!plantName) {
    res.status(400).json({ error: 'Plant name is required' });
    return;
  }

  executePythonScript(['restart', plantName], res);
};

// Controlador para obtener el estado de las plantas
export const getStatus = (req: Request, res: Response): void => {
  executePythonScript(['status'], res);
};

// Controlador para iniciar todas las plantas
export const startAllPlants = (req: Request, res: Response): void => {
  executePythonScript(['start-all'], res);
};

// Controlador para detener todas las plantas
export const stopAllPlants = (req: Request, res: Response): void => {
  executePythonScript(['stop-all'], res);
};

// Controlador para reiniciar todas las plantas
export const restartAllPlants = (req: Request, res: Response): void => {
  executePythonScript(['restart-all'], res);
};
