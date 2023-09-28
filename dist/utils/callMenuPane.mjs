import select, { Separator } from "@inquirer/select";
import getSavedData from "./getSavedData.mjs";
export default async function callMenuPane() {
    const savedData = getSavedData();
    function checkIfWorkspaceExists() {
        if (savedData.savedData.length > 0) {
            return [
                {
                    name: "Configure Existing Workspaces",
                    value: "configure",
                },
            ];
        }
        return [];
    }
    const selection = await select({
        message: "Select a package manager",
        choices: [
            {
                name: "Add a New Workspace",
                value: "add",
            },
            ...checkIfWorkspaceExists(),
            {
                name: "Settings",
                value: "settings",
            },
            new Separator(),
            ...savedData.savedData.map((data) => ({
                name: data.name,
                value: data.value,
                description: data.description,
            })),
            new Separator(),
            {
                name: "Exit",
                value: "exit",
            },
            new Separator(),
        ],
    });
    return selection;
}
//# sourceMappingURL=callMenuPane.mjs.map