import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Strings } from '@/constants/Strings';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import SurahCard from '@/components/SurahCard';
import { fetchSurahs, type Surah } from '@/services/quranApi';

export default function SurahListScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const router = useRouter();

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchSurahs()
      .then(setSurahs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return surahs;
    const q = query.toLowerCase();
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(query) ||
        String(s.number).includes(q)
    );
  }, [surahs, query]);

  const handlePress = useCallback(
    (surah: Surah) => {
      router.push({ pathname: '/(tabs)/quran/[id]', params: { id: surah.number } });
    },
    [router]
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={[styles.loadingText, { color: c.text }]}>
          {Strings.loading_state_message}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text style={[styles.errorText, { color: '#E53E3E' }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.searchBar, { backgroundColor: c.surface, borderColor: c.border }]}>
        <TextInput
          style={[styles.searchInput, { color: c.text }]}
          placeholder={Strings.quran_reader_search_placeholder}
          placeholderTextColor={c.tabIconDefault}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item }) => (
          <SurahCard surah={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Theme.spacing.sm },
  searchBar: {
    margin: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.md,
    height: 44,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: Theme.fontSize.md,
    height: '100%',
  },
  loadingText: {
    fontSize: Theme.fontSize.md,
    marginTop: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.fontSize.md,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  listContent: {
    paddingBottom: Theme.spacing.xl,
  },
});
