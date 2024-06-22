import { expect, it } from "vitest";
import { tryFrmatFile } from ".";
import { resolve } from "path";
const reslovePath = (path: string) => {
  return resolve(process.cwd(), path);
};
it("test format vue sfc", async () => {
  const result = await tryFrmatFile(reslovePath("src/examples/vue/index.vue"));
  expect(result).toMatchSnapshot();
});

it("test format vue sfc-setup", async () => {
  const result = await tryFrmatFile(
    reslovePath("src/examples/vue/setupVue.vue")
  );
  expect(result).toMatchSnapshot();
});

it("test format typescript", async () => {
  const result = await tryFrmatFile(reslovePath("src/examples/ts/index.ts"));
  expect(result).toMatchSnapshot();
});

it("test format javascript", async () => {
  const result = await tryFrmatFile(reslovePath("src/examples/js/index.js"));
  expect(result).toMatchSnapshot();
});
