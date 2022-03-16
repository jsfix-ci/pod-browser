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

/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Alert } from "@material-ui/lab";
import AgentAccessTable from "../agentAccessTable";
import AdvancedSharingButton from "../advancedSharingButton";
import { namedPolicies, customPolicies } from "../../../../constants/policies";
import { isContainerIri } from "../../../../src/solidClientHelpers/utils";
import PermissionsContext from "../../../../src/contexts/permissionsContext";
import AgentAccessSharingList from "../agentAccessSharingList";
import PermissionsPanel from "../PermissionsPanel";
import { DatasetContext } from "@inrupt/solid-ui-react";
import { getSourceUrl } from "@inrupt/solid-client";

export const TESTCAFE_ID_AGENT_ACCESS_LIST_SHOW_ALL =
  "agent-access-list-show-all";

function getEditPermissions(permissions) {
  return permissions.filter(({ alias }) => alias === "editors");
}

function getViewPermissions(permissions) {
  return permissions.filter(({ alias }) => alias === "viewers");
}

function SharingAccordion() {
  const router = useRouter();
  const isContainer = isContainerIri(router.query.resourceIri);
  const [loading, setLoading] = useState(false);
  const { permissions } = useContext(PermissionsContext);
  const editPermissions = getEditPermissions(permissions);
  const viewPermissions = getViewPermissions(permissions);
  const { solidDataset: dataset } = useContext(DatasetContext);
  const resourceIri = getSourceUrl(dataset);
  console.log("sharing accordion render", permissions);
  return (
    <>
      <PermissionsPanel
        type="editors"
        permissions={editPermissions}
        resourceIri={resourceIri}
      />
      <PermissionsPanel
        type="viewers"
        permissions={viewPermissions}
        resourceIri={resourceIri}
      />

      {/*namedPolicies.concat(customPolicies).map(({ name }) => (
        <AgentAccessTable //AgentAccessTable
          key={name}
          type={name}
          loading={loading}
          setLoading={setLoading}
        />
      ))*/}
      {/*isContainer && (
        <Alert icon={false} severity="info">
          Sharing applies to all items in this folder
        </Alert>
      )*/}
      {/* <AdvancedSharingButton loading={loading} setLoading={setLoading} /> */}
    </>
  );
}

export default SharingAccordion;
