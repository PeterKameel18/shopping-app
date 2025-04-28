import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image, Text, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Searchbar } from "react-native-paper";
import { products, cart } from "../services/api";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import RNHTMLtoPDF from "react-native-html-to-pdf";

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

  const generatePDF = async () => {
    try {
      setLoading(true);

      // Fetch cart data from the backend
      const response = await cart.get();
      const cartData = response.data;

      // Generate HTML content for the PDF
      const htmlContent = `
        <h1>Cart Summary</h1>
        <ul>
          ${cartData
            .map(
              (item) => `
            <li>
              <strong>Product:</strong> ${item.product.name}<br />
              <strong>Price:</strong> $${item.product.price.toFixed(2)}<br />
              <strong>Quantity:</strong> ${item.quantity}<br />
              <strong>Total:</strong> $${(
                item.product.price * item.quantity
              ).toFixed(2)}<br />
            </li>
          `
            )
            .join("")}
        </ul>
      `;

      // Generate the PDF
      const options = {
        html: htmlContent,
        fileName: `CartSummary_${new Date().toISOString().slice(0, 10)}`,
        directory: "Documents",
      };

      const file = await RNHTMLtoPDF.convert(options);

      console.log("PDF File Path:", file.filePath);

      Alert.alert("PDF Saved", `PDF has been saved to: ${file.filePath}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF.");
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

      <Button mode="contained" onPress={generatePDF} style={{ margin: 10 }}>
        Save Cart as PDF
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
