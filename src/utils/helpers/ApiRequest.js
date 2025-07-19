import axios from 'axios';
import Constant from './Constant';

export async function getApi(url, header) {
  console.log('GetApi: ', `${Constant.BASE_URL}/${url}`);

  return await axios.get(`${Constant.BASE_URL}/${url}`, {
    headers: {
      Accept: header?.Accept,
      'Content-Type': header.contenttype,
      // 'x-access-token': header.accesstoken,
      // Authorization: `Bearer ${header.accesstoken ?? ''}`,
      Authorization: `${header.accesstoken ?? ''}`,
    },
  });
}

export async function getApiWithParam(url, param, header) {
  console.log('getApiWithParam: ', `${Constant.BASE_URL}/${url}`);

  return await axios({
    method: 'GET',
    baseURL: Constant.BASE_URL,
    url: url,
    params: param,
    headers: {
      Accept: header.Accept,
      'Content-type': header.contenttype,
    },
  });
}

export async function postApi(url, payload, header) {
  console.log('PostApi: ', `${Constant.BASE_URL}/${url}`);

  return await axios.post(`${Constant.BASE_URL}/${url}`, payload, {
    headers: {
      Accept: header.Accept,
      'Content-Type': header.contenttype,
      // 'x-access-token': header.accesstoken,
      // Authorization: `Bearer ${header.accesstoken ?? ''}`,
      Authorization: `${header.accesstoken ?? ''}`,
    },
  });
}
