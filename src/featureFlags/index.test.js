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

import rules, {
  NEW_ACP_UI_ENABLED,
  NEW_ACP_UI_ENABLED_FOR,
  newAcpUiEnabled,
} from "./index";

describe("rules", () => {
  test("it indexes all rules", () => {
    expect(Object.keys(rules())).toEqual([NEW_ACP_UI_ENABLED]);
  });

  describe("new ACP UI enabled", () => {
    test("it returns false for a logged out session", () => {
      expect(newAcpUiEnabled({ info: { isLoggedIn: false } })).toBe(false);
    });

    test("it returns false for a session not in the enabled list", () => {
      expect(
        newAcpUiEnabled({
          info: { webId: "https://pod.inrupt.com/fakename/card#me" },
        })
      ).toBe(false);
    });

    test("it returns true for a session in the enabled list", () => {
      expect(
        newAcpUiEnabled({
          info: {
            webId: NEW_ACP_UI_ENABLED_FOR[0],
          },
        })
      ).toBe(false);
    });
  });
});
