"use client";
import React from 'react';
import './ActionCard.css';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
  onClick: () => void;
  isLoading?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
  isLoading = false
}) => {
  return (
    <div 
      className={`action-card action-card--${color} glass hover-lift animate-fade-in ${isLoading ? 'action-card--loading' : ''}`}
      onClick={!isLoading ? onClick : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="action-card__content">
        <div className="action-card__icon">
          {isLoading ? (
            <div className="action-card__spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            icon
          )}
        </div>
        
        <div className="action-card__text">
          <h3 className="action-card__title">{title}</h3>
          <p className="action-card__description">{description}</p>
        </div>
      </div>
      
      <div className={`action-card__background action-card__background--${color}`}></div>
    </div>
  );
};