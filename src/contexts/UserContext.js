// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshCommunities, setRefreshCommunities] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const profileData = await fetchUserProfile(currentUser.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const profileData = await fetchUserProfile(currentUser.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to update profile data (call this when profile is updated)
  const updateProfile = async (userId) => {
    if (!userId) return;
    
    const profileData = await fetchUserProfile(userId);
    setProfile(profileData);
  };

  const triggerCommunityRefresh = () => {
    console.log('Triggering community refresh...');
    setRefreshCommunities(prev => prev + 1);
    setRefreshTrigger(prev => prev + 1);
  };

  const value = {
    user,
    profile,
    loading,
    refreshCommunities,
    refreshTrigger,
    triggerCommunityRefresh,
    updateProfile,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};