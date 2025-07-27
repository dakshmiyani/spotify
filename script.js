let currentSong = new Audio();  // ✅ global
let play = document.getElementById("play");
let icon = play.querySelector("i");


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


async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/assets/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/",)[1]);
        }
    }

    return songs;
}

const playMusic = (track) => {
    currentSong.src = "/assets/songs/" + track;
    currentSong.play();
    icon.className = "fa-solid fa-pause";
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}


 Array.from(document.getElementsByClassName("card3")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[1])

        })
    })


   
    Array.from(document.getElementsByClassName("card1")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })

     Array.from(document.getElementsByClassName("card2")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[1])

        })
    })
async function main() {
   

    let songs = await getSongs();
    console.log(songs);
    playMusic(songs[0])

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
            <li> 
                <div class="info">${song.replaceAll("%20", " ")}</div>
                <div class="playbtnlib">
                    <span class="playnow">Play Now</span> 
                    <span class="playnowlib"><i class="fa-solid fa-circle-play"></i></span>
                </div>
            </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info").innerHTML.trim();
            playMusic(songName);
        });
    });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            icon.className = "fa-solid fa-pause";
        } else {
            currentSong.pause();
            icon.className = "fa-solid fa-play";
        }
    })


    currentSong.addEventListener("timeupdate", () =>{

            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        
    })

  document.querySelector(".seekbar").addEventListener("click", e => {
    const seekbar = e.currentTarget;
    const rect = seekbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = (clickX / rect.width) * 100;

    document.querySelector(".circle").style.left = `${percent}%`;

    if (!isNaN(currentSong.duration)) {
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    }
});

currentSong.addEventListener("timeupdate", () => {
    if (!isNaN(currentSong.duration)) {
        const percent = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".circle").style.left = `${percent}%`;

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    }
});


  next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
 
  let previous =  document.querySelector("#prev");
  previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })


}

main();
   