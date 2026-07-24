function titleToFileName(title) {
    return title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function getSongPath(title) {
    var songFiles = {
        "buenos dias amor": "jose-jose-buenos-dias-amor.m4a",
        "tu ganas": "Jose Jose – Tu ganas.mp3",
        "sera": "Será José José.mp3",
        "es que te quiero": "jose-jose-es-que-te-quiero.m4a",
        "nadie simplemente nadie": "José José - Nadie Simplemente Nadie.mp3"
    };

    return "./assets/music/" + songFiles[titleToFileName(title)];
}

var songs = [
    {
        "title":"buenos dias, amor",
        "autor":"pepe",
        "image":"./assets/img/buenos dias amor.jpg",
        "path":getSongPath("buenos dias, amor")

    },
    {
        "title":"tú ganas",
        "autor":"pepe",
        "image":"./assets/img/tu ganas.jpeg",
        "path":getSongPath("tú ganas")
    },
    {
        "title":"será",
        "autor":"pepe",
        "image":"./assets/img/sera.jpeg",
        "path":getSongPath("será")
    },
    {
        "title":"es que te quiero",
        "autor":"pepe",
        "image":"./assets/img/es que te quiero.jpg",
        "path":getSongPath("es que te quiero")
    },
    {
        "title":"nadie simplemente nadie",
        "autor":"pepe",
        "image":"./assets/img/nadie simplemente nadie.jpeg",
        "path":getSongPath("nadie simplemente nadie")
    }

]

function playSong(song) {
    var audioPlayer = document.getElementById("audioPlayer");
    var currentSong = document.getElementById("currentSong");
    var currentSongImage = document.getElementById("currentSongImage");
    var currentSongCover = document.getElementById("currentSongCover");

    if (!audioPlayer || !currentSong || !currentSongImage || !currentSongCover || !song) {
        return false;
    }

    currentSong.textContent = song.title;
    currentSongImage.src = song.image;
    currentSongImage.alt = "Portada de " + song.title;
    currentSongCover.classList.remove("d-none");
    audioPlayer.src = song.path;
    audioPlayer.play();

    return false;
}

