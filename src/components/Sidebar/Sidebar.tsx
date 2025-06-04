"use client";
import * as React from "react";
import { Flex } from "@aws-amplify/ui-react";
import { FileUpload } from "../FileUpload";

export const Sidebar = ({ children }: React.PropsWithChildren) => {
  return (
    <Flex direction="column" width="500px" height="100%">
      <Flex direction="row" padding="large">
        {children}
      </Flex>
      <Flex direction="row" padding="large" justifyContent="center">
        <FileUpload />
      </Flex>
    </Flex>
  );
};