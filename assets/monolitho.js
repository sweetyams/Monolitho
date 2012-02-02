/** 
 * Monolitho Theme JS
 * Copyright Willem Shepherd 2012
 *  
 *
 * Built from Ben Watts Radiance Theme
 *  http://benwatts.ca/
 *
 * Dependencies: 
 * - hoverintent.jquery.js
 *
 */

/** 
 * Look under your chair! console.log FOR EVERYONE! 
 *
 * @see http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
 */
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

/** 
 * Fire function based upon attributes on the body tag. 
 * This is the reason for "template{{ template | camelize }}" in layout/theme.liquid
 *
 * @see http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 */
var UTIL = {
 
  fire : function(func,funcname, args){
    var namespace = MONOLITHO; 
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
      namespace[func][funcname](args);
    } 
  }, 
 
  loadEvents : function(){
    var bodyId = document.body.id;

    // hit up common first.
    UTIL.fire('common');
 
    // do all the classes too.
    $.each(document.body.className.split(/\s+/),function(i,classnm){
      UTIL.fire(classnm);
      UTIL.fire(classnm,bodyId);
    });
  } 
 
}; 
$(document).ready(UTIL.loadEvents);

/** 
 * Page-specific call-backs 
 * Called after dom has loaded.  
 */
var MONOLITHO = {

  common : {
    init: function(){
      console.info(' > DOM Ready > Init');
      $('html').removeClass('no-js').addClass('js');
      setupDropdownMenus(); 
      searchPlaceholder();

      $('.nav-arrow', '#top-menu').each( function(){
        $(this).css('top', Math.ceil($(this).parent(2).height()/2) + 1);
      });

    }
  },

  templateIndex : {
    init: function(){
      console.info(' > Index Template');
      if( $("#carousel").length > 0 ){  
        $("#carousel").scrollable({
          circular: true
        });

        if ( $("#carousel").find('.items li[class!=cloned]').length > 1 ) {
          window.api = $("#carousel").autoscroll({
            autoplay: true,
            api: true,
            interval: 3500
          })
          $("#carousel").hover(
              function() { 
                api.pause(); 
                $(this).find('.browse').fadeIn('fast');
              },
              function() { 
                api.play(); 
                $(this).find('.browse').fadeOut('fast');
              }
          );
        }

        $('#carousel-thumbs li:first a').addClass('active');
      }      
    }
  },
  
  templateProduct : { 
    init: function(){
      console.info(' > Product Template');
      $('#product-gallery').enhanceGallery();
      $('#thumbs li:nth-child(4n+4)').addClass('last-in-row');
    }
  }, 

  templateCart : {
    init: function(){
      console.info(' > Cart Template > Init');
      $('#toggle-note').toggle(
        function(){ $('#checkout-addnote').find('textarea').show(); }, 
        function(){ $('#checkout-addnote').find('textarea').hide();  }      
      );                
    }
  }

}


/** 
 * Balances the height of rows of products/collections. 
 * Finds the tallest item in a row, makes each <li> in that row as tall as the tallest. 
 */
$.fn.balanceRowHeight = function(numPerRow) {  
  var nPerRow = numPerRow || 4; 
  var nItems = $(this).find('li').length;
  var nRows = Math.round( nItems / nPerRow );

  for( var row = 1; row <= nRows; row++ ){
    var min = row * nPerRow - nPerRow;
    var max = row * nPerRow;
    var tallestInRow = 0;
    var tallestTitleInRow = 0;

    $(this).find('li').slice(min, max).each(function(){
      if( $(this).height() > tallestInRow ){
        tallestInRow = $(this).height();     
      }
      if( $(this).find('.product-information:first').height() > tallestTitleInRow ){
        tallestTitleInRow = $(this).find('.product-information').height();
      }
    }).height(tallestInRow).addClass('generated-height').find('.product-information').height(tallestTitleInRow);
  }

  return this;
};





/** 
 * Support for dropdown menus 
 */
function setupDropdownMenus(){
  $('#top-menu .has-dropdown').hoverIntent( navRollOver, navRollOut );
  
  function navRollOver(e){
    $(this).addClass('active').find('ul:first').css('top', $(this).height()).show();
  }
  function navRollOut(e){
    $(this).removeClass('active').find('ul:first').hide();
  }

}


/** 
 * Enable placeholder switcheroo in older browsers. 
 * @see http://webdesignerwall.com/tutorials/cross-browser-html5-placeholder-text  
 */
function searchPlaceholder(){

  if(!Modernizr.input.placeholder){
    $('#top-search-input').focus(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
      }
    }).blur(function() {
      var input = $(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
      }
    }).blur();
    $('[placeholder]').parents('form').submit(function() {
      $(this).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
      })
    });
  }

}


/** 
 * Contact Form 
 * Client-side email validation. 
 * Email validation function from: http://docs.jquery.com/Plugins/validation
 */
$('.contact-form').submit( function(e){
  
  var emailField = $(this).find('.email:first');
  var errorMsg = '<label class="error-msg" for="'+emailField.attr('id')+'">Please enter a valid email.</label>';
  
  if( !validEmail(emailField.val()) === true ){   
    if( emailField.parent().is('li') ){
      emailField.parent().addClass('has-error').find('.error-msg').remove();
      $('#email').after(errorMsg);
    } else {
      $(this).addClass('has-error').find('.error-msg').remove();
      $(this).append(errorMsg);
    }
    e.preventDefault();   
  }

});
  
function validEmail(value){
  return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
}



/*
 * MONOLITHO CUSTOM OVERLAY CART
 * Developed by Willem Shepherd, 2012 for Monolitho, a Shopify Theme 
 * tread lightly, this code is fragile!
 */

var tabitemcount  = $("span.item_count").html();
	if (tabitemcount == 0) { 
		$("#cart_checkout").removeClass("cartitemtab");
	}
	else if (tabitemcount == 1) {
		$("#cart_checkout").addClass("cartitemtab");
	}
	else {
		$("#cart_checkout").addClass("cartitemtab");
	}

$('#add-to-cart').bind( 'click', addToCart );

function addToCart(e){
  if (typeof e !== 'undefined') e.preventDefault();
  var id        = $(this).parents('form').find('[name="id"]').val();
  var quantity  = $(this).parents('form').find('[name="quantity"]').val() || 1;

  $.ajax({ 
    type: 'POST',
    url: '/cart/add.js',
    async: false, 
    cache: false, 
    data: 'quantity=' + quantity + '&id=' + id,
    dataType: 'json',
    error: addToCartFail,
    success: updateCartaddNote,
    cache: false 
  });
}


//REMOVING AN ITEM (the X after an item)
function removecartitem(id) {
var variant_id = (id);

$.ajax({ 
    type: 'POST',
    url: '/cart/change.js',
    data:  'quantity=0&id='+variant_id,
    async: false, 
    cache: false, 
    dataType: 'json',
    success: thisGetUpdatedCart,
    error: addToCartFail,
  });

// add alert when item added to cart.
  $('#add-to-cart-msg').html('Item added to cart! <a title="view cart"><span>View cart and checkout &raquo;</span></a>').fadeIn();  
}

// add alert when item removed.
$('#remove-from-cart-msg').html('Item removed from cart!').fadeIn();   


function updateCartaddNote(note, callback) {
  $.ajax({ 
    type: 'POST',
    url: '/cart/update.js',
    data: 'note=' + attributeToString(note),
    dataType: 'json',
    success: thisGetUpdatedCart,
    error: function(XMLHttpRequest, textStatus) {
    Shopify.onError(XMLHttpRequest, textStatus);
    }
  });

// add alert when item added to cart.
  $('#add-to-cart-msg').html('Item added to cart! <a title="view cart"><span>View cart and checkout &raquo;</span></a>').fadeIn();  
}

function addToCartFail(jqXHR, textStatus, errorThrown){
var response = $.parseJSON(jqXHR.responseText);
  console.error('PROBLEM ADDING TO CART!', response.description);  
  $('#add-to-cart-msg').addClass('error').text(response.description);
}

// Get the cart associated with the cart-info div (id)
function thisGetUpdatedCart(cart) {
	changeUpdatedCart(cart, 'cart-info');		
}

// Do all the fancy stuff.
function changeUpdatedCart(cart, cart_summary_id, cart_count_id) {
	if ((typeof cart_summary_id) === 'string') {
		var cart_summary = ('#' + cart_summary_id);
		if (cart_summary.length) {	
			// Empty Entire thing.
			$(cart_summary).empty();			
			
			// Add a table and Tbody to attach stuff to.
			$("<table class=addedcart><tbody id='updating_cart'></tbody></table>").appendTo(cart_summary);
		
			$.each(cart, function(key, value) {

				if (key === 'items') {
					var uc = $('#' + cart_summary_id + ' #updating_cart');
			      
					// Creates the entire table using the new item information that has been updated!
					// If you want to add a column, test it in inline-cart.liquid FIRST, then write it into the line below

					if (value.length) {
						$.each(value, function(i, item) {						
						  var getitem_price = (item.price);
						  var monetizeitemprice = Shopify.formatMoney(getitem_price, '${{amount}}')
							
							//finds image, creates url, cartfinalimage used instead of item.image later in the table
							var imageurl = (item.image);
							var varsize = ('small');
							var matches = imageurl.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
							var cartfinalimage =  (matches[1] + '_' + varsize + '.' + matches[2]);
																																																																																																				
							$("<tr id='product-" + item.id + "' class='"+item.handle + " item'><td id='invisible' class='cart_amount'> <input class='text' type='text' size='4' name='updates"+item.id+"' id='updates_"+item.id+"' value='"+ item.quantity +"' onfocus='this.select();' class='replace' /> </td><td class='cart_image'><a href='"+ item.url +"'><img class='cartimage' src='"+ cartfinalimage +"'  alt='"+ item.title +"' /></a></td><td class='cart_title'> <a href='"+item.url +"'>"+ item.title +"</a></td><td class='cart_itemprice'><span class='quantity'>"+ item.quantity +"</span> x "+ monetizeitemprice +"</td><td class ='cart_remove'><a onClick='removecartitem("+item.id+"); return false;'>remove</a></td></tr>").appendTo(uc);
						
							
						});
					}
					else {
						//Returns error if something went wrong.
						$('<li><em>The cart is empty.</em></li>');
					}
				}
				else {
				//This stuff is the extra informaton that is grabbed from items.
				//remove the comment tags to see what it does!
				/*	$('<dt>' + key + '</dt><dd>' + value + '</dd>').appendTo(cart_summary); */
				}
			});			
		}
	}

	// Update Cart Total Money in Cart and converts it to money format	 
	var $cartTotalAmoutFooter = $('.cart_total span:first');
  	var getTotalPrice = (cart.total_price);
  	var monetizeTotalPrice = Shopify.formatMoney(getTotalPrice, '${{amount}}')

  	switch(cart.total_price){
    	default:
      		$cartTotalAmoutFooter.text (monetizeTotalPrice);
		break;
  	}

	var tabitemcount  = $("span.item_count").html();
	
	if (cart.item_count == 0) { 
		$("#cart_checkout").removeClass("cartitemtab");
	}
  	else if (cart.item_count == 1) {
		$("#cart_checkout").addClass("cartitemtab");
	}
  	else {
		$("#cart_checkout").addClass("cartitemtab");
	}	

	// Update Cart Total Count in Cart Title and Side Tab
  	var $cartLinkNum = $('.item_count');
  	var $carttopTotal = $('#cart-title .items:first');
  	var $cartLinkText = $('.itemtitle');

  	if (cart.item_count == 0) { 
    	$carttopTotal.html('0 items'); 
    	$cartLinkNum.html('0'); 
    	$cartLinkText.html(' items'); 
  	}
  	else if (cart.item_count == 1) {
    	$carttopTotal.html('1 item');
    	$cartLinkNum.html('1'); 
    	$cartLinkText.html(' item'); 
  	}
  	else {
    	$carttopTotal.html(cart.item_count+' items');
    	$cartLinkNum.html(cart.item_count);
    	$cartLinkText.html(' items'); 
  	}	
	// Hides he pluralizer (item/items) in the inline carts title
	$('.itemshide').hide();
}