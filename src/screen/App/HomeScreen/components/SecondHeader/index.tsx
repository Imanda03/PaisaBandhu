import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import { createStyles } from './styles';
import { getFormattedDate, getGreeting } from '../../../../../utils/helper';
import { useFetchUserDetails } from '../../../../../ReactQueryHook/auth.hook';
import { useTheme } from '../../../../../utils/colors';

const SecondHeader = () => {
  const styles = createStyles();
  const { theme } = useTheme();
  const { data: userData, isLoading } = useFetchUserDetails();

  // Get first name from fullName or use 'User' as fallback
  const firstName = userData?.fullName?.split(' ')[0] || 'User';
  const avatarLetter = firstName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.greetText}>{getGreeting(firstName)}</Text>
          {/* <Text style={styles.subText}>Welcome back!</Text> */}
        </View>
        <View style={styles.avatar}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.SECONDARY} />
          ) : (
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          )}
        </View>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{getFormattedDate()}</Text>
      </View>
    </View>
  );
};

export default SecondHeader;
