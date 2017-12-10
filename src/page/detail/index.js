/*
* @Author: halfgod
* @Date:   2017-06-14 20:10:05
* @Last Modified by:   halfgod
* @Last Modified time: 2017-06-15 11:39:44
*/

'use strict';
require('./index.css')
require('page/common/nav/index.js');
require('page/common/header/index.js');

var _mm = require('util/mm.js');
var _product = require('service/product-service.js');
var _cart = require('service/cart-service.js');
var templateIndex = require('./index.string');
var page = {
	data : {
		productId         : _mm.getUrlParam('productId')    || '',
	},
	init : function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad : function(){
		//如果没有productid自动跳回首页
		if(!this.data.productId){
			_mm.goHome();
		}
		this.loadDetail();
	},
	bindEvent : function(){
		var _this = this;
		//图片预览
		$(document).on('mouseenter','.p-img-item',function(){
			var imageUrl = $(this).find('img').attr('src');
			$('.main-img').attr('src',imageUrl);
		});
		$(document).on('click','.p-count-btn',function(){
			    var type = $(this).hasClass('plus') ? 'plus' : 'minus',
			    $pCount = $('.p-count'),
			    currCount = parseInt($pCount.val()),
			    minCount = 1,
			    maxCount = _this.data.detailInfo.stock || 1;
			    if (type === 'plus') {
			    	$pCount.val(currCount < maxCount ? currCount+1 : maxCount);
			    }else if (type === 'minus') {
			    	$pCount.val(currCount > minCount ? currCount-1 : minCount);
			    }
		});

		//添加商品到购物车
		$(document).on('click','.cart-add',function(){
			var productInfo = {
				productId : _this.data.productId,
				count: $('.p-count').val()
			};
			console.log(productInfo);
			_cart.addToCart(productInfo,function(){
				window.location.href = './result.html?type=cart-add';
			},function(errMsg){
				_mm.errorTips(errMsg)
			});
		});
		
	},
	//加载商品详情
	loadDetail : function(){
		var html = '',
		    _this = this,
		$pageWrap = $('.page-wrap');
		//loading
		$pageWrap.html('<div class="loading"></div>');
		//请求detail信息
		_product.getProductDetail(this.data.productId,function(res){
			_this.filter(res);
			_this.data.detailInfo = res;
			html = _mm.renderHtml(templateIndex,res);
			$pageWrap.html(html);
		},function(errMsg){
			$pageWrap.html('<p class="err-tip">此商品太淘气,找不到了</p>');
		});
	},

	filter : function(data){
		if(data.subImages) {
			data.subImages = data.subImages.split(',');
		}
	}

	

};
	
	
	
	
	

$(function(){
	page.init();
});
