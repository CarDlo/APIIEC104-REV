import { exec } from 'child_process';
import path from 'path';

export function runPythonScript() {
  const pythonExecutable = path.join(__dirname, '..', '..', 'python', 'venv', 'Scripts', 'python.exe'); // Ruta completa al ejecutable de Python en el entorno virtual
  const scriptPath = path.join(__dirname, '..', '..', 'python', 'client_iec104.py'); // Ruta completa al script Python

  exec(`"${pythonExecutable}" "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
}