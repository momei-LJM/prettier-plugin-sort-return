import babelParser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import { parse as vueParse } from "@vue/compiler-sfc";
import { isSpreadElement, ObjectProperty } from "@babel/types";
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

        const SpreadElements: Record<string, ObjectProperty> = {};
        for (const p of ps) {
          if (isSpreadElement(p)) {
            const idx = ps.findIndex((p) => p === p);
            SpreadElements[idx] = p;
          } else {
            const key = p.key as any;
            if (keyMaps[key]) {
              keyMaps[key].push(p);
            } else {
              keyMaps.Others.push(p);
            }
          }
        }

        // sort
        Object.keys(keyMaps).forEach((key) =>
          keyMaps[key].sort((a, b) => sortRule(a, b, key))
        );
        const newPs = Object.values(keyMaps).reduce((prev, cur) => {
          return [...prev, ...cur];
        }, []);

        // spread operator keep order
        for (const [idx, node] of Object.entries(SpreadElements)) {
          newPs.splice(+idx, 0, node);
        }
        path.node.properties = newPs;
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
