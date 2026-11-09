/**
 * Re-export from the shared AuthContext.
 * All components that import { useAuth } from './useAuth' continue to work unchanged,
 * but now they all share the same singleton state via AuthContext.
 */
export { useAuth, AuthProvider } from './AuthContext';
export type { User } from './AuthContext';
