
"use strict";
/************************************************
------- General 
*************************************************/
// modal middle 
function centerModals($element) {
	var $modals;
	if ($element.length) {
		$modals = $element;
	} else {
		$modals = $('.modal-vcenter:visible');
	}
	$modals.each( function(i) {
		var $clone = $(this).clone().css('display', 'block').appendTo('body');
		var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
		top = top > 0 ? top : 0;
		$clone.remove();
		$(this).find('.modal-content').css("margin-top", top);
	});
}
$('.modal-vcenter').on('show.bs.modal', function(e) {
	centerModals($(this));
});
$(window).on('resize', centerModals);
if ($("#datepicker1").length) {
	$('#datepicker1').datepicker();
}
if ($("#datepicker2").length) {
	$('#datepicker2').datepicker();
}
if ($("#datepicker3").length) {
	$('#datepicker3').datepicker();
}
$.validate({
		'scrollToTopOnError' : false
});

// header top fiexd 
$(window).on('scroll', function(){
	if ($(window).width() > 767)
	{
		if($(window).scrollTop() > 0)
		{
			$("#header").addClass("fiexd");
		}
		else
		{
			$("#header").removeClass("fiexd");
		}
	}
	
});
$(function($) {
	//$(function(){ $("header").load("./include/header.html") });
	//$(function(){ $("footer").load("./include/footer.html") });


  // window.fbAsyncInit = function() {
  //   FB.init({
  //     appId      : '433595270404056',
  //     cookie     : true,
  //     xfbml      : true,
  //     version    : '{latest-api-version}'
  //   });
      
  //   FB.AppEvents.logPageView();   
      
  // };

  // (function(d, s, id){
  //    var js, fjs = d.getElementsByTagName(s)[0];
  //    if (d.getElementById(id)) {return;}
  //    js = d.createElement(s); js.id = id;
  //    js.src = "https://connect.facebook.net/en_US/sdk.js";
  //    fjs.parentNode.insertBefore(js, fjs);
  //  }(document, 'script', 'facebook-jssdk'));


	if ($(window).width() > 767)
	{
		if($(window).scrollTop() > 0)
		{
			$("#header").addClass("fiexd");
		}
		else
		{
			$("#header").removeClass("fiexd");
		}
	}
	// courent year get
	var full_Date = new Date();
	var full_Year = full_Date.getFullYear();
	$(".footer-bottom p span").text(full_Year);
});

// search box 
$(".navbar-collapse .search-box .search-icon").on('click', function(event){
	$(".search-view").slideDown();	
	event.stopPropagation();
});
$(".search-view").on('click',function(event){
	event.stopPropagation();
});
$("body").on('click',function(){
	if ($(window).width()> 767)
	{
		$(".search-view").slideUp();
	}
});
// Sub Links 
$(".sub-links a").on('click',function(){
	$(this).next("ul").slideToggle();	
});

// login popup
$('body').on('click','.signUp-link a',function(){
	$(".login-popup .close-icon").click();
	setTimeout(function(){
		$(".registration a").click();
	},500);
})
$(".signUp-link a").on('click',function(){
	$(".login-popup .close-icon").click();
	setTimeout(function(){
		$(".registration a").click();
	},500);
});


// radio btn and check box js 
function setupLabel() {
	if ($('.label_check input').length) {
		$('.label_check').each(function(){ 
			$(this).removeClass('c_on');
		});
		$('.label_check input:checked').each(function(){ 
			$(this).parent('label').addClass('c_on');
		});                
	};
	if ($('.label_radio input').length) {
		$('.label_radio').each(function(){ 
			$(this).removeClass('r_on');
		});
		$('.label_radio input:checked').each(function(){ 
			$(this).parent('label').addClass('r_on');
		});
	};
};
$(function($) {
	// $('.label_check, .label_radio').on('click',function(){
	// 	setupLabel();
	// });
	$("body").on("click",".label_check, .label_radio",function(){
		setupLabel();
	})
	setupLabel(); 
});

/************************************************
------- Home Page 
*************************************************/

// main banner
if ($("#mainBnner").length) {
	var banner = $("#mainBnner")
	banner.owlCarousel({
		slideSpeed : 600,
		paginationSpeed : 400,
		items: 1,
		autoplay: true,
		navText: [ '<span class="icon icon-arrow-left"></span>', '<span class="icon icon-arrow-right"></span>' ],
	});
	// banner bg img set
	$(".style2 #mainBnner .owl-stage-outer .owl-stage .owl-item").each(function() {
		var img_src = $(this).children(".item").children("img").attr("src");
		$(this).children(".item").css("background-image", 'url(' + img_src + ')');
		$(this).children(".item").children("img").hide();
	});
	// banner screen height
	var window_height = $(window).height();
	$(".style2 #mainBnner .owl-item .item").css("height",window_height + "px");
	
	
	$(window).resize(function() {
		var window_height = $(window).height();
		$(".style2 #mainBnner .owl-item .item").css("height",window_height + "px");
	});
	
	setTimeout(function(){
		var top_value = $("#mainBnner").height();
		$(".banner-nav .prev").css("top",top_value / 2 + "px");
		$(".banner-nav .next").css("top",top_value / 2 + "px");
	},500);
	$(window).on('resize',function() {
		setTimeout(function(){
			var top_value = $("#mainBnner").height();
			$(".banner-nav .prev").css("top",top_value / 2 + "px");
			$(".banner-nav .next").css("top",top_value / 2 + "px");
		},500);
	});
	$(".next").on('click',function(){
		banner.trigger('next.owl.carousel');
	});
	$(".prev").on('click', function(){
		banner.trigger('prev.owl.carousel');
	});
}



setTimeout(function(){


// Event Slider
if ($(".event-slider").length) {
	$(".event-slider").owlCarousel({
		navText: [ '<span class="icon icon-arrow-left"></span>', '<span class="icon icon-arrow-right"></span>' ],
		responsive:{
			0:{
				items:1
			},
			768:{
				items:2
			},
			991:{
				items:3
			}
		}
	});
}
// Sponsor Slider 
if ($(".sponsor-slider").length) {
	$(".sponsor-slider").owlCarousel({
		navText: [ '<span class="icon icon-arrow-left"></span>', '<span class="icon icon-arrow-right"></span>' ],
		responsive:{
			0:{
				items:1
			},
			479:{
				items:2
			},
			991:{
				items:3
			},
			1200:{
				items:4
			}
		}
	 });
}

// Friend Slider
if ($("#friend_slider").length) {
	$("#friend_slider").owlCarousel({
		slideSpeed : 600,
		paginationSpeed : 400,
		items: 1,
		navText: [ '<span class="icon icon-arrow-left"></span>', '<span class="icon icon-arrow-right"></span>' ],
	});
}
},3000)
/************************************************
------- About Us 
*************************************************/
if ($(".ourImg").length) {
	var imgPath = $(".ourImg img").attr("src");
	var ImgName = imgPath.split("/")[2];
	$(".ourImg").css({"background":"url('images/about-us/"+ ImgName +"')no-repeat center top"});
}

/************************************************
------- Faq
*************************************************/

$(".faq-slide .backTo-top a").on('click',function(){
	$("html, body").animate({ scrollTop: 0 }, "slow");
});

/************************************************
------- Career
*************************************************/
if ($(".job-viewBox").length) {
	$('.job-viewBox').slimScroll({
	  height: 'auto'
	});
}

/************************************************
------- Booking Payment
*************************************************/

// payment detail tab js start
$(".payment-opction ul li a").each(function() {
	 $(this).on('click',function(){
		var open_id = $(this).attr("id");
		if($("."+ open_id + "-info").is(":visible"))
		{
			
		}
		else
		{
			$(".payment-opction ul li").removeClass("active");
			$(this).parents("li").addClass("active");
			$(".payment-detail .payment-type").slideUp();
			$("."+ open_id + "-info").slideDown();	
		}
	});    
});
// seclet box call 
$("#month_select").selectbox();
$("#month_select2").selectbox();
$("#year_select").selectbox();
$("#year_select2").selectbox();

/************************************************
------- Search Result
*************************************************/
// venues View
$(".venues-slide .btn.gray").on('click',function(){
	if($(this).parent(".button").parent(".text").next(".amenities-view").is(":visible"))
	{
		$(this).children(".icon").addClass("icon-arrow-down");
		$(this).children(".icon").removeClass("icon-arrow-up");
		$(this).parent(".button").parent(".text").next(".amenities-view").slideUp();
	}
	else
	{
		$(this).children(".icon").addClass("icon-arrow-up");
		$(this).children(".icon").removeClass("icon-arrow-down");
		$(this).parent(".button").parent(".text").next(".amenities-view").slideDown();

	}
});
$("#setUp_select").selectbox();

// Search Bar Fiexd 
$(window).on('scroll', function(){
	if($(window).scrollTop() > 30)	
	{
		$(".searchFormTop").addClass("fiexd");
	}
	else
	{
		$(".searchFormTop").removeClass("fiexd");
	}
});

/************************************************
------- Search Details
*************************************************/

$(".price-table .label_radio").on('click',function(){
	if($(this).parent("td").parent("tr").hasClass("active"))
	{
	}
	else
	{
		$(".price-table tr").removeClass("active");
		$(this).parent("td").parent("tr").addClass("active");
	}
});

$(".seating-popup .facility-box").on('click',function(){
	$(".seating-popup .facility-box").removeClass("active");
	$(this).addClass("active");
});
// Meal tabe menu js start
$(".meal-tab ul li a").each(function() {
    $(this).on('click',function(){
		var open_id = $(this).attr("id");
		if($("."+ open_id + "-view").is(":visible"))
		{
			
		}
		else
		{
			$(".meal-tab ul li").removeClass("active");
			$(this).parents("li").addClass("active");
			$(".meal-view .meal-details").slideUp();
			$("."+ open_id + "-view").slideDown();	
		}
	});
});
// Meal tabe menu js end
$(".select-btn a").on('click',function(){
	 var text_view = $(".facility-view .facility-box.active").children(".inner-box").children(".name").text();
	 $(".select-seating .select-value").text(text_view);
	 $('.close-icon').click();	
});
$(".booking-btnTop").on('click',function(){
	var body_scrollV = $(".booking-formMain").offset().top;	
	if($(window).width() > 767 )
	{
		body_scrollV = body_scrollV - $("#header").height() - $(".fiexd-nav").height()
	}
	else
	{
		body_scrollV = body_scrollV ;
	}
	$("html, body").animate({ scrollTop: body_scrollV + "px" }, "slow");
});

/************************************************
------- Register
*************************************************/

$("#country_select").selectbox();
$("#services_select").selectbox();

/************************************************
------- My Account
*************************************************/

$(".account-tab ul li a").each(function() {
    $(this).on('click',function(){
		var open_id = $(this).attr("id");
		if($("."+ open_id + "-con").is(":visible"))
		{
			
		}
		else
		{
			$(".account-tab ul li").removeClass("active");
			$(this).parents("li").addClass("active");
			$(".my-account .tab-content").slideUp();
			$("."+ open_id + "-con").slideDown();	
		}
	});
});

/************************************************
------- home 2
*************************************************/
if ($(".history-slider").length) {
	$(".history-slider").owlCarousel({
		navText: [ '<span class="icon icon-arrow-left"></span>', '<span class="icon icon-arrow-right"></span>' ],
		items:1,
		autoplay: true,
		autoplayTimeout: 5000,
	 });
	 $(".history-slider .owl-stage-outer .owl-stage .owl-item").each(function() {
		var img_src = $(this).children(".item").children("img").attr("src");
		$(this).children(".item").css("background-image", 'url(' + img_src + ')');
		$(this).children(".item").children("img").hide();
	});
}
if ($(".user-slider").length) {
	$(".user-slider").owlCarousel({
		items:1,
		autoplay: true,
		autoplayTimeout: 5000,
		dots: true,
	 });
}


// images galler filter
if ($(".grid").length == 1)
{
	var grid = $('.grid');
	grid.isotope({
	  itemSelector: '.filtr-item',
	  filter:'.wedding',
	  //layoutMode: 'fitRows',
	});
	$('.gallery-filter li').click(function(){
	  var selector = $(this).attr('data-filter');
	  $('.gallery-filter li').removeClass("active");
	  $(this).addClass("active");
	  grid.isotope({ filter: selector });
	  return false;
	});
}
$(".quck-menuIcon").on('click',function(){
	$("body").animate({left:"-390px"},500);
	$(".quck-linkRight").animate({right:"0px"},500);
	$(".quck-menuOverlay").fadeIn(500);
	if ($("#header").hasClass("fiexd"))
	{
		$("#header").animate({left:"-390px"},500);
	}
});
$(".close-link").on('click',function(){
	$("body").animate({left:"0"},500);
	$(".quck-linkRight").animate({right:"-390px"},500);
	$(".quck-menuOverlay").fadeOut(500);
	$("#header").animate({left:"0px"},500);
});
$(".quck-linkRight .login-link,.quck-linkRight .registration,.quck-menuOverlay").on('click',function(){
	$("body").animate({left:"0"},500);
	$(".quck-linkRight").animate({right:"-390px"},500);
	$(".quck-menuOverlay").fadeOut(500);
	$("#header").animate({left:"0px"},500);
});
$(".scroll-down .round-border").on('click',function(){
	$("html, body").animate({ scrollTop: $(".service-list").offset().top + "px"},1000 );
});
if ($(".Homebanner-img").length == 1) 
{
	var img_src = $(".Homebanner-img").children("img").attr("src");
	$(".Homebanner-img").css("background-image", 'url(' + img_src + ')');
	$(".Homebanner-img").children("img").hide();
	// banner screen height
	var banner_style3Height = $(window).height();
	$(".Homebanner-img").css("height",banner_style3Height + "px");
	$(window).resize(function(){
		var banner_style3Height = $(window).height();
		$(".Homebanner-img").css("height",banner_style3Height + "px");
	});
}
$(".scroll-down .down-arrow").on('click',function(){
	$("html, body").animate({ scrollTop: $(".our-services").offset().top + "px"},1000 );
});

if ($(".service-slider").length == 1) 
{
	var service_slider = $(".service-slider")
	service_slider.owlCarousel({
		slideSpeed : 600,
		paginationSpeed : 400,
		items: 5,
		autoplay: true,
		margin: 20,
		//navText: [ '<span class="icon icon-arrow-left"></span>', '<span class="icon icon-arrow-right"></span>' ],
		responsive:{
			0:{
				items:1
			},
			479:{
				items:2
			},
			768:{
				items:3
			},
			991:{
				items:4
			},
			1200:{
				items:5
			}
		}
	});	
}
if ($(".member-slider").length == 1) 
{
	$(".member-slider").owlCarousel({
		slideSpeed : 600,
		paginationSpeed : 400,
		items: 2,
		autoplay: true,
		margin: 30,
		navText: [ '<span class="icon icon-arrow-left"></span>', '<span class="icon icon-arrow-right"></span>' ],
		responsive:{
			0:{
				items:1
			},
			768:{
				items:2
			}
		}
	});	
}
if ($(".testimonials-slider").length == 1) 
{
	$(".testimonials-slider").owlCarousel({
		slideSpeed : 600,
		paginationSpeed : 400,
		items: 1,
		autoplay: true,
		margin: 0,
		dots: true,
		nav:false,
		//navText: [ '<span class="icon icon-arrow-left"></span>', '<span class="icon icon-arrow-right"></span>' ],
	});	
}
if ($(".event-gallerSlider").length == 1) 
{
	$(".event-gallerSlider").owlCarousel({
		slideSpeed : 600,
		paginationSpeed : 400,
		items: 3,
		autoplay: true,
		margin: 30,
		dots: false,
		nav:true,
		navText: [ '<img src="images/service-gallerLeft-arrow.png">', '<img src="images/service-gallerRight-arrow.png">' ],
		responsive:{
			0:{
				items:1
			},
			480:{
				items:2,
				margin:20,
			},
			768:{
				items:3
			}
		}
	});	
}
setTimeout(function(){
	$('body').addClass('loaded');
}, 3000);

  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI(response);
    } else {
      // The person is not logged into your app or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  function fblogout(){
  	FB.logout(function(response) {
	  // user is now logged out
	});
  }
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '433595270404056',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.8
    });

    // Now that we've initialized the JavaScript SDK, we call 
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function(response) {
      //statusChangeCallback(response);
    });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI(apiresponse) {
    console.log('Welcome!  Fetching your information.... ');
    console.log("testAPI", apiresponse.authResponse.userID)
    if(!localStorage.getItem('user_data')){
	    FB.api('/me', function(response) {
	    	var fb_id = apiresponse.authResponse.userID
	    	var first_name = response.name
	    	var email = '';
	    	if(response.email){
	    		email = response.email;
	    	} 
		$.ajax({
			method: "POST",
			url: "http://green-n-personal.com:8080/api/social",
			contentType: "application/json;charset=utf-8",
			cache:false,
			data: JSON.stringify({ fb_id : fb_id, first_name:first_name, email:email })
		})
		.done(function( data ) {
			localStorage.setItem("user_data",JSON.stringify(data));
			location.reload();	
			//alert( "Data Saved: " + data );
		});
	      console.log(response);
	      console.log('Successful login for: ' + response.name);
	      document.getElementById('status').innerHTML =
	        'Thanks for logging in, ' + response.name + '!';
	    });    	
    }

  }

  jQuery('body').on("click", '.fb-login-btn', function(){
  	FB.login(statusChangeCallback, {scope: 'email,public_profile', return_scopes: true});
  })
