'use strict';
require('./index.css');
// 通用页面头部
var _mm = require('util/mm.js');

var header = {
    init: function() {
        this.bindEvent();
        this.onLoad();
        return this;
    },
    //使用请求填充搜索输入框
    onLoad: function() {
        var keyword = _mm.getUrlParam('keyword');
        if (keyword) {
            $('#search-input').val(keyword);
        }
    },
    bindEvent: function() {
        //绑定搜索按钮点击事件
        var _this = this;
        $('#search-btn').click(function() {
            _this.searchSubmit();
        });

        // 输入会车后，做搜索提交
        $('#search-input').keyup(function(e) {
            // 13是回车键的keyCode
            if (e.keyCode === 13) {
                _this.searchSubmit();
            }
        });
    },

    //搜索提交
    searchSubmit: function() {
        var keyword = $.trim($('#search-input').val());
        if (keyword) {
            //跳转到list也
            window.location.href = './list.html?keyword=' + keyword;
        } else {
            //返回首页
            _mm.getHome();
        }

    },
};

header.init();