import input from "@inquirer/input";
import select from "@inquirer/select";
import fs from "fs";
import checkDirectory from "../utils/checkDirectory.mjs";
import checkUndefOrEmpty from "../utils/checkUndefOrEmpty.mjs";
export default async function getScriptsFromPackageFile(projectPath, checkUndefined = true) {
    const packageJsonPath = `${projectPath}/package.json`;
    const dirAvailable = checkDirectory(packageJsonPath, "file");
    if (!dirAvailable)
        throw new Error("Project not found");
    const jsonString = fs.readFileSync(packageJsonPath).toString();
    if (jsonString == "{}")
        throw new Error("package.json is empty");
    const parsedPackageJson = JSON.parse(jsonString);
    var name = parsedPackageJson.name;
    var description = parsedPackageJson.description;
    if (checkUndefined) {
        if (checkUndefOrEmpty(name))
            name = await input({ message: "Enter your Project Name" });
        if (checkUndefOrEmpty(description))
            description = await input({
                message: "Enter your Project Description (Leave blank if not needed)",
            });
    }
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
                ...scripts.map((script) => ({
                    name: script,
                    value: script,
                })),
            ],
        });
        scripts = scriptSelection;
    }
    return {
        name: name,
        description: description,
        scripts: scripts,
    };
}
//# sourceMappingURL=getScriptsFromPackageFile.mjs.map