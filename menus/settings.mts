import select from "@inquirer/select";
import fs from "fs";
import { savedFileDir } from "../paths/config.mjs";
import checkDirectory from "../utils/checkDirectory.mjs";
import getSavedData from "../utils/getSavedData.mjs";

export default async function settingsPane() {
  function getMacOSSettings() {
    if (process.platform != "darwin") return [];
    return [
      {
        name: "Default Terminal Application",
        value: "defaultTerminal",
      },
    ];
  }

  const settingsMenuSelection = await select({
    message: "Select a field to edit",
    choices: [
      {
        name: "Back",
        value: "back",
      },
      ...getMacOSSettings(),
    ],
  });

  switch (settingsMenuSelection) {
    case "back":
      return;
    case "defaultTerminal":
      const iTermInstalled = checkDirectory("/Applications/iTerm.app", "dir");
      const warpInstalled = checkDirectory("/Applications/Warp.app", "dir");

      const defaultTerminal = await select({
        message: "Select a default terminal application",
        choices: [
          {
            name: "Back",
            value: "back",
          },
          {
            name: "Terminal",
            value: "Terminal",
          },
          {
            name: "iTerm",
            value: "iTerm",
            disabled: !iTermInstalled,
          },
          {
            name: "Warp",
            value: "Warp",
            disabled: !warpInstalled,
          },
        ],
      });

      switch (defaultTerminal) {
        case "back":
          settingsPane();
        default:
          const savedData = getSavedData();
          fs.writeFileSync(
            savedFileDir,
            JSON.stringify({
              ...savedData,
              settings: {
                ...savedData.settings,
                defaultTerminal,
              },
            })
          );
      }
  }
}
