import { View, Text, TouchableOpacity } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { IoniconsIcon } from '../../../utils/Icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface AuthHeaderProps {
  title: string;
  showRightIcon?: boolean;
  rightIconName?: string;
  rightIconSize?: number;
  onRightIconPress?: () => void;
}

const AuthHeader = ({
  title,
  showRightIcon = false,
  rightIconName = '',
  rightIconSize = 26,
  onRightIconPress,
}: AuthHeaderProps) => {
  const styles = createStyles();
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <IoniconsIcon name="arrow-back" color={theme.SECONDARY} size={30} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {showRightIcon ? (
        <TouchableOpacity onPress={onRightIconPress}>
          <MaterialCommunityIcons name={rightIconName} size={rightIconSize} color={theme.SECONDARY} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 30 }} />
      )}
    </View>
  );
};

export default AuthHeader;
