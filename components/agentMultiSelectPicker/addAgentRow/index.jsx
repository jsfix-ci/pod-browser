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

import React, { useEffect, useState } from "react";
import T from "prop-types";
import { useSession, useThing } from "@inrupt/solid-ui-react";
import {
  Avatar,
  createStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@inrupt/prism-react-components";

import {
  addStringNoLocale,
  addUrl,
  getStringNoLocale,
  getUrl,
} from "@inrupt/solid-client";
import { foaf, vcard } from "rdf-namespaces";
import styles from "./styles";
import useContactFull from "../../../src/hooks/useContactFull";
import { vcardExtras } from "../../../src/addressBook";
import { fetchProfile } from "../../../src/solidClientHelpers/profile";
import { chain } from "../../../src/solidClientHelpers/utils";
import Spinner from "../../spinner";
import SkeletonRow from "../skeletonRow";

const useStyles = makeStyles((theme) => createStyles(styles(theme)));
const VCARD_WEBID_PREDICATE = vcardExtras("WebId");
const TESTCAFE_ID_WEBID_INPUT = "webid-input";
const TESTCAFE_ID_ADD_WEBID_BUTTON = "add-button";
const TESTCAFE_ID_AGENT_WEB_ID = "agent-webid";

const updateThingForNewRow = async (agentWebId, thing, fetch) => {
  let newThing;
  try {
    const profile = await fetchProfile(agentWebId, fetch);
    if (profile) {
      const { name, avatar, webId } = profile;
      newThing = chain(
        thing,
        (t) => addStringNoLocale(t, foaf.name, name),
        (t) => addUrl(t, VCARD_WEBID_PREDICATE, webId) // temporarily storing this here to have a webId to display for these temporary rows
      );
      if (avatar) {
        newThing = addUrl(newThing, vcard.hasPhoto, avatar);
      }
    } else {
      newThing = addUrl(thing, VCARD_WEBID_PREDICATE, agentWebId); // temporarily storing this here to have a webId to display for these temporary rows
    }
  } catch (error) {
    newThing = addUrl(thing, VCARD_WEBID_PREDICATE, agentWebId); // temporarily storing this here to have a webId to display for these temporary rows
  }
  return newThing;
};

export default function AddAgentRow({ onNewAgentSubmit }) {
  const classes = useStyles();
  const [agentWebId, setAgentWebId] = useState("");
  const [existingPermission, setExistingPermission] = useState();
  const [processing, setProcessing] = useState(false);

  const handleAddAgentsWebIds = async (event) => {
    event.preventDefault();
    try {
      setProcessing(true);
      await onNewAgentSubmit(agentWebId);
      setProcessing(false);
    } catch (error) {
      console.log("ERROR HANDLER", error);
    }
    // const existingWebId = permissions.filter((p) => p.webId === agentWebId);
    // if (existingWebId.length) {
    //   setExistingPermission(true);
    //   return;
    // }
    // setNewAgentsWebIds([...newAgentsWebIds, agentWebId]);
    // const newThing = await updateThingForNewRow(
    //   agentWebId,
    //   thing,
    //   fetch
    // );
    // updateTemporaryRowThing(newThing);
    // setAddingWebId(false);
  };

  if (processing) return <SkeletonRow />;

  return (
    <div className={classes.agentPickerFormContainer}>
      <form className={classes.addAgentForm} onSubmit={handleAddAgentsWebIds}>
        <div className={classes.searchBoxContainer}>
          <TextField
            aria-label="Enter WebID"
            placeholder="Enter WebID"
            value={agentWebId}
            error={existingPermission}
            helperText={
              existingPermission ? "That WebID has already been added" : null
            }
            onChange={(e) => {
              setExistingPermission(false);
              setAgentWebId(e.target.value);
            }}
            classes={{ root: classes.searchInput }}
            type="url"
            inputProps={{ "data-testid": TESTCAFE_ID_WEBID_INPUT }}
            // the duplicate props is known issue for Material UI: https://github.com/mui-org/material-ui/issues/11377
            // eslint-disable-next-line react/jsx-no-duplicate-props
            InputProps={{
              pattern: "https://.+",
              title: "Must start with https://",
              className: classes.searchInput,
              disableUnderline: true,
            }}
            required
          />
        </div>
        <Button
          data-testid={TESTCAFE_ID_ADD_WEBID_BUTTON}
          className={classes.button}
          type="submit"
          variant="with-input"
        >
          Add
        </Button>
      </form>
    </div>
  );
}

AddAgentRow.propTypes = {
  onNewAgentSubmit: T.func.isRequired,
  // index: PropTypes.number.isRequired,
  // setNewAgentsWebIds: PropTypes.func.isRequired,
  // newAgentsWebIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  // setAddingWebId: PropTypes.func.isRequired,
  // contactsArrayLength: PropTypes.number.isRequired,
  // addingWebId: PropTypes.bool.isRequired,
  // updateTemporaryRowThing: PropTypes.func.isRequired,
  // permissions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
