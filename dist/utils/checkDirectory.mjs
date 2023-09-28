import fs from "fs";
import { savedFilePath, savedFileDir } from "../paths/config.mjs";
export default function checkDirectory(dir, checkMethod) {
    try {
        var stat = fs.lstatSync(dir);
        if (checkMethod == "dir")
            return stat.isDirectory();
        else
            return stat.isFile();
    }
    catch (e) {
        //create new file
        if (dir != savedFilePath)
            return false;
        fs.mkdirSync(savedFilePath, { recursive: true });
        fs.writeFileSync(savedFileDir, JSON.stringify({
            savedData: [],
        }));
    }
}
//# sourceMappingURL=checkDirectory.mjs.map