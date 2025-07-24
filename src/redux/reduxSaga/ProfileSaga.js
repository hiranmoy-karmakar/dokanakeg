import { call, put, select, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApi, postApi, putApi } from '../../utils/helpers/ApiRequest';
import ShowAlert from '../../utils/helpers/ShowAlert';
import constants from '../../utils/helpers/Constant';

import {
  restaurentCategorySuccess,
  restaurentCategoryFailure,
  groceryCategorySuccess,
  groceryCategoryFailure,
  restaurentListSuccess,
  restaurentListFailure,
  foodItemsListSuccess,
  foodItemsListFailure,
  bannerSuccess,
  bannerFailure,
  foodDetailsSuccess,
  foodDetailsFailure,
  allAddressListSuccess,
  allAddressListFailure,
  activeAddressSuccess,
  activeAddressFailure,
  addAddressSuccess,
  addAddressFailure,
  editAddressSuccess,
  editAddressFailure,
  placeOrderSuccess,
  placeOrderFailure,
  popularRestaurantSuccess,
  popularRestaurantFailure,
  hotSellingFoodSuccess,
  hotSellingFoodFailure,
  nearbyRestaurantSuccess,
  nearbyRestaurantFailure,
  orderListSuccess,
  orderListFailure,
  orderDetailsSuccess,
  orderDetailsFailure,
  profileDetailsSuccess,
  profileDetailsFailure,
  editAccountSuccess,
  editAccountFailure,
  allProductsSuccess,
  allProductsFailure,
  productByCategorySuccess,
  productByCategoryFailure,
  productBySubCategorySuccess,
  productBySubCategoryFailure,
  defaultPageSuccess,
  defaultPageFailure,
} from '../reducer/ProfileReducer';
import { getTokenSuccess, logoutSuccess } from '../reducer/AuthReducer';
let getItem = state => state.AuthReducer;

//Terms and Condition

export function* restaurentCategorySaga(action) {
  let items = yield select(getItem);
  // console.log('token', items.token);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'categories/store-category/2', header);

    if (response?.status === 200) {
      yield put(restaurentCategorySuccess(response?.data));
    } else {
      yield put(restaurentCategoryFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(restaurentCategoryFailure(error));
    // ShowAlert(response?.data?.message);
  }
}

//grocery category
export function* groceryCategorySaga(action) {
  let items = yield select(getItem);
  // console.log('token', items.token);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };
  try {
    let response = yield call(getApi, 'categories/store-category/1', header);

    if (response?.status === 200) {
      yield put(groceryCategorySuccess(response?.data));
    } else {
      yield put(groceryCategoryFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(groceryCategoryFailure(error));
    // ShowAlert(response?.data?.message);
  }
}

export function* restaurentListSaga(action) {
  let items = yield select(getItem);

  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    // ✅ Convert payload object to query string
    const queryString = new URLSearchParams(action.payload).toString();
    const endpoint = `stores?${queryString}`;

    const response = yield call(getApi, endpoint, header);

    if (response?.status === 200) {
      yield put(restaurentListSuccess(response?.data));
    } else {
      yield put(restaurentListFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('restaurentListSaga error:', error);
    yield put(restaurentListFailure(error));
  }
}
// category and food item acording restaurant

export function* foodItemsSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let query = action.payload.types
      ? `stores/${action.payload.id}/category-items?types=${action.payload.types}`
      : `stores/${action.payload.id}/category-items`;

    let response = yield call(getApi, query, header);

    if (response?.status === 200) {
      yield put(foodItemsListSuccess(response?.data));
    } else {
      yield put(foodItemsListFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(foodItemsListFailure(error));
  }
}
// banner
export function* bannerSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let response = yield call(getApi, 'banners', header);

    if (response?.status === 200) {
      yield put(bannerSuccess(response?.data));
    } else {
      yield put(bannerFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(bannerFailure(error));
  }
}
// food details
export function* foodDetailsSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let query = `food-items/${action.payload}`;

    let response = yield call(getApi, query, header);

    if (response?.status === 200) {
      yield put(foodDetailsSuccess(response?.data));
    } else {
      yield put(foodDetailsFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('food details error:', error);
    yield put(foodDetailsFailure(error));
  }
}

// address get
export function* allAddressListSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let response = yield call(getApi, 'user/addresses', header);

    if (response?.status === 200) {
      yield put(allAddressListSuccess(response?.data));
    } else {
      yield put(allAddressListFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(allAddressListFailure(error));
  }
}

// active address get
export function* activeAddressSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let response = yield call(getApi, 'user/addresses?is_default=1', header);

    if (response?.status === 200) {
      yield put(activeAddressSuccess(response?.data));
    } else {
      yield put(activeAddressFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(activeAddressFailure(error));
  }
}
// address add
export function* addAddressSaga(action) {
  let items = yield select(getItem);
  let header = {
    // Accept: 'application/json',
    contenttype: 'application/json',
    // contenttype: 'multipart/form-data',
    accesstoken: items?.getTokenResponse,
  };
  try {
    const response = yield call(
      postApi,
      'user/addresses',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(addAddressSuccess(response?.data));
      ShowAlert(response?.data?.message);
    } else {
      yield put(addAddressFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(addAddressFailure(error));
    // ShowAlert(response?.data?.message);
  }
}

// address edit
export function* editAddressSaga(action) {
  let items = yield select(getItem);
  let header = {
    // Accept: 'application/json',
    contenttype: 'application/json',
    // contenttype: 'multipart/form-data',
    accesstoken: items?.getTokenResponse,
  };
  try {
    const response = yield call(
      putApi,
      `user/addresses/${action.payload.id}`,
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(editAddressSuccess(response?.data));
      ShowAlert(response?.data?.message);
    } else {
      yield put(editAddressFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(editAddressFailure(error));
    // ShowAlert(response?.data?.message);
  }
}
// place order
export function* placeOrderSaga(action) {
  let items = yield select(getItem);
  let header = {
    // Accept: 'application/json',
    contenttype: 'application/json',
    // contenttype: 'multipart/form-data',
    accesstoken: items?.getTokenResponse,
  };
  try {
    const response = yield call(postApi, 'orders', action.payload, header);

    if (response?.status == 200) {
      yield put(placeOrderSuccess(response?.data));
      ShowAlert(response?.data?.message);
    } else {
      yield put(placeOrderFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(placeOrderFailure(error));
    // ShowAlert(response?.data?.message);
  }
}

// popular restaurant
export function* popularRestaurantSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let response = yield call(getApi, 'popular/restaurant', header);

    if (response?.status === 200) {
      yield put(popularRestaurantSuccess(response?.data));
    } else {
      yield put(popularRestaurantFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(popularRestaurantFailure(error));
  }
}

// hot selling food
export function* hotSellingFoodSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let response = yield call(getApi, 'hot-selling/food-items', header);

    if (response?.status === 200) {
      yield put(hotSellingFoodSuccess(response?.data));
    } else {
      yield put(hotSellingFoodFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(hotSellingFoodFailure(error));
  }
}

// nearby restaurnt
export function* nearbyRestaurentSaga(action) {
  let items = yield select(getItem);

  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    // ✅ Convert payload object to query string
    const queryString = new URLSearchParams(action.payload).toString();
    const endpoint = `stores?${queryString}`;

    const response = yield call(getApi, endpoint, header);

    if (response?.status === 200) {
      yield put(nearbyRestaurantSuccess(response?.data));
    } else {
      yield put(nearbyRestaurantFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('restaurentListSaga error:', error);
    yield put(nearbyRestaurantFailure(error));
  }
}

// order list
export function* orderListSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let response = yield call(getApi, 'orders', header);

    if (response?.status === 200) {
      yield put(orderListSuccess(response?.data));
    } else {
      yield put(orderListFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(orderListFailure(error));
  }
}

// order details
export function* orderDetailsSaga(action) {
  let items = yield select(getItem);

  const header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    const api = `orders/${action.payload}`; // if payload is just the ID
    const response = yield call(getApi, api, header);

    if (response?.status === 200) {
      yield put(orderDetailsSuccess(response?.data));
    } else {
      yield put(orderDetailsFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(orderDetailsFailure(error));
  }
}
// profile details
export function* profileDetailsSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let response = yield call(getApi, 'user/profile', header);

    if (response?.status === 200) {
      yield put(profileDetailsSuccess(response?.data));
    } else {
      yield put(profileDetailsFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(profileDetailsFailure(error));
  }
}

// edit account
export function* editAccountSaga(action) {
  let items = yield select(getItem);
  let header = {
    // Accept: 'application/json',
    contenttype: 'application/json',
    // contenttype: 'multipart/form-data',
    accesstoken: items?.getTokenResponse,
  };
  try {
    const response = yield call(putApi, 'user/profile', action.payload, header);

    if (response?.status == 200) {
      yield put(editAccountSuccess(response?.data));
      ShowAlert(response?.data?.message);
    } else {
      yield put(editAccountFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(editAccountFailure(error));
    // ShowAlert(response?.data?.message);
  }
}

//all products
export function* allProductsSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    const queryString = new URLSearchParams(action.payload).toString();
    let response = yield call(getApi, `products?${queryString}`, header);

    if (response?.status === 200) {
      yield put(allProductsSuccess(response?.data));
    } else {
      yield put(allProductsFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('add address error:', error);
    yield put(allProductsFailure(error));
  }
}

//product by category with subcategory
export function* productByCategorySaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let query = `products/category/${action.payload}`;

    let response = yield call(getApi, query, header);

    if (response?.status === 200) {
      yield put(productByCategorySuccess(response?.data));
    } else {
      yield put(productByCategoryFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('food details error:', error);
    yield put(productByCategoryFailure(error));
  }
}
export function* productBySubCategorySaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let query = `products/category/${action.payload}`;

    let response = yield call(getApi, query, header);

    if (response?.status === 200) {
      yield put(productBySubCategorySuccess(response?.data));
    } else {
      yield put(productBySubCategoryFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('food details error:', error);
    yield put(productBySubCategoryFailure(error));
  }
}
//default pages call like T&C, ustomer support, about us, etc.

export function* defaultPageSaga(action) {
  let items = yield select(getItem);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: items?.getTokenResponse,
  };

  try {
    let query = `pages/slug/${action.payload}`;

    let response = yield call(getApi, query, header);

    if (response?.status === 200) {
      yield put(defaultPageSuccess(response?.data));
    } else {
      yield put(defaultPageFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    console.log('food details error:', error);
    yield put(defaultPageFailure(error));
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest(
      'Profile/restaurentCategoryRequest',
      restaurentCategorySaga,
    );
  })(),
  (function* () {
    yield takeLatest('Profile/groceryCategoryRequest', groceryCategorySaga);
  })(),
  (function* () {
    yield takeLatest('Profile/restaurentListRequest', restaurentListSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/foodItemsListRequest', foodItemsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/bannerRequest', bannerSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/foodDetailsRequest', foodDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/allAddressListRequest', allAddressListSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/activeAddressRequest', activeAddressSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/addAddressRequest', addAddressSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/editAddressRequest', editAddressSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/placeOrderRequest', placeOrderSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/popularRestaurantRequest', popularRestaurantSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/hotSellingFoodRequest', hotSellingFoodSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/nearbyRestaurantRequest', nearbyRestaurentSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/orderListRequest', orderListSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/orderDetailsRequest', orderDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/profileDetailsRequest', profileDetailsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/editAccountRequest', editAccountSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/allProductsRequest', allProductsSaga);
  })(),
  (function* () {
    yield takeLatest('Profile/productByCategoryRequest', productByCategorySaga);
  })(),
  (function* () {
    yield takeLatest(
      'Profile/productBySubCategoryRequest',
      productBySubCategorySaga,
    );
  })(),
  (function* () {
    yield takeLatest('Profile/defaultPageRequest', defaultPageSaga);
  })(),
];

export default watchFunction;
