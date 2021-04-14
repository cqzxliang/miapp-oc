import moment, {
  months
} from 'moment';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isNull(arg1) {
  return !arg1 && arg1 !== 0 && typeof arg1 !== 'boolean' ? true : false;
}

module.exports = {
  isNull,
  replaceQuery: function (url, query, opts) {
    for (let prop in query) {
      if (opts && typeof opts.propMap === 'function') {
        prop = opts.propMap.call(null, prop);
      }
      url = url.replace(`{${prop}}`, query[prop]);
    }
    url = url.replace(/\{\w+\}/g, opts && opts.nullVal ? opts.nullVal : '');
    return url;
  },
  isArray: function(ar) {
    return Object.prototype.toString.call(ar) === '[object Array]';
  },
  sortUtils: {
    byCharCode: (a, b, isAscend = true) => {
      a = a + '';
      b = b + '';
      const res = a > b ? 1 : a === b ? 0 : -1;
      return isAscend ? res : -res;
    },
    byDate: (a, b, isAscend = true, format) => {
      const toDateA = moment(a, format);
      const toDateB = moment(b, format);
      const isValida = toDateA.isValid(),
        isValidb = toDateB.isValid();
      let res;
      
      if (!isValida && !isValidb) {
        return sortUtils.byCharCode(a, b, isAscend);
      } else if (isValida && !isValidb) {
        res = 1;
      } else if (!isValida && isValidb) {
        res = -1;
      } else {
        res = toDateA.toDate().getTime() - toDateB.toDate().getTime();
      }
      return isAscend ? res : -res;
    },
    byTime: (
      a,
      b,
      isAscend = true,
      format = 'HH:mm:ss',
    ) => {
      const toDateA = moment('2018-01-01T ' + a, 'YYYY-MM-DDT ' + format);
      const toDateB = moment('2018-01-01T ' + b, 'YYYY-MM-DDT ' + format);
      const isValida = toDateA.isValid(),
        isValidb = toDateB.isValid();
      let res;
      if (!isValida && !isValidb) {
        return sortUtils.byCharCode(a, b, isAscend);
      } else if (isValida && !isValidb) {
        res = 1;
      } else if (!isValida && isValidb) {
        res = -1;
      } else {
        res = toDateA.toDate().getTime() - toDateB.toDate().getTime();
      }
      return isAscend ? res : -res;
    },
    byNumber: (a, b, isAscend = true) => {
      const isValida = isNumber(a),
        isValidb = isNumber(b);
      let res;
      if (!isValida && !isValidb) {
        return sortUtils.byCharCode(a, b, isAscend);
      } else if (isValida && !isValidb) {
        res = 1;
      } else if (!isValida && isValidb) {
        res = -1;
      } else {
        res = Number(a) - Number(b);
      }
      return isAscend ? res : -res;
    },
  },
}

// module.exports = {
//   formatTime: formatTime
// }
