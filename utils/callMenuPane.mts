import select, { Separator } from "@inquirer/select";
import getSavedData from "./getSavedData.mjs";

export default async function callMenuPane() {
  const savedData = getSavedData();

  const selection = await select({
    message: "Select a package manager",
    choices: [
      {
        name: "Add New Workspace",
        value: "add",
      },
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
  return selection as string;
}
