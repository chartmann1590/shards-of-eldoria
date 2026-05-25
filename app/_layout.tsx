import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { colors, typography } from '../src/theme';

SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.primaryContainer,
    fontSize: 16,
    marginTop: 12,
  },
});

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Anybody-800': require('@expo-google-fonts/anybody/fonts/Anybody_800ExtraBold.ttf'),
          'Inter-400': require('@expo-google-fonts/inter/fonts/Inter_400Regular.ttf'),
          'Inter-600': require('@expo-google-fonts/inter/fonts/Inter_600SemiBold.ttf'),
          'Inter-700': require('@expo-google-fonts/inter/fonts/Inter_700Bold.ttf'),
          'JetBrainsMono-400': require('@expo-google-fonts/jetbrains-mono/fonts/JetBrainsMono_400Regular.ttf'),
          'JetBrainsMono-700': require('@expo-google-fonts/jetbrains-mono/fonts/JetBrainsMono_700Bold.ttf'),
        });
      } catch {
      }
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryContainer} />
        <Text style={styles.loadingText}>Loading Eldoria...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'fade',
        }}
      />
    </>
  );
}
