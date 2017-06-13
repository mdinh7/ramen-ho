$(document).ready(function(){

  //hides waitlist form
  //toggle form on Add Party button
  $("#add-party-button").click(function(event){
    $(".form-container").toggle();
  })

  //add to wailist grays out unless all fields are filled
  $('#name, #party_size, #phone_number').bind('keyup', function() {
    if(allFilled()) $('#add-to-waitlist').removeAttr('disabled');
  })

  //checks that all fields are filled in
  function allFilled() {
    if (!($('#name').val() === '') && !($('#party_size').val() === '') && !($('#phone_number').val() === '')) {
      return true;
    }
    else {
      return false;
    }
  }

  $("body").on("submit", "form#add-party-form", function(event) {
    event.preventDefault();

    $.ajax({
      method: "post",
      url: $(this).attr("action"),
      data: $(this).serialize()
    }).done(function(response){
      console.log(response)
      $("#add-party-form").trigger("reset");
      if (Array.isArray(response)) {
        $(".errors").html(listErrors(response))
      }
      else {
      $(".form-container").toggle();
      $(".waitlist").append(response);
      $(".errors").html("");
      }
    })
  })

  $("#cancel-party-button").on("click", function(event){
    $(".form-container").hide();
  })

  function listErrors(errors) {
    html = ""
    $(".errors").show();
    errors.forEach(function(error) {
      html += ("<li>" + error + "</li>")
    })
    return html
  }

  var updateWaittimes = function(est_waittimes){
    Object.keys(est_waittimes).forEach(function(property){
      id = "#waittime-" + property
      $(id).find(".customer-visible .waittime").html("").html(est_waittimes[property])
    })
  }

  $(".waitlist").on("submit", ".seat-party", function(event){
    event.preventDefault()
    var $form = $(this);
    var $chosenWaittimeItem = $(this).closest(".waittime-item");
    var waittimeId = $chosenWaittimeItem.attr("id").replace("waittime-","");
    console.log(waittimeId)
    var data = {'waittime': {'id': waittimeId}};
    // UPDATE Waittime object in the database (set seated to true)
    $.ajax({
      method: "PATCH",
      url: $form.attr("action"),
      dataType: "json",
      data: data
    })
    .done(function(response){
      console.log(response)
      updateWaittimes(response)
      // When done, remove the <li> from the list
      $chosenWaittimeItem.remove();
    });
  });


  $(".waitlist").on("click", ".almost-ready", function(event){
    var waittimeId = $(this).closest("li").prop("id");
    $.ajax({
      method: "get",
      url: '/waittimes/send_notice',
      data: {
        id: waittimeId
      }
    }).done(function(response){
      $("#" + response).find('.almost-ready').toggle()
      $("#" + response).find('.seat-party').toggle()
      $("#" + response).find('.status .ready').toggle()
    })
  })

});
