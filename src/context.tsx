import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCT_LIST } from './constant';
import { ProductInfo } from './type';

export type ActionType = 'INCREASE' | 'DECREASE';

interface ContextInfo {
  cart: ProductInfo[];
  productList: ProductInfo[];
  stockList: ProductInfo[];
  handleActionProduct: (productId: string, actionType: ActionType) => void;
  handleRemoveProduct: (productId: string) => void;
}

export const CartContext = createContext<ContextInfo | null>(null);

export const useCartControls = () => {
  const controls = useContext(CartContext);

  if (!controls) {
    throw new Error('CartContext 내부에서 사용해주세요.');
  }

  return controls;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const productList = PRODUCT_LIST;
  const [cart, setCart] = useState<ProductInfo[] | []>([]);
  const [stockList, setStockList] = useState<ProductInfo[] | []>([]);

  const handleUpdateStock = () => {};

  const handleActionProduct = (productId: string, actionType: ActionType) => {
    const product = productList.find((product) => product.id === productId);

    if (!product) {
      return;
    }

    setCart((prev) => {
      const selectProduct = prev.find((product) => product.id === productId);
      if (selectProduct) {
        if (actionType === 'DECREASE' && selectProduct.quantity === 1) {
          alert('재고가 부족합니다.');
          return prev;
        }

        if (actionType === 'INCREASE' && selectProduct.quantity === product.quantity) {
          alert('재고가 부족합니다.');
          return prev;
        }
        handleUpdateStock();
        return prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                quantity: actionType === 'INCREASE' ? product.quantity + 1 : product.quantity - 1,
              }
            : product
        );
      }

      if (actionType === 'INCREASE') {
        return [...prev, { ...product, quantity: 1 }];
      }

      return prev;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setCart((prev) => prev.filter((product) => product.id !== productId));
  };

  useEffect(() => {
    handleUpdateStock();
  }, []);

  const memorizedValue = useMemo(
    () => ({ cart, productList, handleActionProduct, handleRemoveProduct, stockList }),
    [cart, productList, handleActionProduct, handleRemoveProduct, stockList]
  );

  return <CartContext.Provider value={memorizedValue}>{children}</CartContext.Provider>;
};
