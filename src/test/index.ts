import { readFileSync } from "fs";
import { resolve } from "path";
import * as prettier from "prettier";
import prettierPluginSortReturn from "../../lib/index";

export const tryFrmatFile = async (path: string) => {
  const code = readFileSync(path, "utf-8");
  const { inferredParser } = await prettier.getFileInfo(path);
  const formatted = await prettier.format(code, {
    parser: inferredParser!,
    plugins: [prettierPluginSortReturn],
  });
  return formatted;
};
