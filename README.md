## Installation

```js
npm i prettier-plugin-sort-return -D
```

### Use

Add `prettier-plugin-sort-return` to your `.prettierrc` file:

```js
export default {
  //...
  plugins: ["prettier-plugin-sort-return"],
};
```

### Example

```js
export const fn = () => {
  const NOT_NULL_CONST = "NOT_NULL_CONST";
  const NOT_NULL_CONST2 = "NOT_NULL_CONST2";
  const SELECT_NOT_NULL_CONST = "SELECT_NOT_NULL_CONST";

  const a = 1;
  const foo = 2;
  const bar = 3;
  const baz = 4;

  return {
    NOT_NULL_CONST,
    NOT_NULL_CONST2,
    foo,
    baz,
    SELECT_NOT_NULL_CONST,
    bar,
    a,
    subObj: {
      NOT_NULL_CONST,
      NOT_NULL_CONST2,
      foo,
      baz,
      SELECT_NOT_NULL_CONST,
      bar,
      a,
    },
  };
};
// formatted:
export const fn = () => {
  const NOT_NULL_CONST = "NOT_NULL_CONST";
  const NOT_NULL_CONST2 = "NOT_NULL_CONST2";
  const SELECT_NOT_NULL_CONST = "SELECT_NOT_NULL_CONST";

  const a = 1;
  const foo = 2;
  const bar = 3;
  const baz = 4;

  return {
    a,
    foo,
    baz,
    bar,
    subObj: {
      a,
      foo,
      baz,
      bar,
      NOT_NULL_CONST,
      NOT_NULL_CONST2,
      SELECT_NOT_NULL_CONST,
    },
    NOT_NULL_CONST,
    NOT_NULL_CONST2,
    SELECT_NOT_NULL_CONST,
  };
};
```
