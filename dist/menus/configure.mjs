import input from "@inquirer/input";
import select, { Separator } from "@inquirer/select";
import getSavedData from "../utils/getSavedData.mjs";
import getScriptsFromPackageFile from "../utils/getScriptsFromPackageFile.mjs";
import fs from "fs";
import { savedFileDir } from "../paths/config.mjs";
export default async function configurePane() {
    const savedData = getSavedData();
    const settingsMenuSelection = await select({
        message: "Select a field to edit",
        choices: [
            {
                name: "Back",
                value: "back",
            },
            new Separator(),
            ...savedData.savedData.map((data) => ({
                name: data.name,
                value: data.value,
                description: data.description,
            })),
            new Separator(),
        ],
    });
    if (settingsMenuSelection == "back")
        return;
    const fieldToEdit = savedData.savedData.find((data) => data.value == settingsMenuSelection);
    if (!fieldToEdit)
        throw new Error("Field not found");
    const newValue = await select({
        message: `Edit ${fieldToEdit.name}`,
        choices: [
            {
                name: "Back",
                value: "back",
            },
            new Separator(),
            {
                name: "Name",
                value: "name",
            },
            {
                name: "Description",
                value: "description",
            },
            {
                name: "Launch Scripts",
                value: "scripts",
            },
        ],
    });
    if (newValue == "back")
        return;
    var newName;
    var newDescription;
    var newScripts;
    if (newValue == "name") {
        newName = await input({ message: "Enter your Project Name" });
    }
    if (newValue == "description") {
        newDescription = await input({
            message: "Enter your Project Description",
        });
    }
    if (newValue == "scripts") {
        const packageJSONData = await getScriptsFromPackageFile(fieldToEdit.projectPath, false).catch(() => {
            throw new Error("Project not found");
        });
        newScripts = packageJSONData.scripts;
    }
    const newSavedData = savedData.savedData.map((data) => {
        if (data.value == fieldToEdit.value) {
            if (newName)
                data.name = newName;
            if (newDescription)
                data.description = newDescription;
            if (newScripts)
                data.scripts = newScripts;
        }
        return data;
    });
    savedData.savedData = newSavedData;
    fs.writeFileSync(savedFileDir, JSON.stringify(savedData));
}
//# sourceMappingURL=configure.mjs.map