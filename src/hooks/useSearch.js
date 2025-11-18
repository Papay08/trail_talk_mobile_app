// src/hooks/useSearch.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]); // Store all fetched users
  const [filteredUsers, setFilteredUsers] = useState([]); // Users after category filter
  const [suggestedAccounts, setSuggestedAccounts] = useState([]);
  const [communityResults, setCommunityResults] = useState([]);
  const [suggestedCommunities, setSuggestedCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Get user initials from student_id or faculty_id
  const getInitials = (profile) => {
    if (!profile) return 'US';
    // Prefer display_name initials
    if (profile.display_name) {
      const parts = profile.display_name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    }
    // Fall back to username
    if (profile.username) return profile.username.substring(0, 2).toUpperCase();
    // Fall back to student_id or other id-like field
    if (profile.student_id) return profile.student_id.substring(0, 2).toUpperCase();
    return 'US';
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
        .or(`display_name.ilike.%${query}%,username.ilike.%${query}%,student_id.ilike.%${query}%,school_email.ilike.%${query}%,user_type.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      
      const enhancedUsers = (data || []).map((user) => ({
        ...user,
        initials: getInitials(user),
        displayName: user.display_name || user.username || (user.school_email ? user.school_email.split('@')[0] : 'User'),
        displayUsername: user.student_id || user.username || 'user',
        avatarUrl: user.avatar_url || null,
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
        displayName: user.display_name || user.username || (user.school_email ? user.school_email.split('@')[0] : 'User'),
        displayUsername: user.student_id || user.username || 'user',
        avatarUrl: user.avatar_url || null,
      }));

      return enhancedAccounts;
    } catch (error) {
      console.error('Error fetching suggested accounts:', error);
      return [];
    }
  }, []);

  // Search communities table
  const searchCommunities = useCallback(async (query) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;

      const results = (data || []).map((c) => ({
        ...c,
        id: c.id,
        name: c.name,
        description: c.description,
        member_count: c.member_count || 0,
      }));

      return results;
    } catch (err) {
      console.error('Error searching communities:', err);
      return [];
    }
  }, []);

  const getSuggestedCommunities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;

      const enhanced = (data || []).map((c) => ({
        ...c,
        id: c.id,
        name: c.name,
        description: c.description,
        member_count: c.member_count || 0,
      }));

      return enhanced;
    } catch (err) {
      console.error('Error fetching suggested communities:', err);
      return [];
    }
  }, []);

  // Main search function
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setAllUsers([]);
      setFilteredUsers([]);
      setCommunityResults([]);
      await loadSuggestedContent();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (activeCategory === 'communities') {
        const commResults = await searchCommunities(query);
        setCommunityResults(commResults);
      } else {
        const usersResults = await searchUsers(query);
        // Store all users and apply current category filter
        setAllUsers(usersResults);
        const filtered = applyCategoryFilter(usersResults, activeCategory);
        setFilteredUsers(filtered);
      }
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchUsers, searchCommunities, activeCategory, applyCategoryFilter]);

  // Load suggested content
  const loadSuggestedContent = useCallback(async () => {
    try {
      const [accounts, communities] = await Promise.all([getSuggestedAccounts(), getSuggestedCommunities()]);
      const filteredAccounts = applyCategoryFilter(accounts, activeCategory);
      setSuggestedAccounts(filteredAccounts);
      setAllUsers(accounts);
      setFilteredUsers(filteredAccounts);

      // communities suggestions
      setSuggestedCommunities(communities);
      setCommunityResults(communities);
    } catch (err) {
      console.error('Error loading suggested content:', err);
    }
  }, [getSuggestedAccounts, getSuggestedCommunities, activeCategory, applyCategoryFilter]);

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
    // if switched to communities, ensure community results are prepared
    if (category === 'communities' && suggestedCommunities.length === 0) {
      getSuggestedCommunities().then(setSuggestedCommunities).then(setCommunityResults).catch(() => {});
    }
  }, [allUsers, suggestedAccounts, applyCategoryFilter, suggestedCommunities, getSuggestedCommunities]);

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

  // Immediate client-side filtering for real-time feedback while typing
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();

    if (q.length === 0) {
      // restore suggested content
      const filteredAccounts = applyCategoryFilter(suggestedAccounts, activeCategory);
      setFilteredUsers(filteredAccounts);
      setCommunityResults(suggestedCommunities);
      return;
    }

    // Local filter for users
    if (allUsers && allUsers.length > 0) {
      const localFiltered = allUsers.filter((u) => {
        const name = (u.displayName || u.username || u.school_email || '').toString().toLowerCase();
        const id = (u.student_id || u.displayUsername || '').toString().toLowerCase();
        return name.includes(q) || id.includes(q);
      });
      setFilteredUsers(applyCategoryFilter(localFiltered, activeCategory));
    }

    // Local filter for suggested accounts when allUsers empty
    if ((!allUsers || allUsers.length === 0) && suggestedAccounts && suggestedAccounts.length > 0) {
      const localSuggested = suggestedAccounts.filter((u) => {
        const name = (u.displayName || u.username || u.school_email || '').toString().toLowerCase();
        const id = (u.student_id || u.displayUsername || '').toString().toLowerCase();
        return name.includes(q) || id.includes(q);
      });
      setFilteredUsers(applyCategoryFilter(localSuggested, activeCategory));
    }

    // Local filter for communities
    if (suggestedCommunities && suggestedCommunities.length > 0) {
      const localComm = suggestedCommunities.filter((c) => {
        const name = (c.name || '').toString().toLowerCase();
        const desc = (c.description || '').toString().toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
      setCommunityResults(localComm);
    }
  }, [searchQuery, allUsers, suggestedAccounts, suggestedCommunities, activeCategory, applyCategoryFilter]);

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
    communityResults,
    suggestedAccounts,
    suggestedCommunities,
    isLoading,
    error,
    activeCategory,
    setActiveCategory: handleCategoryChange, // Use the enhanced category change handler
    performSearch,
    clearSearch,
    loadSuggestedContent
  };
};