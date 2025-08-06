import React from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {
  Circle,
  Path,
  Polygon,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const BackgroundIllustration = ({style}: any) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const aspectRatio = 955.95262 / 639.22428;
  const width = screenWidth;
  const height = width / aspectRatio;

  return (
    <View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.5,
        },
        style,
      ]}>
      <Svg width={width} height={height} viewBox="0 0 955.95262 639.22428">
        <Defs>
          <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#6c63ff" stopOpacity="0.1" />
            <Stop offset="1" stopColor="#8b85ff" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Modified elements with dark theme friendly colors */}
        <Rect
          x="0.30042"
          y="0.39886"
          width="703.57562"
          height="450.60114"
          fill="#2a2a2a"
          opacity="0.3"
        />
        <Rect
          x="20.419"
          y="56.91548"
          width="663.33851"
          height="171.77293"
          fill="#333333"
          opacity="0.2"
        />
        <Rect
          x="185.4182"
          y="81.72713"
          width="140.28123"
          height="8.05267"
          fill="#444444"
          opacity="0.3"
        />
        <Rect
          x="185.4182"
          y="111.10108"
          width="216.62477"
          height="8.05267"
          fill="#6c63ff"
          opacity="0.4"
        />
        <Path
          d="M534.74755,435.76326a65.04556,65.04556,0,0,0-105.003-9.69992l-4.18616-3.65793a70.59368,70.59368,0,0,1,113.973,10.52622Z"
          fill="#444444"
          opacity="0.3"
        />
        <Path
          d="M537.36724,508.18169l-4.6134-3.102a65.07765,65.07765,0,0,0,1.99371-69.31644l4.78387-2.83166a70.63742,70.63742,0,0,1-2.16418,75.25012Z"
          fill="#6c63ff"
          opacity="0.4"
        />
        <Path
          d="M426.13766,515.92644a70.58952,70.58952,0,0,1-.57926-93.52106l4.18616,3.65793a65.03087,65.03087,0,0,0,.53366,86.15415Z"
          fill="#8b85ff"
          opacity="0.3"
        />

        {/* Decorative elements with glow effect */}
        <Circle
          cx="831.41549"
          cy="192.09457"
          r="24.71744"
          fill="#6c63ff"
          opacity="0.3"
        />
        <Circle
          cx="431.41549"
          cy="392.09457"
          r="24.71744"
          fill="#8b85ff"
          opacity="0.25"
        />
        <Circle
          cx="631.41549"
          cy="292.09457"
          r="24.71744"
          fill="#9d97ff"
          opacity="0.2"
        />

        {/* Additional subtle decorative elements */}
        <Path
          d="M968.045,322.48242s-3.37053-19.09984-11.23522-16.8528"
          fill="none"
          stroke="#6c63ff"
          strokeWidth="2"
          opacity="0.2"
        />
        <Path
          d="M1076.97631,769.61214h-268"
          fill="none"
          stroke="#8b85ff"
          strokeWidth="2"
          opacity="0.15"
        />
      </Svg>
    </View>
  );
};

export default BackgroundIllustration;
