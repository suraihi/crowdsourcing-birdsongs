
from django.views.generic import CreateView, UpdateView, DeleteView, ListView, DetailView

from django.contrib.auth.mixins import LoginRequiredMixin

from upload.models import Spectrogram_files, Birds, Observations
from .generators import AudioProcessor

from django.core.paginator import Paginator
from django.shortcuts import render
from django.db.models import Q
import base64
from django.http import JsonResponse, HttpResponse
from django_countries.data import COUNTRIES

def all_observations(request):

    observations_list = Observations.objects.all()
    birds = Birds.objects.all()
    countries = COUNTRIES
    countries = [(code, name) for code, name in COUNTRIES.items() if name != 'Israel']
    # Filtering by species (assuming this part remains unchanged)
    species_filter = request.GET.get('species')
    country_filter = request.GET.get('country')
    if species_filter:
        observations_list = observations_list.filter(bird__species=species_filter)
    if country_filter:
        observations_list = observations_list.filter(country=country_filter)

    # Sorting by different fields
    sort_by = request.GET.get('sort_by')
    sort_order = request.GET.get('sort_order')

    if sort_by == 'audio_duration':
        order = 'audio_duration'
        if sort_order == 'desc':
            order = '-audio_duration'
        observations_list = observations_list.order_by(order)
    elif sort_by == 'uploaded_at':
        order = 'uploaded_at'
        if sort_order == 'desc':
            order = '-uploaded_at'
        observations_list = observations_list.order_by(order)
    elif sort_by == 'audio_quality':
        order = 'audio_quality'
        if sort_order == 'desc':
            order = '-audio_quality'
        observations_list = observations_list.order_by(order)

    paginator = Paginator(observations_list, per_page=20)
    page = request.GET.get('page')
    observations = paginator.get_page(page)

    context = {
        'observations': observations,
        'countries': countries,
        'species_filter': species_filter,
        'sort_by': sort_by,
        'sort_order': sort_order,
        'birds' : birds,
    }
    return render(request, "explore/observations_list.html", context)



class ListView(ListView):
    model = Observations
    template_name = "explore/observations_list.html"

    context_object_name = 'observations_list'
    paginate_by = 10  # Number of observations per page

    def get_queryset(self):
        # Modify this queryset to limit the number of observations as per your requirement
        queryset = Observations.objects.all()
        return queryset


class DetailView(DetailView):
    model = Observations
    template_name = "explore/observations_detail.html"

# Create your views here.



def generate_samples(request):
    if request.method == 'POST':
        audio_id = request.POST.get('audio_id')
        start_time = float(request.POST.get('start_time'))

    elif request.method == 'GET':
        audio_id = request.GET.get('audio_id')
        start_time = float(request.GET.get('start_time'))
        duration = float(request.GET.get('duration'))
        # Get selected options (MFCC, spectrogram, audio)
        mfcc_requested = request.GET.get('mfcc')
        spectrogram_requested = request.GET.get('spectrogram')
        audio_requested = request.GET.get('audio')

    else:
        return JsonResponse({'error': 'Invalid request method'})

    audio_file_path = Observations.objects.get(pk=audio_id).audio_file
    processor = AudioProcessor(audio_file_path, start_time, duration)
    response_data = {}
    if mfcc_requested:
        mfcc_data = processor.generate_mfcc()
        mfcc_base64 = base64.b64encode(mfcc_data).decode('utf-8')
        response_data['mfcc_data'] = mfcc_base64

    if spectrogram_requested:
        spectrogram_data = processor.generate_spectrogram()
        spectrogram_base64 = base64.b64encode(spectrogram_data).decode('utf-8')
        response_data['spectrogram_data'] = spectrogram_base64


    if audio_requested:
        audio_data = processor.trim_audio()
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')
        response_data['audio_data'] = audio_base64
        response_data['sample_rate'] = processor.sr


    return JsonResponse(response_data)
