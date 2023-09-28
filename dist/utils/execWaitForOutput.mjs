import { exec } from "child_process";
export async function execWaitForOutput(command, execOptions = {}) {
    return new Promise((resolve, reject) => {
        const childProcess = exec(command, execOptions);
        // stream process output to console
        childProcess.stderr?.on("data", (data) => console.error(data));
        childProcess.stdout?.on("data", (data) => console.log(data));
        // handle exit
        childProcess.on("exit", () => resolve());
        childProcess.on("close", () => resolve());
        // handle errors
        childProcess.on("error", (error) => reject(error));
    });
}
//# sourceMappingURL=execWaitForOutput.mjs.map