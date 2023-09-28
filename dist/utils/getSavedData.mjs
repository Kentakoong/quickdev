import fs from "fs";
import { savedFileDir, savedFilePath } from "../paths/config.mjs";
import checkDirectory from "./checkDirectory.mjs";
export default function getSavedData() {
    checkDirectory(savedFilePath, "dir");
    return JSON.parse(fs.readFileSync(savedFileDir).toString());
}
//# sourceMappingURL=getSavedData.mjs.map