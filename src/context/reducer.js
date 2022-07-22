
export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        productInCart: [...state.productInCart, action.payload],
      };
    case 'SET_MENU_SCREEN_NAVIGATION':
      return {
        ...state,
        menuScreenNavigation: action.payload,
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        productInCart: state.productInCart.filter(product => product.id !== action.payload),
      };
    case 'UPDATE_PRODUCT_IN_CART':
      return {
        ...state,
        productInCart: state.productInCart.map(product => {
          if (product.id === action.payload.id) {
            return {
              ...product,
              quantity: action.payload.quantity,
              totalPrice: action.payload.totalPrice,
            };
          }
          return product;
        }),
      };
  }
};
