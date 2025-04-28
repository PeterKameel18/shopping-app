import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { products } from "../services/api"; // Assuming this is your product API service

const SavePDFScreen = () => {
  const [loading, setLoading] = useState(false);

  const generateProductsPDF = async () => {
    try {
      setLoading(true);

      // Fetch products from your existing API
      const response = await products.getAll(); // Adjust this to match your API service
      const productsData = response.data;

      if (!productsData || productsData.length === 0) {
        throw new Error("No products found");
      }

      // Generate HTML content
      const htmlContent = generateProductsHTML(productsData);

      // Create the PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF saved to:", uri);

      // Share the PDF
      await sharePDF(uri);

      Alert.alert("Success", "Product catalog PDF created successfully");
    } catch (error) {
      console.error("Error generating products PDF:", error);
      Alert.alert("Error", "Failed to generate product catalog PDF");
    } finally {
      setLoading(false);
    }
  };

  const generateProductsHTML = (products) => {
    // Create product list HTML
    const productItemsHTML = products
      .map(
        (product) => `
      <div class="product-item">
        <h3>${product.name}</h3>
        ${
          product.image
            ? `<img src="${product.image}" style="max-width: 200px; max-height: 200px; object-fit: contain;" />`
            : ""
        }
        <p class="price">Price: $${product.price.toFixed(2)}</p>
        ${
          product.description
            ? `<p class="description">${product.description}</p>`
            : ""
        }
      </div>
      <hr />
    `
      )
      .join("");

    // Complete HTML document with styling
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .date {
              text-align: right;
              color: #666;
              font-size: 14px;
              margin-bottom: 30px;
            }
            .product-item {
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .price {
              font-weight: bold;
              color: #e63946;
              font-size: 16px;
            }
            .description {
              color: #555;
              margin-top: 8px;
            }
            hr {
              border: none;
              border-top: 1px solid #eee;
              margin: 15px 0;
            }
            img {
              display: block;
              margin: 10px 0;
            }
            @media print {
              body {
                padding: 0;
              }
              .product-item {
                margin-bottom: 30px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Product Catalog</h1>
          </div>
          <div class="date">
            Generated on: ${new Date().toLocaleDateString()}
          </div>
          <div class="products">
            ${productItemsHTML}
          </div>
        </body>
      </html>
    `;
  };

  const sharePDF = async (filePath) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/pdf",
          dialogTitle: "Share Product Catalog PDF",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert("Error", "Failed to share the PDF");
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Generate Product Catalog PDF"
        onPress={generateProductsPDF}
        disabled={loading}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>
            Generating product catalog PDF...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
});

export default SavePDFScreen;
