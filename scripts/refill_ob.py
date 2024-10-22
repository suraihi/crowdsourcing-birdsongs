import os
import librosa
from django.conf import settings
from upload.models import Observations

def update_observations():
    observations = Observations.objects.all()

    # Specify the absolute path to the directory where audio files are stored
    audio_directory = '/home/suraihi200/media/audio'

    for observation in observations:
        if observation.audio_file:

            audio_filename = os.path.basename(observation.audio_file.name)
            audio_path = os.path.join(audio_directory, audio_filename)
            print(audio_path)
            try:
                # Load audio file and calculate duration using librosa
                audio, sr = librosa.load(audio_path, sr=None)
                duration = librosa.get_duration(y=audio, sr=sr)
                print(duration)

                # Update fields if conditions match

                print("updatind")
                observation.audio_duration = duration
                observation.audio_quality = 2  # Set audio quality to 2
                observation.country = 'MY'  # Set country to 'MY' (Malaysia)

                observation.save()  # Save the changes

            except Exception as e:
                print(f"Error processing {audio_path}: {e}")

update_observations()
