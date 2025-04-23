// @/hooks/useColorScheme.js
import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme()); // Mendapatkan tema sistem saat aplikasi dimulai

  useEffect(() => {
    // Memantau perubahan tema sistem
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme); // Menyesuaikan tema dengan perubahan sistem
    });

    return () => subscription.remove(); // Membersihkan listener saat komponen dibongkar
  }, []);

  return colorScheme;
};
