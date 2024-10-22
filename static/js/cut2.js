document.addEventListener('DOMContentLoaded', function() {

const audio = document.getElementById('audio');
const image = document.getElementById('image');
const widthSelect = document.getElementById('width-select'); // Assuming your select element has an ID 'width-select'
const samplebtn = document.getElementById('sample-btn');
let cropWidth = 224; // Default value
const melCheckbox = document.getElementById('melCheckbox');

const melChecked = melCheckbox.checked ? 'true' : '';

let cropper = null;

function initializeCropper() {
    cropper = new Cropper(image, {
        aspectRatio: NaN,
        viewMode: 2,
        autoCropArea: 1,
        cropBoxResizable: false,
        cropBoxMovable: false,
        dragMode: 'none',
        modal: false,
        guides: false,
        center: false,
        background: false,
        zoomable: false,
        zoomOnTouch: false,
        zoomOnWheel: false ,
        cropBoxResizable: false,
        ready: function () {
            // Automatically trigger cropping and download when the cropper is ready

        }
    });
}
function updateCroppingData() {
    const xPosition = audio.currentTime * 224; // 244 or 224?
    cropper.setData({
        x: xPosition,
        y: 0,
        width: cropWidth,
        height: cropWidth // Assuming height should also be dynamic



    });
}
function handleCropButtonClick() {
    // Get the selected width from the <select> element
    cropWidth = parseInt(widthSelect.value); // Assuming values in the select are integers

    // Update cropping data
    const xPosition = audio.currentTime * 224; // 244 or 224?
    cropper.setData({
        x: xPosition,
        y: 0,
        width: cropWidth,
        height: cropWidth // Assuming height should also be dynamic
    });

    // Get cropped canvas
    let canvas = cropper.getCroppedCanvas({
        width: cropWidth,
        height: cropWidth // Assuming height should also be dynamic
    });

    if (cropWidth === 448) {
        // Compress the canvas width to 224
        const compressedCanvas = document.createElement('canvas');
        compressedCanvas.width = 224;
        compressedCanvas.height = 224;

        const ctx = compressedCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, 224, 224);

        // Use the compressed canvas for further processing
        canvas = compressedCanvas;
    }


    // Trigger download without displaying the canvas or any view boxes
    canvas.toBlob(blob => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        const sample_time = Number((audio.currentTime).toFixed(3));
        downloadLink.download = `Mel_${species.value}_${ob_id.value}_${sample_time}s.png`;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    }, 'image/png');
}

/*
audio.addEventListener('timeupdate', () => {
    //updateCroppingData();
});
*/

widthSelect.addEventListener('change', () => {
    updateCroppingData();
});

samplebtn.addEventListener('click', () => {
    if(melCheckbox.checked){
        handleCropButtonClick();
    }
    });

// Call initializeCropper() when the image is loaded
image.onload = () => {
    initializeCropper();
    updateCroppingData();
};


});
