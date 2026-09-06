import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import ArticleCard from '../../components/ArticleCard';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import { useArticles } from '../../hooks/useArticles';
import { COLORS } from '../../constants/brand';

export default function ArticlesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useArticles();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>{t('articles.title', 'Articles')}</Text>
      </View>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title={t('common.empty')} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ArticleCard article={item} onPress={() => router.push(`/articles/${item._id}`)} />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.navy },
  list: { padding: 16 },
});
