'use strict';
/*user-pass-update*/

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
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
    init : function() {
        this.onLoad();
        this.bindEvent();
    },

    //绑定个人信息事件
    bindEvent : function() {
        var _this = this;
        //点击提交按钮后的动作
        $(document).on('click','.btn-submit',function() {
              var formData = {
                     password                    :  $.trim($('#password-old').val()),
                     passwordNew             :  $.trim($('#password-new ').val()),
                     passwordConfirm       :  $.trim($('#password-confirm ').val()),
              };
              //验证提交的数据
              var  validateResult = _this.validateForm(formData);
              if(validateResult.status) {
                    //校验通过
                    _user.updatePassword({
                        passwordOld  : formData.password,
                        passwordNew : formData.passwordNew
                    },function(result) {
                            //修改密码成功
                             _mm.successTips(result);
                    },function(errorMsg){
                        _mm.errorTips(errorMsg);
                    })
              }  else {
                  //校验失败
                        _mm.errorTips(validateResult.msg);
                    }
        });
    },

    onLoad   :  function() {
    	//初始化左侧菜单
    	navSide.init({
    		name : 'user-pass-update'
    	});
    	
    },

    //校验数据
    validateForm : function(formData) {
          var result = {
            status: false,
            msg: ''
        };
        //手机号
        if (!_mm.validate(formData.password, 'require')) {
                result.msg = '原密码不能为空';
                 return result;
        }

        //新密码
        if (!formData.passwordNew ||  formData.passwordNew.length < 6) {
                result.msg = '新密码长度少于6位';
                return result;
        }

        //确认密码
        if(formData.passwordNew !== formData.passwordConfirm) {
                result.msg = "两次输入的密码不一致";
                return result;
        }

       
        //通过验证
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};

$(function() {
    page.init();
});

