import input from "@inquirer/input";
import select from "@inquirer/select";
import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import checkDirectory from "../utils/checkDirectory.mjs";
import getSavedData from "../utils/getSavedData.mjs";
import { savedFileDir } from "../paths/config.mjs";
import checkUndefOrEmpty from "../utils/checkUndefOrEmpty.mjs";

export default async function addProfiles() {
  console.log(
    chalk.cyan("\n🖥️  We'll be opening the Desktop Directory for you!\n")
  );
  exec("open ~/Desktop");

  const projectPath = await input({ message: "Enter your Project Path" });
  const packageJsonPath = `${projectPath}/package.json`;
  const dirAvailable = checkDirectory(packageJsonPath, "file");
  if (dirAvailable) {
    const parsedPackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath).toString()
    );
    const name = parsedPackageJson.name;

    if (checkUndefOrEmpty(name))
      await input({ message: "Enter your Project Name" });

    const description = parsedPackageJson.description;

    if (checkUndefOrEmpty(description))
      await input({
        message: "Enter your Project Description (Leave blank if not needed)",
      });

    var scripts = parsedPackageJson.scripts;

    if (scripts != undefined) {
      scripts = Object.keys(scripts);
      const scriptSelection = await select({
        message: "Select a script when you want to run your project",
        choices: [
          {
            name: "None",
            value: undefined,
          },
          ...scripts.map((script: string) => ({
            name: script,
            value: script,
          })),
        ],
      });
      scripts = scriptSelection;
    }

    const packageManager = async () => {
      if (checkDirectory(`${projectPath}/yarn.lock`, "file")) return "yarn";
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

    fs.writeFileSync(
      savedFileDir,
      JSON.stringify({
        savedData: [...savedData.savedData, newWorkspace],
      })
    );
  } else {
    throw new Error("Project not found");
  }
}
