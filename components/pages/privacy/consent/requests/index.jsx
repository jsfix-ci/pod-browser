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

import React, { useState, useEffect } from "react";
import { Container, Icons } from "@inrupt/prism-react-components";
import {
  asUrl,
  getStringNoLocale,
  getThing,
  getUrl,
} from "@inrupt/solid-client";
import { foaf, vcard } from "rdf-namespaces";
import { makeStyles } from "@material-ui/styles";
import { createStyles, Typography, Link } from "@material-ui/core";
import { useBem } from "@solid/lit-prism-patterns";
import { useRedirectIfLoggedOut } from "../../../../../src/effects/auth";
import { ConsentRequestProvider } from "../../../../../src/contexts/consentRequestContext";
import styles from "./styles";
import ConsentRequestForm from "../../../../consentRequestForm";
import {
  CONTACTS_PREDICATE,
  mockApp,
  mockAppDataset,
  POLICY_PREDICATE,
  TOS_PREDICATE,
} from "../../../../../__testUtils/mockApp";

// FIXME: When we hook up the API, replace this with actual API call
import getConsentRequestDetails from "../../../../../__testUtils/mockConsentRequestDetails";

const useStyles = makeStyles((theme) => createStyles(styles(theme)));

export default function ConsentShow() {
  useRedirectIfLoggedOut();
  const bem = useBem(useStyles());
  const [consentRequest, setConsentRequest] = useState(null);

  // FIXME: using a mock for the app profile - we will fetch profile later
  const agentDataset = mockAppDataset();
  const agentProfile = mockApp();
  const agentWebId = asUrl(agentProfile);
  const agentContactsUrl = getUrl(agentProfile, CONTACTS_PREDICATE);
  const agentContacts = getThing(agentDataset, agentContactsUrl);
  const agentName = getStringNoLocale(agentProfile, foaf.name);
  const agentUrl = getUrl(agentContacts, vcard.url);
  const agentTOS = getUrl(agentProfile, TOS_PREDICATE);
  const agentPolicy = getUrl(agentProfile, POLICY_PREDICATE);

  useEffect(() => {
    if (!consentRequest) {
      getConsentRequestDetails().then((res) => {
        setConsentRequest(res);
      });
    }
  }, [consentRequest]);

  return (
    <ConsentRequestProvider
      consentRequest={consentRequest}
      setConsentRequest={setConsentRequest}
    >
      <Container className={bem("request-container")}>
        <ConsentRequestForm />
        <div className={bem("request-container__content")}>
          <Typography
            component="h3"
            align="center"
            variant="h3"
            className={bem("heading__uppercase")}
          >
            About this application
          </Typography>
          <div className={bem("app-name")}>
            <Icons className={bem("avatar")} name="project-diagram" />
            <Typography align="center" variant="body2">
              <span className={bem("footer__link")}>
                <Link href={agentWebId} variant="body2">
                  {agentName}
                </Link>
              </span>
            </Typography>
          </div>
          <Typography className={bem("footer__links")}>
            {agentUrl && (
              <span className={bem("footer__link")}>
                <Link href={agentUrl} variant="body2">
                  <Icons
                    name="globe"
                    className={bem("icon-small", "primary")}
                  />
                  Website
                </Link>
              </span>
            )}
            {agentPolicy && (
              <span className={bem("footer__link")}>
                <Link href={agentPolicy} variant="body2">
                  <Icons
                    name="webid"
                    className={bem("icon-small", "primary")}
                  />
                  Privacy Policy
                </Link>
              </span>
            )}
            {agentTOS && (
              <span className={bem("footer__link")}>
                <Link href={agentTOS} variant="body2">
                  <Icons name="doc" className={bem("icon-small", "primary")} />
                  Terms of Service
                </Link>
              </span>
            )}
          </Typography>
        </div>
      </Container>
    </ConsentRequestProvider>
  );
}
