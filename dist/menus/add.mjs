import input from "@inquirer/input";
import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { savedFileDir } from "../paths/config.mjs";
import checkDirectory from "../utils/checkDirectory.mjs";
import getSavedData from "../utils/getSavedData.mjs";
import getScriptsFromPackageFile from "../utils/getScriptsFromPackageFile.mjs";
export default async function addProfiles() {
    console.log(chalk.cyan("\n🖥️  We'll be opening the Desktop Directory for you!\n"));
    exec("open ~/Desktop");
    const projectPath = await input({ message: "Enter your Project Path" });
    const { name, description, scripts } = await getScriptsFromPackageFile(projectPath).catch((err) => {
        throw new Error("Project not found");
    });
    const packageManager = async () => {
        if (checkDirectory(`${projectPath}/yarn.lock`, "file"))
            return "yarn";
        else if (checkDirectory(`${projectPath}/pnpm-lock.yaml`, "file"))
            return "pnpm";
        else if (checkDirectory(`${projectPath}/package-lock.json`, "file"))
            return "npm";
        else {
            const customPackageManager = await input({
                message: "Enter your Package Manager Name",
            });
            return customPackageManager.toLowerCase();
        }
    };
    const newWorkspace = {
        name: name,
        value: uuidv4(),
        description: description,
        projectPath: projectPath,
        scripts: scripts,
        packageManager: await packageManager(),
    };
    const savedData = getSavedData();
    fs.writeFileSync(savedFileDir, JSON.stringify({
        savedData: [...savedData.savedData, newWorkspace],
    }));
}
//# sourceMappingURL=add.mjs.map