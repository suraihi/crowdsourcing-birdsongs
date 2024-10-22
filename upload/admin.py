from django.contrib import admin
from upload.models import Birds, Observations, Spectrogram_files

# Register your models here.

admin.site.register(Birds)
admin.site.register(Observations)
admin.site.register(Spectrogram_files)

