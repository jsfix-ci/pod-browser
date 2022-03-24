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

import { DatasetContext, useSession } from "@inrupt/solid-ui-react";
import { getSourceUrl, universalAccess } from "@inrupt/solid-client";

import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { getPolicyDetailFromAccess } from "../../accessControl/acp";
import AccessControlContext from "../../contexts/accessControlContext";
import useConsentBasedAccessForResource from "../useConsentBasedAccessForResource";
import {
  getRequestedAccessesFromSignedVc,
  getRequestorWebIdFromSignedVc,
} from "../../models/consent/signedVc";
import { isPublicAgentorAuthenticatedAgentWebId } from "../../../components/resourceDetails/utils";
import { fetchProfile } from "../../solidClientHelpers/profile";
import { findSharingTypeForAgents, mapAgentsToSharingType } from "./utils";

export async function getPermissions(resourceIri, fetch) {
  const { getAgentAccessAll } = universalAccess;
  const agents = await getAgentAccessAll(resourceIri, {
    fetch,
  });
  const agentsWithSharingType = findSharingTypeForAgents(agents);
  const sharingTypeWithAssociatedAgents = mapAgentsToSharingType(
    agentsWithSharingType
  );
  return sharingTypeWithAssociatedAgents;
}

export async function setAgentPermissions(resourceIri, agent, access, fetch) {
  console.log(
    "permissions before func gets called",
    useAllPermissions.permissions
  );
  try {
    const res = await universalAccess.setAgentAccess(
      resourceIri,
      agent,
      access,
      { fetch }
    );
    console.log("after set func", { res, resourceIri, agent, access });
    // if this takes a long time look at optomistic rendering
    const newPermissions = await getPermissions(resourceIri, fetch);
    console.log("updated permissions?", newPermissions);
    // is this allowed??
    useAllPermissions.setPermissions(newPermissions);
  } catch (e) {
    console.log(e);
  }
}

export function useAllPermissions() {
  const { solidDataset: dataset } = useContext(DatasetContext);
  const resourceIri = getSourceUrl(dataset);
  const { session } = useSession();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPermissions() {
      setLoading(true);
      getPermissions(resourceIri, session.fetch)
        .then(
          (permissions) => {
            console.log("before set in hook", permissions);
            setPermissions(permissions);
          },
          (error) => {
            setError(error);
          }
        )
        .then(() => setLoading(false));
    }
    fetchPermissions();
    console.log("in hook permissions:", permissions);
  }, [resourceIri, session.fetch]);

  // async function setPublicPermissions(resourceIri, access, fetch) {
  //   // redo this one once func above works
  //   try {
  //     universalAccess.setPublicAccess(resourceIri, access);

  //     const newPermissions = await getPermissions(resourceIri, fetch);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  return {
    permissions,
    loading,
    // setAgentPermissions,
    // setPublicPermissions,
  };
}
