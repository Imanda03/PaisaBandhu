#!/bin/bash

# Script to fix AVD system image mismatch issues
# This fixes the "Broken AVD system path" error

echo "🔍 Diagnosing AVD system image issue..."

AVD_NAME="Pixel_9_Pro"
AVD_INI="$HOME/.android/avd/${AVD_NAME}.ini"
AVD_CONFIG="$HOME/.android/avd/${AVD_NAME}.avd/config.ini"

# Check AVD target
if [ -f "$AVD_INI" ]; then
    TARGET=$(grep "^target=" "$AVD_INI" | cut -d'=' -f2)
    echo "Current AVD target: $TARGET"
else
    echo "❌ AVD ini file not found: $AVD_INI"
    exit 1
fi

# Check available system images
echo ""
echo "Available system images:"
ls -d $ANDROID_SDK_ROOT/system-images/android-*/*/x86_64 2>/dev/null | while read path; do
    echo "  - $path"
done

# Check if target system image exists
TARGET_IMAGE="$ANDROID_SDK_ROOT/system-images/$TARGET"
if [ ! -d "$TARGET_IMAGE" ]; then
    echo ""
    echo "❌ Problem found: AVD targets $TARGET but system image is missing!"
    echo "   Expected: $TARGET_IMAGE"
    echo ""
    
    # Find latest available system image
    LATEST_IMAGE=$(ls -d $ANDROID_SDK_ROOT/system-images/android-*/*/x86_64 2>/dev/null | head -1)
    if [ -z "$LATEST_IMAGE" ]; then
        echo "❌ No system images found! Please install system images via Android Studio SDK Manager."
        exit 1
    fi
    
    # Extract version from path
    LATEST_VERSION=$(echo "$LATEST_IMAGE" | sed 's|.*system-images/\(android-[^/]*\).*|\1|')
    LATEST_VARIANT=$(echo "$LATEST_IMAGE" | sed 's|.*system-images/[^/]*/\([^/]*\).*|\1|')
    
    echo "✅ Found available system image: $LATEST_VERSION ($LATEST_VARIANT)"
    echo ""
    echo "Solution options:"
    echo "1. Install missing $TARGET system images (recommended if you need that specific version)"
    echo "2. Update AVD to use $LATEST_VERSION (quick fix)"
    echo ""
    echo "To install missing system images, run:"
    echo "  sdkmanager \"system-images;$TARGET;google_apis;x86_64\""
    echo ""
    echo "Or update AVD to use available version:"
    echo "  sed -i 's/^target=.*/target=$LATEST_VERSION/' \"$AVD_INI\""
    echo ""
    
    read -p "Do you want to update AVD to use $LATEST_VERSION? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Updating AVD configuration..."
        sed -i "s/^target=.*/target=$LATEST_VERSION/" "$AVD_INI"
        echo "✅ AVD updated to use $LATEST_VERSION"
        echo ""
        echo "Note: You may need to recreate the AVD for best results:"
        echo "  avdmanager delete avd -n $AVD_NAME"
        echo "  avdmanager create avd -n $AVD_NAME -k \"system-images;$LATEST_VERSION;$LATEST_VARIANT;x86_64\" -d pixel_7_pro"
    fi
else
    echo ""
    echo "✅ System image for $TARGET exists at: $TARGET_IMAGE"
    echo "The issue might be something else. Check emulator logs for more details."
fi
