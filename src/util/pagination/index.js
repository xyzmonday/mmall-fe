'use strict'

require('./index.css');
var templatePagination        = require('./index.string');
var _mm 			= require('util/mm.js');

var Pagination = function () {
	var _this = this;
	this.defaultOption = {
		container 	  : null,
		pageNum 	  : 1,
		pageRange       : 5,
		onSelectPage : null
	};

	//事件处理
	$(document).on('click','.pg-item',function(){
		var $this = $(this);
		//对于active获取disabled的按钮点击，不做处理
		if($this.hasClass('active') || $this.hasClass('disabled')) {
			return;
		};

		typeof _this.option.onSelectPage === 'function'
		? _this.option.onSelectPage($this.data('value')) : null;
	});
};
//渲染分页组件
Pagination.prototype.render = function(userOption) {
	this.option = $.extend({},this.defaultOption,userOption);
	//判断容器是否为合法的jquery对象
	if(!(this.option.container instanceof jQuery)) {
		return;
	}

	//判断是否只有一页
	if(this.option.pages <= 1) {
		return;
	}

	//渲染分页内容
	this.option.container.html(this.getPaginationHtml());
};

//获取分页的html
Pagination.prototype.getPaginationHtml = function() {
	//|上一页| 1 2 3 4 5 6|下一页| 5/6
	var option         = this.option;
	var html             = '';
	var pageArray  = [];
	var start            = option.pageNum - option.pageRange > 0 ? option.pageNum - option.pageRange : 1;
	var end               =  option.pageNum + option.pageRange < option.pages ? option.pageNum + option.pageRange : option.pages;

	//上一页按钮
	pageArray.push({
		name 		: "上一页",
		value 		: this.option.prePage,
		disabled 	: !this.option.hasPreviousPage,
	});

	//数字按钮
	for(var i = start ; i<=end;i++) {
		pageArray.push({
			name   : i,
			value   : i,
			active  : (i===option.pageNum)
		});
	};

	//下一页
	pageArray.push({
		name 		: "下一页",
		value 		: this.option.nextPage,
		disabled 	: !this.option.hasNextPage,
	});


	html = _mm.renderHtml(templatePagination,{
		pageArray : pageArray,
		pageNum    : option.pageNum,
		pages          : option.pages
	});

	return html;
};

module.exports = Pagination;