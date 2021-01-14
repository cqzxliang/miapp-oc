const CryptoJS = require('crypto-js');

const key = CryptoJS.enc.Utf8.parse("defed456!@#@#ewaa45h4r1238132&AU");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('45de#d@#$!#asgfd');   //十六位十六进制数作为密钥偏移量

//解密方法
export function Decrypt(word) {
    const ciphertext = CryptoJS.AES.encrypt(word, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return ciphertext.toString();
  }
  
  //加密方法
  export  function Encrypt(word) {
    const bytes = CryptoJS.AES.decrypt(word.toString(), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }
  