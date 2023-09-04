import fs from "fs";
import { savedFileDir, savedFilePath } from "../paths/config.mjs";
import { SavedData } from "../types/global.mjs";
import checkDirectory from "./checkDirectory.mjs";

export default function getSavedData(): {
  settings: {
    defaultTerminal: string;
  };
  savedData: SavedData[];
} {
  checkDirectory(savedFilePath, "dir");
  return JSON.parse(fs.readFileSync(savedFileDir).toString());
}
