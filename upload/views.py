from .models import Observations
#from . features import AudioVisualizer

# Create your views here.from myarts.models import Article
from upload.owner import OwnerListView, OwnerDetailView, OwnerCreateView, OwnerUpdateView, OwnerDeleteView

from django import forms



class ObservCreateForm(forms.ModelForm):
    new_bird_species = forms.CharField(max_length=20, required=False, label='New Bird Species')

    class Meta:
        model = Observations
        fields = ['bird','new_bird_species',  'comment', 'audio_file', 'country', 'audio_quality']

class ObservListView(OwnerListView):
    model = Observations
    # By convention:
    # template_name = "upload/observations_list.html"



class ObservDetailView(OwnerDetailView):
    model = Observations

class ObservCreateView(OwnerCreateView):
    model = Observations
    form_class = ObservCreateForm


class ObservUpdateView(OwnerUpdateView):
    model = Observations
    fields = ['bird', 'comment', 'audio_file']
    # This would make more sense
    # fields_exclude = ['owner', 'created_at', 'updated_at']


class ObservDeleteView(OwnerDeleteView):
    model = Observations
