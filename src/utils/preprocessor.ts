import babelParser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import { parse as vueParse } from "@vue/compiler-sfc";
const parseESMDefault = <T>(moule: any) => {
  return moule.default as T;
};

const traverse = parseESMDefault<typeof _traverse>(_traverse);
const generate = parseESMDefault<typeof _generate>(_generate);
export function myPreprocessor(code: string, options) {
  console.log("options");
  debugger;

  const ast = babelParser.parse(code, {
    plugins: ["typescript"],
    sourceType: "module",
  });

  traverse(ast, {
    ReturnStatement(path) {
      const args = path.node.argument;

      args?.properties?.sort((a, b) => a.key.name.length - b.key.name.length);
    },
    ObjectExpression(path) {
      if (path.findParent((p) => p.type === "ReturnStatement")) {
        const args = path.node.properties;
        args.sort((a, b) => a.key.name.length - b.key.name.length);
      }
    },
  });

  const newCode = generate(ast, {
    retainLines: true,
  }).code;

  return newCode;
}
export function vuePreprocessor(code, options) {
  const { descriptor } = vueParse(code);
  debugger;
  const content = (descriptor.script ?? descriptor.scriptSetup)?.content;
  if (!content) {
    return code;
  }

  return code.replace(content, `\n${myPreprocessor(content, options)}\n`);
}
