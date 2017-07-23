
//-------------------------form----------------------------------
function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 0);
	}
}

function bar_progress(progress_line_object, direction) {
	var number_of_steps = progress_line_object.data('number-of-steps');
	var now_value = progress_line_object.data('now-value');
	var new_value = 0;
	if(direction == 'right') {
		new_value = now_value + ( 100 / number_of_steps );
	}
	else if(direction == 'left') {
		new_value = now_value - ( 100 / number_of_steps );
	}
	progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
}



jQuery(document).ready(function() {
    /*
        Form
    */
    $('.f1 fieldset:first').fadeIn('slow');

    $('.f1 input[type="radio"], .f1 input[type="password"], .f1 textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    // next step
    $('.f1 .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');
    	var next_step = true;
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');

    	if (!$("input[name='dur_radio']").is(":checked")) {
    	    $(this).addClass('has-danger');

    		next_step = false;
    	}
    	// fields validation
    	parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			$(this).addClass('input-error');
    			next_step = false;
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation
    	parent_fieldset.find('input[name="csr_text"], textarea').each(function() {

    		if( $(this).val() == "" ) {
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
					next_step = true;
    		}
    	});


    	// fields validation

    	if( next_step ) {
    		parent_fieldset.fadeOut(400, function() {
    			// change icons
    			current_active_step.removeClass('active').addClass('activated').next().addClass('active');
    			// progress bar
    			bar_progress(progress_line, 'right');
    			// show next step
	    		$(this).next().fadeIn();
	    		// scroll window to beginning of the form
    			scroll_to_class( $('.f1'), 20 );
	    	});
    	}

    });

    // previous step
    $('.f1 .btn-previous').on('click', function() {
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');

    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		current_active_step.removeClass('active').prev().removeClass('activated').addClass('active');
    		// progress bar
    		bar_progress(progress_line, 'left');
    		// show previous step
    		$(this).prev().fadeIn();
    		// scroll window to beginning of the form
			scroll_to_class( $('.f1'), 20 );
    	});
    });

    // submit
    $('.f1').on('submit', function(e) {

    	// fields validation
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation

    });


});

//---------------------------/form--------------------------------------




$('.tab_display').hide();
$('#profile_').show();
$('.showTab_').click(function(){
  var show_target = $(this).attr('target');
  $('.tab_display').hide();
  $('#'+show_target).show();
  $('.showTab_').removeClass('active');
  $(this).toggleClass( "active" );
});



$('.display').hide();
$('#active_services_').show()
$('.showOption_').click(function(){
  var show_target = $(this).attr('target');
  $('.display').hide();
  $('#'+show_target).show();
  $('.showOption_').removeClass('active');
  $(this).toggleClass("active");
});


$('.newProducts_').click(function(){
  var show_target = $(this).attr('target');
  $('#'+show_target).show();
});




// Add new SSL certificate

$(document).on('submit', '#new_ssl_product', function(e){
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'product/add/',
        data:{
            plan : $("input:checked").val(),
            csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
        },

        success : function(json) {
            var msg = "Added certificate";
        },
    });
		$('#ssl_product_1').modal('hide');
		window.location.href = '/dashboard/';
});


//Submit CSR certificate
$('#configure_product').on('show.bs.modal', function(e) {
    //get data-id attribute of the clicked element
    var product_csr_id = $(e.relatedTarget).data('product-id');
		var title = document.getElementById("certificate_title_"+product_csr_id).innerText;
		var duration = document.getElementById("certificate_duration_"+product_csr_id).innerText;

		document.getElementById('product_title').innerHTML="Configure - "+title;
		$(document).on('submit', '#product_csr', function(ee){
		//function submit_csrs() {
			console.log("submit CSR requrest");
			$.ajax({
				type : "POST",
				url : "product/csr/add/",
				data : {
									csr_text :  $("#CSR_text").val(),
									product_id : product_csr_id,
									duration : duration,
									csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
								},

				// handle a successful response
				success : function(json) {
								console.log("success");
						},
						// handle a non-successful response
						error : function(xhr,errmsg,err) {
								console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
						}
				});
		});
});

//Show certificate
$('#view_product').on('show.bs.modal', function(e) {
    //get data-id attribute of the clicked element
    var product_id = $(e.relatedTarget).data('product-id');
    //alert(product_id);
    //populate the textbox
    //$(e.currentTarget).find('#myModalLabel').val(product_id);
    document.getElementById('product_label').innerHTML = product_id;


    //Call Ajax get certificate info
    $.ajax({
    type : "GET",
    url : "product/get",
    data : {
              id : product_id,
            },

    // handle a successful response
    success : function(data) {
	    //var data_ = JSON.parse(data);
            $('#product_details').val(''); // remove the value from the input
            $('#product_details').html(data.output);
        },
        // handle a non-successful response
        error : function(xhr, errmsg, err) {
            $('#product_details').html(errmsg); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });


});
