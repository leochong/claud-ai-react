# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npx ampx sandbox` - Start the Amplify sandbox environment (required for local development)

## Architecture Overview

This is a Next.js 14 application built with AWS Amplify Gen2 that replicates Claude.ai/ChatGPT functionality with conversation management and AI chat capabilities.

### Key Architecture Components

**Frontend Stack:**
- Next.js 14 with App Router
- React 18 with TypeScript
- AWS Amplify UI React components
- Custom CSS with CSS variables for theming

**Backend (AWS Amplify Gen2):**
- **Authentication**: Email-based auth with Cognito User Pools
- **Data**: GraphQL API with conversation schema using Claude 3.5 Sonnet for chat and Claude 3 Haiku for naming
- **Storage**: S3 bucket for file uploads with user-specific access patterns

**Core Data Schema:**
- `chat`: AI conversation with Claude 3.5 Sonnet, owner-only authorization
- `chatNamer`: AI generation using Claude 3 Haiku to create descriptive conversation names

### Application Structure

**Layout & Providers:**
- Root layout wraps everything in `Authenticator` → `ConversationsProvider` → `Layout`
- `ConfigureAmplify.tsx` handles Amplify configuration client-side
- Fixed light mode theme with custom CSS variables

**Main Components:**
- `Dashboard`: Landing page showing user info and conversation management
- `Chat`: Individual conversation interface with file attachments and markdown rendering
- `Sidebar`: Navigation with conversation list, create chat, and logout
- `ConversationsProvider`: Context for managing conversation state across the app

**Routing:**
- `/` - Dashboard (main page)
- `/chat/[id]` - Individual chat conversation

### Key Implementation Details

**Conversation Flow:**
- New chats created with "New Chat" name
- Initial messages stored in sessionStorage and processed on mount
- Chat names automatically generated using Claude 3 Haiku based on first message content
- Messages rendered with ReactMarkdown for formatting

**File Handling:**
- S3 storage configured with `private/{entity_id}/*` access pattern
- File uploads supported in chat interface via `allowAttachments`

**State Management:**
- Conversations managed through React Context (`ConversationsProvider`)
- Real-time updates via Amplify GraphQL subscriptions
- Optimistic updates for conversation operations

## Development Notes

- Amplify sandbox must be running (`npx ampx sandbox`) for local development
- AWS account needs Bedrock access with Claude models enabled
- All conversations are user-scoped (owner authorization)
- File uploads go to user-specific S3 paths for privacy