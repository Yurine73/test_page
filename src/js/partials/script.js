var flag_menu;
$(function () {
	$(".burger").on("click", function(){
		if(!flag_menu == 1) {
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
});