
export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };
    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.payload,
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        productInCart: [...state.productInCart, action.payload],
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
    case 'RESET_PRODUCT_IN_CART':
      return {
        ...state,
        productInCart: [],
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.payload,
      };
    case 'SET_IS_SIGNOUT':
      return {
        ...state,
        isSignout: action.payload,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        userToken: action.payload,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
    case 'UPDATE_USER_TOKEN':
      return {
        ...state,
        userToken: {
          ...state.userToken,
          ...action.payload,
        },
      };
    case 'UPDATE_EMAIL':
      return {
        ...state,
        userToken: {
          ...state.userToken,
          email: action.payload,
        },
      };
    case 'UPDATE_PASSWORD':
      return {
        ...state,
        userToken: {
          ...state.userToken,
          password: action.payload,
        },
      };
  }
};
