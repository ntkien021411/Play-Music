const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progressSong = $("#progress");
const nextSongMusic = $(".btn-next");
const preSongMusic = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatSong = $(".btn-repeat");
const playList = $(".playlist");
const app = {
  currentIndex: 0,
  isRandom : false,
  isRepeat : false,
  config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Đại Điền Hậu Sinh tử",
      singer: "Singer1",
      path: "./music/DaiDienHauSinhTuRemix-VuongNgocManh-6133747.mp3",
      image: "./image/ĐaiDienHauSinhTu.jpg",
    },
    {
      name: "Giày Cao Gót Màu Đỏ",
      singer: "Singer2",
      path: "./music/GiayCaoGotMauDo-ChuLoi-5750670.mp3",
      image: "./image/GiayCaoGotMauDo.jpg",
    },
    {
      name: "Về Đây Em LO",
      singer: "Singer3",
      path: "./music/VeDayEmLoRemix-HuynhAiVyACV-7211110.mp3",
      image: "./image/VeDayEmLo.jpg",
    },
    {
      name: "Sẵn Sàng Yêu Em Đi Thôi",
      singer: "Singer4",
      path: "./music/SanSangYeuEmDiThoiDaiMeoRemix-WONI-7012687.mp3",
      image: "./image/SanSangYeuEmDiThoi.jpg",
    },
    {
      name: "Anh Đã Lạc Vào Remix",
      singer: "Singer5",
      path: "./music/AnhDaLacVaoRemix--7215942.mp3",
      image: "./image/AnhDaLacVaoRemix.jpg",
    },
    {
      name: "Anh Sẽ Đợi",
      singer: "Singer6",
      path: "./music/AnhSeDoiRemixDJThaoB-TLongToMinh-7235657.mp3",
      image: "./image/AnhSeDoiRemix.jpg",
    },
  ],

  setConfig : function (key,value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
  },
  render: function () {
    const html = this.songs.map(function (current,index) {
      return `
                    <div class="song  ${index === app.currentIndex ? 'active' : ''}" data-index = ${index}>

                    <div class="thumb" style="background-image: url('${current.image}')">
                    </div>

                    <div class="body">
                        <h3 class="title">${current.name}</h3>
                        <p class="author">${current.singer}</p>
                    </div>

                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>   
                `;
    });
    // const playList = $(".playlist");
    playList.innerHTML = html.join("");

    // const audioPath =this.songs[0].path;
    //  $('#audio').style.src = audioPath;
    // console.log(this.songs[0].path);
    // console.log(html.join(''));
    // console.log(playList);
  },

  defineProperties: function () {
    // định nghĩa 1 thuộc tính trong 1 object
    // tham số 1 là object cần định nghĩa property
    // tham số 2 là tên property
    // tham số 3 là value of property
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
    
  },

  handleEvent: function () {
    const this_ = this; // chỉ object app
    const cdWith = cd.offsetWidth;

    //xử lí CD quay / dừng
    // animate return a animation object
    // tham số 1 là mảng animation
    // tham số 2 là thời gian animation
    const cdThumbAnimation = cdThumb.animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 10000, // thời gian
        iterations: Infinity, // lặp lại bao nhiêu lần
      }
    );
    cdThumbAnimation.pause(); // stop animation
    // console.log(cdThumbAnimation);

    document.onscroll = function () {
      // browser event scroll
      // console.log(window.scrollY); // độ dài khi lăn chuột
      // console.log(document.documentElement.scrollTop);// độ dài khi lăn chuột

      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newCDWidth = cdWith - scrollTop;
      cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : "0px";
      cd.style.opacity = newCDWidth / cdWith;
      // console.log(scrollTop);
      // console.log(newCDWidth);
    };

    //* Start / stop songs
    playBtn.onclick = function () {
      const isPlaying = player.classList.contains("playing");
      if (!isPlaying) {
        // khi bấm nút mà đang dừng thì cho chạy
        // console.log('success');
        // player.classList.add('playing');
        audio.play();
      } else {
        // khi bấm nút mà đang chạy thì cho dừng
        // console.log('fail');
        // player.classList.remove('playing');
        audio.pause();
      }
      // console.log(123);
    };

    //* When song play
    audio.onplay = function () {
      player.classList.add("playing");
      cdThumbAnimation.play(); //* xoay CD
    };

    //* When song pause
    audio.onpause = function () {
      player.classList.remove("playing");
      cdThumbAnimation.pause(); //* dừng CD
    };

    //* Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      // console.log(audio.currentTime /audio.duration * 100);
      const progress = Math.floor((audio.currentTime / audio.duration) * 100);
      progressSong.value = progress;
      // console.log(progress);

      //*  Auto run again if song ends
      //       if(audio.currentTime === audio.duration){
      //         // audio.currentTime = 0;
      //         audio.play();
      //       }
    };
    //* progess thay đổi thì songs thay đổi
    progressSong.onchange = function (e) {
      // audio.pause();
      const valueChange = e.target.value;
      const secondAudioChange = (valueChange / 100) * audio.duration;
      audio.currentTime = secondAudioChange;
      // console.log(valueChange);
      // console.log(secondAudioChange);
    };

    //* Bấm next thì sẽ chuyển bài tiếp
    // console.log(nextSong);
    nextSongMusic.onclick = function () {
      // console.log(1);
      // app.currentIndex++;
      // console.log(app.currentIndex);

      // randam is active so next is used
      if (randomBtn.classList.contains("active")) {
        this_.playRandom();
      } else {
        this_.nextSong();
      }
      this_.render();
      audio.play();
      this_.scrollToActiveSong();
    };

    //* Bấm pre  thì sẽ lùi bài
    // console.log(nextSong);
    preSongMusic.onclick = function () {
      // console.log(1);
      // app.currentIndex++;
      // console.log(app.currentIndex);

      // randam is active so pre is used
      if (randomBtn.classList.contains("active")) {
        this_.playRandom();
      } else {
        this_.preSong();
      }
      this_.render();
      this_.scrollToActiveSong();
      audio.play();
      
    };

    //* Khi bấm random active
    randomBtn.onclick = function () {
      // if(!randomBtn.classList.contains('active')){
      //   randomBtn.classList.add('active');
      //   this_.playRandom();
      //   audio.play();
      // }else{
      //   randomBtn.classList.remove('active');
      // }

    this_.isRandom=!this_.isRandom;
 
    randomBtn.classList.toggle('active',this.isRandom);
   
    this_.setConfig('isRandom',this_.isRandom);

      // randomBtn.classList.toggle("active");

    };

    //* Xử lí audio when  song ended
    //* when song ends the next song or random active so next random song
    audio.onended = function () {
      //* cách 1
      // if(randomBtn.classList.contains('active')){
      //   this_.playRandom();
      // }else{
      //   this_.nextSong();
      // }
      // audio.play();

      //* cách 2
      // method click() giống việc bấm vào nút next ở dòng 191
      if (repeatSong.classList.contains("active")) {
        // audio.currentTime = 0;
        audio.play();
      } else {
        nextSongMusic.click();
      }
      
    };

    //* Xử lí repeat song
    repeatSong.onclick = function () {
      // repeatSong.style.color = 'red';
      repeatSong.classList.toggle("active");
      // audio.currentTime = 0;
      // audio.play();
      this_.isRepeat=!this_.isRepeat
      this_.setConfig('isRepeat',this_.isRepeat)
      repeatSong.classList.toggle('active',this_.isRepeat)

    };
    

    //* Lắng nghe hành vi click vào playlist
    playList.onclick = function (e) {
      const songActive = e.target.closest('.song:not(.active)');
      // console.log(e.target);
      // tim thằng cha gần thằng e  nhất có class là song và ngoại trừ thằng có class active 
      if(songActive|| e.target.closest('.option')){
        //*Xử lí khi click vào song 
        if(songActive && !e.target.closest('.option') ){
          // console.log(songActive.dataset.index); // thay cho getAttreibute data-set
          
          // lấy từ dataset là chuỗi nên phải convert sang number
          this_.currentIndex = Number(songActive.dataset.index);
          this_.loadCurSong();
          audio.play();
          this_.render();
          // console.log( this_.currentIndex);
        }
       
        //   console.log(e.target.closest('.song:not(.active)'));
        //*Xử lí khi click vào  song option
          if(e.target.closest('.option')){
            // console.log(123);
          }


            // console.log(e.target);
         
        }

        // console.log(e.target.closest());
    };

   

    // currentSong: function () {
    //   return this.songs[this.currentIndex];
    // },
  },

  loadCurSong: function () {
    // console.log(heading,cdThumb,audio);

    heading.textContent = this.currentSong.name;
    // cdThumb.style.backgroundImage = ' url( ' + this.currentSong.image + " ) ";
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig : function () {
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;

  },
   //* Scroll to active song
   scrollToActiveSong : function () {
      setTimeout(function () {
        $('.song.active').scrollIntoView({
          behavior : 'smooth',
          block: "end",
          //  inline: "nearest"
        });
      },200);
  },

  nextSong: function () {
    this.currentIndex++;
    // console.log(this.currentIndex , this.songs.length);
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurSong();
  },

  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    // if(this.currentIndex >= this.songs.length){
    //   this.currentIndex = 0;
    // }
    this.loadCurSong();
  },

  playRandom: function () {
    // let curIndexWhenRandomActive;
    do {
      var curIndexWhenRandomActive = Math.floor(
        Math.random() * this.songs.length
      );
    } while (this.currentIndex === curIndexWhenRandomActive);
    this.currentIndex = curIndexWhenRandomActive;
    this.loadCurSong();
  },

  start: function () {
    this.handleEvent(); //* event sroll(up/down) and picture(bigger/smaller)

    this.defineProperties(); //* define properties

    this.render(); //* view song

    // console.log(this.currentSong());
    this.loadConfig(); // Gán cấu hình từ config vào ứng dụng 
    //Hiển thị trạng thái ban đầu của btn
    // randomBtn.classList.toggle('active',this.isRandom);
    repeatSong.classList.toggle('active',this.isRepeat)

    this.loadCurSong(); //* load first song in UI when run broswer
  },
};

app.start();

// console.log(app.currentSong);
