// src/index.ts
import babelParsers from "prettier/parser-babel";
import typescriptParsers from "prettier/parser-typescript";
import htmlParsers from "prettier/parser-html";

// src/utils/preprocessor.ts
import babelParser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import { parse as vueParse } from "@vue/compiler-sfc";
var parseESMDefault = (moule) => {
  return moule.default ?? module;
};
var traverse = parseESMDefault(_traverse);
var generate = parseESMDefault(_generate);
var sortRule = (a, b, type) => {
  const property = type === "Identifier" ? "key" : "name";
  return a.key[property].length - b.key[property].length;
};
function preprocessor(code, options) {
  const ast = babelParser.parse(code, {
    plugins: ["typescript"],
    sourceType: "module"
  });
  traverse(ast, {
    ObjectExpression(path) {
      if (path.findParent((p) => p.isReturnStatement())) {
        const ps = path.node.properties;
        const keyMaps = {
          Identifier: [],
          StringLiteral: [],
          NumericLiteral: [],
          Others: []
        };
        for (const p of ps) {
          const key = p.key;
          if (keyMaps[key]) {
            keyMaps[key].push(p);
          } else {
            keyMaps.Others.push(p);
          }
        }
        Object.keys(keyMaps).forEach(
          (key) => keyMaps[key].sort((a, b) => sortRule(a, b, key))
        );
        path.node.properties = Object.values(keyMaps).reduce((prev, cur) => {
          return [...prev, ...cur];
        }, []);
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
  const content = (descriptor.script ?? descriptor.scriptSetup)?.content;
  if (!content) {
    return code;
  }
  return code.replace(content, `
${preprocessor(content, options)}
`);
}

// src/index.ts
var src_default = {
  parsers: {
    babel: {
      ...babelParsers.parsers.babel,
      preprocess: preprocessor
    },
    typescript: {
      ...typescriptParsers.parsers.typescript,
      preprocess: preprocessor
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
