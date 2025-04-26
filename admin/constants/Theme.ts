// theme.ts (atau simpan di mana saja)

import { DefaultTheme, DarkTheme, Theme } from "@react-navigation/native";
import { Colors } from "./Colors"; // path sesuai lokasi file kamu

export const MyLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: Colors.light.cardBackground,
    text: Colors.light.text,
    border: Colors.light.icon,
    notification: Colors.light.tint,
  },
};

export const MyDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    card: Colors.dark.cardBackground,
    text: Colors.dark.text,
    border: Colors.dark.icon,
    notification: Colors.dark.tint,
  },
};
