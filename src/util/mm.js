/**
 * js 工具类
 */

'use strict'
//注意这里需要引入的hogan.js
var Hogan = require('hogan.js');
var config = {
    serverHost: ''
};

var _mm = {

    //网络请求	
    request: function(param) {
        //缓存_mm对象
        var _this = this;
        $.ajax({
            type: param.method || 'get',
            url: param.url || '',
            dataType: param.type || 'json',
            data: param.data,
            success: function(result) {
                // 请求成功
                if (0 === result.status) {
                    typeof param.success === 'function' && param.success(result.data, result.msg);
                }
                //没有登录，强制登录
                else if (10 == result.status) {
                    _this.doLogin();
                }
                //参数错误
                else if (1 === result.status) {
                    typeof param.error === 'function' && param.error(result.msg);
                }
            },
            error: function(error) {
                typeof param.error === 'function' && param.error(error.statusText);
            }
        });
    },

    //获取服务端地址
    getServerUrl: function(path) {
        return config.serverHost + path;
    },

    //获取url参数
    getUrlParam: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        //search是获取?后面的字符串
        //substr(1)是去除?
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },

    //渲染html模板
    renderHtml: function(htmlTemplate, data) {
        var template = Hogan.compile(htmlTemplate),
            result = template.render(data);
        return result;
        return result;
    },

    //成功提示
    successTips: function(msg) {
        alert(msg || '操作成功');
    },

    //错误提示
    errorTips: function(msg) {
        alert(msg || '哪里不对了');
    },


    //字段的印证,支持是否为空，手机，邮箱
    validate: function(value, type) {
        var value = $.trim(value);
        //必输字段的非空印证
        if ('require' === type) {
            return !!value;
        }
        //手机印证
        if ('phone' == type) {
            return /^1\d{10}$/.test(value);
        }
        //邮箱印证
        if ('email' === type) {
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },

    //登录
    doLogin: function() {
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },

    //跳回主页
    goHome: function() {
        window.location.href = './index.html';
    }
}

module.exports = _mm;