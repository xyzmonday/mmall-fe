'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var navSide = require('page/common/nav-side/index.js');
var _mm = require('util/mm.js');

//页面加载完毕
$(function() {
    var type = _mm.getUrlParam('type');
    var $element = $('.' + type + '-success');
    $element.show();

});