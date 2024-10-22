document.addEventListener('DOMContentLoaded', function() {

const audio = document.getElementById('audio');
const image = document.getElementById('image');
const widthSelect = document.getElementById('width-select'); // Assuming your select element has an ID 'width-select'
const cropButton = document.getElementById('crop-btn');
let cropWidth = 224; // Default value

let cropper = null;

function initializeCropper() {
    cropper = new Cropper(image, {
        aspectRatio: NaN,
        viewMode: 2,
        autoCropArea: 1,
        cropBoxResizable: false,
        cropBoxMovable: false,
        dragMode: 'none',
        ready: function () {
            // Automatically trigger cropping and download when the cropper is ready

        }
    });
        console.log('initializing CroppingData...... cropper= ');
    console.log(cropper);
}
function updateCroppingData() {
    const xPosition = audio.currentTime * 224; // 244 or 224?
    cropper.setData({
        x: xPosition,
        y: 0,
        width: cropWidth,
        height: cropWidth // Assuming height should also be dynamic
    });

    console.log('updateCroppingData...... cropper= ');
    console.log(cropper);

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

    console.log('inside updateCroppingData...... cropper= ');
    console.log(cropper);
    // Get cropped canvas
    let canvas = cropper.getCroppedCanvas({
        width: cropWidth,
        height: cropWidth // Assuming height should also be dynamic
    });
        console.log('cropped canvas canvas= ');
    console.log(canvas);

    if (cropWidth === 448) {
        // Compress the canvas width to 224
        const compressedCanvas = document.createElement('canvas');
        compressedCanvas.width = 224;
        compressedCanvas.height = 224;

        const ctx = compressedCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, 224, 224);
        console.log('compressed canvas ctx= ');
    console.log(ctx);
        // Use the compressed canvas for further processing
        canvas = compressedCanvas;
    }
const samplet = cropWidth/224;
        console.log(' canvas canvas= ');
    console.log(canvas);
    // Trigger download without displaying the canvas or any view boxes
    canvas.toBlob(blob => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${species.value}_${ob_id.value}_${(audio.currentTime).toFixed(2)}-${samplet.toFixed(2)}s.png`;
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

cropButton.addEventListener('click', () => {
    initializeCropper();
        handleCropButtonClick();
    });

// Call initializeCropper() when the image is loaded
image.onload = () => {
console.log('image is loaded');
    //updateCroppingData();
};



});
