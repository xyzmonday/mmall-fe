'use strict';
/*user-center-update*/

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide              = require('page/common/nav-side/index.js');
var _mm                    = require('util/mm.js');
var _user                  = require('service/user-service.js');
var templateIndex  = require('./index.string');
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
                     phone           :  $.trim($('#phone').val()),
                     email             :  $.trim($('#email').val()),
                     question       :  $.trim($('#question').val()),
                     answer          :  $.trim($('#answer').val())
              };
               //验证提交的数据
              var validateResult = _this.validateForm(formData);
              if(validateResult.status) {
                         _user.updateUserInfo(userInfo,function(result){
                                _mm.successTips(result);
                                window.location.href = './user-center.html';
                },function(errorMsg){
                        _mm.errorTips(errorMsg);
                })
              } else {
                    _mm.errorTips(validateResult.msg);
              }

        });
    },

    onLoad   :  function() {
    	//初始化左侧菜单
    	navSide.init({
    		name : 'user-center'
    	});
    	//加载个人信息
    	this.loadUserInfo();
    },
    //加载个人信息
    loadUserInfo  :  function() {
            var  userHtml = '';
            _user.getUserInfo(function(result) {
                    console.log(result);
                     userHtml = _mm.renderHtml(templateIndex,result);
                     $('.panel-body').html(userHtml);
            },function(errorMsg) {
                 _mm.errorTips(errorMsg);
            });
    },

    ////校验数据
    validateForm : function(formData) {
          var result = {
            status: false,
            msg: ''
        };
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
    }
};

$(function() {
    page.init();
});

