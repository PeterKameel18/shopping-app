import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { products } from "../services/api";

const SavePDFScreen = () => {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    try {
      setLoading(true);

      // Fetch products data from the backend
      const response = await products.getAll();
      const productsData = response.data;

      // Generate HTML content for the PDF
      const htmlContent = `
        <h1>Available Products</h1>
        <ul>
          ${productsData
            .map(
              (product) => `
            <li>
              <strong>Name:</strong> ${product.name}<br />
              <strong>Price:</strong> $${product.price.toFixed(2)}<br />
              <strong>Description:</strong> ${product.description}<br />
            </li>
          `
            )
            .join("")}
        </ul>
      `;

      // Create the PDF
      const options = {
        html: htmlContent,
        fileName: "AvailableProducts",
        directory: "Documents",
      };

      const file = await RNHTMLtoPDF.convert(options);

      Alert.alert("PDF Saved", `PDF has been saved to: ${file.filePath}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={loading ? "Generating PDF..." : "Save Products as PDF"}
        onPress={generatePDF}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default SavePDFScreen;
