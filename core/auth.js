// import { encryptUtil } from '../utils/encryptUtil';
// const formatUrl = 'https://miwebapi.mic.com.cn/';
const formatUrl = 'http://localhost:8082/';
const loginUrl = 'global/login';
const app = getApp();
const getSelfPrivilege = 'Guid/GetUserFunctions';
const encryptUtil = require('../utils/encryptUtil');
const util = require('../utils/util');

export async function login(data = {}) {
    let userName = encryptUtil.Decrypt(data.userName);
    let password = encryptUtil.Decrypt(data.password);
    const postData = {
        userName: userName,
        password: password
    };
    try {
        wx.showLoading({
            title: '登录中',
            mask:true,
        })
        let res = await requestWithoutToken('POST', loginUrl, postData);
        if (res.statusCode == 200) {
            const token = res.data.Token;
            app.setToken(token);
            const expires = res.data.Expires;
            app.setExpires(expires);
            let user = {};
            Object.assign(user, res.data.User);
            let priRes = await request('GET', getSelfPrivilege, {
                moduleID: ''
              })
            user.privilege =  priRes.data;
            user.modules = res.data.Modules;
            user.password = password;
            user.userName = userName;
            app.setUserInfo(user);
            wx.hideLoading();
            return true;
        } else {

            wx.hideLoading();
            wx.showToast({
                title: '登录出错！',
                icon: 'none',
                duration: 3000
            });
            return false;
        }
    } catch (err) {
        wx.hideLoading();
        wx.showToast({
            title: '登录出错！',
            icon: 'none',
            duration: 3000
        });

        return false;
    };
}


export async function request(method, url, data) {
    const vm = this
   if(!isTokenExpired()){
       await getNewToken();
   }
   const token = app.getToken();
    return new Promise((resolve, reject) => {
        wx.request({
            url: formatUrl + url,
            data,
            header: {
                'content-type': 'application/json',
                'access_token': token
            },
            method,
            dataType: 'json',
            responseType: 'text',
            success:(res)=> {
                resolve(res)
            },
            fail:()=> {
                reject({
                    msg: '请求失败',
                    url:  url,
                    method,
                    data
                })
            }
        })
    })
}

export async function requestWidthLogin(method, url, data) {
   await  login({userName:'hugh.liang' , password:'pass147'});
   if(!isTokenExpired()){
       await getNewToken();
   }
   const token = app.getToken();
    return new Promise((resolve, reject) => {
        wx.request({
            url: formatUrl + url,
            data,
            header: {
                'content-type': 'application/json',
                'access_token': token
            },
            method,
            dataType: 'json',
            responseType: 'text',
            success:(res)=> {
                resolve(res)
            },
            fail:()=> {
                reject({
                    msg: '请求失败',
                    url:  url,
                    method,
                    data
                })
            }
        })
    })
}


function requestWithoutToken(method, url, data) {
    
    return new Promise((resolve, reject) => {
        wx.request({
            url: formatUrl + url,
            data,
            header: {
                'content-type': 'application/json'
            },
            method,
            dataType: 'json',
            responseType: 'text',
            success:(res)=> {
                resolve(res)
            },
            fail:()=> {
                reject({
                    msg: '请求失败',
                    url:  url,
                    method,
                    data
                })
            }
        })
    })
}

function isTokenExpired() {
    const tokenExpired = parseInt(app.getExpires());
    const nowTime = new Date().getTime();
    if (tokenExpired - 30*1000 > nowTime) {
      return true;
    } else {
      return false;
    }
}

async function getNewToken(){
    let user = app.getUserInfo();
    const postData = {
        userName: user.userName,
        password: user.password
    };
    let res = await requestWithoutToken('POST', loginUrl, postData, 'application/json');
    if (res.statusCode == 200) {
        const token = res.data.Token;
        app.setToken(token);
        const expires = res.data.Expires;
        app.setExpires(expires);
        Object.assign(user, res.data.User);
        user.modules = res.data.Modules;
        app.setUserInfo(user);
        return true;
    } else {
        return false;
    }
    
}

export  function hasPrivilege(module, fn ) {
    const userinfo = app.getUserInfo();
    const privilege = userinfo.privilege;
    if (util.isArray(privilege)) {
      return !!privilege
        .filter(m => m.ROLE_NAME.indexOf(module) > -1)
        .find(p => p.FUNCTION_URL === fn);
    }
    return false;
  }

export function getLookUp(type){
    return request('GET', 'IPQA/GetMRILookup', {
        lookup_type: type
      });
}  