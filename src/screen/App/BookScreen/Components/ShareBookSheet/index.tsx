import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import BottomSheet from '../../../../../components/BottomSheet';
import InputComponent from '../../../../../components/core/Input';
import ButtonIconComponent from '../../../../../components/core/ButtonIcon';
import { useTheme } from '../../../../../utils/colors';
import { useShareBook } from '../../../../../ReactQueryHook/book.hook';
import { scale, spacing, fontSize } from '../../../../../utils/responsive';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
};

const ShareBookSheet: React.FC<Props> = ({
  isVisible,
  onClose,
  bookId,
  bookTitle,
}) => {
  const [email, setEmail] = useState('');
  const { theme } = useTheme();
  const { mutate: shareBook, isLoading } = useShareBook();

  const sheetStyles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.BACKGROUND_LIGHT,
          borderRadius: scale(18),
          padding: spacing(16),
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: theme.BORDER_COLOR,
          marginBottom: spacing(8),
        },
        title: {
          color: theme.TEXT,
          fontSize: fontSize(17),
          fontWeight: '700',
          marginBottom: spacing(6),
          letterSpacing: 0.2,
        },
        subtitle: {
          color: theme.LIGHT_TEXT,
          fontSize: fontSize(14),
          lineHeight: fontSize(20),
          marginBottom: spacing(14),
        },
      }),
    [theme],
  );

  const handleShare = () => {
    if (!email.trim() || isLoading) return;
    shareBook(
      { bookId, email: email.trim() },
      {
        onSuccess: () => {
          setEmail('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={handleClose}
      title="Share Book"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
      >
        <View style={sheetStyles.card}>
          <Text style={sheetStyles.title}>Share "{bookTitle}"</Text>
          <Text style={sheetStyles.subtitle}>
            Invite a friend by email. They need an existing account to accept.
          </Text>
          <InputComponent
            placeholder="Friend's email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={{ marginTop: spacing(8) }}>
          <ButtonIconComponent
            title={isLoading ? 'Sharing...' : 'Share Book'}
            onPress={handleShare}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export default ShareBookSheet;
