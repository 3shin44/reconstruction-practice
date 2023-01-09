const logger = {
  // 字體大小
  fontSize: '15',
  // log顯示等級
  logLevels: ['debug', 'info', 'warn', 'error'],
  // 顏色
  colors: {
    hotpink: 'hotpink',
    white: 'white',
    cuteGreen: '#1ab394',
    cuteBlue: 'rgb(0, 157,224)',
    gold: 'gold'
  },
  /**
   * debug
   * @param {string} tag - tag
   * @param {Arguments} arguments - arguments
   */
  debug(tag = '', ...arg) {
    if (!this.logLevels.includes('debug')) {
      return
    }
    console.log(
      '[' + formatDate() + '] %c[debug]',
      `color: ${this.colors.white};font-size:${this.fontSize}px;background-color:${this.colors.cuteGreen};`,
      tag,
      ...arg
    )
  },
  /**
   * info
   * @param {string} tag - tag
   * @param {string} information - information
   */
  info(tag = '', msg = '') {
    if (!this.logLevels.includes('info')) {
      return
    }
    const time = formatDate()
    console.info(
      '[' + time + '] %c[info]',
      `background-color: ${this.colors.cuteBlue};font-size:${this.fontSize}px; color: white;`,
      typeof tag === 'object' ? JSON.stringify(tag) : tag,
      msg
    )
  },
  /**
   * warn
   * @param {string} tag - tag
   * @param {Arguments} arguments - arguments
   */
  warn(tag = '', ...arg) {
    if (!this.logLevels.includes('warn')) {
      return
    }
    console.warn(
      '[' + formatDate() + '] %c[warn]',
      `color: white;font-size:${this.fontSize}px; background-color: ${this.colors.gold}`,
      typeof tag === 'object' ? JSON.stringify(tag) : tag,
      ...arg
    )
  },
  /**
   * error
   * @param {string} tag - tag
   * @param {any} errorMessage - errorMessage
   */
  error(tag = '', msg = '') {
    if (!this.logLevels.includes('error')) {
      return
    }
    const time = formatDate()
    console.error(
      '[' + time + '] %c[error]',
      `color: white;font-size:${this.fontSize}px; background-color: ${this.colors.hotpink};`,
      typeof tag === 'object' ? JSON.stringify(tag) : tag,
      msg
    )
  }
}
// debug開發使用
if (process.env.NODE_ENV === 'production') {
  logger.logLevels = logger.logLevels.filter((level) => level !== 'debug')
}

const formatDate = ()=>{
  let current_datetime = new Date();
  let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
  return formatted_date;
}
export default logger
