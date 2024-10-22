document.addEventListener('DOMContentLoaded', function() {
    const spectrogramContainer = document.getElementById('spectrogram-container');
    const cursor = document.getElementById('cursor');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const audio = document.getElementById('audio');
    const analogScrollContainer = document.getElementById('analogScrollContainer');
    const scrollHandle = document.getElementById('scrollHandle');
    const scrollCont = document.getElementById('frame');
    const toggleScrollButton = document.getElementById('toggleScrollButton');
    const widthSelect = document.getElementById('width-select');

    const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };



    // Update the cursor's width based on the user's choice
    cursor2.style.width = widthSelect.value + 'px';

    let isPlaying = false;
    let isScrolling = false;
    let isAutoScrolling = true; // Variable to control auto-scrolling
    let isUserScrolling =false;
    let cursorPosition = 0;
    let scrollTimer;


    updateCursorPosition();
// Set scroll handle position
    audio.addEventListener('timeupdate', function() {
        // Calculate the new position of the scroll handle based on audio current time
        const audioDuration = audio.duration;
        const HandleWidth = analogScrollContainer.clientWidth;
        const newPosition = (audio.currentTime / audioDuration) * HandleWidth;

        // Set scroll handle position
        scrollHandle.style.left = newPosition + 'px';
    });

    audio.onloadeddata = function() {
        console.log('audio time:', audio.currentTime);

        // Play audio and update cursor position



scrollHandle.addEventListener('mousedown', handleMouseDown);

function handleMouseDown(event) {
    isScrolling = true;
    const offsetX = event.pageX - scrollHandle.getBoundingClientRect().left;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    function handleMouseMove(event) {
        if (isScrolling) {
            const newX = event.pageX - offsetX - analogScrollContainer.getBoundingClientRect().left;
            const maxWidth = analogScrollContainer.clientWidth - scrollHandle.clientWidth;
            const newPosition = Math.max(0, Math.min(maxWidth, newX));

            const audioDuration = audio.duration;
            const handleWidth = analogScrollContainer.clientWidth;
            const audioCurrentTime = (newPosition / handleWidth) * audioDuration;

            requestAnimationFrame(() => {
                audio.currentTime = audioCurrentTime;
                scrollHandle.style.left = newPosition + 'px';
            });
        }
    }

    function handleMouseUp() {
        isScrolling = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}




        // Update cursor position and scroll handle position based on audio time


    };


    scrollCont.addEventListener('scroll', function(event) {
        const scrollLeft = event.target.scrollLeft;

        // Set audio current time and scroll handle position
        if(isUserScrolling){
        const x =isPlaying
        audio.pause();

        if(audio.currentTime<1)
        audio.currentTime =(audio.duration)* (scrollLeft/spectrogramContainer.clientWidth)  ;
        else{audio.currentTime =(audio.duration)* (scrollLeft/spectrogramContainer.clientWidth) +0.67}
        console.log('Scroll Left:', scrollLeft);
        console.log('audio time:', audio.currentTime);
        console.log('width:', audio.currentTime);
        if(x){
            setTimeout(function() {
                audio.play();
            }, 1000); // 2000 milliseconds = 2 seconds
        }
        }




    });

        // Detect manual scrolling by the user
        spectrogramContainer.addEventListener('wheel', function(event) {
            // Set the user scrolling flag to true
            isUserScrolling = true;
            console.log('user scrolling');

            // Clear the previous timeout and set a new one
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                // Set the user scrolling flag to false when the scrolling stops
                isUserScrolling = false;
                console.log('user stopped scrolling');
            }, 200); // Adjust the timeout duration as needed (in milliseconds)
        });



    toggleScrollButton.addEventListener('click', function() {
        // Toggle the auto-scrolling variable
        isAutoScrolling = !isAutoScrolling;
    });

     // Scroll audio forward
     scrollForwardButton.addEventListener('click', function() {
        audio.currentTime += 5; // Scroll forward by 5 seconds (adjust as needed)
    });

    // Scroll audio backward
    scrollBackwardButton.addEventListener('click', function() {
        audio.currentTime -= 5; // Scroll backward by 5 seconds (adjust as needed)
    });



    playButton.addEventListener('click', function() {
        isPlaying = !isPlaying;
        if (isPlaying){audio.play();}
        else {audio.pause()}
    });


        // Update cursor position and scroll handle position when audio is playing
    audio.addEventListener('play', function() {
        isPlaying = true;

    });

    // Update cursor position and scroll handle position when audio is paused
    audio.addEventListener('pause', function() {
        isPlaying = false;
    });



    widthSelect.addEventListener('change', function() {
        // Get the selected cursor width from the dropdown menu
        const selectedWidth = widthSelect.value;
        // Update the cursor's width based on the user's choice
        cursor2.style.width = selectedWidth + 'px';
    });




            function updateCursorPosition() {
            const audioDuration = audio.duration;
            const containerWidth = spectrogramContainer.clientWidth ;
            const actualWidth = containerWidth ;
            cursorPosition = (audio.currentTime / audioDuration) * actualWidth ;

            cursor.style.left = cursorPosition + 'px';



            if (isAutoScrolling) {
                if(!isUserScrolling){

                    scrollCont.scrollLeft = cursorPosition-150;

                }

            }
                requestAnimationFrame(updateCursorPosition);
             }


});
