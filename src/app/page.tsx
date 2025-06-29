"use client";

import * as React from "react";
import { getCurrentUser } from 'aws-amplify/auth';
import { Dashboard } from "@/components/Dashboard/Dashboard";

export default function Home() {
  const [user, setUser] = React.useState<{ username?: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--background)',
        color: 'var(--text-white)'
      }}>
        Loading...
      </div>
    );
  }

  return <Dashboard user={user} />;
}
