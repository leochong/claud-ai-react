import { ColorMode } from "@aws-amplify/ui-react";
import { ThemeStyle } from "@aws-amplify/ui-react/server";
import { ConfigureAmplify } from "./ConfigureAmplify";
import { theme } from "@/theme";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { CreateChat } from "@/components/Sidebar/CreateChat";
import { LogoutButton } from "@/components/Sidebar/Logout";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set a fixed color mode - using light as default
  const colorMode: ColorMode = "light";

  return (
    <html lang="en">
      <body {...theme.containerProps({ colorMode })}>
        <Layout>
          <ConfigureAmplify />

          <Sidebar>
            <LogoutButton />
            <CreateChat />
          </Sidebar>

          {children}
        </Layout>
        <ThemeStyle theme={theme} />
      </body>
    </html>
  );
}