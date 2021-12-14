const $ = document.querySelector.bind(document);

const MOVIE_DB_API = '5b373cfa6121028619e63bf3cee17a18';
const MOVIE_DB_ENDPOINT = 'https://api.themoviedb.org';
const MOVIE_DB_IMAGE_ENDPOINT = 'https://image.tmdb.org/t/p/w200';

window.onload = function () {
    this.fetch(`${MOVIE_DB_ENDPOINT}/3/person/popular?api_key=${MOVIE_DB_API}&language=en-US&page=1`)
        .then(r => r.json())
        .then(data => {
            const pop = data.results;
            const popList = createPoplarPeopleContainer(pop)
            console.log(`https://api.themoviedb.org/3/tv/popular?api_key=${MOVIE_DB_API}&language=en-US&page=1`)
        });

    onLogin(user => {
        if (user) {
            //user just logged in
            $("#signinbutton").style.display = "none";
            $("#signoutbutton").style.display = "block";
            email = user.email;
            forEachComment(createComment);
        }
        else {
            $("#signinbutton").style.display = "block";
            $("#signoutbutton").style.display = "none";
        }
    });

    $('#movies').style.display = "none";
    $("#tvshows").style.display = "none";

    let ul = document.querySelector('ul');
    let li = document.querySelectorAll('li');

    li.forEach(eL => {
        eL.addEventListener('click', function () {
            ul.querySelector('.active').classList.remove('active');

            eL.classList.add('active');

            if (this.innerText === 'Home') {
                $('#movies').style.display = "none";
                $("#people").style.display = "block";
                $("#tvshows").style.display = "none";
            }
            else {
                if (this.innerText === "TV Shows") {
                    $("#tvshows").style.display = "block";
                    $("#people").style.display = "none";
                    $('#movies').style.display = "none";

                    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${MOVIE_DB_API}&language=en-US&page=1`)
                        .then(r => r.json())
                        .then(data => {
                            const pop = data.results;
                            const popList = createPoplarShowContainer(pop)
                        });
                }
                else {
                    if (this.innerText === 'Movies') {
                        $('#movies').style.display = "block";
                        $("#people").style.display = "none";
                        $("#tvshows").style.display = "none";

                        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${MOVIE_DB_API}&language=en-US&page=1`)
                            .then(r => r.json())
                            .then(data => {
                                const pop = data.results;
                                const popList = createPoplarMovieContainer(pop)
                            });
                    }
                }
            }
        });
    });


    $("#signoutbutton").onclick = function () {
        logout();
    }

    $('#addCommentBtn').onclick = function () {
        addComment($('#newComment').value)
            .then((id) => {
                createComment({ Message: $('#newComment').value }, id);
                $('#newComment').value = '';
            })
            .catch(err => $('.error').innerText = err.message)
    }
}

function addPersonCard(person) {
    var personDiv = document.createElement('div');
    personDiv.setAttribute('class', 'person');
    personDiv.innerHTML = `<img src= "${MOVIE_DB_IMAGE_ENDPOINT + person.profile_path}" data-people-id=${person.id}>
   <div id = tag>${person.name}</div>`;
    return personDiv;
}

function addMovieCard(movie) {
    var movieDiv = document.createElement('div');
    movieDiv.setAttribute('class', 'movie');
    movieDiv.innerHTML = `<img src= "${MOVIE_DB_IMAGE_ENDPOINT + movie.poster_path}" data-movie-id=${movie.id}>
   <div id = tag>${movie.title}</div>`;
    return movieDiv;
}

function addTvCard(show) {
    var showDiv = document.createElement('div');
    showDiv.setAttribute('class', 'shows');
    showDiv.innerHTML = `<img src= "${MOVIE_DB_IMAGE_ENDPOINT + show.poster_path}" data-movie-id=${show.id}>
   <div id = tag>${show.name}</div>`;
    return showDiv;
}


function createPoplarPeopleContainer(people) {
    $('#imgPeople').innerHTML = '';
    for (var person of people) {
        if (person.profile_path)
            $('#imgPeople').appendChild(addPersonCard(person));
    }
}

function createPoplarMovieContainer(movie) {
    $('#imgMovie').innerHTML = '';
    for (var poster of movie) {
        if (poster.poster_path)
            $('#imgMovie').appendChild(addMovieCard(poster));
    }
}

function createPoplarShowContainer(show) {
    $('#imgShows').innerHTML = '';
    for (var poster of show) {
        if (poster.poster_path)
            $('#imgShows').appendChild(addTvCard(poster));
    }
}

function createComment(commentDoc, id) {
    var div = document.createElement('div');
    var text = div.appendChild(document.createElement("span"));
    var timestamp;
    if (commentDoc.TimeStamp) {
        timestamp = commentDoc.TimeStamp.toDate();
    }
    else {
        timestamp = new Date();
        div.classList.add("currentUserComment");
    }

    text.innerHTML = `${commentDoc.Message} <div class = "timestamp" style="text-align: right"> ${timestamp.toDateString()} </div> `;

    $('#comments').appendChild(div);
    if (email === commentDoc.email) {
        div.classList.add("currentUserComment");
        var trashIcon = div.appendChild(document.createElement("span"));
        var penIcon = div.appendChild(document.createElement("span"));
        penIcon.innerHTML = `<i class="fas fa-edit"></i>`;
        penIcon.className = "Edit";
        trashIcon.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        trashIcon.className = "Trash";
        penIcon.onclick = function () {
            var message = prompt("'Edit?");
            if (message) 
            {
                updateComment(id, message);
                text.innerHTML = `${message} <div class = "timestamp" style="text-align: right"> ${timestamp.toDateString()} </div> `;
            }
        }
        trashIcon.onclick = function () {
            if (confirm("Are you sure you want to delete this comment?")) {
                deleteComment(id);
                div.remove();
            }
        }
    }
    div.classList.add('comment');
}