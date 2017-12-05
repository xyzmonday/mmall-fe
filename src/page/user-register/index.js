'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var navSide  = require('page/common/nav-side/index.js');
var _mm        = require('util/mm.js');
var _user      = require('service/user-service.js');
/*表单里面的错误提示*/
var formError = {
    show :  function(errorMsg) {
        $('.error-item').show().find('.error-msg').text(errorMsg);
    },
    hide: function() {
        $('.error-item').hide().find('.error-msg').text('');
    }
};
var page = {
    init :  function() {
        this.bindEvent();
    },
    bindEvent: function() {
        var _this = this;

        //验证username
        $('#username').blur(function() {
            var username = $.trim($(this).val());
            if (!username) {
                return;
            }
            //异步验证用户名是否存在
            _user.checkUsername(username, function(result) {
                formError.hide();
            }, function(errorMsg) {
                formError.show(errorMsg);
            });
        });

        //点击注册
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
            username                  :   $.trim($('#username').val()),
            password                  :   $.trim($('#password').val()),
            passwordConfirm   :   $.trim($('#password-confirm').val()),
            phone                        :   $.trim($('#phone').val()),
            email                         :   $.trim($('#email').val()),
            question                   :   $.trim($('#question').val()),
            answer                     :  $.trim($('#answer').val()),
        };
        var validateResult = this.formValidate(formData);
        if (validateResult.status) {
            //验证成功，提交
            _user.register(formData, function(result) {
                window.location.href = './result.html?typ=register';
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

        if (formData.password.length < 6) {
            result.msg = '密码长度不能少于6位';
            return result;
        }

        //验证密码是否一致
        if (formData.password !== formData.passwordConfirm) {
            result.msg = '两次输入密码不一致';
            return result;
        }

        //手机号
        if (!_mm.validate(formData.phone, 'phone')) {
            result.msg = '手机号不正确';
            return result;
        }

        //邮箱
        if (!_mm.validate(formData.email, 'email')) {
            result.msg = '邮箱格式不正确';
            return result;
        }

        //提示问题
        if (!_mm.validate(formData.question, 'require')) {
            result.msg = '密码提示问题不能为空';
            return result;
        }
        //答案
        if (!_mm.validate(formData.answer, 'require')) {
            result.msg = '密码提示问题答案不能为空';
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