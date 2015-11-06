console.log("testttttttt");

$(document).ready(function() {

  var events = getEvents();
  console.log("1111111111111111");
  console.log(events);


    $('#calendar').fullCalendar({
      header: {
          center: 'month,agendaFourDay' // buttons for switching between views
      },
      views: {
          agendaFourDay: {
              type: 'agenda',
              duration: { days:   7 },
              buttonText: '7 day'
          }
      }
  });

});



var getEvents = function(){
  console.log("getEvents()");

  $.ajax({
    url: "events",
    method: "GET"
  }).done(function(data){
    console.log(data);
    var events = [];
    $.each(data, function(index, event){
      var event = {};
      event["title"] = event.name;
      event["start"] = event.start_date;
      event["description"] = event.description;
      events[index] = event;
    })

    return events;

  });

}
