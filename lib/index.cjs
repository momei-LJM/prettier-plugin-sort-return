var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_parser_babel = __toESM(require("prettier/parser-babel"), 1);
var import_parser_typescript = __toESM(require("prettier/parser-typescript"), 1);
var import_parser_html = __toESM(require("prettier/parser-html"), 1);

// src/utils/preprocessor.ts
var import_parser = __toESM(require("@babel/parser"), 1);
var import_traverse = __toESM(require("@babel/traverse"), 1);
var import_generator = __toESM(require("@babel/generator"), 1);
var import_compiler_sfc = require("@vue/compiler-sfc");
var parseESMDefault = (moule) => {
  return moule.default ?? module;
};
var traverse = parseESMDefault(import_traverse.default);
var generate = parseESMDefault(import_generator.default);
var sortRule = (a, b, type) => {
  const property = type === "Identifier" ? "key" : "name";
  return a.key[property].length - b.key[property].length;
};
function preprocessor(code, options) {
  const ast = import_parser.default.parse(code, {
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
  const { descriptor } = (0, import_compiler_sfc.parse)(code);
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
      ...import_parser_babel.default.parsers.babel,
      preprocess: preprocessor
    },
    typescript: {
      ...import_parser_typescript.default.parsers.typescript,
      preprocess: preprocessor
    },
    vue: {
      ...import_parser_html.default.parsers.vue,
      preprocess: vuePreprocessor
    }
  }
};
