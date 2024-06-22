// src/index.ts
import babelParsers from "prettier/parser-babel";
import typescriptParsers from "prettier/parser-typescript";
import htmlParsers from "prettier/parser-html";

// src/utils/preprocessor.ts
import babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { parse as vueParse } from "@vue/compiler-sfc";
function myPreprocessor(code, options) {
  console.log("options");
  debugger;
  const ast = babelParser.parse(code, {
    plugins: ["typescript"],
    sourceType: "module"
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
    }
  });
  const newCode = generate(ast, {
    retainLines: true
  }).code;
  return newCode;
}
function vuePreprocessor(code, options) {
  const { descriptor } = vueParse(code);
  debugger;
  const content = (descriptor.script ?? descriptor.scriptSetup)?.content;
  if (!content) {
    return code;
  }
  return code.replace(content, `
${myPreprocessor(content, options)}
`);
}

// src/index.ts
var src_default = {
  parsers: {
    babel: {
      ...babelParsers.parsers.babel,
      preprocess: myPreprocessor
    },
    typescript: {
      ...typescriptParsers.parsers.typescript,
      preprocess: myPreprocessor
    },
    vue: {
      ...htmlParsers.parsers.vue,
      preprocess: vuePreprocessor
    }
  }
};
export {
  src_default as default
};
