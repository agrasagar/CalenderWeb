console.log("testttttttt");

$(document).ready(function() {

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
    //to get from the //http://localhost:3000/events
    $.ajax({
      url: "events",     //http://localhost:3000/events
      method: "GET"
    }).done(function(data){
      console.log(data);
      var events = [];
      $.each(data, function(index, event){
        var event = {};
        event["title"] = data[index].name;
        event["start"] = data[index].start_date;
        event["description"] = data[index].description;
        events[index] = event;
      })
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
            events:events
          });
      });
});
/*var getEvents = function(){
  console.log("getEvents()");

  $.ajax({
    url: "events",     //http://localhost:3000/events
    method: "GET"
  }).done(function(data){
    console.log(data);
    var events = [];
    $.each(data, function(index, event){
      var event = {};
      event["title"] = data[index].name;
      event["start"] = data[index].start_date;
      event["description"] = data[index].description;
      events[index] = event;
    })
    console.log(events);
    return events;
});
}*/
