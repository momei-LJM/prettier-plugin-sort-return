import babelParsers from "prettier/parser-babel";

import typescriptParsers from "prettier/parser-typescript";
import htmlParsers from "prettier/parser-html";
import { myPreprocessor, vuePreprocessor } from "./utils/preprocessor";

export default {
  parsers: {
    babel: {
      ...babelParsers.parsers.babel,
      preprocess: myPreprocessor,
    },
    typescript: {
      ...typescriptParsers.parsers.typescript,
      preprocess: myPreprocessor,
    },
    vue: {
      ...htmlParsers.parsers.vue,
      preprocess: vuePreprocessor,
    },
  },
};
