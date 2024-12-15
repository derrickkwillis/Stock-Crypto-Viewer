import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity} from "react-native";
import { useRouter } from "expo-router"; 
import { fetchStockData } from "../../api/api";

const popularStocks = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX", "INTC", "IBM",
  "ORCL", "ADBE", "PYPL", "CSCO", "BABA", "V", "MA", "JPM", "BAC", "C",
  "XOM", "WMT", "DIS", "KO", "PFE", "T", "PEP", "ABT", "CVX", "UNH",
  "MRK", "HD", "NKE", "MCD", "PG", "LLY", "AVGO", "VZ", "RTX", "UPS",
  "CAT", "GS", "MS", "BA", "MMM", "GE", "HON", "F",
];

const ITEMS_PER_PAGE = 10;

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredStocks, setFilteredStocks] = useState([]); // Filtered stocks to display
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // For navigation


  // Load preloaded stocks
  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      const promises = popularStocks.slice(0, 50).map((symbol) => fetchStockData(symbol));
      const stockData = await Promise.all(promises);

      const validStocks = stockData.filter((data) => data); // Filter valid data
      setStocks(validStocks);
      setFilteredStocks(validStocks); // Initialize filtered stocks
      setLoading(false);
    };

    loadStocks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStocks(stocks); // Show all stocks if search query is empty
    } else {
      const filtered = stocks.filter(
        (stock) =>
          (stock.Symbol && stock.Symbol.toLowerCase().startsWith(searchQuery.toLowerCase())) ||
          (stock.Name && stock.Name.toLowerCase().startsWith(searchQuery.toLowerCase()))
      );
      setFilteredStocks(filtered);
    }
  }, [searchQuery, stocks]);
  


  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredStocks.length);
  const displayedStocks = filteredStocks.slice(startIndex, endIndex);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Stocks</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a stock by its symbol (e.g., AAPL)"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading && <Text>Loading...</Text>}
      {!loading && displayedStocks.length === 0 && <Text>No matching stocks found.</Text>}

      {/* Stock List */}
      <FlatList
        data={displayedStocks}
        keyExtractor={(item) => item.Symbol}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/details/${item.Symbol}`)}>
          <View style={styles.stockItem}>
            <Text style={styles.stockName}>
            {item.Symbol}
                        </Text>
            <Text>Current Price: ${item.CurrentPrice}</Text>
            <Text>High: ${item.High}</Text>
            <Text>Low: ${item.Low}</Text>
            <Text>Previous Close: ${item.PreviousClose}</Text>
          </View>
          </TouchableOpacity>
        )}
      />

      {/* Pagination Controls */}
      <View style={styles.pagination}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageNumber}>Page {currentPage}</Text>
        <Button
          title="Next"
          onPress={() =>
            setCurrentPage((prev) =>
              prev * ITEMS_PER_PAGE < filteredStocks.length ? prev + 1 : prev
            )
          }
          disabled={endIndex >= filteredStocks.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  searchBar: { height: 40, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, marginBottom: 16 },
  stockItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  stockName: { fontSize: 18, fontWeight: "bold" },
  pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  pageNumber: { fontSize: 16, fontWeight: "bold" },
});

export default StockPage;
