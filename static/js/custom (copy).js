

$("#plan_slections").hide();
$("#add_checkout").hide();
$("#finished").hide();

$("#verification").hide();
$("#confirmation").hide();

// Add certificates service
$("#choose_plan_click").click(function() {

  var value = $("input[name=dur_radio]:checked").data("options");
  if (value == undefined)
   {
      $("#plan_slections").show();
      $("#plan_slections").html("Please select any one option.");
   }
  else
   {
       $("#plan_slections").hide();
   }

  var plan = $("input[name=dur_radio]:checked").data("options").plan;
  $("#choose_plan").hide();
  $("#choose_plan_button").removeClass('btn-primary').addClass('btn-default');
  $("#add_chkout_button").removeClass('btn-default').addClass('btn-primary');
  $("#add_checkout").show();

  $('#plan_details').html(plan);

});  

$("#back_add_ssl").click(function() {

  $("#add_checkout").hide();
  $("#choose_plan_button").removeClass('btn-default').addClass('btn-primary');
  $("#add_chkout_button").removeClass('btn-primary').addClass('btn-default');
  $("#choose_plan").show();

});  


$("#checkout_button").click(function() {
  $("#add_checkout").hide();
  $("#add_chkout_button").removeClass('btn-primary').addClass('btn-default');
  $("#finished_button").removeClass('btn-default').addClass('btn-primary');
  $("#finished").show();

  add_new_certificate();

});  




function add_new_certificate(){
  $.ajax({
    url : "/add_new_cert/",
    type : "GET",
    data : {
              certificate : $("input:checked").val(),
            },

    // handle a successful response
    success : function(json) {
            $('#results').val(''); // remove the value from the input
            var plan = $("input[name=dur_radio]:checked").data("options").plan;
            var chk_out_msg = "New "+plan+" added successfully.";
            $('#results').html(chk_out_msg);
        },
        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};












$("#submit_csr").click(function() {
  $("#add_csr").hide();
  $("#add_csr_button").removeClass('btn-primary').addClass('btn-default');
  $("#verification_button").removeClass('btn-default').addClass('btn-primary');
  $("#verification").show();
  send_csr_data();
});


$("#back_csr").click(function() {

  $("#verification").hide();
  $("#add_csr_button").removeClass('btn-default').addClass('btn-primary');
  $("#verification_button").removeClass('btn-primary').addClass('btn-default');
  $("#add_csr").show();

});  


function send_csr_data(){
  console.log("submit CSR requrest");
  $.ajax({
    url : "/cert_req/",
    type : "GET",
    data : {
              csr_text :  $("#csr_text").val(),
            },

    // handle a successful response
    success : function(json) {
            $('#csr_text').val(''); // remove the value from the input
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check
            $('#results').html(json);
            //show_confirmation();
        },
        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};


function show_confirmation()
{
  $("#verification").hide();
  $("#confirmation").show();
}
