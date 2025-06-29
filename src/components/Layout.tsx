"use client";
import * as React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { ConversationsProvider } from "@/providers/ConversationsProvider";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <Authenticator>
      <ConversationsProvider>
        <div style={{ width: "100vw", minHeight: "100vh" }}>
          {children}
        </div>
      </ConversationsProvider>
    </Authenticator>
  );
};
