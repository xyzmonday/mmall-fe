'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var navSide = require('page/common/nav-side/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
/*表单里面的错误提示*/
var formError = {
    show: function(errorMsg) {
        $('.error-item').show().find('.error-msg').text(errorMsg);
    },
    hide: function() {
        $('.error-item').hide().find('.error-msg').text('');
    }
};
var page = {
    init: function() {
        this.bindEvent();
    },
    bindEvent: function() {
        var _this = this;
        //点击登录
        $('#btn-submit').click(function() {
            _this.submit();
        });

        //如果按下回车，也是提交
        $('.user-content').keyup(function(e) {
            if (e.keyCode === 13) {
                _this.submit();
            }
        });
    },
    //提交表单
    submit: function() {
        var formData = {
            username: $.trim($('#username').val()),
            password: $.trim($('#password').val())
        };
        var validateResult = this.formValidate(formData);
        if (validateResult.status) {
            //验证成功，提交
            _user.login(formData, function(result) {
                window.location.href = _mm.getUrlParam('redirect') || './index.html';
            }, function(errorMsg) {
                formError.show(errorMsg);
            });
        } else {
            //验证失败，给出错误提示
            formError.show(validateResult.msg);
        }
    },

    //校验表单
    formValidate: function(formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (!_mm.validate(formData.username, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        if (!_mm.validate(formData.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        //通过验证
        result.status = true;
        result.msg = '验证通过';
        return result;
    },

};

$(function() {
    page.init();
});