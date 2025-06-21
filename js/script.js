let currentSong = new Audio();

async function getSongs() {
    let a = await fetch("http://192.168.1.6:5500/Lecture_84_Spotify_Clone/songs/songs.json");
    let response = await a.json();
    return response
}

const playMusic = (track, name, pause=false) => {
    currentSong.src = track
    if(!pause) {
        currentSong.play()
        play.src = "/Lecture_84_Spotify_Clone/Spotify-Clone/assets/images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = name
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

// function for time conversion
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Main function
async function main() {
    let allSongs = await getSongs()
    playMusic(allSongs[0].file, allSongs[0].name, true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of allSongs) {
        songUL.innerHTML = songUL.innerHTML +
            `
            <li data-file="${song.file}" data-name="${song.name}">
                <img class="invert" src="/Lecture_84_Spotify_Clone/Spotify-Clone/assets/images/music.svg" alt="">
                <div class="info">
                    <div>${song.name}</div>
                </div>
                <div class="playnow">
                    <span>Play now</span>
                    <img class="invert" src="/Lecture_84_Spotify_Clone/Spotify-Clone/assets/images/play.svg" alt="">
                </div>
            </li>
        `;
    }

    // Add event listeners to all song <li> cards
    const songItems = document.querySelectorAll(".songList li");
    songItems.forEach(item => {
        item.addEventListener("click", () => {
            const file = item.getAttribute("data-file");
            const name = item.getAttribute("data-name");
            if (file) {
                playMusic(file, name);
            }
        });
    });
    // Attach event listener for play, next and previous buttons
    play.addEventListener("click", ()=>{
        if(currentSong.paused) {
            currentSong.play();
            play.src = "/Lecture_84_Spotify_Clone/Spotify-Clone/assets/images/pause.svg"
        } else {
            currentSong.pause();
            play.src = "/Lecture_84_Spotify_Clone/Spotify-Clone/assets/images/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";
    })

    // Add an event to listen seek-bar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime = (currentSong.duration*percent)/100;
    })

}
main();

