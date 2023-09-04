import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import { runAppleScript } from "run-applescript";
import { savedFileDir } from "../paths/config.mjs";
import checkDirectory from "../utils/checkDirectory.mjs";
import { execWaitForOutput } from "../utils/execWaitForOutput.mjs";
import getSavedData from "../utils/getSavedData.mjs";

export default async function loadProfiles(selection: string) {
  const savedData = getSavedData();

  const selectedWorkspace = savedData.savedData.find(
    (data) => data.value == selection
  );

  if (selectedWorkspace == undefined)
    return console.error("Project not found!");

  if (!checkDirectory(selectedWorkspace.projectPath, "dir")) {
    console.log(
      chalk.red(`\n🖥️  Project ${selectedWorkspace.name} not found, exiting.\n`)
    );
    fs.writeFileSync(
      savedFileDir,
      JSON.stringify({
        savedData: savedData.savedData.filter(
          (data) => data.value != selection
        ),
      })
    );
  } else {
    console.log(
      chalk.cyan(
        `\n🖥️  We'll be opening project ${selectedWorkspace.name} Project for you!\n`
      )
    );

    const isModulesInstalled = checkDirectory(
      `${selectedWorkspace.projectPath}/node_modules`,
      "dir"
    );

    if (!isModulesInstalled) {
      console.log(
        chalk.cyan(
          `\n🖥️  Installing Dependencies for ${selectedWorkspace.name} Project for you!\n`
        )
      );
      await execWaitForOutput(
        `echo 'Installing Dependencies' && cd ${selectedWorkspace.projectPath} &&
            ${selectedWorkspace.packageManager} install
            `
      );
    }

    const cd = `cd ${selectedWorkspace.projectPath}`;

    const packageManagerStart = `${selectedWorkspace.packageManager}${
      selectedWorkspace.packageManager == "npm" ? " run" : ""
    } ${selectedWorkspace.scripts}`;

    const start = `"${cd}\ 
${packageManagerStart}"`;

    if (process.platform != "darwin") {
      exec(`code ${selectedWorkspace.projectPath}`);

      await execWaitForOutput(start);
    } else {
      var defaultTerminal: string;
      try {
        defaultTerminal = getSavedData().settings.defaultTerminal;
      } catch (error) {
        defaultTerminal = "Terminal";
      }
      if (defaultTerminal == "Warp") {
        await runAppleScript(`
          tell application "Warp" to activate
            tell application "System Events"
            tell process "Warp"
              keystroke "n" using command down
            end tell
            tell application "Warp" to activate
            tell application "System Events"
              tell process "Warp"
                delay 0.5
                keystroke "${cd}"
                delay 1
                key code 36
                delay 0.5
                keystroke "${packageManagerStart}"
                delay 0.5
                key code 36
              end tell
            end tell
          end tell
        `);
      } else if (defaultTerminal == "iTerm") {
        await runAppleScript(`
          if application "iTerm" is running then
            tell application "iTerm"
              set newWindow to (create window with default profile)
              tell newWindow
                tell current tab
                  tell current session
                    write text ${start}
                  end tell
                end tell
              end tell
            end tell
          else
            tell application "iTerm"
              tell current window
                tell current tab
                  tell current session
                    write text ${start}
                  end tell
                end tell
              end tell
            end tell
          end if
          `);
      } else {
        await runAppleScript(`
          tell application "Terminal"
            do script ${start}
            activate
          end tell
          `);
      }
      exec(`code ${selectedWorkspace.projectPath}`);
    }
  }
}