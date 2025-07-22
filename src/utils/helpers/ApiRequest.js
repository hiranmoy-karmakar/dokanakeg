import axios from 'axios';
import Constant from './Constant';

export async function getApi(url, header) {
  console.log('GetApi:', `${Constant.BASE_URL}/${url}`);
  return await axios.get(`${Constant.BASE_URL}/${url}`, {
    headers: {
      Accept: header?.Accept,
      'Content-Type': header?.contenttype,
      // 'x-access-token': header.accesstoken,
      // Authorization: `Bearer ${header.accesstoken ?? ''}`,
      Authorization: `Bearer ${header?.accesstoken ?? ''}`,
    },
  });
}

export async function getApiWithParam(url, param, header) {
  console.log('getApiWithParam:', `${Constant.BASE_URL}/${url}`);
  return await axios({
    method: 'GET',
    baseURL: Constant.BASE_URL,
    url: url,
    params: param,
    headers: {
      Accept: header?.Accept,
      'Content-Type': header?.contenttype,
      Authorization: `Bearer ${header?.accesstoken ?? ''}`,
    },
  });
}

export async function postApi(url, payload, header) {
  console.log('PostApi:', `${Constant.BASE_URL}/${url}`);
  return await axios.post(`${Constant.BASE_URL}/${url}`, payload, {
    headers: {
      Accept: header?.Accept,
      'Content-Type': header?.contenttype,
      Authorization: `Bearer ${header?.accesstoken ?? ''}`,
    },
  });
}

export async function postApiWithParam(url, param, payload, header) {
  console.log('postApiWithParam:', `${Constant.BASE_URL}/${url}`);
  return await axios({
    method: 'POST',
    baseURL: Constant.BASE_URL,
    url: url,
    params: param,
    data: payload,
    headers: {
      Accept: header?.Accept,
      'Content-Type': header?.contenttype,
      Authorization: `Bearer ${header?.accesstoken ?? ''}`,
    },
  });
}

export async function putApi(url, payload, header) {
  console.log('PutApi:', `${Constant.BASE_URL}/${url}`);
  return await axios.put(`${Constant.BASE_URL}/${url}`, payload, {
    headers: {
      Accept: header?.Accept,
      'Content-Type': header?.contenttype,
      Authorization: `Bearer ${header?.accesstoken ?? ''}`,
    },
  });
}

export async function putApiWithParam(url, param, payload, header) {
  console.log('putApiWithParam:', `${Constant.BASE_URL}/${url}`);
  return await axios({
    method: 'PUT',
    baseURL: Constant.BASE_URL,
    url: url,
    params: param,
    data: payload,
    headers: {
      Accept: header?.Accept,
      'Content-Type': header?.contenttype,
      Authorization: `Bearer ${header?.accesstoken ?? ''}`,
    },
  });
}

export async function deleteApi(url, header) {
  console.log('DeleteApi:', `${Constant.BASE_URL}/${url}`);
  return await axios.delete(`${Constant.BASE_URL}/${url}`, {
    headers: {
      Accept: header?.Accept,
      'Content-Type': header?.contenttype,
      Authorization: `Bearer ${header?.accesstoken ?? ''}`,
    },
  });
}

export async function deleteApiWithParam(url, param, header) {
  console.log('deleteApiWithParam:', `${Constant.BASE_URL}/${url}`);
  return await axios({
    method: 'DELETE',
    baseURL: Constant.BASE_URL,
    url: url,
    params: param,
    headers: {
      Accept: header?.Accept,
      'Content-Type': header?.contenttype,
      Authorization: `Bearer ${header?.accesstoken ?? ''}`,
    },
  });
}
