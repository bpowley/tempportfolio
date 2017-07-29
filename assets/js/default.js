$(document).ready(function () {

	$('a[href*="#"]:not([href="#"])').click(function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			if (target.length) {
				$('html, body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});

	/* Detecting Elements in View */
	var $animation_elements = $('.animation-element');
	var $window = $(window);

	function check_if_in_view() {
		var window_height = $window.height();
		var window_top_position = $window.scrollTop();
		var window_bottom_position = (window_top_position + window_height);

		$.each($animation_elements, function () {
			var $element = $(this);
			var element_height = $element.outerHeight();
			var element_top_position = $element.offset().top + 200;
			var element_bottom_position = (element_top_position + element_height);

			//check to see if this current container is within viewport
			if ((element_bottom_position >= window_top_position) &&
				(element_top_position <= window_bottom_position)) {
				$element.addClass('in-view');
			}
		});
	}


	$window.on('scroll resize', check_if_in_view);
	$window.trigger('scroll');

	// Initiate Rellax
	var rellax = new Rellax('.rellax');

	// Initialize instafeed
	// var feed = new Instafeed({
		// get: 'user',
		// userId: '400537280',
		// limit: '5',
		// clientId: '9733e03825fb4aada5d65dcfe740baa3',
		// accessToken: '400537280.ba4c844.a4b7763f74a0434ab98d9ae737445385',
		// template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>'
	// });
	// feed.run();

	// Initialize flickity
	$('.work-carousel').flickity({
		cellAlign: 'left',
		wrapAround: true,
		freeScroll: true,
		pageDots: false,
		resize: true,
		setGalleryHeight: false
	});

	// Initialize Typed
	Typed.new('#typed-info', {
		strings: ["a Colorado State University undergraduate.", "an aspiring creative web developer.", "seeking computer science internship opportunities."],
		typeSpeed: 10,
		startDelay: 1200,
		backDelay: 2000,
		backSpeed: 10,
		callback: function() {
			$('#btn-more').css("opacity", "1");
		}
	});

	// $('.carousel-cell').hover(function() {
	// 	$('work_hover_text').html("<p>" + ( $(this).data('site') ) + "</p>") ;
	// });
});
