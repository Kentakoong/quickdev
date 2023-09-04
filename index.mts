import addProfiles from "./menus/add.mjs";
import loadProfiles from "./menus/load.mjs";
import settings from "./menus/settings.mjs";
import callMenuPane from "./utils/callMenuPane.mjs";
import chalk from "chalk";

async function main() {
  const selection = await callMenuPane();

  if (selection == "add") {
    addProfiles()
      .then(() => {
        main();
      })
      .catch(() => {
        console.log(
          chalk.red(
            `\n🖥️  Project not found, please make sure you have a package.json file in your project.\n`
          )
        );
        main();
      });
  } else if (selection == "settings") {
    settings().then(() => {
      main();
    });
  } else if (selection == "exit") {
    console.log(chalk.cyan("\n🖥️  Exiting StartDev\n"));
  } else {
    loadProfiles(selection);
  }
}

main();
