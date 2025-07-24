import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: {},
  isLoading: true,
  error: {},
  restaurentCategoryResponse: {},
  groceryCategoryResponse: {},
  restaurentListResponse: {},
  foodItemsListResponse: {},
  bannerResponse: {},
  foodDetailsResponse: {},
  allAddressListResponse: {},
  addAddressResponse: {},
  editAddressResponse: {},
  activeAddressResponse: {},
  placeOrderResponse: {},
  popularRestaurantResponse: {},
  hotSellingFoodResponse: {},
  nearbyRestaurantResponse: {},
  orderListResponse: {},
  orderDetailsResponse: {},
  profileDetailsResponse: {},
  editAccountResponse: {},
  allProductsResponse: {},
  productByCategoryResponse: {},
  productBySubCategoryResponse: {},
  defaultPageResponse: {},
};

const ProfileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    //restaurant category

    restaurentCategoryRequest(state, action) {
      state.status = action.type;
    },
    restaurentCategorySuccess(state, action) {
      state.restaurentCategoryResponse = action.payload;
      state.status = action.type;
    },
    restaurentCategoryFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //grocery category
    groceryCategoryRequest(state, action) {
      state.status = action.type;
    },
    groceryCategorySuccess(state, action) {
      state.groceryCategoryResponse = action.payload;
      state.status = action.type;
    },
    groceryCategoryFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // restaurant list
    restaurentListRequest(state, action) {
      state.status = action.type;
    },
    restaurentListSuccess(state, action) {
      state.restaurentListResponse = action.payload;
      state.status = action.type;
    },
    restaurentListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // category and food item acording restaurant
    foodItemsListRequest(state, action) {
      state.status = action.type;
    },
    foodItemsListSuccess(state, action) {
      state.foodItemsListResponse = action.payload;
      state.status = action.type;
    },
    foodItemsListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // banner
    bannerRequest(state, action) {
      state.status = action.type;
    },
    bannerSuccess(state, action) {
      state.bannerResponse = action.payload;
      state.status = action.type;
    },
    bannerFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // food details
    foodDetailsRequest(state, action) {
      state.status = action.type;
    },
    foodDetailsSuccess(state, action) {
      state.foodDetailsResponse = action.payload;
      state.status = action.type;
    },
    foodDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // address get
    allAddressListRequest(state, action) {
      state.status = action.type;
    },
    allAddressListSuccess(state, action) {
      state.allAddressListResponse = action.payload;
      state.status = action.type;
    },
    allAddressListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // address add
    addAddressRequest(state, action) {
      state.status = action.type;
    },
    addAddressSuccess(state, action) {
      state.addAddressResponse = action.payload;
      state.status = action.type;
    },
    addAddressFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // address edit
    editAddressRequest(state, action) {
      state.status = action.type;
    },
    editAddressSuccess(state, action) {
      state.editAddressResponse = action.payload;
      state.status = action.type;
    },
    editAddressFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // address active
    activeAddressRequest(state, action) {
      state.status = action.type;
    },
    activeAddressSuccess(state, action) {
      state.activeAddressResponse = action.payload;
      state.status = action.type;
    },
    activeAddressFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // place order
    placeOrderRequest(state, action) {
      state.status = action.type;
    },
    placeOrderSuccess(state, action) {
      state.placeOrderResponse = action.payload;
      state.status = action.type;
    },
    placeOrderFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // popular restaurant
    popularRestaurantRequest(state, action) {
      state.status = action.type;
    },
    popularRestaurantSuccess(state, action) {
      state.popularRestaurantResponse = action.payload;
      state.status = action.type;
    },
    popularRestaurantFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // hot selling food
    hotSellingFoodRequest(state, action) {
      state.status = action.type;
    },
    hotSellingFoodSuccess(state, action) {
      state.hotSellingFoodResponse = action.payload;
      state.status = action.type;
    },
    hotSellingFoodFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // nearby restaurnt
    nearbyRestaurantRequest(state, action) {
      state.status = action.type;
    },
    nearbyRestaurantSuccess(state, action) {
      state.nearbyRestaurantResponse = action.payload;
      state.status = action.type;
    },
    nearbyRestaurantFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // order list
    orderListRequest(state, action) {
      state.status = action.type;
    },
    orderListSuccess(state, action) {
      state.orderListResponse = action.payload;
      state.status = action.type;
    },
    orderListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // order details
    orderDetailsRequest(state, action) {
      state.status = action.type;
    },
    orderDetailsSuccess(state, action) {
      state.orderDetailsResponse = action.payload;
      state.status = action.type;
    },
    orderDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // profile details
    profileDetailsRequest(state, action) {
      state.status = action.type;
    },
    profileDetailsSuccess(state, action) {
      state.profileDetailsResponse = action.payload;
      state.status = action.type;
    },
    profileDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // edit account
    editAccountRequest(state, action) {
      state.status = action.type;
    },
    editAccountSuccess(state, action) {
      state.editAccountResponse = action.payload;
      state.status = action.type;
    },
    editAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //all products
    allProductsRequest(state, action) {
      state.status = action.type;
    },
    allProductsSuccess(state, action) {
      state.allProductsResponse = action.payload;
      state.status = action.type;
    },
    allProductsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //product by category with subcategory
    productByCategoryRequest(state, action) {
      state.status = action.type;
    },
    productByCategorySuccess(state, action) {
      state.productByCategoryResponse = action.payload;
      state.status = action.type;
    },
    productByCategoryFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //product by category with subcategory
    productBySubCategoryRequest(state, action) {
      state.status = action.type;
    },
    productBySubCategorySuccess(state, action) {
      state.productBySubCategoryResponse = action.payload;
      state.status = action.type;
    },
    productBySubCategoryFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //default pages call like T&C, ustomer support, about us, etc.
    defaultPageRequest(state, action) {
      state.status = action.type;
    },
    defaultPageSuccess(state, action) {
      state.defaultPageResponse = action.payload;
      state.status = action.type;
    },
    defaultPageFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});

export const {
  restaurentCategoryRequest,
  restaurentCategorySuccess,
  restaurentCategoryFailure,

  groceryCategoryRequest,
  groceryCategorySuccess,
  groceryCategoryFailure,

  restaurentListRequest,
  restaurentListSuccess,
  restaurentListFailure,

  foodItemsListRequest,
  foodItemsListSuccess,
  foodItemsListFailure,

  bannerRequest,
  bannerSuccess,
  bannerFailure,

  foodDetailsRequest,
  foodDetailsSuccess,
  foodDetailsFailure,

  allAddressListRequest,
  allAddressListSuccess,
  allAddressListFailure,

  addAddressRequest,
  addAddressSuccess,
  addAddressFailure,

  editAddressRequest,
  editAddressSuccess,
  editAddressFailure,

  activeAddressRequest,
  activeAddressSuccess,
  activeAddressFailure,

  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,

  popularRestaurantRequest,
  popularRestaurantSuccess,
  popularRestaurantFailure,

  hotSellingFoodRequest,
  hotSellingFoodSuccess,
  hotSellingFoodFailure,

  nearbyRestaurantRequest,
  nearbyRestaurantSuccess,
  nearbyRestaurantFailure,

  orderListRequest,
  orderListSuccess,
  orderListFailure,

  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFailure,

  profileDetailsRequest,
  profileDetailsSuccess,
  profileDetailsFailure,

  editAccountRequest,
  editAccountSuccess,
  editAccountFailure,

  allProductsRequest,
  allProductsSuccess,
  allProductsFailure,

  productByCategoryRequest,
  productByCategorySuccess,
  productByCategoryFailure,

  productBySubCategoryRequest,
  productBySubCategorySuccess,
  productBySubCategoryFailure,

  defaultPageRequest,
  defaultPageSuccess,
  defaultPageFailure,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
