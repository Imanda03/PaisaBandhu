import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../../utils/colors';
import { MaterialIcons } from '../../utils/Icons';
import { scale, verticalScale } from '../../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SectionId = 'add_book' | 'add_transaction' | 'challenges';

const SECTIONS: { id: SectionId; title: string; icon: string; content: string[] }[] = [
  {
    id: 'add_book',
    title: 'Add Book',
    icon: 'menu-book',
    content: [
      'Go to the **Book** tab at the bottom.',
      'Tap the **+** button to create a new book.',
      '**Book types:**',
      '• **Single** – For your personal expenses. Only you can add and see transactions.',
      '• **Group** – Share with friends. You can split expenses and assign transactions to members.',
      'Enter a name and choose the type, then save.',
    ],
  },
  {
    id: 'add_transaction',
    title: 'Add Transaction',
    icon: 'receipt-long',
    content: [
      '**Step 1:** Open the **Book** tab.',
      '**Step 2:** Create a book (or select an existing one).',
      '**Step 3:** Tap a book to open it.',
      '**Step 4:** On the transaction screen, tap **Add Income** or **Add Expense** to record a transaction.',
      'Fill in title, amount, category, date and note, then save.',
    ],
  },
  {
    id: 'challenges',
    title: 'Challenges',
    icon: 'emoji-events',
    content: [
      'Open the **Challenges** tab.',
      'Tap the **+** button to create a challenge.',
      '**Types:** Save Amount, Spend Less, No Purchases, or Category Limit.',
      'Set a title, description, target (if needed), and end date.',
      'Track your progress and complete challenges to stay on top of your finances.',
    ],
  },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function HelpModal({ visible, onClose }: Props) {
  const { theme } = useTheme();
  const [expandedId, setExpandedId] = useState<SectionId | null>(null);

  const renderParagraph = (line: string) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <Text
        key={line}
        style={[sectionStyles.para, { color: theme.LIGHT_TEXT }]}
      >
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <Text
              key={i}
              style={[sectionStyles.para, styles.bold, { color: theme.TEXT }]}
            >
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const sectionStyles = StyleSheet.create({
    card: {
      backgroundColor: theme.BACKGROUND_LIGHT || theme.BACKGROUND,
      borderRadius: scale(16),
      marginBottom: verticalScale(14),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.BORDER_COLOR,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(18),
    },
    iconWrap: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      backgroundColor: theme.SECONDARY + '22',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: scale(14),
    },
    sectionTitle: {
      fontSize: scale(17),
      fontWeight: '800',
      color: theme.TEXT,
      flex: 1,
    },
    body: {
      paddingHorizontal: scale(18),
      paddingBottom: scale(18),
    },
    para: {
      fontSize: scale(14),
      lineHeight: scale(22),
      marginBottom: verticalScale(8),
    },
    bold: {
      fontWeight: '700',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.BACKGROUND }]}>
          <View style={[styles.headerRow, { borderBottomColor: theme.BORDER_COLOR }]}>
            <Text style={[styles.title, { color: theme.TEXT }]}>Help & Guide</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.BORDER_COLOR + '40' }]}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={22} color={theme.TEXT} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {SECTIONS.map((section) => {
              const isExpanded = expandedId === section.id || expandedId === null;
              return (
                <View key={section.id} style={sectionStyles.card}>
                  <TouchableOpacity
                    style={sectionStyles.header}
                    onPress={() =>
                      setExpandedId(expandedId === section.id ? null : section.id)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={sectionStyles.iconWrap}>
                      <MaterialIcons
                        name={section.icon as any}
                        size={24}
                        color={theme.SECONDARY}
                      />
                    </View>
                    <Text style={sectionStyles.sectionTitle}>{section.title}</Text>
                    <MaterialIcons
                      name={isExpanded ? 'expand-less' : 'expand-more'}
                      size={24}
                      color={theme.LIGHT_TEXT}
                    />
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={sectionStyles.body}>
                      {section.content.map(renderParagraph)}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    maxHeight: '85%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.2, shadowRadius: 16 },
      android: { elevation: 16 },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(20),
    borderBottomWidth: 1,
  },
  title: {
    fontSize: scale(20),
    fontWeight: '800',
  },
  closeBtn: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    maxHeight: 400,
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: verticalScale(40),
  },
  para: {
    fontSize: scale(14),
    lineHeight: scale(22),
    marginBottom: verticalScale(8),
  },
  bold: {
    fontWeight: '700',
  },
});
