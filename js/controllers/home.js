angular.module('cvsApp').controller('homeCtrl', ['$rootScope',"$scope", "goods", "$location", "order", "tools", "toaster","accountAPI", function ($rootScope,$scope, goods, $location, order, tools, toaster,accountAPI) {

    // 判断是否登录
    $scope.isLoaded=function () {
        accountAPI.islogined({},function (data) {
            data.isLogined==='true'?$scope.getGoodsList():$location.path('login');
        },function () {
            $location.path('login');
        })
    };
    $scope.isLoaded();


    $scope.getGoodsList = function () {
        goods.getList({}, function (data) {
            $scope.goodsList = data.info;
        })
    };
    $scope.getGoodsList();

    $scope.orderData = {
        outSum: 0.00,
        inSum: 0.00,
        diffPrice: 0.00,
        num: 0
    };
    $scope.getCookie = function(cookieName){
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for(var i = 0; i < arrCookie.length; i++){
            var arr = arrCookie[i].split("=");
            if(cookieName == arr[0]){
                return arr[1];
            }
        }
        return "";
    }
    $scope.userId=$scope.getCookie('userId');
    $scope.submitData = {
        goodsList: [],
        userId:$scope.userId
    };
    $scope.channel = 'ALIPAY';

    /*购买*/
    $scope.open = function (item) {
        item.display = true;
        item.goodsNum = 1;
        $scope.orderData.inSum = tools.add($scope.orderData.inSum, item.price);
        $scope.orderData.outSum = tools.add($scope.orderData.outSum, item.outPrice);
        $scope.orderData.diffPrice = tools.add($scope.orderData.diffPrice, (item.outPrice - item.price));
        $scope.orderData.num++;
    };
    $scope.close = function (e, item) {
        e.stopPropagation();
        item.display = false;
        var totalInPrice = tools.multiply(item.goodsNum, item.price);
        var totalOutPrice = tools.multiply(item.goodsNum, item.outPrice);
        var totalDiffPrice = tools.multiply(item.goodsNum, item.outPrice - item.price);
        $scope.orderData.inSum = tools.add($scope.orderData.inSum, -totalInPrice);
        $scope.orderData.outSum = tools.add($scope.orderData.outSum, -totalOutPrice);
        $scope.orderData.diffPrice = tools.add($scope.orderData.diffPrice, -totalDiffPrice);
        $scope.orderData.num -= item.goodsNum;
        item.goodsNum = 0;
    };
    $scope.plusNum = function (item) {
        item.goodsNum++;
        $scope.orderData.inSum = tools.add($scope.orderData.inSum, item.price);
        $scope.orderData.outSum = tools.add($scope.orderData.outSum, item.outPrice);
        $scope.orderData.diffPrice = tools.add($scope.orderData.diffPrice, (item.outPrice - item.price));
        $scope.orderData.num++;
    };


    $scope.selectedGoods = function () {
        angular.forEach($scope.goodsList, function (val, key) {
            for (var i = 0; i < val.goodsNum; i++) {
                $scope.submitData.goodsList.push({id: val.id, goodsId: val.goodsId, price: val.price})
            }
        })
    };

    $scope.placeOrder = function () {
        $scope.selectedGoods();
        toaster.clear();
        if ($scope.submitData.goodsList.length == 0) {
            toaster.pop('waring', '请选择商品');
            return;
        }

        order.place({}, $scope.submitData).$promise.then(function (data) {
            $scope.encrypt(data.message);
            console.log(data.message);
        },function (data) {
            alert('只能购买相同面值的虚拟商品!');
            window.location.reload();

        })
    };

    $scope.encrypt = function (orderId) {
        order.encrypt({}, "orderId=" + orderId, function (data) {
            //获取商品账单加密详情
            $rootScope.billDetail = data.info;
            $scope.payBlock = true;
            console.log(data)
            $scope.orderId = orderId
            console.log(orderId)
            var filterObj1 = $.extend({}, {orderId: orderId});

            order.payment({}, JSON.stringify({'orderId': orderId}), function (data) {
                var payInterval = setInterval(payment, 500);
                // payment()
                var payaccount=1
                function payment() {
                    var filterObj = $.extend({}, {orderId: orderId});
                    order.payId(filterObj, function (data) {
                        if (data.payId!="blank") {
                            window.location.href = 'http://pay.happytai.cn/checkstand/?payId=' + data.payId + '&from=shop&appId=F75378884E4048C7AF8890DB9A38C541&redirectUrl=http://shop.happytai.cn';
                        }else{
                            payaccount+=1
                            if(payaccount>10){
                                clearInterval(payInterval);
                                alert('支付下单失败');
                                window.location.reload();
                            }
                        }
                    })
                }
            })
        })
    };
}]);