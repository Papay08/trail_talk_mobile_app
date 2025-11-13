// src/hooks/useSearch.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]); // Store all fetched users
  const [filteredUsers, setFilteredUsers] = useState([]); // Users after category filter
  const [suggestedAccounts, setSuggestedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Get user initials from student_id or faculty_id
  const getInitials = (profile) => {
    if (!profile) return 'US';
    if (profile.student_id) {
      return profile.student_id.substring(0, 2).toUpperCase();
    }
    return 'US'; // Default if no student_id
  };

  // Apply category filter to users
  const applyCategoryFilter = useCallback((users, category) => {
    if (category === 'all') {
      return users;
    } else if (category === 'students') {
      return users.filter(user => user.user_type === 'student');
    } else if (category === 'faculty') {
      return users.filter(user => user.user_type === 'faculty');
    }
    return users;
  }, []);

  // Search across users/profiles - FIXED: Only search existing columns
  const searchUsers = useCallback(async (query) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,student_id.ilike.%${query}%,user_type.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      
      const enhancedUsers = (data || []).map((user) => ({
        ...user,
        initials: getInitials(user),
        displayName: user.username || 'User',
        displayUsername: user.student_id || 'user' // Removed faculty_id reference
      }));

      return enhancedUsers;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }, []);

  // Get suggested accounts - FIXED: Only use existing columns
  const getSuggestedAccounts = useCallback(async () => {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      
      const enhancedAccounts = (data || []).map((user) => ({
        ...user,
        initials: getInitials(user),
        displayName: user.username || 'User',
        displayUsername: user.student_id || 'user' // Removed faculty_id reference
      }));

      return enhancedAccounts;
    } catch (error) {
      console.error('Error fetching suggested accounts:', error);
      return [];
    }
  }, []);

  // Main search function
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setAllUsers([]);
      setFilteredUsers([]);
      await loadSuggestedContent();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const usersResults = await searchUsers(query);
      
      // Store all users and apply current category filter
      setAllUsers(usersResults);
      const filtered = applyCategoryFilter(usersResults, activeCategory);
      setFilteredUsers(filtered);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchUsers, activeCategory, applyCategoryFilter]);

  // Load suggested content
  const loadSuggestedContent = useCallback(async () => {
    try {
      const accounts = await getSuggestedAccounts();
      const filteredAccounts = applyCategoryFilter(accounts, activeCategory);
      
      setSuggestedAccounts(filteredAccounts);
      setAllUsers(accounts);
      setFilteredUsers(filteredAccounts);
    } catch (err) {
      console.error('Error loading suggested content:', err);
    }
  }, [getSuggestedAccounts, activeCategory, applyCategoryFilter]);

  // Handle category change
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    
    // Apply filter to currently displayed users
    if (allUsers.length > 0) {
      const filtered = applyCategoryFilter(allUsers, category);
      setFilteredUsers(filtered);
    }
    
    // Also filter suggested accounts
    if (suggestedAccounts.length > 0) {
      const filteredSuggested = applyCategoryFilter(suggestedAccounts, category);
      setSuggestedAccounts(filteredSuggested);
    }
  }, [allUsers, suggestedAccounts, applyCategoryFilter]);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      loadSuggestedContent();
    }
  }, [searchQuery, performSearch, loadSuggestedContent]);

  // Load suggested content on mount
  useEffect(() => {
    loadSuggestedContent();
  }, [loadSuggestedContent]);

  // Update filtered users when activeCategory changes
  useEffect(() => {
    if (allUsers.length > 0) {
      const filtered = applyCategoryFilter(allUsers, activeCategory);
      setFilteredUsers(filtered);
    }
  }, [activeCategory, allUsers, applyCategoryFilter]);

  // Clear search results
  const clearSearch = () => {
    setSearchQuery('');
    setAllUsers([]);
    setFilteredUsers([]);
    loadSuggestedContent();
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults: filteredUsers, // Return filtered users as searchResults
    suggestedAccounts,
    isLoading,
    error,
    activeCategory,
    setActiveCategory: handleCategoryChange, // Use the enhanced category change handler
    performSearch,
    clearSearch,
    loadSuggestedContent
  };
};