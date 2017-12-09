'use strict';
/*user-center*/

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var templateIndex = require('./index.string');
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
    init	 : function() {
        this.onLoad();
    },
    
    onLoad  :  function() {
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
                     userHtml = _mm.renderHtml(templateIndex,result);
                     $('.panel-body').html(userHtml);
            },function(errorMsg) {
                 _mm.errorTips(errorMsg);
            });
    },
};

$(function() {
    page.init();
});

