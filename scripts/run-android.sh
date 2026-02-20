#!/bin/bash

# Script to run React Native Android app with correct SDK paths
# Usage: ./scripts/run-android.sh

export ANDROID_HOME=/home/genimanda/Android/Sdk
export ANDROID_SDK_ROOT=/home/genimanda/Android/Sdk

echo "Using Android SDK: $ANDROID_HOME"
echo "Starting React Native Metro bundler and building Android app..."

cd "$(dirname "$0")/.."

# Start Metro bundler in background if not running
if ! pgrep -f "react-native start" > /dev/null; then
    echo "Starting Metro bundler..."
    npm start &
    sleep 3
fi

# Run Android build
npm run android

