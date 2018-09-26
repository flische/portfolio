$(document).ready(function(){
	/*============================================
	Page Preloader
	==============================================*/
	
	$(window).load(function(){
		$('#page-loader').fadeOut(500);
	});	
	
	/*============================================
	Navigation Functions
	==============================================*/
	if ($(window).scrollTop()< 10){
		$('#main-nav').removeClass('scrolled');
	}
	else{
		$('#main-nav').addClass('scrolled');    
	}

	$(window).scroll(function(){
		if ($(window).scrollTop()< 10){
			$('#main-nav').removeClass('scrolled');
		}
		else{
			$('#main-nav').addClass('scrolled');    
		}
	});
	
	$('a.scrollto').click(function(e){
		e.preventDefault();
		var target =$(this).attr('href');
		$('html, body').stop().animate({scrollTop: $(target).offset().top}, 1600, 'easeInOutExpo',
			function(){window.location.hash =target;});
			
		if ($('.navbar-collapse').hasClass('in')){
			$('.navbar-collapse').removeClass('in').addClass('collapse');
		}
	});
	
	/*============================================
	Tabs
	==============================================*/	
	
	$('.toggle-tabs').click(function(e){
		e.preventDefault()
		
		if($(this).is('.active')){return;}
		$(this).tab('show');
		
		$(this).siblings('.toggle-tabs').removeClass('active');
		$(this).addClass('active');
	})
	
	$('.toggle-tabs').on('shown.bs.tab', function (e) {
	  $('.tab-content').addClass('fadeOut');
	  
	  setTimeout(function(){
		$('.tab-content').removeClass('fadeOut');
	  },200)
	})
	
	/*============================================
	Skills
	==============================================*/	
	$('#skills').waypoint(function(){
		$('.chart').each(function(){
		$(this).easyPieChart({
				size:200,
				animate: 2000,
				lineCap:'butt',
				scaleColor: false,
				trackColor: 'transparent',
				barColor: $('.main-color').css('color'),
				lineWidth: 5,
				easing:'easeOutQuad'
			});
		});
	},{offset:'80%'});
	/*============================================
	Filter Projects
	==============================================*/
	
	$('.project-count').each(function(){
	
		var filter = $(this).parent('.btn').attr('data-filter');
		$(this).text($('.project-item'+filter).length);
	
	});
	
	$('#filter-works .btn').click(function(e){
		e.preventDefault();
		
		$('#filter-works .btn').removeClass('active');
		$(this).addClass('active');

		var category = $(this).attr('data-filter');

		$('.project-item').addClass('filtered');
		$('.project-item').each(function(){
			if($(this).is(category)){
				$(this).removeClass('filtered');
			}
		});
			
		$('#projects-container').addClass('anim-out');
			
		setTimeout(function(){
			$('.project-item').show();
			$('.project-item.filtered').hide();
			$('#projects-container').removeClass('anim-out');
		},450);
		
		scrollSpyRefresh();
		waypointsRefresh();
	});
	
	/*============================================
	Project Viewer
	==============================================*/
	
	$('#project-viewer').addClass('add-slider');
	
	$('.project-item').click(function(e){
	
		e.preventDefault();
		
		loadProject($(this));
	
		$('#project-viewer').modal({backdrop:false});
		
	})
	
	/*Prevent Navbar movement*/
	$('#project-viewer').on('show.bs.modal',function(){
		$('#main-nav').width($('#main-nav').width());
		
	});
	
	$('#project-viewer').on('hidden.bs.modal',function(){
		$('#main-nav').width('auto');
	});
	
	
	/*Projects navigation*/
	$('.project-nav .next-project').click(function(){
		var $newProject = $('.project-item.active').next('.project-item');
		$('#project-viewer .container').fadeOut(500,function(){loadProject($newProject);});
	});
	
	$('.project-nav .previous-project').click(function(){
		var $newProject = $('.project-item.active').prev('.project-item');
		$('#project-viewer .container').fadeOut(500,function(){loadProject($newProject);});
	});
	
	function loadProject($project){
	
		$('.project-item').removeClass('active');
		$project.addClass('active');
		
		var projectLink = $project.attr('href').replace(/[#?]/g, '');
		
		window.location.hash = '?'+projectLink;
		
		$('#project-viewer-content').load(projectLink,function(){
			$('#project-viewer .container').fadeIn(500);
			afterLoadFn();
		});
		
	}
	
	function afterLoadFn(){
	
		$('#project-viewer').scrollTop(0);
		
		/*Show-Hide Nav butttons*/
		if($('.project-item.active').index()==0){$('#project-viewer .previous-project').addClass('hidden');}
		else{$('#project-viewer .previous-project').removeClass('hidden');}
	
		if($('.project-item.active').index()== ($('.project-item').length -1)){$('#project-viewer .next-project').addClass('hidden');}
		else{$('#project-viewer .next-project').removeClass('hidden');}
	
		$('.project-slider').flexslider({
			animation:'slide',
			slideshowSpeed: 4000,
			useCSS: true,
			directionNav: false, 
			pauseOnAction: false, 
			pauseOnHover: true,
			smoothHeight: false
		});
		
		$('.video-container').fitVids();
	}
	
	/*Close project Modal*/
	
	$('#project-viewer').on('hidden.bs.modal',function(){
		$('#project-viewer-content').empty();
		$('#project-viewer .container').fadeOut();
	});
	
	$('#project-viewer').on('hide.bs.modal',function(){
		window.location.hash = 'portfolio';
	});
	
	/*Open project by url*/
	var reg = /^[#]+[?]/;

	if(reg.test(window.location.hash)){
		var $project = $('.project-item[href="'+window.location.hash+'"]');
		$project.trigger('click');
	}
	
	/*============================================
	Tweets
	==============================================*/
	$('#twitter-slider').flexslider({
		slideshowSpeed: 5000,
		useCSS: true,
		directionNav: false, 
		pauseOnAction: false, 
		pauseOnHover: true,
		smoothHeight: false
	});
	
	/*============================================
	Twitter
	==============================================*/
	var maxTweets = $('#twitter-slider').data('max-tweets'),
		widgetID = $('#twitter-slider').data('widget-id');
	
	var configTweets = {
	  "id": widgetID,
	  "domId": '',
	  "maxTweets": maxTweets,
	  "enableLinks": true,
	  "showUser": false,
	  "showTime": true,
	  "dateFunction": '',
	  "showRetweet": false,
	  "customCallback": handleTweets,
	  "showInteraction": false
	};
	
	twitterFetcher.fetch(configTweets);

	function handleTweets(tweets){
	
		var x = tweets.length,
			n = 0,
			tweetsHtml = '<ul class="slides">';
			
		while(n < x) {
			tweetsHtml += '<li>' + tweets[n] + '</li>';
			n++;
		}
		
		tweetsHtml += '</ul>';
		$('#twitter-slider').html(tweetsHtml);
	
		$('#twitter-slider').flexslider({
			slideshowSpeed: 5000,
			useCSS: true,
			directionNav: false, 
			pauseOnAction: false, 
			pauseOnHover: true,
			smoothHeight: false
		});
	}
	/*============================================
	Testimonials
	==============================================*/
	$('#testimonials-slider').flexslider({
		slideshow: false,
		animationSpeed: 0,
		useCSS: true,
		directionNav: false, 
		controlNav: false, 
		pauseOnAction: false, 
		pauseOnHover: true,
		smoothHeight: false
	});
	
	$('.testimonial-controls .previous').click(function(){
		$('#testimonials-slider').flexslider('previous');
	});
	
	$('.testimonial-controls .next').click(function(){
		$('#testimonials-slider').flexslider('next');
	});
	
	/*============================================
	Placeholder Detection
	==============================================*/
	if (!Modernizr.input.placeholder) {
		$('#contact-form').addClass('no-placeholder');
	}
	
	/*============================================
	Tooltips
	==============================================*/
	$("[data-toggle='tooltip']").tooltip({container: 'body'});
	
	/*============================================
	Waypoints Animations
	==============================================*/
	$(window).load(function(){
		
		$('.scrollimation').waypoint(function(){
			$(this).addClass('in');
		},{offset:'95%'});
		
	});
	
	/*============================================
	Refresh scrollSpy function
	==============================================*/
	function scrollSpyRefresh(){
		setTimeout(function(){
			$('body').scrollspy('refresh');
		},1000);
	}
	
	/*============================================
	Refresh waypoints function
	==============================================*/
	function waypointsRefresh(){
		setTimeout(function(){
			$.waypoints('refresh');
		},1000);
	}
});