angular.module("RepayApp",["Global"]),angular.module("RepayApp").directive("repayLink",[function(){return{link:function(a,b){a.redirect=function(){b[0].click()}}}}]),angular.module("RepayApp").controller("MainController",["$scope","$http","ALIMAMA","ReabateService",function(a,b,c,d){var e=this;a.rebate={mode:void 0,allow:void 0,redirect:void 0},a.user={},this.redirect=function(){"auto"===a.rebate.mode&&angular.isFunction(a.redirect)&&a.redirect()},this.alimama=function(b){var d=document.createElement("script"),e=document.getElementsByTagName("head")[0];window.alimamatk_show||(angular.isFunction(b)&&angular.element(d).on("load",b),d.charset="gbk",d.async=!0,d.src="http://a.alimama.cn/tkapi.js",e.insertBefore(d,e.firstChild)),window.alimamatk_onload=window.alimamatk_onload||[],window.alimamatk_onload.push({pid:c.PID,appkey:c.APPKEY,unid:a.user.uid||c.UNID})},a.repay=function(b){var c=angular.parseUrl(b);if(c.query){var f=angular.parseObject(c.query);a.user.uid=f.u,a.rebate.mode=f.m,f.q&&(/(tmall|taobao)/.test(f.q)?(a.rebate.redirect=f.q,e.alimama(function(){setTimeout(e.redirect,300)})):d.rebate(f.q,a.user,function(b){b.rebate===!0?(a.rebate.allow=!0,a.rebate.redirect=b.url||b.from.redirect,setTimeout(e.redirect,300)):a.rebate.allow=!1}))}},a.repay(window.location.href)}]);