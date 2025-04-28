import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { cart } from "../services/api";

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await cart.add(product._id, quantity);
      navigation.navigate("Cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <TextInput
            mode="outlined"
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(parseInt(text) || 1)}
            keyboardType="numeric"
            style={styles.quantityInput}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleAddToCart}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Add to Cart
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: "#1E88E5",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityInput: {
    width: 100,
  },
  button: {
    marginTop: 20,
  },
});

export default ProductDetailScreen;
