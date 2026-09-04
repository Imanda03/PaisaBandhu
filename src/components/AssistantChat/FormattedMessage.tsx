import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../../utils/colors';
import { fontSize, scale, spacing, verticalScale } from '../../utils/responsive';

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'numbers'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'divider' };

function parseBlocks(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, '\n').trim().split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (/^[-*_]{3,}$/.test(trimmed)) {
      blocks.push({ type: 'divider' });
      i += 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim(),
      });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ') });
      continue;
    }

    if (/^[-•*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-•*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-•*]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'bullets', items });
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'numbers', items });
      continue;
    }

    const para: string[] = [trimmed];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,3}\s+/.test(lines[i].trim()) &&
      !/^[-•*]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim()) &&
      !/^>\s?/.test(lines[i].trim()) &&
      !/^[-*_]{3,}$/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: 'paragraph', text: para.join(' ') });
  }

  return blocks;
}

type InlinePart =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'code'; value: string };

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', value: text.slice(last, match.index) });
    }
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push({ type: 'bold', value: token.slice(2, -2) });
    } else if (token.startsWith('`')) {
      parts.push({ type: 'code', value: token.slice(1, -1) });
    } else {
      parts.push({ type: 'italic', value: token.slice(1, -1) });
    }
    last = match.index + token.length;
  }

  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) });
  }

  return parts.length ? parts : [{ type: 'text', value: text }];
}

type Props = {
  content: string;
  theme: ThemeColors;
  isDark: boolean;
  isUser?: boolean;
};

const FormattedMessage: React.FC<Props> = ({
  content,
  theme,
  isDark,
  isUser = false,
}) => {
  const styles = useMemo(
    () => createFormatStyles(theme, isDark, isUser),
    [theme, isDark, isUser],
  );
  const blocks = useMemo(() => parseBlocks(content), [content]);

  const renderInline = (text: string, keyPrefix: string) =>
    parseInline(text).map((part, idx) => {
      const key = `${keyPrefix}-${idx}`;
      if (part.type === 'bold') {
        return (
          <Text key={key} style={styles.bold}>
            {part.value}
          </Text>
        );
      }
      if (part.type === 'italic') {
        return (
          <Text key={key} style={styles.italic}>
            {part.value}
          </Text>
        );
      }
      if (part.type === 'code') {
        return (
          <Text key={key} style={styles.code}>
            {part.value}
          </Text>
        );
      }
      return (
        <Text key={key} style={styles.text}>
          {part.value}
        </Text>
      );
    });

  if (isUser) {
    return (
      <Text style={styles.userPlain}>{content}</Text>
    );
  }

  return (
    <View style={styles.wrap}>
      {blocks.map((block, index) => {
        const key = `b-${index}`;
        const isLast = index === blocks.length - 1;

        if (block.type === 'heading') {
          return (
            <Text
              key={key}
              style={[
                styles.heading,
                block.level === 1 && styles.h1,
                block.level === 2 && styles.h2,
                block.level === 3 && styles.h3,
                !isLast && styles.blockGap,
              ]}
            >
              {renderInline(block.text, key)}
            </Text>
          );
        }

        if (block.type === 'divider') {
          return <View key={key} style={[styles.divider, !isLast && styles.blockGap]} />;
        }

        if (block.type === 'quote') {
          return (
            <View key={key} style={[styles.quote, !isLast && styles.blockGap]}>
              <Text style={styles.quoteText}>{renderInline(block.text, key)}</Text>
            </View>
          );
        }

        if (block.type === 'bullets') {
          return (
            <View key={key} style={!isLast ? styles.blockGap : undefined}>
              {block.items.map((item, itemIndex) => (
                <View key={`${key}-i-${itemIndex}`} style={styles.listRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{renderInline(item, `${key}-${itemIndex}`)}</Text>
                </View>
              ))}
            </View>
          );
        }

        if (block.type === 'numbers') {
          return (
            <View key={key} style={!isLast ? styles.blockGap : undefined}>
              {block.items.map((item, itemIndex) => (
                <View key={`${key}-n-${itemIndex}`} style={styles.listRow}>
                  <Text style={styles.number}>{itemIndex + 1}.</Text>
                  <Text style={styles.listText}>{renderInline(item, `${key}-${itemIndex}`)}</Text>
                </View>
              ))}
            </View>
          );
        }

        return (
          <Text key={key} style={[styles.paragraph, !isLast && styles.blockGap]}>
            {renderInline(block.text, key)}
          </Text>
        );
      })}
    </View>
  );
};

const createFormatStyles = (
  theme: ThemeColors,
  isDark: boolean,
  isUser: boolean,
) =>
  StyleSheet.create({
    wrap: {
      gap: 0,
    },
    userPlain: {
      fontSize: fontSize(15),
      lineHeight: fontSize(22),
      fontWeight: '500',
      color: isDark ? '#1A1A1F' : '#F7F7F8',
    },
    text: {
      color: isUser ? (isDark ? '#1A1A1F' : '#F7F7F8') : theme.TEXT,
      fontSize: fontSize(15),
      lineHeight: fontSize(23),
    },
    paragraph: {
      color: theme.TEXT,
      fontSize: fontSize(15),
      lineHeight: fontSize(23),
    },
    bold: {
      color: theme.TEXT,
      fontSize: fontSize(15),
      lineHeight: fontSize(23),
      fontWeight: '700',
    },
    italic: {
      color: theme.TEXT,
      fontSize: fontSize(15),
      lineHeight: fontSize(23),
      fontStyle: 'italic',
    },
    code: {
      fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
      fontSize: fontSize(13),
      color: isDark ? '#E0C48A' : '#8A6D3B',
      backgroundColor: isDark ? 'rgba(198,165,107,0.12)' : 'rgba(198,165,107,0.12)',
    },
    heading: {
      color: theme.TEXT,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    h1: {
      fontSize: fontSize(17),
      lineHeight: fontSize(23),
      marginBottom: verticalScale(2),
    },
    h2: {
      fontSize: fontSize(15),
      lineHeight: fontSize(21),
      marginBottom: verticalScale(2),
    },
    h3: {
      fontSize: fontSize(14),
      lineHeight: fontSize(20),
      fontWeight: '700',
      color: isDark ? '#E0C48A' : '#8A6D3B',
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: verticalScale(6),
      paddingRight: spacing(4),
    },
    bullet: {
      width: scale(16),
      color: '#C6A56B',
      fontSize: fontSize(15),
      lineHeight: fontSize(23),
      fontWeight: '700',
    },
    number: {
      width: scale(20),
      color: '#C6A56B',
      fontSize: fontSize(14),
      lineHeight: fontSize(23),
      fontWeight: '700',
    },
    listText: {
      flex: 1,
      color: theme.TEXT,
      fontSize: fontSize(15),
      lineHeight: fontSize(23),
    },
    quote: {
      borderLeftWidth: 3,
      borderLeftColor: '#C6A56B',
      paddingLeft: spacing(10),
      paddingVertical: verticalScale(2),
    },
    quoteText: {
      color: theme.LIGHT_TEXT,
      fontSize: fontSize(14),
      lineHeight: fontSize(21),
      fontStyle: 'italic',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(30,30,36,0.1)',
      marginVertical: verticalScale(4),
    },
    blockGap: {
      marginBottom: verticalScale(10),
    },
  });

export default React.memo(FormattedMessage);
