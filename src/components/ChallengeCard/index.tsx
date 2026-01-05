import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '../../utils/Icons';
import { useTheme } from '../../utils/colors';
import { Challenge } from '../../services/ChallengeService';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
  progress?: number;
  onDelete?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
  progress = 0,
  onDelete,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getChallengeIcon = () => {
    switch (challenge.type) {
      case 'save_amount':
        return '💰';
      case 'spend_less':
        return '📉';
      case 'no_purchases':
        return '🚫';
      case 'category_limit':
        return '🎯';
      default:
        return '🏆';
    }
  };

  const getStatusColor = () => {
    if (challenge.status === 'completed') return theme.SUCCESS;
    if (challenge.status === 'cancelled') return theme.ERROR;
    return theme.PURPLE;
  };

  return (
    <Animated.View entering={FadeInDown}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.BACKGROUND_LIGHT }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[getStatusColor(), `${getStatusColor()}80`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.icon}>{getChallengeIcon()}</Text>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.description}>{challenge.description}</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {challenge.status === 'active' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: getStatusColor(),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: theme.TEXT }]}>
                {progress.toFixed(0)}% Complete
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{challenge.status}</Text>
            </View>
            {onDelete && (
              <TouchableOpacity
                style={[
                  styles.deleteButtonFooter,
                  {
                    backgroundColor: theme.ERROR + '15',
                    borderWidth: 1,
                    borderColor: theme.ERROR + '30',
                  },
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                activeOpacity={0.7}
              >
                <MaterialIcons name="delete-outline" size={18} color={theme.ERROR} />
                <Text style={[styles.deleteButtonText, { color: theme.ERROR }]}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
      ...theme.shadow && {
        shadowColor: theme.SHADOW,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    header: {
      flexDirection: 'row',
      padding: 16,
      alignItems: 'center',
    },
    icon: {
      fontSize: 40,
      marginRight: 12,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    body: {
      padding: 16,
    },
    progressContainer: {
      marginBottom: 12,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.BACKGROUND,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteButtonFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 6,
    },
    deleteButtonText: {
      fontSize: 12,
      fontWeight: '600',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
      textTransform: 'capitalize',
    },
  });

export default ChallengeCard;

