import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { StripeProvider } from "@stripe/stripe-react-native";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductsScreen from "./screens/ProductsScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import OrderConfirmationScreen from "./screens/OrderConfirmationScreen";
import SavePDFScreen from "./screens/SavePDFScreen"; // Import SavePDFScreen

const Stack = createStackNavigator();

export default function App() {
  return (
    <StripeProvider
      publishableKey="pk_test_51RDxYa4YiA47dO04CJgFKweR2vY585XIBlw9WJooLvil24y8r2tKJJxTptalJ65NXYK7WxoApAjLJbSo0JiJhtGN008HFyb3zQ"
      merchantIdentifier="merchant.com.your.app"
    >
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Products"
              component={ProductsScreen}
              options={{ title: "Products" }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ title: "Product Details" }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: "Shopping Cart" }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ title: "Checkout" }}
            />
            <Stack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
              options={{ title: "Order Confirmation" }}
            />
            <Stack.Screen
              name="SavePDFScreen"
              component={SavePDFScreen}
              options={{ title: "Save PDF" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StripeProvider>
  );
}
