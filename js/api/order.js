angular.module('cvsApp').factory('order', ["$resource", "settings", function ($resource, settings) {
    return $resource(settings.cvsUrl+'/:orderId', null, {
        place: {
            method: 'POST',
            url: settings.cvsUrl + 'orders'
        },
        encrypt: {
            method: 'POST',
            url: settings.cvsUrl + 'orders/app/pay',
            headers:{"Content-Type":"application/x-www-form-urlencoded"}
        },
        payId:{
            method: 'GET',
            url: settings.cvsUrl+'/orders/payId/:orderId',
            headers:{"Content-Type":"application/x-www-form-urlencoded"}
        },
        payment: {
            method: 'POST',
            // isArray: true,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control" : "no-cache"
            },
            url: settings.cvsUrl+"/orders/payment"
        },
        pay:{
            method:'POST',
            url: settings.cvsFundsUrl + 'pay/trade/gateway',
            headers:{"Content-Type":"application/x-www-form-urlencoded"}
        },
        payye:{
            method:'POST',
            url: settings.cvsFundsUrl + 'pay/trade',
            headers:{"Content-Type":"application/x-www-form-urlencoded"}
        },
        payBank:{
            method:'GET',
            url: settings.cvsFundsUrl + 'bankcard',
            headers:{"Content-Type":"application/x-www-form-urlencoded"}
        },
        openBank:{
            method:'POST',
            url: settings.cvsFundsUrl + 'bankcard',
            headers:{"Content-Type":"application/x-www-form-urlencoded"}
        },
        newAccount:{
            method:'POST',
            url: settings.cvsFundsUrl + 'account/open',
            headers:{"Content-Type":"application/x-www-form-urlencoded"}
        }
    })
}]);