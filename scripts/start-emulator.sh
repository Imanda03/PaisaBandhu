#!/bin/bash

# Script to properly start Android Emulator
# Usage: ./scripts/start-emulator.sh

AVD_NAME="Pixel_9_Pro"
EMULATOR_PATH="/usr/lib/android-sdk/emulator/emulator"

echo "Checking if emulator is already running..."
if adb devices | grep -q "emulator"; then
    echo "Emulator is already running!"
    adb devices
    exit 0
fi

echo "Killing any zombie emulator processes..."
pkill -f qemu-system-x86_64 || true
sleep 2

echo "Starting emulator: $AVD_NAME"
export ANDROID_EMULATOR_USE_SYSTEM_LIBS=1
export QT_X11_NO_MITSHM=1

# Start emulator with optimized settings
$EMULATOR_PATH -avd $AVD_NAME \
    -gpu host \
    -accel-check \
    -no-boot-anim &> /tmp/emulator.log &

echo "Emulator is starting in the background..."
echo "Logs are being written to /tmp/emulator.log"
echo "Waiting for device to be ready..."

# Wait for emulator to boot
timeout=120
counter=0
while ! adb devices | grep -q "device$"; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo "Timeout waiting for emulator to start"
        exit 1
    fi
    echo -n "."
done

echo ""
echo "Emulator is ready!"
adb devices

