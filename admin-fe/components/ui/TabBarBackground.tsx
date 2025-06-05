// components/ui/TabBarBackground.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function TabBarBackground() {
  const backgroundClass = 'bg-white dark:bg-neutral-900';

  return (
    <View
      // Terapkan class Tailwind CSS di sini
      // h-full untuk memastikan View mengisi tinggi TabBarBackground
      // absolute bottom-0 left-0 right-0 untuk memposisikannya
      className={`absolute bottom-0 left-0 right-0 h-full ${backgroundClass}`}
    >
    </View>
  );
}