import { exec } from "child_process";

export function terminalCommand(command: string): void {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Command execution returned an error: ${stderr}`);
      return;
    }
    console.log("Done.");
  });
}