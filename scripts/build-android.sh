#!/bin/bash

# Script to build Android app with correct SDK paths
# Usage: ./scripts/build-android.sh

export ANDROID_HOME=/home/genimanda/Android/Sdk
export ANDROID_SDK_ROOT=/home/genimanda/Android/Sdk

echo "Using Android SDK: $ANDROID_HOME"
echo "Building Android app..."

cd "$(dirname "$0")/.."

# Run the build with correct environment
npm run android

