const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progest = $('#progest');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Beautiful In White',
            singer: 'Shane Filan',
            path: './music/Beautiful In White.mp3',
            image: './images/shane-filan.jpg',
        },
        {
            name: 'Symphony',
            singer: 'Clean Bandit',
            path: './music/Clean Bandit - Symphony feat. Zara Larsson (Refeci Remix).mp3',
            image: './images/clean-bandit.jpg',
        },
        {
            name: 'Hypnotized',
            singer: 'DEAMN',
            path: './music/DEAMN - Hypnotized.mp3',
            image: './images/deamn.jpg',
        },
        {
            name: 'Save Me',
            singer: 'DEAMN',
            path: './music/DEAMN - Save Me.mp3',
            image: './images/deamn.jpg',
        },
        {
            name: 'Believer',
            singer: 'Imagine Dragons',
            path: './music/Imagine Dragons - Believer.mp3',
            image: './images/imagine-dragons.jpg',
        },
        {
            name: 'Just Give Me A Reason',
            singer: 'P!nk',
            path: './music/Just Give Me A Reanson.mp3',
            image: './images/pink.jpg',
        },
        {
            name: 'Let Her Go',
            singer: 'Passenger',
            path: './music/Let Her Go.mp3',
            image: './images/passenger.jpg',
        },
        {
            name: 'Animals',
            singer: 'Martin Garrix',
            path: './music/Martin Garrix - Animals.mp3',
            image: './images/martin-garrix.jpg',
        },
        {
            name: 'What Makes You Beautiful',
            singer: 'One Direction',
            path: './music/One Direction - What Makes You Beautiful (Official Video).mp3',
            image: './images/one-direction.jpg',
        },
        {
            name: 'Walk Thru Fire',
            singer: 'Vicetone',
            path: './music/Vicetone - Walk Thru Fire (Official Video) ft. Meron Ryan.mp3',
            image: './images/vicetone.jpg',
        },
        
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // X??? l?? khi CD quay / d???ng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)',
            }
        ], {
            duration: 10000, // 10 gi??y
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // X??? l?? ph??ng to / thu nh??? ????a CD
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // X??? l?? khi click n??t play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // T???i ??u
        // Khi b??i h??t ???????c play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        
        // Khi b??i h??t ???????c pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }

        // Khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // X??? l?? khi tua b??i h??t
        progress.onchange = function(e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        // X??? l?? khi next b??i h??t
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // X??? l?? khi prev b??i h??t
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // X??? l?? khi b???t / t???t random b??i h??t
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // X??? l?? b??i h??t khi h???t b??i
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // X??? l?? khi b???t / t???t repeat b??i h??t
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()

                }
                
                if (e.target.closest('.option')) {
                    console.log('Additional part');
                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 200)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // Ga??n c????u hi??nh t???? config va??o ????ng du??ng
        this.loadConfig();
        // ?????nh ngh??a c??c thu???c t??nh cho object
        this.defineProperties();
        // L???ng nghe v?? x??? l?? c??c s??? ki???n
        this.handleEvents();
        // Load th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong();
        // Render playlist
        this.render();
        // Hi????n thi?? tra??ng tha??i ban ??????u cu??a button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()

