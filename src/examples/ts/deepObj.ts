export const fn = ()=> {
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
    }
    };
  }