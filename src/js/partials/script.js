var flag_menu;
$(function () {
	$(".burger").on("click", function () {
		if (!flag_menu == 1) {
			$(this).addClass("active");
			$(".menu").addClass("open");
			flag_menu = 1;
		} else {
			$(this).removeClass("active");
			$(".menu").removeClass("open");
			flag_menu = 0;
		}
	});
	$('.title_slider').slick({
		infinite: true,
		slidesToShow: 1,
		dots: true
	});
	$(".gallery .item").fancybox();
	$('a[href^="#"]').click(function () {
		var el = $(this).attr('href');
		$('body, html').animate({
			scrollTop: $(el).offset().top -50
		}, 1000);
	});
	$(window).scroll(function () {
		if ($(window).scrollTop() > $(".title_slider ").height()) {
			$(".header").addClass("on_fixed");
		} else {
			$(".header").removeClass("on_fixed");
		}
		menu_url_section();
	});
});

function menu_url_section() {
	var $sections = $('section');
	$sections.each(function (i, el) {
		var top = $(el).offset().top - 100;
		var bottom = top + $(el).height();
		var scroll = $(window).scrollTop();
		var id = $(el).attr('id');
		if (scroll > top && scroll < bottom) {
			$('.menu a.active').removeClass('active');
			$('.menu a[href="#' + id + '"]').addClass('active');

		}
	})
}