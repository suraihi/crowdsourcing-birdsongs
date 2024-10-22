from django.core.validators import FileExtensionValidator, RegexValidator
from django.db import models
import os
from django.conf import settings
from django_countries.fields import CountryField


from django.core.exceptions import ValidationError
import librosa

class AudioValidator:
    def __init__(self, max_size, max_duration=120):  # 10 * 1024 * 1024 =10 MB, adjust as needed
        self.max_size = max_size
        self.max_duration = max_duration

    def __call__(self, audio_file):
        try:
            audio, _ = librosa.load(audio_file, mono=True)
            duration_in_seconds = librosa.get_duration(y=audio)
        except Exception as e:
            raise ValidationError("Unable to read audio file.")

        error_messages = []

        if duration_in_seconds > self.max_duration:
            error_messages.append(f"[[Audio duration should be less than {self.max_duration} seconds. Yours was {round(duration_in_seconds, 2)}s.]]")

        if audio_file.size > self.max_size:
            error_messages.append(f"[[File size should be less than {self.max_size/1048576} MB. Yours was {round(audio_file.size/1048576, 2)} MB.]]")

        if audio.ndim > 1:  # Check if audio has more than one dimension (i.e., not mono)
            error_messages.append("Audio should be in mono format.")

        if error_messages:
            raise ValidationError("\n".join(error_messages))




class Birds(models.Model):
    species = models.CharField(max_length=20)
    def __str__(self):
        return self.species


class Observations(models.Model):
    AUDIO_QUALITY_CHOICES = [
        (1, 'Good quality recorder and clear sound of bird'),
        (2, 'Average quality recorder and acceptable sound of bird'),
        (3, 'Bad recording device and hard to hear the sound of bird'),
    ]


    owner= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bird = models.ForeignKey(Birds, on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to="media/audio", validators=[FileExtensionValidator(allowed_extensions=['mp3', 'wav']) , AudioValidator(max_size = 5*1024*1024,max_duration=120) ], help_text='Mono | less than 2 minuets | lower then 5MB')
    comment = models.CharField(max_length=200, help_text='Tell us About Your Observation')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    country = CountryField(blank=True, null=True, help_text='Where the Audio was Recorded')
    audio_duration = models.FloatField(blank=True, null=True, help_text='Duration of the audio in seconds')
    audio_quality = models.IntegerField(choices=AUDIO_QUALITY_CHOICES, null=True)#, RegexValidator(regex=r'^[a-zA-Z0-9_-]+$', message='Enter a valid filename.')]

    def __str__(self):
        obs = str(self.owner)+'_' + str(self.bird.species)+'_'+str(self.id)
        return obs

class Spectrogram_files(models.Model):
    observations = models.ForeignKey(Observations, on_delete=models.CASCADE)
    spectrogram_file = models.FileField(upload_to='media/spectrogram')

