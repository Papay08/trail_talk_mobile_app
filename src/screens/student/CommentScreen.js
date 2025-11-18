import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { colors } from '../../styles/colors';
import { fonts } from '../../styles/fonts';
import { UserContext } from '../../contexts/UserContext';
import useComments from '../../hooks/useComments';
import { useNavigation, useRoute } from '@react-navigation/native';

const CommentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { post, user: routeUser, onCommentAdded } = route.params || {};
  const { user } = useContext(UserContext);
  const currentUser = routeUser || user;

  // Hook for comments
  const {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    fetchComments,
    hasCommented,
  } = useComments(post?.id, currentUser?.id);

  const [text, setText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!post) {
      navigation.goBack();
    }
  }, [post]);

  const handleSend = async () => {
    if (!currentUser) return;
    if (!text.trim()) return;
    const res = await addComment(text.trim(), false);
    if (res.success) {
      setText('');
      // scroll to bottom (newest comment)
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 250);
      
      // CALL THE CALLBACK TO UPDATE PARENT COMPONENT
      if (onCommentAdded) {
        onCommentAdded();
      }
      
      // Optionally navigate back or show success
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  };

  const renderComment = ({ item }) => {
    const isAnonymous = item.is_anonymous;
    const authorName = isAnonymous ? (item.anonymous_name || 'Anonymous') : (item.user?.display_name || 'User');
    const avatar = !isAnonymous
      ? (item.user?.avatar_url ? { uri: item.user.avatar_url } : require('../../../assets/profile_page_icons/default_profile_icon.png'))
      : require('../../../assets/profile_page_icons/profile_default_bg.png');

    return (
      <View style={styles.commentRow}>
        <Image source={avatar} style={styles.commentAvatar} />
        <View style={styles.commentBody}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{authorName}</Text>
            <Text style={styles.commentTime}>{formatTime(item.created_at)}</Text>
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>

        {item.user_id === currentUser?.id ? (
          <TouchableOpacity
            style={styles.kebabButton}
            onPress={() => {
              Alert.alert('Delete comment', 'Are you sure you want to delete this comment?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    const res = await deleteComment(item.id);
                    if (!res.success) {
                      Alert.alert('Could not delete', res.error?.message || 'Delete failed');
                    }
                  },
                },
              ]);
            }}
          >
            <Text style={styles.kebab}>⋮</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={styles.wrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
        >
          <View style={styles.container}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backText}>{'‹'}</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Comments</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Post copy */}
            <View style={styles.postCopyEnhanced}>
              <View style={styles.postHeader}>
                <Image
                  source={post?.is_anonymous ? require('../../../assets/profile_page_icons/profile_default_bg.png') : (post?.author?.avatar_url ? { uri: post.author.avatar_url } : require('../../../assets/profile_page_icons/default_profile_icon.png'))}
                  style={styles.postAvatar}
                />
                <View style={styles.postMeta}>
                  <Text style={styles.postAuthor}>{post?.is_anonymous ? (post.anonymous_name || 'Anonymous') : (post.author?.display_name || 'User')}</Text>
                  <Text style={styles.postTime}>{formatTime(post?.created_at)}</Text>
                </View>
              </View>
              <View style={styles.postContentBoxEnhanced}>
                <Text style={styles.postContentEnhanced}>{post?.content}</Text>
              </View>
            </View>

            {/* Comments list */}
            <FlatList
              ref={flatListRef}
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderComment}
              contentContainerStyle={styles.commentsList}
              ListEmptyComponent={() => (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>{loading ? 'Loading comments...' : 'No comments yet. Be the first!'}</Text>
                </View>
              )}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Write a comment..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                  <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const t = new Date(timestamp);
  const diff = (now - t) / 1000; // seconds
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return t.toLocaleDateString();
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background || '#252428' },
  wrapper: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 12, backgroundColor: 'transparent' },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, alignItems: 'flex-start' },
  backText: { fontSize: 28, color: colors.white },
  title: { fontSize: 18, fontFamily: fonts.semiBold, color: colors.white },

  postCopyEnhanced: { marginVertical: 8 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 0 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postMeta: { flexDirection: 'column' },
  postAuthor: { color: colors.white, fontFamily: fonts.semiBold },
  postTime: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.normal, fontSize: 12 },
  postContentBoxEnhanced: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  postContentEnhanced: { color: colors.white, fontFamily: fonts.normal, fontSize: 16, lineHeight: 22 },

  commentsList: { paddingVertical: 8, paddingBottom: 16 },
  commentRow: { flexDirection: 'row', paddingVertical: 8, alignItems: 'flex-start' },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  commentBody: { flex: 1 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  commentAuthor: { color: colors.white, fontFamily: fonts.semiBold },
  commentTime: { color: 'rgba(255,255,255,0.4)', fontFamily: fonts.normal, fontSize: 12 },
  commentText: { color: colors.white, fontFamily: fonts.normal, marginTop: 4 },

  kebabButton: { paddingHorizontal: 8, paddingVertical: 6, alignSelf: 'flex-start' },
  kebab: { color: 'rgba(255,255,255,0.6)', fontSize: 18 },

  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.5)', fontFamily: fonts.normal },

  inputContainer: { paddingHorizontal: 12, paddingBottom: Platform.OS === 'ios' ? 20 : 12, backgroundColor: 'transparent' },
  inputRow: { flexDirection: 'row', padding: 8, backgroundColor: '#0f0f0f', borderRadius: 999, alignItems: 'center' },
  input: { flex: 1, minHeight: 40, maxHeight: 120, backgroundColor: 'transparent', paddingHorizontal: 14, paddingVertical: 10, color: colors.white, fontFamily: fonts.normal },
  sendButton: { marginLeft: 8, backgroundColor: '#3778FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: '#fff', fontFamily: fonts.semiBold },
});

export default CommentScreen;