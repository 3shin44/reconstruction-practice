const functionUtil = {
  /**
   * 取得亂數，以crypto函式取得
   * @returns {number} 0 - 2^32 的亂數
   */
  getRandom() {
    const crypto = window.crypto
    return crypto.getRandomValues(new Uint32Array(1))[0]
  },
  /**
   * 產UUID
   * @returns {string} UUID(ex:"7d728773-adc5-446e-a551-4622555d6254")
   */
  createUUID() {
    let d = Date.now()
    if (
      typeof performance !== 'undefined' &&
      typeof performance.now === 'function'
    ) {
      d += performance.now() //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + parseFloat('0.' + this.getRandom()) * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
  },
  /**
   * 取得URL參數
   * @returns {Object} 將URL參數組成物件{ key: value }
   */
  getQueryStringObj() {
    const resultObj = {}
    if (location.search) {
      const paramArr = decodeURI(location.search).split('&')
      paramArr.forEach((item) => {
        let key = item.split('=')[0]
        let value = item.split('=')[1]
        value = value.replace(/%40/g, '@')
        value = value.replace(/%/g, '%25')
        value = decodeURIComponent(value)
        key = key.replace('?', '')
        key = key.toLocaleLowerCase()
        resultObj[key] = value
      })
    }
    return resultObj
  },
  /**
   * 回傳提示檢查
   * @param  API回傳結果
   * @returns 異常檢查結果: true, false
   */
  apiResponseError(apiRes) {
    // 預設回覆訊息與預設成功代碼
    let returnCode = 'returnCode',
      sucessCode = '0000',
      returnMsg = 'returnMsg'

    if (apiRes[returnCode] != sucessCode) {
      // 顯示伺服器錯誤訊息, 並回覆確認錯誤
      console.log(apiRes[returnMsg])
      return true
    } else {
      return false
    }
  },
  /**
   * 更新顯示陣列 (配合BasePagination組件使用)
   * @param {Array} originArray - 原始資料陣列
   * @param {Array} displayArray - 顯示資料陣列
   * @param {integer} pageNo - 當前頁碼
   * @param {integer} dataPerPage - 每頁資料筆數
   * @returns Array
   */
  //
  refreshTable(originArray, displayArray, pageNo, dataPerPage = 10) {
    displayArray = originArray
    displayArray = displayArray.slice(
      (pageNo - 1) * dataPerPage,
      pageNo * dataPerPage
    )
    return displayArray
  },

  /**
   * JS日期物件轉換格式為 YYYY/MM/DD
   * @param  date - 原始時間物件
   * @param  separator - 分隔符號, 預設為"/"
   * @returns YYYY/MM/DD (default)
   */
  dateToYYYYMMDD(date, separator = '/') {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join(separator)
  }
}
export default functionUtil
