import { useTheme } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

type PlaceholderScreenProps = {
  title: string;
  testID: string;
};

export function PlaceholderScreen({ title, testID }: PlaceholderScreenProps) {
  const { colors } = useTheme();//este se usa segun la decision tomada con useColorScheme para usar DarkTheme o DefaultTheme.

  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={`${title} screen`}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});
