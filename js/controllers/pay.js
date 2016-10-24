angular.module('cvsApp').controller('payCtrl', ['$rootScope',"$stateParams", "$scope", "goods", "$location", "order", "tools", "toaster", "fundsAPI","accountAPI","$timeout", function ($rootScope, $stateParams, $scope, goods, $location, order, tools, toaster, fundsAPI,accountAPI,$timeout) {
    //判断是否登录
    $scope.isLoaded=function () {
        accountAPI.islogined({},function (data) {
            data.isLogined==='true'?$scope.getGoodsList():$location.path('login');
        },function () {
            $location.path('login');
        })
    };
    $scope.isLoaded();
    //初始化错误提醒
    $scope.payerror_description='商品失效';
    /*判断是否开户*/
    $scope.getGoodsList = function () {
        fundsAPI.get({appId:"F75378884E4048C7AF8890DB9A38C541", tag: "shop"}, function (data) {
            $scope.blance=data.usableBalance;
            $scope.passwordYe=true;
        },function (data) {
            $scope.openAccount=true;
            $scope.passwordYe=false;
        })
    };
    //开户
    $scope.newAccount=function (openData) {
        var postData = {
            appId: 'F75378884E4048C7AF8890DB9A38C541',
            tag: 'shop',
            accountName:openData.countName,
            payPassword:openData.password
        };
        order.newAccount({},tools.fromJson(postData),function (data) {
            console.log(data)
        })
    }
    $scope.payBlock = true;
    //验证信息是否失效
    if($rootScope.billDetail==undefined){
        alert('商品信息已经失效');
        $location.path('home');
    }else {$scope.newAll=true;}
    //获取上页面的应付款信息
    $scope.inSum=$stateParams.amount;

    $scope.payJye=function () {
        $scope.bankBlock=false;
        $scope.payBlock=true;
        $scope.weixinBlock=false;
    };

    //余额支付
    $scope.pay = function () {
        var postData = {
            appId: 'F75378884E4048C7AF8890DB9A38C541',
            tag: 'shop',
            billDetail:$rootScope.billDetail,
            appKey:'9E9A06E769E217A166670EE4F03CB561',
            payPassword:$scope.password
        };
        order.payye({}, tools.fromJson(postData), function (data) {
            $scope.newAll=false;
            $scope.newBack=true;
            // $location.path('home');
            $timeout(function () {
                $location.path('home');
            },3000)
        },function(data){
            $scope.passwordError=true;
            $scope.error_description=data.data.error.description;
        })
    };
    //支付宝支付
    $scope.payJali = function () {
        var postData = {
            appId: 'F75378884E4048C7AF8890DB9A38C541',
            tag: 'shop',
            billDetail:$rootScope.billDetail,
            appKey:'9E9A06E769E217A166670EE4F03CB561',
            channel: 'ALIPAY',
            terminal: 'WEB'
        };
        order.pay({}, tools.fromJson(postData), function (data) {
            $scope.alipay($.param($.parseJSON(data.info)))
        },function(data){
            //商品失效
            $scope.newAll=false;
            $scope.newBackerror=true;
            $scope.payerror_description=data.data.error.description
            $timeout(function () {
                $location.path('home');
            },3000);
        })
    };
    $scope.alipay = function (param) {
        window.location.href = 'https://mapi.alipay.com/gateway.do?' + param
    };
    //微信支付
    $scope.payJweixin = function () {
        var postData = {
            appId: 'F75378884E4048C7AF8890DB9A38C541',
            tag: 'shop',
            billDetail:$rootScope.billDetail,
            appKey:'9E9A06E769E217A166670EE4F03CB561',
            channel: 'WEIXIN',
            terminal: 'WEB'
        };
        $scope.bankBlock=false;
        $scope.payBlock=false;
        $scope.weixinBlock=true;
        order.pay({}, tools.fromJson(postData), function (data) {
            // $scope.weixin($.param(data.info))
            $scope.codeUrl='http://pan.baidu.com/share/qrcode?w=150&h=150&url='+data.info.codeurl;
        },function(data){
            //商品失效
            $scope.newAll=false;
            $scope.newBackerror=true;
            $scope.payerror_description=data.data.error.description;
            $timeout(function () {
                $location.path('home');
            },3000);
            console.log($scope.payerror_description)
        })
    };
    //银行卡支付
    /*获取用户银行卡信息*/
    $scope.payBank=function () {
        $scope.payBlock=false;
        $scope.weixinBlock=false;
        $scope.bankBlock=true;
        order.payBank({}, function (data) {
            $scope.selectList=data.infos;
            // $scope.bankCardNofour=data.infos
        },function(){
            $scope.loadBlock = true;
        })
    };
    /*支付*/
    $scope.payBankGo=function () {
        var postData = {
            appId: 'F75378884E4048C7AF8890DB9A38C541',
            tag: 'shop',
            billDetail:$rootScope.billDetail,
            appKey:'9E9A06E769E217A166670EE4F03CB561',
            channel: 'LIANLIAN',
            terminal: 'WEB',
            bankCardNo:$scope.bankCardNo,
            payType:'QUICKPAY'
        };console.log(postData)
        order.pay({}, tools.fromJson(postData), function (data) {
            console.log(data);
            console.log($.param(data.info));
            $scope.lianlian($.param(data.info))
        },function(data){
            $scope.bankError=true;
            $scope.bankError=data.data.error ? data.data.error.description : '服务器挂了！！';
        })
    };
    $scope.bankChange = function(bankCardNo) {
        console.log(bankCardNo)
        $scope.bankCardNo=bankCardNo;
    }

    // $scope.select = '中国建设银行';
    // /*监听下拉银行卡*/
    // $scope.$watch('select', function (newValue, oldValue) {
    //     console.log(3333);
    //     if(newValue!=oldValue){
    //         angular.forEach($scope.selectList,function (d,data) {
    //             if(newValue==d.bankName){
    //                 $scope.bankCardNo=d.bankCardNo;
    //             }
    //         })
    //     }
    // },true);

    /*打开连连页面*/
    $scope.lianlian = function (param) {
        window.location.href = 'https://yintong.com.cn/payment/bankgateway.htm?' + param
        // window.location.href='http://test.yintong.com.cn/asklianlian/?cat=10&'+param;
    };

    // //开户
    // $scope.openBank=function(){
    //     var postData = {
    //         appId: 'F75378884E4048C7AF8890DB9A38C541',
    //         tag: 'shop',
    //         bankcardNo:'6226660605677380',
    //         realName:'马永辉',
    //         idCardNo:'342401199008059410'
    //     };
    //     order.openBank({}, tools.fromJson(postData), function (data) {
    //         console.log(data);
    //     })
    // }

    //tab切换改变css
    $('.newNav span').click(function () {
        $('.newNav span').css('background-color','#A0BEDD')
        $(this).css('background-color','#C4D5E7')
    })

    //检测是否可以绑定银行卡
    $scope.canbankBind=function () {
        $scope.bankBindBlock=true;
    }
    //绑定银行卡
    $scope.bankBind=function (data) {
        var postData = {
            appId: 'F75378884E4048C7AF8890DB9A38C541',
            tag: 'shop',
            bankcardNo:data.cardNo,
            realName:data.userName,
            idCardNo:data.idCard
        };console.log(postData)
        order.openBank({}, tools.fromJson(postData), function (data) {
            console.log(data);
        })
    }
}]);
/**
 * Created by Administrator on 2016/8/20.
 */
























