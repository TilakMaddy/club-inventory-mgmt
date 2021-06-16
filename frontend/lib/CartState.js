import { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // this is our own custom provider - we will store data (state)
  // and functionality (updater) here and anyone can access it via consumers

  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function openCart() {
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }


  return <LocalStateProvider value={{ cartOpen, openCart, closeCart, toggleCart }}>
    {children}
  </LocalStateProvider>
}

function useCart() {
  // consumer
  return useContext(LocalStateContext);
}

export { CartStateProvider, useCart };