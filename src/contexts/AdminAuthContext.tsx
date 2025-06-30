
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in (from localStorage)
    const savedAdmin = localStorage.getItem('adminUser');
    if (savedAdmin) {
      setAdminUser(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Call the Supabase RPC function to verify admin credentials
      const { data, error } = await supabase.rpc('verify_admin_login', {
        input_email: email,
        input_password: password
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Invalid credentials' };
      }

      // Type assertion for the RPC response since TypeScript doesn't know about our custom function
      const adminData = data as Array<{ id: string; email: string }>;

      if (adminData && adminData.length > 0) {
        const admin = { id: adminData[0].id, email: adminData[0].email };
        setAdminUser(admin);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
