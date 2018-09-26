$(document).ready(function() {

	$('#contact-form .form-control').each(function(){
	
		if($.trim($(this).val()) == ''){
			$(this).removeClass('input-filled');
		}else{
			$(this).addClass('input-filled');
		}
	});
	
	$('#contact-form .form-control').on('blur',function(){
	
		if($.trim($(this).val()) == ''){
			$(this).removeClass('input-filled');
		}else{
			$(this).addClass('input-filled');
		}
	});
	
	$('#contact-form .form-control').on('focus',function(){
		$(this).parent('.controls').find('.error-message').fadeOut(300);
	});


	$('#contact-form').submit(function() {
		
		if($('#contact-form').hasClass('clicked')){
			return false;
		}
		
		$('#contact-form').addClass('clicked');
		
		var buttonCopy = $('#contact-form button').html(),
			errorMessage = $('#contact-form button').data('error-message'),
			sendingMessage = $('#contact-form button').data('sending-message'),
			okMessage = $('#contact-form button').data('ok-message'),
			hasError = false;
		
		$('#contact-form .error-message,#contact-form .contact-form-message').remove();
		
		$('.requiredField').each(function() {
			if($.trim($(this).val()) == '') {
				var errorText = $(this).data('error-empty');
				$(this).next('label').append('<span class="error-message" style="display:none;">'+errorText+'.</span>').find('.error-message').fadeIn('fast');
				hasError = true;
			} else if($(this).is("input[type='email']") || $(this).attr('name')==='email') {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
				if(!emailReg.test($.trim($(this).val()))) {
					var invalidEmail = $(this).data('error-invalid');
					$(this).next('label').append('<span class="error-message" style="display:none;">'+invalidEmail+'.</span>').find('.error-message').fadeIn('fast');
					hasError = true;
				}
			}
		});
		
		if(hasError) {
			$('#contact-form').append('<p class="contact-form-message">'+errorMessage+'</p>');
			$('#contact-form').removeClass('clicked');
		}
		else {
			$('#contact-form').append('<p class="contact-form-message"><i class="fa fa-spinner fa-pulse"></i>'+sendingMessage+'</p>');
			
			var formInput = $(this).serialize();
			$.post($(this).attr('action'),formInput, function(data){
				$('#contact-form .contact-form-message').remove();
				$('#contact-form').append('<p class="contact-form-message">'+okMessage+'</p>');
				$('#contact-form').removeClass('clicked');
				$('#contact-form')[0].reset();
				$('#contact-form .form-control').removeClass('input-filled');
			});
			
		}
		
		return false;	
	});
});