'use strict';
require('./index.css')
var nav = require('page/common/nav/index.js');
require('page/common/header/index.js');

var _mm = require('util/mm.js');
var _cart = require('service/cart-service.js');
var templateIndex = require('./index.string');


var page  = {
	data : {

	},
	init : function() {
		this.loadCart();
		this.bindEvent();
	},

	//绑定事件
	bindEvent  : function() {
		var _this = this;
		//商品选中/反选
		$(document).on('click','.cart-select',function(){
			var  $this  = $(this);
			var productId = $this.parents('.cart-table').data('product-id');
			//切换选中状态
			if($this.is(':checked')) {
				//选中
				_cart.selectProduct(productId,function(result) {
  					_this.renderCart(result);
				},function(errorMsg){
					showCartError();
				});
			} else {
				//取消选中
				_cart.unselectProduct(productId,function(result) {
  					_this.renderCart(result);
				},function(errorMsg){
					showCartError();
				});
			}

		});

		//商品全选/取消全选
		$(document).on('click','.cart-select-all',function(){
			var $this = $(this);
			
			//切换选中状态
			if($this.is(':checked')){
				_cart.selectAllProduct(function(result){
			    		_this.renderCart(result);
				},function(errorMsg){
					_this.showCartError();	
				});
			}else{
				_cart.unselectAllProduct(function(result){
			    		_this.renderCart(result);
				},function(errorMsg){
					_this.showCartError();	
				});
			}
		});

		//商品数量的变化
		$(document).on('click','.count-btn',function(){
			var $this 		= $(this);
			var $pCount		= $this.siblings('.count-input');
			var type 		= $this.hasClass('plus') ?  'plus'  : 'minus';
			var productId  		= $this.parents('.cart-table').data('product-id');
			var currentCount 	= parseInt($pCount.val());
			var minCount 		= 1;
			var maxCount 		= parseInt($pCount.data('stock'));
			var newCount 		= 0;

			if(type === 'plus') {
				if(currentCount >= maxCount) {
					_mm.errorTips("该商品数量达到上限");
					return;
				}
				newCount = currentCount +1;
			} else if (type ==='minus') {
				if(currentCount <= minCount) {
					return;
				} 
				newCount = currentCount - 1;
			}
			//更新商品数量
			_cart.updateProduct({
				productId : productId,
				count         : newCount
			},function(result){
				_this.renderCart(result);
			},function(errorMsg){
				_this.showCartError();
			});
		});

		//删除单个商品
		$(document).on('click','.cart-delete',function(){
			if(window.confirm('确定要删除该商品吗?')) {
				var productId  	= $(this).parents('.cart-table').data('product-id');
				_this.deleteCartProduct(productId);
			}
		});

		//删除选中的商品
		$(document).on('click','.delete-select',function(){
			if(window.confirm('确定要删除该商品吗?')) {
				var productIdArray = [];
				var $selectedItems = $('.cart-select:checked');
				for(var i = 0 ; i < $selectedItems.length;i++) {
					var productId  = $($selectedItems).parents('.cart-table').data('product-id');
					productIdArray.push(productId);
				}
				//构建一个productId做批量删除
				if(productIdArray.length) {
					_this.deleteCartProduct(productIdArray.join(','));
				} else {
					_mm.errorTips('您还没有选中要删除的商品');
				}
			}
		});

		//提交购物车，去结算
		$(document).on('click','.btn-submit',function(){
			//判断总价
			if( _this.data.cartInfo  &&  _this.data.cartInfo .cartTotalPrice > 0) {
				window.location.href = './confirm.html';
			} else {
				_mm.errorTips('请选择商品后在提交');
			}
		});
	},


	//删除指定的商品，也支持批量删除，参数为productId，用逗号分隔
	deleteCartProduct : function(productIds) {
		var _this = this;
		_cart.deleteProduct(productIds,function(result){
			_this.renderCart(result);
		},function(errorMsg){	
			_this.showCartError();
		}); 
	},


	//加载购物车的数据
	loadCart : function() {
		var _this = this;
		_cart.getCartList(function(result) {
		             _this.renderCart(result);
		},function(errorMsg){
			showCartError();
		})
	},

	//渲染购物车
	renderCart  : function(data) {
		this.filter(data);
		this.data.cartInfo = data;
		var cartHtml = _mm.renderHtml(templateIndex,data);
		$('.page-wrap').html(cartHtml);
		//通知导航的购物车
		nav.loadCartCount();
	},

	filter : function(data) {
		data.notEmpty = !!data.cartProductVoList.length;	
	},

	//显示错误信息
	showCartError : function() {
		$('.page-wrap').html('<p class =".err-tip">哪里不对了</p>');
	}

};


$(function(){
	page.init();
});

