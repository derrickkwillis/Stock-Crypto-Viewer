import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchCompanyNews } from "../../api/api";

const ITEMS_PER_PAGE = 10;

const NewsPage = () => {
  const { symbol } = useLocalSearchParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const loadNews = async () => {
      const newsData = await fetchCompanyNews(symbol);
      setNews(newsData);
      setLoading(false);
    };

    loadNews();
  }, [symbol]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, news.length);
  const displayedNews = news.slice(startIndex, endIndex);

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading news for {symbol}...</Text>
      </View>
    );
  }

  if (news.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No recent news available for {symbol}.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Latest News for {symbol}</Text>
      </View>

      <FlatList
        data={displayedNews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
            <View style={styles.newsItem}>
              <Text style={styles.newsTitle}>{item.headline}</Text>
              <Text style={styles.newsSummary}>{item.summary}</Text>
              <Text style={styles.newsDate}>
                {item.datetime
                  ? new Date(item.datetime * 1000).toLocaleDateString() // Correct epoch conversion
                  : "No Date Available"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.pagination}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageNumber}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() =>
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },

  newsItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  newsSummary: {
    fontSize: 14,
    color: "#555",
  },
  newsDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  paginationButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  paginationButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewsPage;
