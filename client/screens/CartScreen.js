import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
import { cart } from "../services/api";

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cart.get();
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
    setTotal(total);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await cart.update(productId, newQuantity);
      const updatedItems = cartItems.map((item) => {
        if (item.product._id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cart.remove(productId);
      const updatedItems = cartItems.filter(
        (item) => item.product._id !== productId
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const renderCartItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.productName}>{item.product.name}</Text>
          <Text style={styles.price}>${item.product.price.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <Button
              mode="outlined"
              onPress={() =>
                handleQuantityChange(item.product._id, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <TextInput
              mode="outlined"
              value={item.quantity.toString()}
              onChangeText={(text) =>
                handleQuantityChange(item.product._id, parseInt(text) || 1)
              }
              keyboardType="numeric"
              style={styles.quantityInput}
            />
            <Button
              mode="outlined"
              onPress={() =>
                handleQuantityChange(item.product._id, item.quantity + 1)
              }
            >
              +
            </Button>
          </View>
          <Button
            mode="text"
            onPress={() => handleRemoveItem(item.product._id)}
            style={styles.removeButton}
          >
            Remove
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Products")}
          >
            Browse Products
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product._id}
            contentContainerStyle={styles.list}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Checkout")}
              style={styles.checkoutButton}
            >
              Proceed to Checkout
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "#1E88E5",
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityInput: {
    width: 50,
    marginHorizontal: 5,
  },
  removeButton: {
    marginTop: 5,
  },
  totalContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkoutButton: {
    marginTop: 10,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default CartScreen;
