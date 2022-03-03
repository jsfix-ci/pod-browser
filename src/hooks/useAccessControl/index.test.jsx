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

import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/dom";
import { mockSolidDatasetFrom } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import useAccessControl from "./index";
import * as accessControlFns from "../../accessControl";
import usePoliciesContainerUrl from "../usePoliciesContainerUrl";
import mockSessionContextProvider from "../../../__testUtils/mockSessionContextProvider";
import mockSession from "../../../__testUtils/mockSession";
import { mockProfileAlice } from "../../../__testUtils/mockPersonResource";
import { joinPath } from "../../stringHelpers";
import useIsLegacyAcp from "../useIsLegacyAcp";
import useAccessControlType from "../useAccessControlType";

jest.mock("../usePoliciesContainerUrl");
const mockedPoliciesContainerUrlHook = usePoliciesContainerUrl;

jest.mock("../useIsLegacyAcp");
const mockedIsLegacyAcp = useIsLegacyAcp;

jest.mock("../useAccessControlType");
const mockedUseAccessControlType = useAccessControlType;

jest.mock("@inrupt/solid-ui-react", () => {
  const uiReactModule = jest.requireActual("@inrupt/solid-ui-react");
  return {
    SessionContext: uiReactModule.SessionContext,
    useSession: jest.fn(),
  };
});
const mockedUseSession = useSession;

describe("useAccessControl", () => {
  const authenticatedProfile = mockProfileAlice();
  const policiesContainerUrl = "policiesContainer";

  const accessControl = "accessControl";
  const resourceUrl = joinPath(authenticatedProfile.pods[0], "test");
  const resourceInfo = mockSolidDatasetFrom(resourceUrl);
  const error = "error";

  const session = mockSession();
  const SessionProvider = mockSessionContextProvider(session);
  const wrapper = ({ children }) => (
    <SessionProvider>{children}</SessionProvider>
  );

  beforeEach(() => {
    mockedUseSession.mockReturnValue({ session });
  });

  it("returns undefined if given no resourceInfo", async () => {
    mockedIsLegacyAcp.mockReturnValue({ data: false });
    mockedUseAccessControlType.mockReturnValue({ data: "acp" });
    const { result } = renderHook(() => useAccessControl(null), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });
  });

  it("returns error if getAccessControl fails", async () => {
    mockedIsLegacyAcp.mockReturnValue({ data: false });
    mockedPoliciesContainerUrlHook.mockReturnValue(policiesContainerUrl);
    mockedUseAccessControlType.mockReturnValue({ data: "acp" });
    jest
      .spyOn(accessControlFns, "getAccessControl")
      .mockRejectedValueOnce(error);
    const { result, waitForNextUpdate } = renderHook(
      () => useAccessControl(resourceInfo),
      {
        wrapper,
      }
    );
    await waitForNextUpdate();
    await waitFor(() => {
      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeNull();
    });
  });

  describe("using latest ACP", () => {
    const policiesContainerUrl = "policiesContainer";
    beforeEach(() => {
      mockedIsLegacyAcp.mockReturnValue({ data: false });
      mockedUseSession.mockReturnValue({ session });
      mockedUseAccessControlType.mockReturnValue({ data: "acp" });
      jest
        .spyOn(accessControlFns, "getAccessControl")
        .mockResolvedValueOnce(accessControl);
    });
    it("returns accessControl with latest ACP if given resourceUri", async () => {
      mockedPoliciesContainerUrlHook.mockReturnValue(policiesContainerUrl);
      mockedUseAccessControlType.mockReturnValue({ data: "acp" });

      const { result, waitForNextUpdate } = renderHook(
        () => useAccessControl(resourceInfo),
        {
          wrapper,
        }
      );
      await waitForNextUpdate();
      await waitFor(() => {
        expect(accessControlFns.getAccessControl).toHaveBeenCalledWith(
          resourceInfo,
          policiesContainerUrl,
          expect.any(Function),
          false,
          "acp"
        );
        expect(result.current.isValidating).toBeFalsy();
        expect(result.current.data.accessControl).toBe(accessControl);
        expect(result.current.error).toBeNull();
      });
    });

    it("returns true for isValidating when neither data or error are available", async () => {
      mockedPoliciesContainerUrlHook.mockReturnValue(null);
      const { result } = renderHook(() => useAccessControl(resourceInfo), {
        wrapper,
      });
      await waitFor(() => {
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeUndefined();
        expect(result.current.isValidating).toBeTruthy();
      });
    });
  });

  describe("using legacy ACP", () => {
    const policiesContainerUrl = "policiesContainer";
    beforeEach(() => {
      mockedPoliciesContainerUrlHook.mockReturnValue(policiesContainerUrl);
      mockedIsLegacyAcp.mockReturnValue({ data: true });
      mockedUseAccessControlType.mockReturnValue({ data: "acp" });
      mockedUseSession.mockReturnValue({ session });
    });

    it("returns accessControl with legacy ACP if given resourceUri", async () => {
      mockedPoliciesContainerUrlHook.mockReturnValue(policiesContainerUrl);
      mockedIsLegacyAcp.mockReturnValue({ data: true });
      const { result, waitForNextUpdate } = renderHook(
        () => useAccessControl(resourceInfo),
        {
          wrapper,
        }
      );
      await waitForNextUpdate();
      await waitFor(() => {
        expect(result.current.data.accessControl).toBe(accessControl);
        expect(result.current.data.accessControlType).toBe("acp");
        expect(result.current.error).toBeNull();
        expect(accessControlFns.getAccessControl).toHaveBeenCalledWith(
          resourceInfo,
          policiesContainerUrl,
          expect.any(Function),
          true,
          "acp"
        );
      });
    });
  });
});
