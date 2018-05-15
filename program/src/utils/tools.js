import Cookies from 'js-cookie';
import { LOGIN_URL, VERIFY_PAGE } from '../constant/config';

// 验证是否登录
export function verifyLogin() {
  const { href } = window.location;
  const paramas = queryString.parse(href);
  /* 判断url是否有access_token,如果有则将其存储到cookie */
  if (paramas.access_token) {
    const accessToken = paramas.access_token.split('#/')[0];
    Cookies.set('access_token', accessToken, { expires: 7 });
  } else {
    window.location.href = `${LOGIN_URL}?next=${VERIFY_PAGE}`;
  }
  // 读取cookie，如果没有access_token,则跳转到登录页面
  /* if (!Cookies.get('access_token')) {
    console.log('用户未登录');
    // window.location.href = REGISTER_URL + '?next='+ LOGIN_URL + "?next=" + NEXT_URL;
    window.location.href = LOGIN_URL + '?next=' + NEXT_URL;
  } else {
    console.log('用户已登录',Cookies.get('access_token'));
    // window.location.href = HOME_PAGE;
  } */
}

// 未登录状态跳转到验证页面
export function jumpToVerify() {
  window.location.href = VERIFY_PAGE;
}

// 解析url
export const queryString = {
  parse(url) {
    const parseObj = {};
    if (!url) {
      return false;
    }
    let argStr = '';
    if (url.split('?').length > 1) {
      argStr = url.split('?')[1];
      const argArr = argStr.split('&');
      argArr.forEach((val) => {
        const args = val.split('=');
        if (args.length > 1) {
          parseObj[args[0]] = args[1];
        }
      });
    }
    return parseObj;
  },
  toQueryString(params) {
    console.log('参数params:', Object.prototype.toString.call(params), params);
    if (Object.prototype.toString.call(params) !== '[object Object]') {
      // throw new Error('toString方法传参必须是一个JSON');
      return '';
    }
    let queryStr = '';
    Object.keys(params).forEach((key) => {
      queryStr += `${key}=${params[key] || ''}&`;
    });
    console.log('queryString---', queryStr);
    return queryStr.substring(0, queryStr.length - 1);
  },
};


/**
 * 验证文件后缀是否符合要求
 * @param {string} fileName 文件名
 * @param {array} fileNameArr 包含文件名的数组
 */
export function checkFile(fileName, fileNameArr) {
  const partter = '(\\.' + fileNameArr.join('|\\.') + ')$';
  return new RegExp(partter, 'i').test(fileName);
}


// 时间戳转年月日时分秒
export function timeStampToDate(timeStamp) {
  const date = new Date(timeStamp);
  const time = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    week: date.getDay(),
    H: date.getHours(),
    M: date.getMinutes(),
    S: date.getSeconds(),
  };
  return { ...time, timeStr: `${time.year}-${time.month}-${time.day} ${time.H}:${time.M}:${time.S}` };
}


// 获取文件的后缀名
export function getFileSuffix(filename) {
  return filename.split('.').slice(-1)[0];
}

// 获取目录字符串
let categoryStr = '';
export function getCategoryStr(category) {
  if (typeof category !== 'object') {
    throw new Error('参数必须是一个json对象');
  }
  categoryStr += '-' + category.category_name;
  if (category.children) { getCategoryStr(category.children); }
  return categoryStr;
}


/**
 * 根据指定key替换数组中的的某一个对象
 * 
 * @param {obj} obj 用来替换的json对象
 * @param {arr} arr 放置了很多个json对象的数据
 * @param {string} key 用于替换查找的key
 * 
 * demo 
 * var arr1 = [{name:'test1'},{name:'test2'},{name:'test3'}]
 * 执行replaceObjFromArr({name:'test1',age:25},arr1,"name");
 * 结果：[{name:'test1',age:23},{name:'test2'},{name:'test3'}]
 */
export function replaceObjFromArr(obj, arr, key) {
  if (!Array.isArray(arr)) {
    throw new Error('传参必须是数组');
  }
  let isExist = false;
  const newArr = arr.map((val) => {
    if (val[key] === obj[key]) {
      isExist = true;
      return obj;
    } else {
      return val;
    }
  });
  return isExist ? newArr : [...newArr, obj];
}

// 根据指定的Key删除对象数组中的某一个对象
export function removeObjFromArr(obj, arr, key) {
  if (!Array.isArray(arr)) {
    throw new Error('传参必须是数组');
  }
  return arr.filter(val => (
    obj[key] !== val[key]
  ));
}


// 处理服务器错误信息
export function handleServerMsg(str) {
  const strArr = str.split(':');
  if (strArr.length === 2) {
    return strArr[1];
  } else {
    return strArr[0];
  }
}

// 处理服务器错误信息
export function handleServerMsgObj(obj) {
  if (typeof obj === 'object') {
    const objKeys = Object.keys(obj);
    return obj[objKeys[0]];
  } else if (typeof obj === 'string') {
    return handleServerMsg(obj);
  }
}

// 将以秒为单位的时间转换成人性化的字符串
export function transformSecondsToHuman(seconds) {
  const data = {
    h: '', // 时
    m: '', // 分
    s: '', // 秒
    str: '',
  };
  if (seconds < 60) {
    data.h = 0;
    data.m = 0;
    data.s = seconds;
    data.str = seconds + 's';
  } else if (seconds > 216000) {
    data.h = seconds / 360;
  }
}
