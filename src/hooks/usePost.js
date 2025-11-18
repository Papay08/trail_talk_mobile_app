import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const usePosts = (activeTab, currentUserId) => {
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // MANUAL JOIN APPROACH - No Supabase joins
  const fetchAllPosts = async () => {
    try {
      console.log('Fetching all posts...');
      
      // Step 1: Get posts only
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.log('Error fetching posts:', postsError);
        throw postsError;
      }
      
      console.log(`Found ${postsData?.length || 0} posts`);

      if (!postsData || postsData.length === 0) return [];

      // Step 2: Get author profiles separately
      const authorIds = [...new Set(postsData.map(post => post.author_id))];
      console.log('Fetching profiles for author IDs:', authorIds);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', authorIds);

      if (profilesError) {
        console.log('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log(`Found ${profilesData?.length || 0} profiles`);

      // Step 3: Combine data manually
      const postsWithAuthors = postsData.map(post => ({
        ...post,
        author: profilesData?.find(profile => profile.id === post.author_id) || null
      }));

      console.log('Successfully combined posts with authors');
      // For each post, fetch interaction counts from their respective tables so counts are authoritative
      const enriched = await Promise.all(postsWithAuthors.map(async (p) => {
        try {
          const postId = p.id;
          // Use head:true to get counts without returning rows
          const [{ count: likesCount }, { count: commentsCount }, { count: repostsCount }, { count: bookmarksCount }] = await Promise.all([
            supabase.from('post_likes').select('*', { head: true, count: 'exact' }).eq('post_id', postId),
            supabase.from('comments').select('*', { head: true, count: 'exact' }).eq('post_id', postId),
            supabase.from('reposts').select('*', { head: true, count: 'exact' }).eq('post_id', postId),
            supabase.from('bookmarks').select('*', { head: true, count: 'exact' }).eq('post_id', postId),
          ]);

          return {
            ...p,
            likes_count: Number(likesCount) || 0,
            comments_count: Number(commentsCount) || 0,
            reposts_count: Number(repostsCount) || 0,
            bookmarks_count: Number(bookmarksCount) || 0,
          };
        } catch (err) {
          console.log('Error fetching counts for post', p.id, err);
          return {
            ...p,
            likes_count: p.likes_count || 0,
            comments_count: p.comments_count || 0,
            reposts_count: p.reposts_count || 0,
            bookmarks_count: p.bookmarks_count || 0,
          };
        }
      }));

      return enriched;
    } catch (error) {
      console.log('Error fetching all posts:', error);
      return [];
    }
  };

  const fetchFollowingPosts = async () => {
    if (!currentUserId) {
      console.log('No current user ID, skipping following posts');
      return [];
    }

    try {
      console.log('Fetching posts from followed users for user:', currentUserId);
      
      // Step 1: Get who the user follows
      const { data: followingData, error: followError } = await supabase
        .from('follows')
        .select('following_user_id')
        .eq('follower_user_id', currentUserId);

      if (followError) {
        console.log('Error fetching follows:', followError);
        throw followError;
      }

      console.log(`User follows ${followingData?.length || 0} users`);

      if (!followingData || followingData.length === 0) return [];

      // Step 2: Get posts from followed users
      const followingUserIds = followingData.map(follow => follow.following_user_id);
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .in('author_id', followingUserIds)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.log('Error fetching followed posts:', postsError);
        throw postsError;
      }

      console.log(`Found ${postsData?.length || 0} posts from followed users`);

      if (!postsData || postsData.length === 0) return [];

      // Step 3: Get author profiles
      const authorIds = [...new Set(postsData.map(post => post.author_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', authorIds);

      if (profilesError) {
        console.log('Error fetching followed profiles:', profilesError);
        throw profilesError;
      }

      // Step 4: Combine data manually
      const postsWithAuthors = postsData.map(post => ({
        ...post,
        author: profilesData?.find(profile => profile.id === post.author_id) || null
      }));

      console.log('Successfully combined followed posts with authors');
      // Enrich counts (likes/comments/reposts/bookmarks) from related tables
      const enriched = await Promise.all(postsWithAuthors.map(async (p) => {
        try {
          const postId = p.id;
          const [{ count: likesCount }, { count: commentsCount }, { count: repostsCount }, { count: bookmarksCount }] = await Promise.all([
            supabase.from('post_likes').select('*', { head: true, count: 'exact' }).eq('post_id', postId),
            supabase.from('comments').select('*', { head: true, count: 'exact' }).eq('post_id', postId),
            supabase.from('reposts').select('*', { head: true, count: 'exact' }).eq('post_id', postId),
            supabase.from('bookmarks').select('*', { head: true, count: 'exact' }).eq('post_id', postId),
          ]);

          return {
            ...p,
            likes_count: Number(likesCount) || 0,
            comments_count: Number(commentsCount) || 0,
            reposts_count: Number(repostsCount) || 0,
            bookmarks_count: Number(bookmarksCount) || 0,
          };
        } catch (err) {
          console.log('Error fetching counts for followed post', p.id, err);
          return {
            ...p,
            likes_count: p.likes_count || 0,
            comments_count: p.comments_count || 0,
            reposts_count: p.reposts_count || 0,
            bookmarks_count: p.bookmarks_count || 0,
          };
        }
      }));

      return enriched;
    } catch (error) {
      console.log('Error in fetchFollowingPosts:', error);
      return [];
    }
  };

  const fetchPosts = async () => {
    console.log('Starting fetchPosts...');
    setRefreshing(true);
    
    try {
      const [allPosts, followedPosts] = await Promise.all([
        fetchAllPosts(),
        fetchFollowingPosts()
      ]);
      
      console.log(`Setting ${allPosts.length} all posts and ${followedPosts.length} followed posts`);
      
      setPosts(allPosts);
      setFollowingPosts(followedPosts);
    } catch (error) {
      console.log('Error in fetchPosts:', error);
    } finally {
      setRefreshing(false);
      console.log('Finished fetchPosts');
    }
  };

  useEffect(() => {
    console.log('usePosts useEffect triggered with user:', currentUserId);
    if (currentUserId) {
      fetchPosts();
    }
  }, [currentUserId]);

  // REAL-TIME SUBSCRIPTIONS: refresh feed when interactions change
  useEffect(() => {
    if (!currentUserId) return;

    console.log('Setting up realtime subscriptions for post interactions');

    const channel = supabase.channel('posts-interactions');

    const tables = ['post_likes', 'comments', 'reposts', 'bookmarks'];

    tables.forEach(table =>
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          console.log('Realtime event on', table, payload.eventType || payload.type);
          // Debounce/coalesce by scheduling a single refetch
          fetchPosts();
        }
      )
    );

    channel.subscribe((status) => console.log('posts-interactions channel status', status));

    return () => {
      try {
        channel.unsubscribe();
      } catch (e) {
        console.log('Error unsubscribing posts-interactions channel', e);
      }
    };
  }, [currentUserId]);

  return {
    posts: activeTab === 'forYou' ? posts : followingPosts,
    refreshing,
    onRefresh: fetchPosts,
    refetchPosts: fetchPosts
  };
};