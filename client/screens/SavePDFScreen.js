import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { cart } from "../services/api";

const SavePDFScreen = () => {
  const [loading, setLoading] = useState(false);

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
              <strong>Total:</strong> $${(item.product.price * item.quantity).toFixed(2)}<br />
            </li>
          `
            )
            .join("")}
        </ul>
      `;

      // Create the PDF
      const options = {
        html: htmlContent,
        fileName: "CartSummary",
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
        title={loading ? "Generating PDF..." : "Save Cart as PDF"}
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
