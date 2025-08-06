import { KeyboardTypeOptions } from "react-native";
import { userDataProps } from "./types";

export const getFormFields = (watch: (field: string) => any) => {
    return [
        {
            name: 'fullName',
            placeholder: 'Full name',
            rules: { required: 'Full name is required' },
            keyboardType: 'default' as KeyboardTypeOptions,
        },
        {
            name: 'email',
            placeholder: 'Email',
            keyboardType: 'default' as KeyboardTypeOptions,
            rules: {
                required: 'Email is required',
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email',
                },
            },
        },
        {
            name: 'phoneNumber',
            placeholder: 'Phone Number',
            keyboardType: 'number-pad' as KeyboardTypeOptions,
            rules: {
                required: 'Phone number is required',
                pattern: {
                    value: /^\d{10}$/,
                    message: 'Please enter a valid 10-digit phone number',
                },
            },
        },
        {
            name: 'password',
            placeholder: 'Password',
            rules: { required: 'Password is required' },
            secureTextEntry: true,
            keyboardType: 'default' as KeyboardTypeOptions,
        },
        {
            name: 'confirmPassword',
            placeholder: 'Confirm Password',
            keyboardType: 'default' as KeyboardTypeOptions,
            rules: {
                required: 'Please confirm your password',
                validate: (val: string) =>
                    watch('password') === val || 'Passwords do not match',
            },
            secureTextEntry: true,
        },
    ];
};


export const loginFields = [
    {
        name: 'email',
        placeholder: 'Email',
        secureTextEntry: false,
        rules: {
            required: 'Email is required',
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email',
            },
        },
    },
    {
        name: 'password',
        placeholder: 'Password',
        rules: { required: 'Password is required' },
        secureTextEntry: true,
    },
] as const;

export const categoryFormFields = {
    title: {
        name: 'title',
        rules: {
            required: 'Category name is required',
            minLength: {
                value: 2,
                message: 'Category name must be at least 2 characters',
            },
        },
    },
    icon: {
        name: 'icon',
        rules: { required: 'Please select an icon' },
    },
    type: {
        name: 'type',
        rules: { required: 'Please select a type' },
    },
} as const;