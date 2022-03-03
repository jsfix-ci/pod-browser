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

// eslint-disable-next-line camelcase
import { hasAccessibleAcl, acp_v1 as acp } from "@inrupt/solid-client";
import WacAccessControlStrategy from "./wac";
import AcpAccessControlStrategy from "./acp";

export const noAccessPolicyError =
  "No available access policy for this resource";

export function hasAccess(resourceInfo) {
  return hasAccessibleAcl(resourceInfo) || acp.hasLinkedAcr(resourceInfo);
}

export function isAcp(accessControlType) {
  return accessControlType === "acp";
}

export function isWac(accessControlType) {
  return accessControlType === "wac";
}

export async function getAccessControl(
  resourceInfo,
  policiesContainerUrl,
  fetch,
  isLegacy,
  accessControlType
) {
  if (isWac(accessControlType)) {
    return WacAccessControlStrategy.init(resourceInfo, fetch);
  }
  if (isAcp(accessControlType)) {
    return AcpAccessControlStrategy.init(
      resourceInfo,
      policiesContainerUrl,
      fetch,
      isLegacy ?? false
    );
  }
  throw new Error(noAccessPolicyError);
}
