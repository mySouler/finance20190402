import axios from 'axios'
const common  = {}

// 下载文件  post
common.downloadExcl_post = function (url, data, name, loading) {
    axios.post(url, data,{headers: {'Content-Type': 'application/json;charset=UTF-8'},responseType: 'blob'}).then((res) => {

        let fileName = name
            //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
    　  let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        }
        loading.close();
    }).catch(err => {
        loading.close();
    })

}


// 下载文件   get
common.downloadExcl_get = function (url, data, name, loading) {
    let fileName = name
    axios.get(url, {params:data,responseType:"blob"}).then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
          } else {
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              window.URL.revokeObjectURL(link.href);
          }
          loading.close();

         //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
    　
    }).catch(err => {
        loading.close();
    })
}

common.formatDateTime = function(date) {
    date = new Date(date)
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h=h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second=date.getSeconds();
    second=second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
}
export default common
