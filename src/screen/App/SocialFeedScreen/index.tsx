import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons, IoniconsIcon } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { FeedItem } from '../../../services/SocialFeedService';
import FeedItemComponent from '../../../components/FeedItem';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  useFetchFeed,
  useReactToFeedItem,
} from '../../../ReactQueryHook/feed.hook';
import { useFetchUserDetails } from '../../../ReactQueryHook/auth.hook';
import FeedCommentModal from '../../../components/FeedCommentModal';

type FeedType = 'public' | 'private';

const SocialFeedScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [feedType, setFeedType] = useState<FeedType>('public');
  const [selectedFeedItemId, setSelectedFeedItemId] = useState<string | null>(
    null,
  );
  const {
    data: feedItems = [],
    isLoading: loading,
    refetch,
    isRefetching: refreshing,
  } = useFetchFeed({
    limit: 20,
    feedType: feedType,
  });
  const { mutate: reactToItem } = useReactToFeedItem();
  const { data: currentUser } = useFetchUserDetails();

  const handleRefresh = () => {
    refetch();
  };

  const handleReact = (itemId: string, reaction: 'like' | 'celebrate') => {
    reactToItem({ itemId, reaction });
  };

  const handleComment = (item: FeedItem) => {
    setSelectedFeedItemId(item.id);
  };

  const handleCloseCommentModal = () => {
    setSelectedFeedItemId(null);
  };

  const renderFeedItem = ({
    item,
    index,
  }: {
    item: FeedItem;
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <FeedItemComponent
        item={item}
        currentUserId={currentUser?.id}
        feedType={feedType}
        onReact={reaction => handleReact(item.id, reaction)}
        onComment={() => handleComment(item)}
      />
    </Animated.View>
  );

  const styles = createStyles(theme);

  if (loading && feedItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <IoniconsIcon
                  name="arrow-back"
                  size={24}
                  color={theme.SECONDARY}
                />
              </TouchableOpacity>
              <MaterialIcons name="people" size={28} color={theme.SECONDARY} />
              <Text style={styles.headerText}>Social Feed</Text>
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.emptyContainer}>
            <MaterialIcons name="rss-feed" size={64} color={theme.PURPLE} />
            <Text style={[styles.emptyText, { color: theme.TEXT }]}>
              Loading feed...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <IoniconsIcon
                name="arrow-back"
                size={24}
                color={theme.SECONDARY}
              />
            </TouchableOpacity>
            <MaterialIcons name="people" size={28} color={theme.SECONDARY} />
            <Text style={styles.headerText}>Social Feed</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Tabs for Public and Private */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor:
                  feedType === 'public' ? theme.PURPLE : theme.INPUT_BACKGROUND,
                borderBottomColor:
                  feedType === 'public' ? theme.PURPLE : 'transparent',
              },
            ]}
            onPress={() => setFeedType('public')}
          >
            <MaterialIcons
              name="public"
              size={20}
              color={feedType === 'public' ? theme.SECONDARY : theme.TEXT}
            />
            <Text
              style={[
                styles.tabText,
                { color: feedType === 'public' ? theme.SECONDARY : theme.TEXT },
              ]}
            >
              Public
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor:
                  feedType === 'private'
                    ? theme.PURPLE
                    : theme.INPUT_BACKGROUND,
                borderBottomColor:
                  feedType === 'private' ? theme.PURPLE : 'transparent',
              },
            ]}
            onPress={() => setFeedType('private')}
          >
            <MaterialIcons
              name="lock"
              size={20}
              color={feedType === 'private' ? theme.SECONDARY : theme.TEXT}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: feedType === 'private' ? theme.SECONDARY : theme.TEXT,
                },
              ]}
            >
              Private
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={feedItems}
          renderItem={renderFeedItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.PURPLE]}
              tintColor={theme.PURPLE}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="rss-feed" size={64} color={theme.PURPLE} />
              <Text style={[styles.emptyText, { color: theme.TEXT }]}>
                No feed items yet
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.LIGHT_TEXT }]}>
                Start using the app to see activity here
              </Text>
            </View>
          }
        />
        {selectedFeedItemId && (
          <FeedCommentModal
            isVisible={!!selectedFeedItemId}
            onClose={handleCloseCommentModal}
            feedItemId={selectedFeedItemId}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.PURPLE,
    },
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? '15%' : '10%',
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: theme.PURPLE,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      color: theme.SECONDARY,
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
      backgroundColor: theme.BACKGROUND,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 24,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 15,
        },
      }),
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.BORDER_COLOR,
      gap: 12,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 25,
      borderBottomWidth: 2,
    },
    tabText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
    },
    listContent: {
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
  });

export default SocialFeedScreen;
