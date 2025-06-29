"use client";
import React from 'react';
import { Button } from '../common/Button';
import { FiLogOut, FiUser } from 'react-icons/fi';
import './Header.css';

interface HeaderProps {
  user?: {
    username?: string;
    email?: string;
  } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="header glass">
      <div className="header__content">
        <div className="header__logo">
          <div className="logo">
            <div className="logo__icon">
              <div className="logo__gradient"></div>
            </div>
            <span className="logo__text">Claude AI</span>
          </div>
        </div>
        
        <div className="header__user">
          <div className="user-info">
            <div className="user-info__avatar">
              <FiUser />
            </div>
            <div className="user-info__details">
              <span className="user-info__name">
                {user?.username || 'User'}
              </span>
              <span className="user-info__email">
                {user?.email || 'user@example.com'}
              </span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            leftIcon={<FiLogOut />}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};