import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { colors } from '../src/theme';

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
          Anybody_800ExtraBold: require('@expo-google-fonts/anybody/Anybody_800ExtraBold.ttf'),
          Anybody_700Bold: require('@expo-google-fonts/anybody/Anybody_700Bold.ttf'),
          Inter_400Regular: require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
          Inter_700Bold: require('@expo-google-fonts/inter/Inter_700Bold.ttf'),
          JetBrainsMono_500Medium: require('@expo-google-fonts/jetbrains-mono/JetBrainsMono_500Medium.ttf'),
          JetBrainsMono_700Bold: require('@expo-google-fonts/jetbrains-mono/JetBrainsMono_700Bold.ttf'),
        });
      } catch {
        // Fonts are nice-to-have; system fallback is acceptable.
      }
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

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
