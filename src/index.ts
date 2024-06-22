import babelParsers from "prettier/parser-babel";

import typescriptParsers from "prettier/parser-typescript";
import htmlParsers from "prettier/parser-html";
import { preprocessor, vuePreprocessor } from "./utils/preprocessor";

export default {
  parsers: {
    babel: {
      ...babelParsers.parsers.babel,
      preprocess: preprocessor,
    },
    typescript: {
      ...typescriptParsers.parsers.typescript,
      preprocess: preprocessor,
    },
    vue: {
      ...htmlParsers.parsers.vue,
      preprocess: vuePreprocessor,
    },
  },
};
