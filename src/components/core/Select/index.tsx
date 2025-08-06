import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useTheme } from '../../../utils/colors';
import { createStyles } from './styles';
import { useNavigation } from '@react-navigation/native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { capitalizeFirstLetter } from '../../../utils/helper';
import FriendModal from '../../FriendModal';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Category {
  id: string;
  title: string;
  icon: string;
  type: 'income' | 'expense';
  name?: string;
}

interface SelectProps {
  value: string;
  onPress: (selectedValue: string) => void;
  error?: string;
  placeholder?: string;
  options: Category[];
  label?: string;
  isFriend?: boolean;
  name?: string;
  bookId: string;
  type?: string
}

const SelectComponent = ({
  value,
  onPress,
  error,
  placeholder = 'Select option',
  options,
  label,
  isFriend,
  bookId,
  type
}: SelectProps) => {
  const { theme } = useTheme();
  const styles = createStyles();
  const navigation: any = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFriendModal, setIsFriendModal] = useState<boolean>(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const openModal = () => {
    setIsModalVisible(true);
    translateY.value = withSpring(0, {
      damping: 18,
      stiffness: 160,
      mass: 0.8,
    });
  };

  const closeModal = () => {
    runOnJS(setIsModalVisible)(false);

    translateY.value = withSpring(SCREEN_HEIGHT, {
      damping: 16,
      stiffness: 150,
      mass: 0.5,
    });
  };


  const selectedCategory = options?.find(cat => cat?.id === value);

  const navigateToCategory = () => {
    if (isFriend) {
      return setIsFriendModal(true);
    }
    closeModal();
    navigation.navigate('AddCategories', { type: type });
  };

  const onClose = () => {
    setIsFriendModal(false)
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        onPress={openModal}
        style={[
          styles.inputContainer,
          error && { borderColor: theme.ERROR },
          !error && { borderColor: value ? theme.PRIMARY : theme.BORDER_COLOR },
        ]}>
        <Text style={value ? styles.input : styles.placeholderText}>
          {isFriend ? selectedCategory?.name || placeholder : selectedCategory?.title || placeholder}
        </Text>
        <Entypo
          name={isModalVisible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={error ? theme.ERROR : theme.TEXT}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.modalContent,
            animatedModalStyle,
            { overflow: 'hidden' } // Fix visual glitch
          ]}>
            <View style={styles.modalHeader}>
              <View style={styles.insideHeader}>
                <View style={styles.leftButton} />
                <Text style={styles.modalTitle}>
                  Select {isFriend ? 'Friend' : 'Category'}
                </Text>
                <TouchableOpacity style={styles.rightSpacer} onPress={navigateToCategory}>
                  <Text style={styles.rightButtonText}>Add New</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={options}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item.id && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onPress(item.id);
                    closeModal();
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      value === item.id && styles.selectedOptionText,
                    ]}>
                    {isFriend ? item.name : capitalizeFirstLetter(item.title)}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No {isFriend ? 'friend' : 'category'} available. Please add new.
                  </Text>
                </View>
              }
            />

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      <FriendModal isVisible={isFriendModal} onClose={onClose} bookId={bookId} />
    </View>
  );
};

export default React.memo(SelectComponent);
