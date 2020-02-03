$(document).ready(function(){

viewArticles();
$("#scrapeArticles").on("click",function(){
   $.ajax({
       method: "GET",
       url: "/scrape"
   }).then(function(data){
        //console.log(data);

        location.reload();
   });
});

function viewArticles(){
// Grab the articles as a json
$.getJSON("/articles", function(data) {
    
    const articles = data.filter(article => article.saved === false)
    // For each one
    for (var i = 0; i < articles.length; i++) {
      // Display the apropos information on the page
      //$("#articles").append("<div class='container' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" +data[i].summary + "</p>");
      $("#articles").append(`
      <div class='container mt-3 mb-3 bg-light'>
        <div class='row'>
            <h2><a target="_blank" href="${articles[i].link}">${articles[i].title}</a></h2><br>
            <hr>
            <h3>${articles[i].summary}</h3><br>
            <hr>
            <button class="float-right saveArticle" article-id=${articles[i]._id}>Save Article</button>
        </div>
      </div>
      `)
    }
  });
}  

$(document).on("click",".saveArticle", function(){
    console.log("HEy");
    const articleId = $(this).attr("article-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + articleId
    }).then(function(data) {
        location.reload();
    })
});

 
  $("#savedArticles").on("click",function(){
    $("#articles").empty();$.getJSON("/articles", function(data) {
        
        const articles = data.filter(article => article.saved === true)
        // For each one
        for (var i = 0; i < articles.length; i++) {
          // Display the apropos information on the page
          //$("#articles").append("<div class='container' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" +data[i].summary + "</p>");
          $("#articles").append(`
          <div class='container mt-3 mb-3 bg-light'>
            <div class='row'>
                <h2><a target="_blank" href="${articles[i].link}">${articles[i].title}</a></h2><br>
                <hr>
                <h3>${articles[i].summary}</h3><br>
                <hr>
                <button class="float-right saveArticle" article-id=${articles[i]._id}>Save Article</button>
            </div>
          </div>
          `)
        }
      });

  });
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  

});