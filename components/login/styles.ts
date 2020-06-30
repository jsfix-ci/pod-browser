/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { PrismTheme, createStyles } from "@solid/lit-prism-patterns";

const styles = (theme: PrismTheme) =>
  createStyles(theme, ["button", "content"], {
    "login-form": {
      background: theme.palette.background.default,
      borderRadius: theme.shape.borderRadius,
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.3)",
      padding: theme.spacing(5),
      minWidth: 420,
      textAlign: "center",
    },
    "login-form__what-is-solid": {
      margin: 0,
    },
    "login-form__sub-title": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      letterSpacing: 1.2,
      margin: "30px 0",
      position: "relative",
      textTransform: "none",
      "& span": {
        padding: "0 5px",
      },
      "&::before, &::after": {
        width: "32%",
        content: '""',
        background: theme.palette.text.secondary,
        height: 1,
        boxSizing: "border-box",
        left: 0,
        top: "50%",
      },
      "&::before:": {
        right: 0,
      },
    },
  });

export default styles;
