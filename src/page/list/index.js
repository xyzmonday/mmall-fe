'use strict';
/*list*/

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var Pagination = require('util/pagination/index.js');
var navSide             = require('page/common/nav-side/index.js');
var _mm                   = require('util/mm.js');
var _product           = require('service/product-service.js');
var templateIndex = require('./index.string');

var page = {

	data : {
		listParam : {
			keyword          : _mm.getUrlParam('keyword') || '',
			categoryId    : _mm.getUrlParam('categoryId') || '',
			orderBy     	: _mm.getUrlParam('orderBy') || 'price_asc',
			pageNum     	: _mm.getUrlParam('pageNum') || 1,
			pageSize         : _mm.getUrlParam('pageSize') || 6
		}
	},

	init  : function() {
		this.onLoad();
		this.bindEvent();
	},

	onLoad : function() {
		this.loadList();
	},

	bindEvent : function() {
		var _this = this;
		 // 排序的点击事件
	            $('.sort-item').click(function(){
		            var $this = $(this);
		             _this.data.listParam.pageNum = 1;
		            // 点击默认排序
		            if($this.data('type') === 'default'){
		                // 已经是active样式
		                if($this.hasClass('active')) {
		                    return;
		                }
		                // 其他
		                else{
		                    $this.addClass('active').siblings('.sort-item')
		                        .removeClass('active asc desc');
		                    _this.data.listParam.orderBy = 'price_asc';
		                }
		            }
		            // 点击价格排序
		            else if($this.data('type') === 'price'){
		                // active class 的处理
		                $this.addClass('active').siblings('.sort-item')
		                        .removeClass('active asc desc');
		                // 升序、降序的处理
		                if(!$this.hasClass('asc')){
		                    $this.addClass('asc').removeClass('desc');
		                    _this.data.listParam.orderBy = 'price_asc';
		                }else{
		                    $this.addClass('desc').removeClass('asc');
		                    _this.data.listParam.orderBy = 'price_desc';
		                }
		            }
		            // 重新加载列表
		            _this.loadList();
		        });
	},

	//加载list数据
	loadList : function() {
		var _this        = this;
		var listParam = this.data.listParam;
		var listHtml   =  ''; 
		 var $pListCon   = $('.p-list-con');
        		 $pListCon.html('<div class="loading"></div>');
		_product.getProductList(listParam,function(result) {
			listHtml = _mm.renderHtml(templateIndex,{
				list : result.list
			});
			 $pListCon.html(listHtml);
			//加载分页信息
			_this.loadPagination({
				hasPreviousPage  : result.hasPreviousPage,
				prePage                  : result.prePage,
				hasNextPage        : result.hasNextPage,
				pageNum                : result.pageNum,
				pages                      : result.pages,
				nextPage                : result.nextPage,
			});
			/*_mm.successTips(result.msg);*/
		},function(errorMsg){
			_mm.errorTips(errorMsg);
		});
	},

	//加载分页信息
	//pageNum ： 当前分
	//pages        ： 总页数
	loadPagination : function(pageInfo) {
		var _this = this;
		this.pagination ? '' : (this.pagination = new Pagination());
		this.pagination.render($.extend({},pageInfo,{
			container : $('.pagination'),
			onSelectPage : function(pageNum){
				_this.data.listParam.pageNum = pageNum;
				_this.loadList();
			}
		}));
	},
}

$(function(){
	page.init();
})