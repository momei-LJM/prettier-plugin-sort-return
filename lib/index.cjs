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
function myPreprocessor(code, options) {
  console.log("options");
  debugger;
  const ast = import_parser.default.parse(code, {
    plugins: ["typescript"],
    sourceType: "module"
  });
  (0, import_traverse.default)(ast, {
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
  const newCode = (0, import_generator.default)(ast, {
    retainLines: true
  }).code;
  return newCode;
}
function vuePreprocessor(code, options) {
  const { descriptor } = (0, import_compiler_sfc.parse)(code);
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
      ...import_parser_babel.default.parsers.babel,
      preprocess: myPreprocessor
    },
    typescript: {
      ...import_parser_typescript.default.parsers.typescript,
      preprocess: myPreprocessor
    },
    vue: {
      ...import_parser_html.default.parsers.vue,
      preprocess: vuePreprocessor
    }
  }
};
