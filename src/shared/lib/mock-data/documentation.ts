export interface Documentation {
  id: string;
  title: string;
  content: string;
  type: 'project-context' | 'feature-specs' | 'technical-docs';
  createdAt: string;
  updatedAt: string;
  authorId: string;
  projectId: string;
}

export const mockDocumentationData: Documentation[] = [
  {
    id: 'doc-1',
    title: 'Project Overview',
    type: 'project-context',
    content: `# Project Context

## Project Description
This project is a feature specification management tool that helps teams transform feature requests into comprehensive specifications with AI assistance.

## Key Objectives
- Streamline the feature specification process
- Reduce miscommunication between stakeholders
- Provide AI-powered assistance for documentation generation
- Enable collaborative specification refinement

## Target Audience
- Product managers
- Business analysts
- Development teams
- Designers
- Stakeholders

## Key Features
- Feature request management
- AI-powered specification generation
- Collaborative commenting and refinement
- Team management and notifications
- Documentation generation and export

## Technical Stack
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- State Management: Zustand, TanStack Query
- UI Components: Radix UI, Lucide Icons
- Authentication: Custom auth system
- Database: PostgreSQL (planned)
- Deployment: Vercel (planned)`,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    authorId: 'user-1',
    projectId: 'org-1',
  },
  {
    id: 'doc-2',
    title: 'User Authentication Feature',
    type: 'feature-specs',
    content: `# User Authentication System

## Overview
Complete authentication system supporting both admin and member signup flows with role-based access control.

## User Stories
- As a founder, I want to create a project workspace so that I can manage my team
- As a team member, I want to join an existing workspace using an invite code
- As a user, I want to securely log in and out of the system

## Technical Requirements
- Support for admin and member signup flows
- Email/password authentication
- JWT token management
- Role-based access control (founder, developer, ba, pm, designer)
- Organization/workspace management
- Invite code system for team members

## Implementation Details
- Forms built with react-hook-form and zod validation
- Secure password requirements (minimum 8 characters)
- Email validation
- Error handling and user feedback
- Responsive design for all screen sizes

## Acceptance Criteria
- ✅ Admin can create new project with workspace
- ✅ Members can join using invite codes
- ✅ Secure login/logout functionality
- ✅ Form validation and error handling
- ✅ Responsive design implementation`,
    createdAt: '2024-12-10T14:30:00Z',
    updatedAt: '2024-12-15T09:15:00Z',
    authorId: 'user-1',
    projectId: 'org-1',
  },
  {
    id: 'doc-3',
    title: 'API Integration Guidelines',
    type: 'technical-docs',
    content: `# API Integration Guidelines

## Overview
This document outlines the standards and practices for API integration within the SpecFlow application.

## Authentication
All API requests should include the JWT token in the Authorization header:
\`Authorization: Bearer <token>\`

## Request/Response Format
- All requests and responses use JSON format
- Use RESTful conventions for endpoints
- Include proper HTTP status codes

## Error Handling
- Consistent error response format
- Meaningful error messages
- Proper HTTP status codes
- Client-side error boundaries

## Data Validation
- Server-side validation for all inputs
- Use Zod schemas for TypeScript validation
- Consistent validation error format

## Rate Limiting
- Implement rate limiting for all endpoints
- Graceful degradation when limits are exceeded
- Clear error messages about rate limits

## Caching Strategy
- Use React Query for client-side caching
- Implement proper cache invalidation
- Consider server-side caching for static data`,
    createdAt: '2024-12-05T16:20:00Z',
    updatedAt: '2024-12-12T11:45:00Z',
    authorId: 'user-2',
    projectId: 'org-1',
  },
];
