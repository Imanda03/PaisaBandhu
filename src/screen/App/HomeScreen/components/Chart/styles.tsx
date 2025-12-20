import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../../utils/colors';

export const createStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: theme.LIGHT_PURPLE,
      marginVertical: '2%',
      padding: '2%',
      borderRadius: 10,
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerLabelContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    percentageText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    statusText: {
      fontSize: 16,
      opacity: 0.7,
    },
    noDataText: {
      fontSize: 12,
      opacity: 0.5,
    },
    detailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 10,
      paddingHorizontal: 20,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    detailText: {
      fontSize: 14,
      color: theme.SECONDARY,
      fontWeight: 500,
    },
    infoWrapper: {
      alignSelf: 'flex-end',
      position: 'relative',
      zIndex: 2,
      marginBottom: -10,
      paddingHorizontal: 15,
    },

    tooltipContainer: {
      position: 'absolute',
      top: 25,
      right: 0,
      backgroundColor: theme.BACKGROUND_LIGHT,
      padding: 8,
      borderRadius: 6,
      borderColor: theme.BORDER_COLOR,
      borderWidth: 0.5,
      maxWidth: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 4,
    },

    tooltipText: {
      fontSize: 14,
      color: theme.TEXT,
      fontStyle: 'italic',
      lineHeight: 16,
    },
  });
};
