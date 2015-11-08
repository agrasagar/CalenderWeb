
$(document).ready(function() {
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
            //events: "events",
            eventSources: [ "events" ],
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

  $("#search_start").datepicker({
    dateFormat: "yy-mm-dd"
  });

  $("#search_end").datepicker({
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
  });

  $("#import-gcal").click(function(){
    console.log("import google calendar");
    importGCal();
  });

  $("#event_export_btn").click(function(){
    console.log("export google calendar");
    exportEventToGCal();
  });

  $("#Search").click(function(){
    searchEvents();
  });

    $("#Clear").click(function(){
      clearFields();
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
  $("#event_export_btn").show();
}

var newEvent = function(date, jsEvent, view){
  $("#new_event_note").show();
  $("#action_type").val("new");
  $("#event_id").val("");
  $("#event_name").val("");
  $("#event_description").val("");
  $("#event_start_date").datepicker("setDate", date.toDate());
  $("#event_start_time").timepicker("setTime", date.toDate());
  $("#event_export_btn").hide();
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
    }
  });
}

var searchEvents = function(){
  $("#accordion").html("");
  $("#search_results").show();
  var url = "/events/search";
  var method = "POST";
  var params = {};
  if($("#search_name").val()!=undefined) params.name = $("#search_name").val().trim();
  if($("#search_description").val()!=undefined) params.description = $("#search_description").val().trim();
  if($("#search_start").val().trim()) params.start_date = $("#search_start").val().trim();
  if($("#search_end").val().trim()) params.end_date = $("#search_end").val().trim();
    $.ajax({
      url: url,
      method: method,
      data: params,
      async: false,
      success: function(data){
        console.log(data);
        var str = "";
        if(data.length == 0){
          str = "0 Search results"
            $("#accordion").html(str);
        }
        $.each( data, function( index, event) {
          var start= new Date(event.start_date);
          var end= new Date(event.end_date);
          str += "<h4>"+event.name+"</h4>";
          str += "<div><p><span>Description: </span><span class='label label-info'>"+event.description+"</span></p>"
          str += "<p><span>Start: </span><span class='label label-info'>"+start.toDateString()+"</span></p>"
          str += "<p><span>End: </span><span class='label label-info'>"+end.toDateString()+"</span></p>"
          str += "<p><span>Recurrence: </span><span class='label label-info'>"+event.repeat+"</span></p></div>"
          console.log(str);
        });
        console.log(str);
        $("#accordion").html(str);
        $("#accordion").accordion({
          header: "h4"
        });
        }
    });
}

var clearFields = function(){
  $("#search_name").val("");
  $("#search_description").val("");
  $("#search_start").val("");
  $("#search_end").val("");
  $("#accordion").html("");
  $("#search_results").hide();
}

var importGCal = function(){
  var isChecked = $("#import-gcal-checkbox").is(":checked");
  var googleApiKeys = {
    googleCalendarApiKey: 'AIzaSyAwHVdFNAQE0NwTKBtETzER_u8p-o5wKEQ',
    googleCalendarId: 'aaltoelec@gmail.com'
  }
  if(isChecked){
    $('#calendar').fullCalendar( "removeEventSource", googleApiKeys);
    $('#calendar').fullCalendar( "addEventSource", googleApiKeys);
    $('#calendar').fullCalendar('refetchEvents');
  } else {
    $('#calendar').fullCalendar( "removeEventSource", googleApiKeys);
    $('#calendar').fullCalendar('refetchEvents');
  }
}

var exportEventToGCal = function(){
  var id = $("#event_id").val();
  $.ajax({
    url: "events/export_event",
    method: "POST",
    data: {id: id},
    async: false,
    success: function(data){
      console.log(data);
      window.location.replace(data);
    }
  });
};
