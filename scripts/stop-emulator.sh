#!/bin/bash

# Script to stop Android Emulator
# Usage: ./scripts/stop-emulator.sh

echo "Stopping Android Emulator..."

# Kill all emulator processes
pkill -f qemu-system-x86_64 || true
pkill -f emulator || true

# Wait a bit
sleep 2

# Force kill if still running
pkill -9 -f qemu-system-x86_64 || true

echo "Emulator stopped."
adb kill-server 2>/dev/null || true

