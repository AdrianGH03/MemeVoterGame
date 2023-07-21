
let next = document.querySelector('#next');
let reset = document.querySelector('#reset');
let faceL = document.querySelector('#faceLeft');
let faceR = document.querySelector('#faceRight');
let memePic = document.querySelector('#girlPicture');
let likeButton = document.querySelector('#like');
let dislikeButton = document.querySelector('#dislike')

const totalLikeButton = document.getElementById('total-like');
const totalDislikeButton = document.getElementById('total-dislike');
let likeCounts = [];     // Array to store the like counts for each image
let dislikeCounts = [];  // Array to store the dislike counts for each image
let fetchCount = 0;      // Counter for the number of times getFetch() is called

////////////////////////////////////////////////////
//Event listeners for the like and dislike buttons to add to their counts
////////////////////////////////////////////////////
likeButton.addEventListener('click', () => {
  likeCounts[currentIndex] = (likeCounts[currentIndex] || 0) + 1;
  totalLikeButton.textContent = likeCounts[currentIndex];

  if (dislikeCounts[currentIndex] > 0) {
    dislikeCounts[currentIndex]--;
    totalDislikeButton.textContent = dislikeCounts[currentIndex];
  }
  fetchCount++;
});

dislikeButton.addEventListener('click', () => {
  dislikeCounts[currentIndex] = (dislikeCounts[currentIndex] || 0) + 1;
  totalDislikeButton.textContent = dislikeCounts[currentIndex];

  if (likeCounts[currentIndex] > 0) {
    likeCounts[currentIndex]--;
    totalLikeButton.textContent = likeCounts[currentIndex];
  }
  fetchCount++;
});

////////////////////////////////////////////////////
//Stop user from clicking more than once per fetch
////////////////////////////////////////////////////
likeButton.disabled = true;
dislikeButton.disabled = true;

likeButton.addEventListener('click', handleLike);
dislikeButton.addEventListener('click', handleDislike);
let isButtonsEnabled = true;
function handleLike() {
  if (!isButtonsEnabled) return;
  disableButtons();
  playCheer();
  showThumbsUp();
  likeButton.style.backgroundColor = 'limegreen';
}
function handleDislike() {
  if (!isButtonsEnabled) return; 
  disableButtons();
  playBoo();
  showThumbsUp();
  dislikeButton.style.backgroundColor = 'red';
}
function disableButtons() {
  likeButton.disabled = true;
  dislikeButton.disabled = true;
  isButtonsEnabled = false;
}
function enableButtons() {
  likeButton.disabled = false;
  dislikeButton.disabled = false;
  isButtonsEnabled = true;
}
////////////////////////////////////////////////////
//Get Fetch (gets the meme)
////////////////////////////////////////////////////
function reloadPage(){
  location.reload()
}

let randomNumber = Math.floor(Math.random() * 50)
let currentIndex = randomNumber; 
next.addEventListener('click', getFetch);
function getFetch() {
  const funnyMemesWins = document.querySelector('#likesWins');
  const badMemesWins = document.querySelector('#dislikesWins');
  const hideApp = document.querySelector('#hideWhenEnd');
  funnyMemesWins.volume = 0.3;
  badMemesWins.volume = 0.3;
  
  if (fetchCount == 11) {
    let totalLikes = likeCounts.reduce((a, b) => a + b, 0);
    let totalDislikes = dislikeCounts.reduce((a, b) => a + b, 0);
    
    playVideo();
    //Remove App and replace with video taking up full content of page. after video done = page refreshed
    function playVideo(){
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.documentElement.style.padding = "0";
      document.documentElement.style.margin = "0";
      hideApp.style.display = "none";


      if (totalLikes > totalDislikes) {
        funnyMemesWins.style.display = "block";
        document.body.style.backgroundImage = `url('flowers.jpg')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        
        startEndless();
        startEndless();
        funnyMemesWins.play();
      } else if (totalLikes < totalDislikes) {
        badMemesWins.style.display = "block";
        document.body.style.background = "black";
        badMemesWins.play();
      } else {
        console.log('It\'s a tie!');
      }
      return;
      }
  }


  fetch(`https://www.reddit.com/r/memes/hot.json?limit=300`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      
      const memes = data.data.children;
    const meme = memes[currentIndex].data;
    
    const imageUrl = meme.url;
    const thumbnailUrl = meme.thumbnail;

    const imageElement = new Image();
    imageElement.onload = () => {

      memePic.src = imageUrl;
      enableButtons();
    };
    imageElement.onerror = () => {
      memePic.src = thumbnailUrl;
      enableButtons();
    };
    imageElement.src = imageUrl;
      
    const randomNumber = Math.floor(Math.random() * 300);
    currentIndex = (currentIndex + randomNumber) % memes.length; 

    totalLikeButton.textContent = likeCounts[currentIndex] || 0;
    totalDislikeButton.textContent = dislikeCounts[currentIndex] || 0;
      
    enableButtons();
    next.addEventListener('click', resetButtonColors);

    function resetButtonColors() {
      likeButton.style.backgroundColor = ''; // Remove the background color for the like button
      dislikeButton.style.backgroundColor = ''; // Remove the background color for the dislike button
      next.removeEventListener('click', resetButtonColors);
    }

    next.addEventListener('click', muteSounds);

    function muteSounds() {
      if (fetchCount === 11) {
        yayButtonSound.muted = true;
        booButtonSound.muted = true;
        next.removeEventListener('click', muteSounds);
        next.addEventListener('click', unmuteSounds);
      }
    }
  
    function unmuteSounds() {
      if (fetchCount === 11) {
        yayButtonSound.muted = false;
        booButtonSound.muted = false;
        next.removeEventListener('click', unmuteSounds);
        next.addEventListener('click', muteSounds);
      }
    }
    })
    .catch(err => {
      console.log(`error ${err}`);
      memePic.src = "scrubs.gif";
    });
}
////////////////////////////////////////////////////
//Pre-loads these functions on refresh
////////////////////////////////////////////////////
resetImage();
reset.addEventListener('click', function() {
  location.reload(); // Reload the current page
});

////////////////////////////////////////////////////
//Change images and add sound effects based on like/dislike
////////////////////////////////////////////////////
likeButton.addEventListener('click', showThumbsUp);
dislikeButton.addEventListener('click', showThumbsDown);

function showThumbsUp(){
  faceL.src = "thumbsup.png";
  faceR.src = "thumbsup2.png";

  next.addEventListener('click', resetFace)
  reset.addEventListener('click', resetFace)
  function resetFace(){
    faceL.src = "thinkingR.png";
    faceR.src = "thinking.png";
  }
}
//Confetti effect for like button
likeButton.addEventListener('click', start);
function start() {
  setTimeout(function(){
    confetti.start();
  }, 0);
  setTimeout(function(){
    confetti.stop();
  }, 1500);

}
function startEndless() {
  confetti.start();
}
  


//Yay sound effect for like button
likeButton.addEventListener('click', () => {
  const yayButtonSound = document.querySelector('#yayButtonSound');
  yayButtonSound.play();
});

//Thumbs Down image changer
function showThumbsDown(){
  faceL.src = "thumbsdown.png";
  faceR.src = "thumbsdown.png";

  next.addEventListener('click', resetFace)
  reset.addEventListener('click', resetFace)
  function resetFace(){
    faceL.src = "thinkingR.png";
    faceR.src = "thinking.png";
  }
}
likeButton.addEventListener('click', playCheer);
dislikeButton.addEventListener('click', playBoo);
function playCheer(){
  const yayButtonSound = document.querySelector('#yayButtonSound');
  let whichSound = Math.ceil(Math.random() * 130); //105
  if(whichSound <= 15){
    yayButtonSound.src = 'denver.mp3';
    yayButtonSound.playbackRate = 1.2;
    yayButtonSound.volume = 0.3;
  } else if (whichSound <= 30 && whichSound > 15){
    yayButtonSound.src = 'noice.mp3';
    yayButtonSound.playbackRate = 1.5;
  } else if (whichSound <= 45 && whichSound > 30){
    yayButtonSound.src = 'kawhi.mp3';
    yayButtonSound.playbackRate = 1.4;
  } else if (whichSound <= 60 && whichSound > 45){
    yayButtonSound.src = 'kekw.mp3';
    yayButtonSound.playbackRate = 1.7;
  } else if (whichSound <= 85 && whichSound > 60){
    yayButtonSound.src = 'russian.mp3';
    yayButtonSound.playbackRate = 1.6;
  } else if (whichSound <= 100 && whichSound > 85){
    yayButtonSound.src = 'animewow.mp3';
    yayButtonSound.playbackRate = 1.4;
  } else if (whichSound <= 115 && whichSound > 100){
    yayButtonSound.src = 'dababy.mp3';
  }
  
  yayButtonSound.play();
}
function playBoo(){
  const booButtonSound = document.querySelector('#booButtonSound');
  let whichSound = Math.ceil(Math.random() * 130); //105
  if(whichSound <= 15){
    booButtonSound.src = 'sleepy.mp3';
    booButtonSound.playbackRate = 1.2;
    booButtonSound.volume = 0.3;
  } else if (whichSound <= 30 && whichSound > 15){
    booButtonSound.src = 'boom.mp3';
    booButtonSound.playbackRate = 1.5;
  } else if (whichSound <= 45 && whichSound > 30){
    booButtonSound.src = 'bruh.mp3';
    booButtonSound.playbackRate = 1.4;
  } else if (whichSound <= 60 && whichSound > 45){
    booButtonSound.src = 'sideeye.mp3';
    booButtonSound.playbackRate = 1.7;
  } else if (whichSound <= 85 && whichSound > 60){
    booButtonSound.src = 'dontcare.mp3';
    booButtonSound.playbackRate = 1.6;
  } else if (whichSound <= 100 && whichSound > 85){
    booButtonSound.src = 'miami.mp3';
    booButtonSound.playbackRate = 1.4;
  } else if (whichSound <= 115 && whichSound > 100){
    booButtonSound.src = 'thatwascheeks.mp3';
  }
  booButtonSound.play();
}

dislikeButton.addEventListener('click', toggleHiddenImages);
function toggleHiddenImages() {
  const tomatoSplats = document.querySelectorAll('.tomatoes');
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    for (var i = 0; i < tomatoSplats.length; i++) {
      tomatoSplats[i].style.display = 'none';
    }
  } else {
    for (var i = 0; i < tomatoSplats.length; i++) {
      tomatoSplats[i].style.display = 'block';
    }
  }

  likeButton.addEventListener('click', hideTomatoesOnClick)
  reset.addEventListener('click', hideTomatoesOnClick)
  next.addEventListener('click', hideTomatoesOnClick)
  function hideTomatoesOnClick(){
    for (var i = 0; i < tomatoSplats.length; i++) {
      tomatoSplats[i].style.display = 'none';
    }
  }
}







////////////////////////////////////////////////////
//Shows OG image every refresh.
////////////////////////////////////////////////////
function resetImage(callback) {
  includedTags = '';
  document.querySelector('#girlPicture').src = "scrubs.gif";
}









