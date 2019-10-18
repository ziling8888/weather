function API() { }
API.prototype.queryString = function (params) {
    var str = '';
    for (var key in params) {
        str += key + '=' + params[key] + '&';
    }

    str = str.slice(0, -1);

    return str;
}

API.prototype.ajax = function (o) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            o.success(this.responseText);
        }
    }

    var str = this.queryString(o.data);

    xhr.open(o.type.toUpperCase(), o.url + '?' + str, o.isAsync);

    xhr.send();
}
var api = new API();
if(localStorage.getItem('address')==undefined){
    localStorage.setItem('address',JSON.stringify([]));
}

var val = '';
$('.search-input').focus(function(){
    $('.pp').html('');
    var address=JSON.parse(localStorage.getItem('address'));
    for(var i=0;i<address.length;i++){
        if(address[i]==''){
            continue;
        }
        $li=$(`<li>${address[i]}</li>`);
        $('.pp').append($li);

    }
   
})
$('.search-input').blur(function(){
    $('.pp').html('');
})
$('.jd-icon').on('click', function () {
    val = $('.search-input').val();
    $('.history>ul').html('');
    var address=JSON.parse(localStorage.getItem('address'));
    if(address.indexOf(val)==-1){
        address.unshift(val);
        localStorage.setItem('address',JSON.stringify(address));
    }

    search();
})
search()


function search() {
    $.ajax({
        type: 'get',
        url: 'https://apis.map.qq.com/ws/location/v1/ip',
        data: {
            key: 'IC5BZ-PRRKO-3SOWN-SWOLB-UIR7E-3YFZJ',
            output: 'jsonp'
        },

        dataType: 'jsonp',
     
        success: function (data) {
            console.log('data ==> ', data);
            console.log('city',city)
            if (val == '') {
                var city = data.result.ad_info.city;
            }
            else {
                city = val;
            }
            hour(city);
            day(city);
        }
    })
}

//获取24小时天气
function hour(city) {
    api.ajax({
        type: 'get',
        url: 'https://api.heweather.net/s6/weather/hourly',
        data: {
            location: city,
            key: '0a66bfc35c794639a3d5165f51ab0a9f'
        },
        isAsync: true,
        success: function (d) {

            var date = JSON.parse(d);

            console.log(date);

            var hour = date.HeWeather6[0].hourly;

            console.log(hour);

            for (var i = 0; i < hour.length; i++) {

                var time = hour[i].time.slice(hour[i].time.length - 6, hour[i].time.length);

                var weather = hour[i].cond_txt;


                $li = $(`<li>
               <p class="p">${time}</p>
             <div>
               <img class="auto-img" src="./images/天气图标_${weather}.png" alt="">
             </div>
             <p class="p">${weather}</p>              
           </li>`);
                $('.list').append($li);
            }
        }
    })
}

//获取10天天气
function day(city) {
    api.ajax({
        type: 'get',
        url: 'https://api.heweather.net/s6/weather/forecast',
        data: {
            location: city,
            key: '0a66bfc35c794639a3d5165f51ab0a9f'
        },
        isAsync: true,
        success: function (d) {
            var data = JSON.parse(d);
            console.log(data);
            $('.img').html('');
            var dayweather = data.HeWeather6[0].daily_forecast;
            $('.min').text(dayweather[0].tmp_min);
            $('.max').text(dayweather[0].tmp_max);
            $('.a').text(dayweather[0].cond_txt_d);
            $('.city-county').text(city);
            $('.img').append($(`<img class="auto-img" src="./images/天气图标_${dayweather[0].cond_txt_d}.png" alt="">`))
            $('.date').text(dayweather[0].date.slice(dayweather[0].date.length - 5, dayweather[0].date.length));
            for (var i = 1; i < dayweather.length; i++) {
                var time = dayweather[i].date.slice(dayweather[i].date.length - 5, dayweather[i].date.length);
                var weatherb = dayweather[i].cond_txt_d;
                var weatherf = dayweather[i].cond_txt_n;
                var weather = weatherb + '转' + weatherf;
                if (weatherb == weatherf) {
                    var weather = dayweather[i].cond_txt_d;
                }

                var $li = $(`<li>
             <p class="p">${time}</p>
           <div>
             <img class="auto-img" src="./images/天气图标_${dayweather[i].cond_txt_d}.png" alt="">
           </div>
           <p class="p">${weather}</p>              
         </li>`);
                $('.lists').append($li);
                $('.search-input').val('');
            }
        }
    })
}
