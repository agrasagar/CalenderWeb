console.log("testttttttt");

$(document).ready(function() {

    // page is now ready, initialize the calendar...

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
