
import librosa
import librosa.display
import matplotlib.pyplot as plt
import os
import numpy as np  # Import NumPy
import soundfile as sf









class AudioProcessor:
    def __init__(self, audio_file_path, start_time, duration):
        self.start_time = start_time
        self.duration= duration
        self.audio_file_path = str(audio_file_path)
        self.y, self.sr = librosa.load(self.audio_file_path, offset=self.start_time, duration=self.duration, sr=None)

    def generate_mfcc(self):
        mfccs = librosa.feature.mfcc(y=self.y, sr=self.sr, n_mfcc=13, fmax=8000)

        plt.figure(figsize=(2.24, 2.24))
        img = librosa.display.specshow(mfccs, x_axis='time', sr=self.sr, hop_length=512)
        plt.axis('off')  # Hide axis labels
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0)  # Remove padding

        mfcc_path = f'mfcc_{os.path.basename(self.audio_file_path)}_{self.start_time}.png'
        plt.savefig(mfcc_path, dpi=100, bbox_inches=None, pad_inches=0)
        plt.close()

        with open(mfcc_path, 'rb') as f:
            data = f.read()

        os.remove(mfcc_path)  # Delete the file after reading its content

        return data

    def generate_spectrogram(self):
        plt.figure(figsize=(2.24, 2.24)) # Adjust the size as needed
        librosa.display.specshow(librosa.amplitude_to_db(librosa.stft(self.y), ref=np.max), y_axis='linear')
        plt.axis('off')  # Hide axis labels
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0)  # Remove padding

        spectrogram_path = f'spectrogram_{os.path.basename(self.audio_file_path)}.png'
        plt.savefig(spectrogram_path, dpi=100, bbox_inches=None, pad_inches=0)
        plt.close()

        with open(spectrogram_path, 'rb') as f:
            data = f.read()

        os.remove(spectrogram_path)  # Delete the file after reading its content

        return data

    def trim_audio(self):
        trimmed_audio = self.y  # Trimming the audio to one second
        temp_audio_path = f'trimmed_audio_{os.path.basename(self.audio_file_path)}_{self.start_time}.wav'

        sf.write(temp_audio_path, trimmed_audio, self.sr, 'PCM_24')

        with open(temp_audio_path, 'rb') as f:
            data = f.read()

        os.remove(temp_audio_path)  # Delete the file after reading its content

        return data