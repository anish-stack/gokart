import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { useArticleDetail } from '../../hooks/useArticles';
import { formatEta } from '../../utils/formatters';
import { COLORS } from '../../constants/brand';

const { width } = Dimensions.get('window');

const HEIGHT_JS = `
  (function() {
    function post() {
      var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.ReactNativeWebView.postMessage(String(h));
    }
    post();
    window.addEventListener('load', post);
    setTimeout(post, 300);
    setTimeout(post, 800);
    new ResizeObserver(post).observe(document.body);
  })();
  true;
`;

export default function ArticleDetailScreen() {
  const { i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [webViewHeight, setWebViewHeight] = useState(100);

  const { data, isLoading, isError, refetch } = useArticleDetail(id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Article</Text>
        </View>
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  const lang = i18n.language;

  const title =
    data.title?.[lang] ||
    data.title?.en ||
    '';

  const body =
    data.body?.[lang] ||
    data.body?.en ||
    '';

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        {data.coverImage ? (
          <Image
            source={{ uri: data.coverImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : null}

        {/* Article Card */}
        <View style={styles.card}>

          {/* Title */}
          <Text style={styles.title}>
            {title}
          </Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            {!!data.author && (
              <Text style={styles.author}>
                {data.author}
              </Text>
            )}

            {!!data.publishedAt && (
              <Text style={styles.date}>
                {formatEta(data.publishedAt)}
              </Text>
            )}
          </View>

          {/* HTML Article Body */}
          {!!body && (
            <View style={[styles.webViewContainer, { height: webViewHeight }]}>
              <WebView
                originWhitelist={['*']}
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta
                          name="viewport"
                          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                        />

                        <style>
                          * {
                            box-sizing: border-box;
                          }

                          html, body {
                            margin: 0;
                            padding: 0;
                          }

                          body {
                            background: ${COLORS.card};
                            color: ${COLORS.text};
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                            line-height: 1.7;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                          }

                          p {
                            margin-top: 0;
                            margin-bottom: 16px;
                          }

                          h1,
                          h2,
                          h3,
                          h4,
                          h5,
                          h6 {
                            color: ${COLORS.navy};
                            margin-top: 20px;
                            margin-bottom: 10px;
                            line-height: 1.3;
                          }

                          h1 {
                            font-size: 28px;
                          }

                          h2 {
                            font-size: 24px;
                          }

                          h3 {
                            font-size: 20px;
                          }

                          h4 {
                            font-size: 18px;
                          }

                          strong,
                          b {
                            font-weight: 700;
                          }

                          a {
                            color: ${COLORS.blue};
                            text-decoration: underline;
                          }

                          ul,
                          ol {
                            padding-left: 24px;
                            margin-top: 8px;
                            margin-bottom: 16px;
                          }

                          li {
                            margin-bottom: 8px;
                          }

                          img {
                            max-width: 100%;
                            height: auto;
                            border-radius: 10px;
                            margin-top: 8px;
                            margin-bottom: 12px;
                          }

                          blockquote {
                            margin: 16px 0;
                            padding: 12px 16px;
                            border-left: 4px solid ${COLORS.blue};
                            background: ${COLORS.bg};
                          }

                          table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 16px 0;
                          }

                          th,
                          td {
                            border: 1px solid ${COLORS.border};
                            padding: 8px;
                            text-align: left;
                          }

                          th {
                            background: ${COLORS.bg};
                            font-weight: 700;
                          }

                          pre {
                            background: ${COLORS.bg};
                            padding: 12px;
                            border-radius: 8px;
                            overflow-x: auto;
                            white-space: pre-wrap;
                          }

                          code {
                            font-family: monospace;
                          }
                        </style>
                      </head>

                      <body>
                        ${body}
                      </body>
                    </html>
                  `,
                }}
                style={styles.webView}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                automaticallyAdjustContentInsets={false}
                injectedJavaScript={HEIGHT_JS}
                onMessage={(e) => {
                  const h = parseInt(e.nativeEvent.data, 10);
                  if (!isNaN(h) && h > 0 && h !== webViewHeight) {
                    setWebViewHeight(h);
                  }
                }}
              />
            </View>
          )}

          {/* Tags */}
          {!!data.tags?.length && (
            <View style={styles.tagsRow}>
              {data.tags.map((tag, index) => (
                <View
                  key={`${tag}-${index}`}
                  style={styles.tagChip}
                >
                  <Text style={styles.tagText}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.navy,
  },

  scroll: {
    padding: 16,
    paddingBottom: 40,
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  author: {
    fontSize: 12,
    color: COLORS.blue,
    fontWeight: '700',
  },

  date: {
    fontSize: 12,
    color: COLORS.muted,
  },

  webViewContainer: {
    width: '100%',
    overflow: 'hidden',
  },

  webView: {
    width: '100%',
    backgroundColor: 'transparent',
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },

  tagChip: {
    backgroundColor: COLORS.bg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  tagText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '600',
  },
});