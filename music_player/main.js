const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progest = $('#progest');


const app = {
    currentIndex: 0,
    isPlaying: false,
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

    render: function() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
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
        $('.playlist').innerHTML = htmls.join('');
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

        // Xử lý khi CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)',
            }
        ], {
            duration: 10000, // 10 giây
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ đĩa CD
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click nút play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Tối ưu
        // Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        
        // Khi bài hát được pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát
        progress.onchange = function(e) {
            const seekTime = e.target.value / 100 * audio.duration;
            console.log(seekTime);
            audio.currentTime = seekTime;
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        // Lắng nghe và xử lý các sự kiện
        this.handleEvents();
        // Load thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();
    }
}

app.start()

