import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import BottomSheet from '../../../../../components/BottomSheet';
import InputComponent from '../../../../../components/core/Input';
import ButtonIconComponent from '../../../../../components/core/ButtonIcon';
import { useTheme } from '../../../../../utils/colors';
import { useShareBook } from '../../../../../ReactQueryHook/book.hook';

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

  const handleShare = () => {
    if (!email.trim()) return;
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Text style={{ color: theme.TEXT, fontSize: 16, marginBottom: 8, fontWeight: '600' }}>
          Share "{bookTitle}" with a friend
        </Text>
        <Text style={{ color: theme.LIGHT_TEXT, fontSize: 14, marginBottom: 12 }}>
          Enter their email. They must have an account.
        </Text>
        <InputComponent
          placeholder="Friend's email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={{ marginTop: 20 }}>
          <ButtonIconComponent
            title={isLoading ? 'Sharing...' : 'Share Book'}
            onPress={handleShare}
            loading={isLoading}
            disabled={!email.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export default ShareBookSheet;
