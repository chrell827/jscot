$(document).ready(function(){
viewArticles();
$("#scrapeArticles").on("click",function(){
   $.ajax({
       method: "GET",
       url: "/scrape"
   }).then(function(data){
        location.reload();
   });
});
function viewArticles(){
$.getJSON("/articles", function(data) {
    const articles = data.filter(article => article.saved === false)
    for (var i = 0; i < articles.length; i++) {
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
        for (var i = 0; i < articles.length; i++) {
          $("#articles").append(`
          <div class='container mt-3 mb-3 bg-light'>
            <div class='row'>
                <h2><a target="_blank" href="${articles[i].link}">${articles[i].title}</a></h2><br>
                <hr>
                <h3>${articles[i].summary}</h3><br>
                <hr>
                <button class="float-right viewNotes" data-toggle="modal" data-target="#noteViewer" article-id=${articles[i]._id}>View Notes</button>
                <button class="float-right deleteArticle" article-id=${articles[i]._id}>Delete Article</button>
            </div>
          </div>
          `)
        }
      });
  });
  $(document).on("click",".deleteArticle",function(){
    const thisId = $(this).attr("article-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
  });
  $(document).on("click", ".viewNotes", function() {
    $("#notes").empty();
    const thisId = $(this).attr("article-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        data.notes.forEach(element => {
            $("#notes").append(`
            <h4>${element.body}</h4>
            `)
        })
        $("#notes").append(`
        <textarea id='bodyinput' name='body'></textarea>
        <button data-id="${thisId}" id='savenote'>Save Note</button>
        `)
    });
  });
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  });
});