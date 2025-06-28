import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  isAuthenticated: boolean;
  loading: boolean;
  children: React.ReactNode;
};

export default function ProtectedRoute({ isAuthenticated, loading, children }: Props) {
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}