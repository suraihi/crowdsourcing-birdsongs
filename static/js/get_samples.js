document.addEventListener('DOMContentLoaded', function() {
    const samplebtn = document.getElementById('sample-btn');
    const audio_Id = document.getElementById('ob_id');
    const audioId = audio_Id.value;
    const loadingText = 'Generating...';



    const species = document.getElementById('species').value;

    function generateMFCCAndSpectrogram(audioId) {
        const audio = document.getElementById('audio');
        const mfccCheckbox = document.getElementById('mfccCheckbox');
        const spectrogramCheckbox = document.getElementById('spectrogramCheckbox');
        const audioCheckbox = document.getElementById('audioCheckbox');
        const widthselect = document.getElementById('width-select');
        const sample_duration = widthselect.value / 224;
        const mfccChecked = mfccCheckbox.checked ? 'true' : '';
        const spectrogramChecked = spectrogramCheckbox.checked ? 'true' : '';
        const audioChecked = audioCheckbox.checked ? 'true' : '';

        const melCheckbox = document.getElementById('melCheckbox');
        const melChecked = melCheckbox.checked ? 'true' : '';


        const sample_time = Number((audio.currentTime).toFixed(3));
        if (mfccChecked || spectrogramChecked || audioChecked) {

                    // Disable button and change style
        samplebtn.disabled = true;
        samplebtn.textContent = loadingText;
        samplebtn.classList.add('loading');




            fetch(`/explore/generate_samples/?audio_id=${audioId}&start_time=${sample_time}&duration=${sample_duration}&mfcc=${mfccChecked}&spectrogram=${spectrogramChecked}&audio=${audioChecked}`, {
                    method: 'GET',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.mfcc_data) {
                        downloadData(data.mfcc_data, `mfcc_${species}_${audioId}_${sample_time}.png`);
                    }
                    if (data.spectrogram_data) {
                        downloadData(data.spectrogram_data, `spectrogram_${species}_${audioId}_${sample_time}.png`);
                    }
                    if (data.audio_data) {
                        downloadAudio(data.audio_data, data.sample_rate, `audio_${species}_${audioId}_${sample_time}.wav`);
                    } else {
                        console.error('Error: MFCC or spectrogram data missing in the response');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    // Enable button and revert style after fetching
                    samplebtn.disabled = false;
                    samplebtn.textContent = 'Generate Sample';
                    samplebtn.classList.remove('loading');
                });
        }
else { if (!melChecked){alert('please select type of sample. MFCC, Audio,..');}}

    }
function downloadData(data, fileName) {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function downloadAudio(data, sampleRate, fileName) {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'audio/wav' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}



samplebtn.addEventListener('click', function() {

    generateMFCCAndSpectrogram(audioId);
});


});
