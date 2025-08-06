import React, { useState } from 'react';
import { View } from 'react-native';
import { createStyles } from './styles';
import AuthHeader from '../../../../components/core/AuthHeader';
import AddCategoryForm from '../../../../components/CategoryForm';

const AddCategories = () => {
    const styles = createStyles();
    return (
        <View style={styles.root}>
            <AuthHeader title="Add Category" />
            <View style={styles.container}>
                <AddCategoryForm />
            </View>
        </View>
    );
};

export default AddCategories;
