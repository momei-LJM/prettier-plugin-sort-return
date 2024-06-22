import babelParser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import { parse as vueParse } from "@vue/compiler-sfc";
import {
  Expression,
  Identifier,
  PrivateName,
  isObjectExpression,
} from "@babel/types";
import { isReturnStatement } from "typescript";
import { ObjectProperty } from "@babel/types";
const parseESMDefault = <T>(moule: any) => {
  return moule.default ?? (module as T);
};

const traverse = parseESMDefault<typeof _traverse>(_traverse);
const generate = parseESMDefault<typeof _generate>(_generate);

const sortRule = (a: any, b: any, type: string) => {
  const property = type === "Identifier" ? "key" : "name";
  return a.key[property].length - b.key[property].length;
};

export function preprocessor(code: string, options: any) {
  const ast = babelParser.parse(code, {
    plugins: ["typescript"],
    sourceType: "module",
  });

  traverse(ast, {
    ObjectExpression(path) {
      if (path.findParent((p) => p.isReturnStatement())) {
        const ps = path.node.properties as ObjectProperty[];

        const keyMaps: Record<
          "Identifier" | "StringLiteral" | "NumericLiteral" | "Others",
          any[]
        > = {
          Identifier: [],
          StringLiteral: [],
          NumericLiteral: [],
          Others: [],
        };

        for (const p of ps) {
          const key = p.key as any;
          if (keyMaps[key]) {
            keyMaps[key].push(p);
          } else {
            keyMaps.Others.push(p);
          }
        }

        Object.keys(keyMaps).forEach((key) =>
          keyMaps[key].sort((a, b) => sortRule(a, b, key))
        );
        path.node.properties = Object.values(keyMaps).reduce((prev, cur) => {
          return [...prev, ...cur];
        }, []);
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
  const content = (descriptor.script ?? descriptor.scriptSetup)?.content;
  if (!content) {
    return code;
  }

  return code.replace(content, `\n${preprocessor(content, options)}\n`);
}
