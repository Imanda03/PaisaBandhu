import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '../../utils/Icons';
import { useTheme } from '../../utils/colors';
import { Achievement } from '../../services/AchievementService';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface AchievementBadgeProps {
  achievement: Achievement;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  onPress,
  size = 'medium',
  showProgress = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, size);

  const getRarityColors = () => {
    switch (achievement.rarity) {
      case 'legendary':
        return ['#FFD700', '#FFA500'];
      case 'epic':
        return ['#9D4EDD', '#7209B7'];
      case 'rare':
        return ['#4A90E2', '#357ABD'];
      case 'common':
      default:
        return [theme.PURPLE, theme.LIGHT_PURPLE];
    }
  };

  const colors = getRarityColors();

  const BadgeContent = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}
      >
        {achievement.unlocked ? (
          <Animated.View entering={ZoomIn.delay(100)}>
            <Text style={styles.icon}>{achievement.icon}</Text>
          </Animated.View>
        ) : (
          <View style={styles.locked}>
            <MaterialIcons name="lock" size={size === 'large' ? 32 : size === 'medium' ? 24 : 16} color="#FFFFFF" />
          </View>
        )}
      </LinearGradient>
      {size !== 'small' && (
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.TEXT }]} numberOfLines={1}>
            {achievement.title}
          </Text>
          {showProgress && !achievement.unlocked && achievement.progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(achievement.progress / (achievement.target || 100)) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: theme.LIGHT_TEXT }]}>
                {achievement.progress}/{achievement.target}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Animated.View entering={FadeInDown}>
          <BadgeContent />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View entering={FadeInDown}>
      <BadgeContent />
    </Animated.View>
  );
};

const createStyles = (theme: any, size: 'small' | 'medium' | 'large') => {
  const sizes = {
    small: { badge: 60, icon: 24, padding: 8 },
    medium: { badge: 80, icon: 32, padding: 12 },
    large: { badge: 120, icon: 48, padding: 16 },
  };

  const s = sizes[size];

  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    badge: {
      width: s.badge,
      height: s.badge,
      borderRadius: s.badge / 2,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadow && {
        shadowColor: theme.SHADOW,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      },
    },
    icon: {
      fontSize: s.icon,
    },
    locked: {
      opacity: 0.5,
    },
    info: {
      marginTop: 8,
      alignItems: 'center',
      width: 120,
    },
    title: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    progressContainer: {
      width: '100%',
      marginTop: 4,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.BACKGROUND,
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: 2,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.PURPLE,
      borderRadius: 2,
    },
    progressText: {
      fontSize: 10,
      textAlign: 'center',
    },
  });
};

export default AchievementBadge;

