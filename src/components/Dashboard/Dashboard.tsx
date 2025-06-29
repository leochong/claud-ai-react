"use client";
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ConversationsContext } from '@/providers/ConversationsProvider';
import { signOut } from 'aws-amplify/auth';
import { Header } from './Header';
import { ActionCard } from './ActionCard';
import { UploadZone } from './UploadZone';
import { Button } from '../common/Button';
import { 
  FiMessageSquare, 
  FiFolder, 
  FiSettings, 
  FiPlusCircle, 
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import './Dashboard.css';

interface DashboardProps {
  user?: {
    username?: string;
    email?: string;
  } | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { createConversation } = useContext(ConversationsContext);
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreateChat = async () => {
    if (isCreatingChat || isNavigating) return;
    
    setIsCreatingChat(true);
    setIsNavigating(true);
    
    try {
      const conversation = await createConversation();
      if (conversation) {
        await router.push(`/chat/${conversation.id}`);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setIsCreatingChat(false);
      setIsNavigating(false);
    }
  };

  const handleFileManagement = () => {
    // Placeholder for file management functionality
    console.log('File management clicked');
  };

  const handleSettings = () => {
    // Placeholder for settings functionality
    console.log('Settings clicked');
  };

  const handleFileUploadComplete = (files: string[]) => {
    console.log('Files uploaded successfully:', files);
    // You can add additional logic here, such as showing a success notification
  };

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="dashboard__main">
        <div className="dashboard__container">
          {/* Welcome Section */}
          <section className="dashboard__welcome animate-fade-in">
            <div className="welcome-content">
              <h1 className="welcome-title">
                Welcome back, {user?.username || 'User'}
              </h1>
              <p className="welcome-subtitle">
                Your AI-powered workspace is ready. Start a conversation, upload files, or explore your settings.
              </p>
            </div>
            
            <div className="welcome-stats glass">
              <div className="stat-item">
                <FiTrendingUp className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">24</span>
                  <span className="stat-label">Conversations</span>
                </div>
              </div>
              <div className="stat-item">
                <FiFolder className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Files</span>
                </div>
              </div>
              <div className="stat-item">
                <FiZap className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Uptime</span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="dashboard__quick-actions">
            <div className="quick-actions-header">
              <h2 className="section-title">Quick Actions</h2>
              <Button
                variant="primary"
                size="md"
                onClick={handleCreateChat}
                isLoading={isCreatingChat}
                loadingText="Creating..."
                leftIcon={<FiPlusCircle />}
              >
                New Chat
              </Button>
            </div>
            
            <div className="action-cards-grid">
              <ActionCard
                title="Start Conversation"
                description="Begin a new AI conversation with advanced capabilities"
                icon={<FiMessageSquare />}
                color="blue"
                onClick={handleCreateChat}
                isLoading={isCreatingChat}
              />
              
              <ActionCard
                title="File Management"
                description="Upload, organize, and manage your files securely"
                icon={<FiFolder />}
                color="green"
                onClick={handleFileManagement}
              />
              
              <ActionCard
                title="Settings"
                description="Customize your experience and manage preferences"
                icon={<FiSettings />}
                color="purple"
                onClick={handleSettings}
              />
            </div>
          </section>

          {/* File Upload Section */}
          <section className="dashboard__upload animate-fade-in">
            <div className="upload-header">
              <h2 className="section-title">File Upload</h2>
              <p className="section-description">
                Drag and drop files or click to upload. Supports images, documents, and more.
              </p>
            </div>
            
            <UploadZone onUploadComplete={handleFileUploadComplete} />
          </section>
        </div>
      </main>
    </div>
  );
};