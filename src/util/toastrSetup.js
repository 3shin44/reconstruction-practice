import toastr from 'toastr'
import api from '../api/getAPI'
import 'toastr/toastr.scss'

export default async function () {
  let timeOutConfig = '5000'
  const {toastrSecond} = await api.getConfig()
  if(toastrSecond){
    timeOutConfig = toastrSecond * 1000;
  }
  // global toastr setting
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '500',
    hideDuration: '1000',
    timeOut: timeOutConfig,
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  }
}
