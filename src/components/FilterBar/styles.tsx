import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/colors';
import { scale, spacing } from '../../utils/responsive';

export const createStyles = () => {
    // Called only from React components (e.g. FilterBar), not at module scope
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            marginBottom: spacing(14),
        },
        filterSection: {
            gap: spacing(10),
        },
        typeFilters: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: spacing(10),
            gap: spacing(8),
        },
        filterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacing(10),
            paddingHorizontal: spacing(14),
            borderRadius: scale(22),
            flex: 0.32,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.BORDER_COLOR + '35',
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                },
                android: { elevation: 2 },
            }),
        },
        dateFilterContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            gap: 10,
        },
        buttonText: {
            marginLeft: 6,
            fontWeight: '600',
        },
        dateFilterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            //   justifyContent: 'center',
            paddingVertical: 12,
            borderRadius: 12,
            marginBottom: 8,
            paddingHorizontal: 12,
            width: '50%',
        },
        dateButtonText: {
            marginLeft: 8,
            fontSize: 16,
            fontWeight: '600',
        },
        dateDisplay: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        dateCard: {
            flex: 0.45,
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
        },
        dateLabel: {
            fontSize: 14,
            opacity: 0.7,
            marginBottom: 4,
        },
        dateValue: {
            fontSize: 16,
            fontWeight: '600',
        },
        arrowIcon: {
            marginHorizontal: 8,
        },
    });
};
