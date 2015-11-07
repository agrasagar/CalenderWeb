
$(document).ready(function() {

/*
    $( "#Create" ).click(function() {
        $("#box").fadeIn('slow');
        $("#dialog").fadeIn('slow');
    });
    $('#submit').click(function(){
      var name = $('input[name="firstName"]').val();
      var description = $('input[name="description"]').val();
      var start_date = $('input[name="start_date"]').val();
      console.log(name);
      console.log(description);
      $('#box,#dialog').hide();
    })
    $('#cancel').click(function(){
      $('#box,#dialog').hide();
    })
    $( "#Upadate" ).click(function() {
      $( this ).slideUp();
    });
    $( "#Delete" ).click(function() {
      $( this ).slideUp();
    });
    $( "#Search" ).click(function() {
      $( this ).slideUp();
    });
*/
    // page is now ready, initialize the calendar...
      $('#calendar').fullCalendar({

        header: {
          left: 'prev,next',
          center: 'title',
          right: 'month,agenda7Day,dayview' // buttons for switching between views
          },
          views: {
            month:{
              dragOpacity: {
                month: .2,
                'default': .5
              }
            },
          dayview:{
              type: 'basic'
          },
          agenda7Day: {
                type: 'agenda',
                duration: { days:   7 },
                buttonText: 'agenda7day'
              }
            },
            //url for fetching events
            events: "events",
            timezone: "Europe/Helsinki",
            allDay: false,
            eventClick: function( event, jsEvent, view ) {
              showEvent(event, jsEvent, view);
            },
            dayClick: function(date, jsEvent, view) {
              newEvent(date, jsEvent, view);
            }

          });


  $("#event_start_date").datepicker({
    dateFormat: "yy-mm-dd"
  });

  $("#event_start_time").timepicker({
    timeFormat: "H:i"
  });
  $("#event_save_btn").click(function(){
    saveEvent();
    return false;
  });

  $("#event_delete_btn").click(function(){
    deleteEvent();
    return false;
  })

});
//---document ready block ends here

var showEvent = function(calEvent, jsEvent, view){
  $("#new_event_note").hide();
  $("#action_type").val("edit");
  $("#event_id").val(calEvent.id);
  $("#event_name").val(calEvent.title);
  $("#event_description").val(calEvent.description);
  $("#event_start_date").datepicker("setDate", calEvent.start.toDate());
  $("#event_start_time").timepicker("setTime", calEvent.start.toDate());

}

var newEvent = function(date, jsEvent, view){
  $("#new_event_note").show();
  $("#action_type").val("new");
  $("#event_id").val("");
  $("#event_name").val("");
  $("#event_description").val("");
  $("#event_start_date").datepicker("setDate", date.toDate());
  $("#event_start_time").timepicker("setTime", date.toDate());
};

var saveEvent = function(){
  var params = {};
  var action_type = $("#action_type").val();
  if(action_type == "edit"){ params._id = $("#event_id").val(); }
  params.name = $("#event_name").val().trim();
  params.description = $("#event_description").val().trim();
  params.start_date = $("#event_start_date").val().trim();
  params.start_time = $("#event_start_time").val().trim();
  if(!params.name){
    alert("Please enter event name!");
    return;
  }


  if(action_type == "new"){
    var url = "/events/";
    var method = "POST";
  } else {
    var url = "/events/" + params._id;
    var method = "PUT";
  }

  $.ajax({
    url: url,
    method: method,
    data: params,
    async: false,
    success: function(data){
      console.log(data);
      $('#calendar').fullCalendar('refetchEvents');
      //$('#calendar').fullCalendar('rerenderEvents');
    }
  });

}

var deleteEvent = function(){
  var action_type = $("#action_type").val();
  if(action_type == "edit"){ var id = $("#event_id").val(); }
  $.ajax({
    url: "events/"+id,
    method: "DELETE",
    async: false,
    success: function(data){
      console.log(data);
      $('#calendar').fullCalendar('refetchEvents');
      //$('#calendar').fullCalendar('rerenderEvents');
    }
  });

}
