import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Modal,
  Pressable,
  StyleSheet,
  Keyboard,
  type KeyboardEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '../../utils/Icons';
import { useTheme } from '../../utils/colors';
import { createStyles } from './styles';
import FormattedMessage from './FormattedMessage';
import { useAssistantChat } from '../../ReactQueryHook/assistant.hook';
import { AssistantChatMessage } from '../../services/AssistantService';

type ChatItem = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type QuickAction = {
  id: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  description: string;
  prompt: string;
  tint: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'balance',
    icon: 'account-balance-wallet',
    title: 'Check balance',
    description: 'This month’s income and expenses',
    prompt: "What's my balance this month?",
    tint: '#C6A56B',
  },
  {
    id: 'expense',
    icon: 'add-circle-outline',
    title: 'Add expense',
    description: 'Log a transaction quickly',
    prompt: 'Add expense Rs 500 for lunch under Food',
    tint: '#D45D5D',
  },
  {
    id: 'recent',
    icon: 'receipt-long',
    title: 'Recent activity',
    description: 'Show latest transactions',
    prompt: 'Show my recent transactions',
    tint: '#5BA56B',
  },
  {
    id: 'books',
    icon: 'menu-book',
    title: 'My books',
    description: 'List all expense books',
    prompt: 'List my books',
    tint: '#6B8CAE',
  },
];

type Props = {
  bottomOffset?: number;
  onDataChanged?: () => void;
};

const TypingDots = ({ color }: { color: string }) => {
  const d1 = useSharedValue(0.35);
  const d2 = useSharedValue(0.35);
  const d3 = useSharedValue(0.35);

  useEffect(() => {
    const pulse = (sv: typeof d1, delay: number) => {
      sv.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 320 }),
            withTiming(0.35, { duration: 320 }),
          ),
          -1,
          false,
        ),
      );
    };
    pulse(d1, 0);
    pulse(d2, 140);
    pulse(d3, 280);
  }, [d1, d2, d3]);

  const s1 = useAnimatedStyle(() => ({ opacity: d1.value }));
  const s2 = useAnimatedStyle(() => ({ opacity: d2.value }));
  const s3 = useAnimatedStyle(() => ({ opacity: d3.value }));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 2 }}>
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }, s1]} />
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }, s2]} />
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }, s3]} />
    </View>
  );
};

const AssistantChat: React.FC<Props> = ({ bottomOffset = 100, onDataChanged }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [keyboardLift, setKeyboardLift] = useState(0);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const composerBarRef = useRef<View>(null);
  const liftTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const assistantChat = useAssistantChat();

  const translateY = useSharedValue(800);
  const overlayOpacity = useSharedValue(0);
  const canSend = input.trim().length > 0 && !assistantChat.isLoading;

  const restingPad = Math.max(insets.bottom, 12);

  // Measure the visible input bar vs keyboard — only lift by actual overlap.
  // Wait for adjustResize on phones that support it; refine once more if OS
  // resizes late so we don't over-lift the composer.
  useEffect(() => {
    const clearLiftTimers = () => {
      liftTimersRef.current.forEach(clearTimeout);
      liftTimersRef.current = [];
    };

    if (!mounted) {
      clearLiftTimers();
      setKeyboardLift(0);
      return;
    }

    const measureBar = (
      keyboardTop: number,
      mode: 'set' | 'refine',
    ) => {
      composerBarRef.current?.measureInWindow((_x, y, _w, h) => {
        if (typeof y !== 'number' || typeof h !== 'number') return;
        const gap = keyboardTop - (y + h);

        if (mode === 'set') {
          // Covered → lift by overlap; already clear → no lift
          setKeyboardLift(gap < -12 ? Math.ceil(-gap) + 8 : 0);
        } else {
          // Late OS resize: shrink over-lift; still covered: nudge up
          if (gap > 28) {
            setKeyboardLift(prev => Math.max(0, prev - Math.floor(gap - 12)));
          } else if (gap < -12) {
            setKeyboardLift(prev => prev + Math.ceil(-gap) + 8);
          }
        }
        listRef.current?.scrollToEnd({ animated: true });
      });
    };

    const applyLiftForKeyboard = (e: KeyboardEvent) => {
      const keyboardTop = e.endCoordinates.screenY;
      clearLiftTimers();
      setKeyboardLift(0);

      const firstDelay = Platform.OS === 'android' ? 140 : 40;
      const refineDelay = firstDelay + (Platform.OS === 'android' ? 120 : 60);

      liftTimersRef.current.push(
        setTimeout(() => measureBar(keyboardTop, 'set'), firstDelay),
        setTimeout(() => measureBar(keyboardTop, 'refine'), refineDelay),
      );
    };

    const onHide = () => {
      clearLiftTimers();
      setKeyboardLift(0);
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, applyLiftForKeyboard);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      clearLiftTimers();
      showSub.remove();
      hideSub.remove();
    };
  }, [mounted]);

  const composerBottomPad = restingPad + keyboardLift;

  const openSheet = useCallback(() => {
    setMounted(true);
    setKeyboardLift(0);
    overlayOpacity.value = withTiming(1, { duration: 200 });
    translateY.value = withTiming(0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [overlayOpacity, translateY]);

  const closeSheet = useCallback(() => {
    Keyboard.dismiss();
    setKeyboardLift(0);
    overlayOpacity.value = withTiming(0, { duration: 160 });
    translateY.value = withTiming(
      800,
      { duration: 240, easing: Easing.in(Easing.cubic) },
      finished => {
        if (finished) runOnJS(setMounted)(false);
      },
    );
  }, [overlayOpacity, translateY]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setInput('');
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || assistantChat.isLoading) return;

      const userItem: ChatItem = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };
      const nextMessages = [...messages, userItem];
      setMessages(nextMessages);
      setInput('');
      scrollToEnd();

      const apiMessages: AssistantChatMessage[] = nextMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const result = await assistantChat.mutateAsync(apiMessages);
        setMessages(prev => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: result.message,
          },
        ]);
        if (result.actionsPerformed?.length) onDataChanged?.();
        scrollToEnd();
      } catch {
        // toast in hook
      }
    },
    [assistantChat, messages, onDataChanged, scrollToEnd],
  );

  const renderMessage = useCallback(
    ({ item, index }: { item: ChatItem; index: number }) => {
      const isUser = item.role === 'user';
      return (
        <Animated.View
          entering={FadeInUp.delay(Math.min(index * 16, 60)).duration(220)}
          style={[
            styles.bubbleRow,
            isUser ? styles.bubbleRowUser : styles.bubbleRowAssistant,
          ]}
        >
          {!isUser && (
            <View style={styles.avatar}>
              <MaterialIcons name="auto-awesome" size={12} color="#C6A56B" />
            </View>
          )}
          <View
            style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}
          >
            <FormattedMessage
              content={item.content}
              theme={theme}
              isDark={isDark}
              isUser={isUser}
            />
          </View>
        </Animated.View>
      );
    },
    [styles, isDark, theme],
  );

  const emptyState = useMemo(
    () => (
      <View style={styles.welcome}>
        <View style={styles.welcomeHero}>
          <Text style={styles.welcomeTitle}>How can I help?</Text>
          <Text style={styles.welcomeBody}>
            Ask about balances, add expenses, or manage books.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Suggestions</Text>
        <View style={styles.actionList}>
          {QUICK_ACTIONS.map((action, i) => (
            <Animated.View
              key={action.id}
              entering={FadeInDown.delay(40 + i * 40).duration(220)}
            >
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => sendMessage(action.prompt)}
                activeOpacity={0.75}
                disabled={assistantChat.isLoading}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: action.tint + '1A' }]}
                >
                  <MaterialIcons name={action.icon} size={18} color={action.tint} />
                </View>
                <View style={styles.actionCopy}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDesc} numberOfLines={1}>
                    {action.description}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={theme.LIGHT_TEXT} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    ),
    [styles, sendMessage, assistantChat.isLoading, theme.LIGHT_TEXT],
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { bottom: bottomOffset }]}
        onPress={openSheet}
        activeOpacity={0.85}
        accessibilityLabel="Open Kharcha AI"
      >
        <MaterialIcons name="auto-awesome" size={22} color={theme.SECONDARY} />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="none"
        visible={mounted}
        onRequestClose={closeSheet}
        statusBarTranslucent
      >
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDark
                  ? 'rgba(0,0,0,0.55)'
                  : 'rgba(15,16,18,0.4)',
              },
              overlayStyle,
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
          </Animated.View>

          <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
            <Animated.View style={[styles.sheetRoot, sheetStyle]}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <View style={styles.headerAvatar}>
                  <MaterialIcons name="auto-awesome" size={16} color="#C6A56B" />
                </View>
                <View style={styles.headerCopy}>
                  <View style={styles.headerTitleRow}>
                    <Text style={styles.headerTitle}>Kharcha AI</Text>
                    <View style={styles.statusDot} />
                  </View>
                  <Text style={styles.headerSubtitle}>Finance assistant</Text>
                </View>
                <View style={styles.headerActions}>
                  {messages.length > 0 && (
                    <TouchableOpacity
                      style={styles.iconBtn}
                      onPress={resetChat}
                      hitSlop={8}
                      accessibilityLabel="New chat"
                    >
                      <MaterialIcons name="refresh" size={18} color={theme.LIGHT_TEXT} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={closeSheet}
                    hitSlop={8}
                    accessibilityLabel="Close"
                  >
                    <MaterialIcons name="close" size={20} color={theme.TEXT} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.body}>
                <FlatList
                  ref={listRef}
                  style={styles.messageList}
                  contentContainerStyle={styles.messageListContent}
                  data={messages}
                  keyExtractor={item => item.id}
                  renderItem={renderMessage}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={emptyState}
                  ListFooterComponent={
                    assistantChat.isLoading ? (
                      <View style={[styles.bubbleRow, styles.bubbleRowAssistant]}>
                        <View style={styles.avatar}>
                          <MaterialIcons name="auto-awesome" size={12} color="#C6A56B" />
                        </View>
                        <View style={[styles.bubble, styles.assistantBubble]}>
                          <TypingDots color="#C6A56B" />
                        </View>
                      </View>
                    ) : null
                  }
                  onContentSizeChange={scrollToEnd}
                />

                <View
                  style={[
                    styles.composerWrap,
                    { paddingBottom: composerBottomPad },
                  ]}
                >
                  <View
                    ref={composerBarRef}
                    collapsable={false}
                    style={[
                      styles.composerBar,
                      inputFocused && styles.composerBarFocused,
                    ]}
                  >
                    <View style={styles.inputShell}>
                      <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Ask about balance, expenses, books…"
                        placeholderTextColor={theme.PLACEHOLDER_COLOR}
                        value={input}
                        onChangeText={setInput}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        multiline
                        maxLength={500}
                        editable={!assistantChat.isLoading}
                        onSubmitEditing={() => sendMessage(input)}
                        returnKeyType="send"
                        blurOnSubmit={false}
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.sendBtn, !canSend && styles.sendBtnIdle]}
                      onPress={() => sendMessage(input)}
                      disabled={!canSend}
                      activeOpacity={0.8}
                      accessibilityLabel="Send"
                    >
                      <MaterialIcons
                        name="arrow-upward"
                        size={22}
                        color={canSend ? '#1A1A1F' : theme.LIGHT_TEXT}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(AssistantChat);
