import React from 'react';
import { View, ScrollView } from 'react-native';
import { createStyles } from './styles';
import AuthHeader from '../../../../components/core/AuthHeader';
import AddCategoryForm from '../../../../components/CategoryForm';

const AddCategories = React.memo(() => {
    const styles = createStyles();
    return (
        <View style={styles.root}>
            <AuthHeader title="Add Category" />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <AddCategoryForm />
            </ScrollView>
        </View>
    );
});

AddCategories.displayName = 'AddCategories';
export default AddCategories;
