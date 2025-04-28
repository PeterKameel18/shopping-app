import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image, Text } from "react-native";
import { Card, Title, Paragraph, Button, Searchbar } from "react-native-paper";
import { products } from "../services/api";

const ProductsScreen = ({ navigation }) => {
  const [productsList, setProductsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await products.getAll();
      setProductsList(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productsList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.image }} />
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>${item.price.toFixed(2)}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("ProductDetail", { product: item })
          }
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <Button
        mode="contained"
        onPress={() => navigation.navigate("SavePDF")}
        style={{ margin: 10 }}
      >
        Save Orders as PDF
      </Button>

      {error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : null}

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchBar: {
    margin: 10,
  },
  list: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    maxWidth: "48%",
  },
});

export default ProductsScreen;
