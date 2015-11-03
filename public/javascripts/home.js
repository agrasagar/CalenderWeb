$(document).ready(function(){
  console.log("ssssssssssssss");
    $.ajax({
      url: "test.html",
      context: document.body
    }).done(function() {
      $( this ).addClass( "done" );
    });
});


console.log("testttttttt");
