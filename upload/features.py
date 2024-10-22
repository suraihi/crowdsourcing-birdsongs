


import matplotlib.pyplot as plt
import librosa
import numpy as np


from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
import soundfile as sf



class AudioVisualizer:
    def __init__(self, audio_file):
        self.audio_file = audio_file
        self.y, self.sr = sf.read(self.audio_file)

    def get_audio_duration(self):
        self.audio_duration = len(self.y) / self.sr
        return self.audio_duration


    def generate_and_save_spectrogram(self):
        # Extract clip and sample rate
        #audio = AudioSegment.from_file(self.audio_file)
        #print(librosa.__version__)
        #y, sr = librosa.load(self.audio_file, sr=None)
        # Generate spectrogram
        S = librosa.feature.melspectrogram(y=self.y, sr=self.sr,n_fft=2048, n_mels=256,hop_length=128, fmax=8000)
        # Plot the spectrogram
        fig_height = 1  # Set the desired height of the figure (in inches)
        fig_width = len(self.y)/self.sr  # Set the desired width of the figure (in inches)

        fig, ax = plt.subplots(figsize=(fig_width, fig_height))
        ax = fig.add_axes([0., 0., 1., 1.])
        ax.axis('off')
        S_dB = librosa.power_to_db(S, ref=np.max)
        img = librosa.display.specshow(S_dB, x_axis='off', y_axis='off', sr=self.sr, fmax=8000, ax=ax)

        # Save the spectrogram plot as a PNG image
        buffer = BytesIO()
        plt.savefig(buffer, format='jpg', dpi=224, bbox_inches=None)
        buffer.seek(0)
        plt.close()
        spectrogram_path = '/home/suraihi/Desktop/myaudioapp/media/555555.jpg'
        spectrogram_file = InMemoryUploadedFile(buffer, None, spectrogram_path, 'image/jpg', buffer.tell(), None)
        return spectrogram_file
