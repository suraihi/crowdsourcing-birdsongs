import os
import librosa
from django.conf import settings
from upload.models import Observations

def update_observations():
    observations = Observations.objects.all()

    for observation in observations:
        if observation.audio_file:
            audio_path = os.path.join(settings.MEDIA_ROOT, str(observation.audio_file))

            try:
                # Load audio file and calculate duration using librosa
                audio, sr = librosa.load(audio_path, sr=None)
                duration = librosa.get_duration(y=audio, sr=sr)

                # Update fields if conditions match
                if (
                    observation.audio_quality is None
                    and observation.country is None
                    and duration > 0  # Check if duration is valid
                ):
                    observation.audio_duration = duration
                    observation.audio_quality = 2  # Set audio quality to 2
                    observation.country = 'MY'  # Set country to 'MY' (Malaysia)

                    observation.save()  # Save the changes

            except Exception as e:
                print(f"Error processing {audio_path}: {e}")

update_observations()
