import songs from "./data.js";

// console.log(songs)

let songIndex = 0;
let currentSong = songs[songIndex];
let audioFile = new Audio(currentSong.audioFile) //default audio file
let currentPlayingSong = currentSong;


const playerBackward = document.getElementById("playerBackward");
const playerForward = document.getElementById("playerForward");
const playerMaster = document.getElementById("playerMaster");
const progressBar = document.getElementById("progressBar");
const gif = document.getElementById("gif");
const songCurrentTime = document.getElementById("songCurrentTime");
const songDuration = document.getElementById("songDuration");


songs.forEach((song) => {
    songList.innerHTML += `<div id="songItem${song.id}" class="song-item flex items-center justify-between my-1 rounded-md hover:bg-slate-50 bg-slate-200">
    <img src="../Music Cover/${song.coverPhoto}" alt="${song.songName} cover" class="h-[75px] w-[75px]">
    <h2 class="song-name">${song.songName}</h2>
    <h2 class="song-by hidden">${song.songBy}</h2>
    <h2 class="song-album hidden">${song.album}</h2>
    <div class="icon mr-2"><i id="songItemIcon${song.id}" class="fa-solid fa-play text-lg cursor-pointer px-1 playPauseIcon"></i></div>
</div>`;
});

const updateSongDetails = (songIndex) => {
    const currentSong = songs[songIndex];
    const songDetails = document.getElementById("songDetails");
    songDetails.innerHTML = `
        <div class="details-card w-fit mx-auto flex flex-col">
            <img id="songDetailsImg" src="${currentSong.coverPhoto}" alt=${currentSong.songName} class="h-96 w-96 rounded-t-md">
            <div class="info p-3 w-96 bg-slate-200 text-lg font-semibold rounded-b-md">
                 <h2 id="songDetailName">Song : ${currentSong.songName}</h2>
                 <h2 id="songDetailBy">Song by : ${currentSong.songBy}</h2>
                 ${currentSong.album === "" ? `<h2 class="hidden">Album : ${currentSong.album}</h2>` : `<h2 class="block ">Album : ${currentSong.album}</h2>`}
            </div>
        </div>
    `;
}

updateSongDetails(songIndex);

const toggleSongMode = () => {
    if (audioFile.currentTime <= 0 || audioFile.paused) {
        audioFile.play();
    }
    else {
        audioFile.pause();
    }
};

const toggleIconsMode = (currentItem) => {

    if (currentItem.classList.contains("fa-play")) {

        currentItem.classList.remove("fa-play");
        currentItem.classList.add("fa-pause");

    }
    else {
        currentItem.classList.remove("fa-pause");
        currentItem.classList.add("fa-play");
    }
};


const hideGif = () => {
    gif.classList.remove("opacity-100");
    gif.classList.add("opacity-0");
}

const showGif = () => {
    gif.classList.remove("opacity-0");
    gif.classList.add("opacity-100");
}

//update the time of song
const updateTime = () => {
    const currentTime = audioFile.currentTime;
    const duration = audioFile.duration;

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    songCurrentTime.innerText = formatTime(currentTime);
    songDuration.innerText = formatTime(duration);

}

// Progress Bar update
audioFile.addEventListener("timeupdate", () => {
    let progress = (audioFile.currentTime / audioFile.duration) * 100;
    progressBar.value = progress;
    updateTime();
});

//manually changing the song timing from progress bar
progressBar.addEventListener("change", () => {
    audioFile.currentTime = (progressBar.value * audioFile.duration) / 100;
    audioFile.play();
    playerMaster.classList.remove("fa-play");
    playerMaster.classList.add("fa-pause");
});

//Master player
playerMaster.addEventListener("click", () => {
    toggleSongMode();
    toggleIconsMode(playerMaster);

    if (currentPlayingSong) {
        const playingSongIcon = document.getElementById("songItemIcon" + currentPlayingSong.id);
        toggleIconsMode(playingSongIcon);
        if (audioFile.paused) {
            hideGif();
        } else {
            showGif();
        }
    }
});

//Player's back button functionality
playerBackward.addEventListener("click", () => {
    const previousSongIndex = (songIndex - 1 + songs.length) % songs.length;
    songIndex = previousSongIndex;
    toggleSongAndIcon(songIndex);
});

//Player's next button functionality
playerForward.addEventListener("click", () => {
    const nextSongIndex = (songIndex + 1) % songs.length;
    songIndex = nextSongIndex;
    toggleSongAndIcon(songIndex);
});

//Select all song's to manage their state ---> play/pause
const songItemIcons = [];
for (let i = 0; i < songs.length; i++) {
    songItemIcons[i] = document.getElementById("songItemIcon" + songs[i].id);
    songItemIcons[i].addEventListener("click", () => {
        songIndex = i;
        toggleSongAndIcon(songIndex);
    });
}

//Toggle the current state of individual song item and master player according to play/pause state
const toggleSongAndIcon = (index) => {
    const clickedSongIcon = document.getElementById("songItemIcon" + songs[index].id);

    if (currentPlayingSong !== songs[index]) {
        if (document.getElementById("songItemIcon" + currentPlayingSong.id).classList.contains("fa-pause")) {
            document.getElementById("songItemIcon" + currentPlayingSong.id).classList.remove("fa-pause");
            document.getElementById("songItemIcon" + currentPlayingSong.id).classList.add("fa-play");
            toggleIconsMode(playerMaster);
        }
        currentPlayingSong = songs[index];
        audioFile.src = currentPlayingSong.audioFile;
    }

    toggleSongMode();
    toggleIconsMode(clickedSongIcon);
    toggleIconsMode(playerMaster);
    updateSongDetails(index);
    if (audioFile.paused) {
        hideGif();
    } else {
        showGif();
    }
};

//autoplay next song when previous song is complete
audioFile.addEventListener("ended", () => {
    const nextSongIndex = (songIndex + 1) % songs.length;
    songIndex = nextSongIndex;
    toggleSongAndIcon(songIndex);
});
