import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

//pantalla de inicio nativa (configurada en app.json) permanezca visible hasta que hideAsyncse llame. https://docs.expo.dev/versions/latest/sdk/splash-screen/
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();//este hook es para decidir que tema usar, lo detecta de forma nativa del OS. para luego usar DarkTheme o DefaultTheme

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* automaticamente cuando se renderiza esta pantalla (como un react normal), inmediatamente renderizara la pantalla que ya essta apuntando el enrutador en este caso (tabs) quue sería el _layout y este ultimo por defecto, renderiza today page */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
