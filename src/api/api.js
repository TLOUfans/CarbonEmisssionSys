'use strict';
import axios from 'axios';

let base = '';

export const login = params => {
  return axios.post(`${base}/user/user`, params).then(res => res.data)
};
export const register = params => {
  return axios.post(`${base}/user/register`, params).then(res => res.data)
};
export const queryUsers = params => {
  return axios.post(`${base}/user/queryUsers`, params).then(res => res.data)
};
export const removeUser = params => {
  return axios.post(`${base}/user/removeUser`, params).then(res => res.data)
};
export const resetPass = params => {
  return axios.get(`${base}/user/resetPass`, params).then(res => res.data);
};


export const querfactor = params => {
  return axios.post(`${base}/factor/matAndMach`, params).then(res => res.data);
}
export const saveFactor = params => {
  return axios.post(`${base}/factor/saveFactor`, params).then(res => res.data);
}
export const downloadModelField = params => {
  return location.href = `/factor/downloadModelField`;
}

export const saveProject = params => {
  return axios.post(`${base}/build/saveProject`, params).then(res => res.data);
}

export const buildingList = params => {
  return axios.post(`${base}/build/buildingList`).then(res => res.data);
}

export const calcEmission = params => {
  return axios.post(`${base}/build/calcEmission`, params).then(res => res.data);
}

const tecentMapKey = 'KRLBZ-7APWP-XR3DP-LAGDY-3QSRQ-3YBLN';

//城市坐标获取 ==> 腾讯地图webservices
export const cityLocation = params => {
  return axios.get(`/ws/geocoder/v1/?address=${params}&key=${tecentMapKey}`).then(res => res.data);
}

//坐标的距离计算 ==> 腾讯地图webservices
export const distance = params => {
  return axios.get(`/ws/direction/v1/driving/?from=${params.from}&to=${params.to}&key=${tecentMapKey}`).then(res => res.data);
}

export const calcDistance = async params => {
  //所在城市
  const toCity = params.toCity;
  //来源城市
  const fromCitys = params.fromCitys;

  if (!toCity) return {message: '请选择项目所在城市'};
  if (!(fromCitys instanceof Array)) return {message: '来源城市格式错误'};
  if (!fromCitys.join('')) return {message: '来源城市不能为空'};

  const fromCityDistance = await Promise
    .all(fromCitys.map(v => cityLocation(v)))
    .then(res => {
      return res.map(v => {
        if(!v.result) {
          console.log(fromCitys[0]);
          return ''
        }
        const location = v.result.location;
        return location['lat'] + ',' + location['lng'];
      });
    });

  const toCityDistance = await cityLocation(toCity)
    .then(res => {
      if (res.status == 0) {
        const location = res.result.location;
        return location['lat'] + ',' + location['lng']
      }
      return ""
    });

  return await Promise.all(fromCityDistance.map(v => {return distance({from: toCityDistance, to: v})}))
    .then(res => {
      return res.map(v => {
        if (v.status == 0) {
          return v.result.routes[0].distance + "|" + fromCityDistance + "|" + fromCitys[0]
        }
        return '0|none|' + fromCitys[0]
      })
    });
}


//获取项目所在地城市名称
export const listProjCity = params => {
  return axios.post(`${base}/city/listProjCity`, params).then(res => res.data);
};

//添加来源城市
export const addOriginCity = params => {
  return axios.post(`${base}/city/addOriginCity`, params).then(res => res.data);
};

//根据城市名称获取源城市信息
export const listOriginCity = params => {
  return axios.post(`${base}/city/listOriginCity`, params).then(res => res.data);
};

//根据来源城市ID删除源城市
export const delOriginCity = params => {
  return axios.post(`${base}/city/delOriginCity`, params).then(res => res.data);
};

//根据来源城市ID修改源城市
export const updateOriginCity = params => {
  return axios.post(`${base}/city/updateOriginCity`, params).then(res => res.data);
};