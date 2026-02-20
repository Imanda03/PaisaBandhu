#!/bin/bash

# Script to fix emulator freezing issues
# This addresses common causes of emulator hanging/freezing

echo "🔧 Fixing emulator freezing issues..."

# 1. Kill all existing emulator processes
echo "Stopping all emulator instances..."
pkill -9 -f qemu-system-x86_64 2>/dev/null
pkill -9 -f emulator 2>/dev/null
sleep 2

# 2. Kill ADB server to reset connections
echo "Resetting ADB..."
adb kill-server 2>/dev/null
sleep 1

# 3. Clear emulator cache (safe - won't delete your data)
echo "Clearing emulator cache..."
rm -rf ~/.android/avd/*/cache/* 2>/dev/null
rm -rf /tmp/android-* 2>/dev/null

# 4. Check system resources
echo ""
echo "📊 System Resources:"
free -h | grep -E "Mem|Swap"
echo ""
echo "Load Average:"
uptime

# 5. Check if system is overloaded
LOAD_AVG=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d',' -f1 | xargs)
LOAD_THRESHOLD=8.0

if (( $(echo "$LOAD_AVG > $LOAD_THRESHOLD" | bc -l) )); then
    echo "⚠️  WARNING: System load is very high ($LOAD_AVG)."
    echo "   Consider closing other applications before starting emulator."
    echo ""
fi

# 6. Check swap usage
SWAP_USED=$(free | grep Swap | awk '{printf "%.1f", $3/$2 * 100}')
if (( $(echo "$SWAP_USED > 50" | bc -l) )); then
    echo "⚠️  WARNING: High swap usage ($SWAP_USED%)."
    echo "   System may be slow. Consider freeing memory."
    echo ""
fi

# 7. Set environment variables for better performance
export ANDROID_EMULATOR_USE_SYSTEM_LIBS=1
export QT_X11_NO_MITSHM=1
export LIBGL_ALWAYS_SOFTWARE=0

echo "✅ Cleanup complete!"
echo ""
echo "To start emulator with optimized settings:"
echo "  ./scripts/start-emulator.sh"
echo ""
echo "Or manually:"
echo "  emulator -avd Pixel_9_Pro -gpu swiftshader_indirect -memory 2048"

