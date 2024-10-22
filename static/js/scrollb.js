document.addEventListener('DOMContentLoaded', function() {
    const spectrogramContainer = document.getElementById('spectrogram-container');
    const cursor = document.getElementById('cursor');
    const cursor2 = document.getElementById('cursor2');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const audio = document.getElementById('audio');
    const analogScrollContainer = document.getElementById('analogScrollContainer');
    const scrollHandle = document.getElementById('scrollHandle');
    const scrollCont = document.getElementById('frame');
    const toggleScrollButton = document.getElementById('toggleScrollButton');
    const widthSelect = document.getElementById('width-select');


    // Update the cursor's width based on the user's choice
    cursor2.style.width = widthSelect.value + 'px';

    let isPlaying = false;
    let isScrolling = false;
    let isAutoScrolling = true; // Variable to control auto-scrolling
    let isUserScrolling =false;
    let cursorPosition = 0;
    let scrollTimer;





    audio.onloadeddata = function() {
        console.log('audio time:', audio.currentTime);

        // Play audio and update cursor position
        updateCursorPosition();
        audio.addEventListener('timeupdate', function() {
            // Calculate the new position of the scroll handle based on audio current time
            const audioDuration = audio.duration;
            const HandleWidth = analogScrollContainer.clientWidth;
            const newPosition = (audio.currentTime / audioDuration) * HandleWidth;

            // Set scroll handle position
            scrollHandle.style.left = newPosition + 'px';
        });


        // Event listener for mouse down on the scroll handle
        scrollHandle.addEventListener('mousedown', function(event) {
            isScrolling = true;

            // Calculate initial mouse position relative to the scroll handle
            const offsetX = event.clientX - scrollHandle.getBoundingClientRect().left;

            // Event listener for mouse move
            function handleMouseMove(event) {
                if (isScrolling) {
                    // Calculate new position of the scroll handle based on mouse position
                    const newX = event.clientX - offsetX - analogScrollContainer.getBoundingClientRect().left;
                    const maxWidth = analogScrollContainer.clientWidth - scrollHandle.clientWidth;
                    const newPosition = Math.max(0, Math.min(maxWidth, newX));

                    // Calculate corresponding audio time based on scroll handle position
                    const audioDuration = audio.duration;
                    const HandleWidth = analogScrollContainer.clientWidth - 73;
                    const audioCurrentTime = (newPosition / HandleWidth) * audioDuration;

                    // Set audio current time and scroll handle position
                                        requestAnimationFrame(() => {
                    audio.currentTime = audioCurrentTime;
                    scrollHandle.style.left = newPosition + 'px';
                });
                }
            }

            // Event listener for mouse up
            function handleMouseUp() {
                isScrolling = false;

                // Remove the event listeners for mouse move and mouse up
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }

            // Add event listeners for mouse move and mouse up
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });


         // Event listener for touch start on the scroll handle
    scrollHandle.addEventListener('touchstart', function(event) {
        event.preventDefault(); // Prevent default touch start behavior
        isScrolling = true;

        // Calculate initial touch position relative to the scroll handle
        const touch = event.touches[0];
        const offsetX = touch.clientX - scrollHandle.getBoundingClientRect().left;

        // Event listener for touch move
        function handleTouchMove(event) {
            event.preventDefault(); // Prevent default touch move behavior

            if (isScrolling) {
                // Calculate new position of the scroll handle based on touch position
                const touch = event.touches[0];
                const newX = touch.clientX - offsetX - analogScrollContainer.getBoundingClientRect().left;
                const maxWidth = analogScrollContainer.clientWidth - scrollHandle.clientWidth;
                const newPosition = Math.max(0, Math.min(maxWidth, newX));

                // Calculate corresponding audio time based on scroll handle position
                const audioDuration = audio.duration;
                const HandleWidth = analogScrollContainer.clientWidth - 73;
                const audioCurrentTime = (newPosition / HandleWidth) * audioDuration;

                // Set audio current time and scroll handle position
                audio.currentTime = audioCurrentTime;
                scrollHandle.style.left = newPosition + 'px';
            }
        }

        // Event listener for touch end
        function handleTouchEnd(event) {
            event.preventDefault(); // Prevent default touch end behavior
            isScrolling = false;

            // Remove the event listeners for touch move and touch end
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        }

        // Add event listeners for touch move and touch end
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    });


        // Update cursor position and scroll handle position based on audio time
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


});
