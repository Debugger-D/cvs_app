angular.module('cvsApp').factory('tools', [function () {
    var tools = {
        add: function (arg1, arg2) {
            var r1, r2, m, c;

            try {
                r1 = arg1.toString().split(".")[1].length
            } catch (e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch (e) {
                r2 = 0
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2))
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                }
                else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            }
            else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m
        },
        multiply: function (arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length
            } catch (e) {
            }
            try {
                m += s2.split(".")[1].length
            } catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        }
        ,
        divide: function (arg1, arg2) {
            var t1 = 0, t2 = 0, r1, r2;
            try {
                t1 = arg1.toString().split(".")[1].length
            } catch (e) {
            }
            try {
                t2 = arg2.toString().split(".")[1].length
            } catch (e) {
            }
            with (Math) {
                r1 = Number(arg1.toString().replace(".", ""));
                r2 = Number(arg2.toString().replace(".", ""));
                return (r1 / r2) * pow(10, t2 - t1);
            }
        },
        fromJson: function (json) {
            var str = '';
            angular.forEach(json, function (val, key) {
                if (val || val == 0) {
                    str += key + '=' + val + '&'
                }
            });
            if (str) {
                str = str.substring(0, str.length - 1)
            }
            return str
        },
        parseParam:function(param, key){
            var paramStr="";
            if(param instanceof String||param instanceof Number||param instanceof Boolean){
                    paramStr+="&"+key+"="+encodeURIComponent(param);
                    }else{
                    $.each(param,function(i){
                            vark=key==null?i:key+(param instanceof Array?"["+i+"]":"."+i);
                            paramStr+='&'+parseParam(this, k);
                            });
                    }
            returnparamStr.substr(1);
        }
    };

    return tools;
}])
;