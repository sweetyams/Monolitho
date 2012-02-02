$(document).ready(function(){



var $overlay = $("#cart_slide");
var $shareb = $("#share"); 
var $share = $("#sharing");
var $newsb = $(".newsletter");


 $shareb.toggle( 
	function() {
 $share.fadeIn("medium");
 $("#cart_slide").addClass("overlay");
 $(".sharing").addClass("share_over");
 $("#share").addClass("sharemainbright");
 $(".sharing .arrow").addClass("sharearrowbright") 
}, 
	function() {
 $share.fadeOut("medium");
 $("#cart_slide").removeClass("overlay");
 $(".sharing").removeClass("share_over");
 $("#share").removeClass("sharemainbright");
 $(".sharing .arrow").removeClass("sharearrowbright"); 
});


 $overlay.click( 
	function () {
 $share.fadeOut("medium");
 $("#cart_slide").removeClass("overlay");
 $(".sharing").removeClass("share_over")
 $("#share").removeClass("sharemainbright")
 $(".sharing .arrow").removeClass("sharearrowbright")
 $("#slideout_inner").fadeOut("medium");
 $("#cart_checkout").removeClass("cartcheckoutoverlay");

 });


 $(".cart_click").click( 
	function () {
 $("#slideout_inner").fadeIn("slow");
 $("#cart_slide").addClass("overlay");
 $("#cart_checkout").addClass("cartcheckoutoverlay");

 });

 $("#add-to-cart-msg").click( 
	function () {
 $("#slideout_inner").fadeIn("medium");
 $("#cart_slide").addClass("overlay"); });


 $("#cart_close").click( 
	function () {
 $("#slideout_inner").fadeOut("medium");
 $("#cart_slide").removeClass("overlay"); });

 });