
from django.views.generic import CreateView, UpdateView, DeleteView, ListView, DetailView

from django.contrib.auth.mixins import LoginRequiredMixin
from . features import AudioVisualizer
from . models import Spectrogram_files, Birds, Observations

import psutil
import time
import csv
import os



class OwnerListView(LoginRequiredMixin, ListView):
    """
    Sub-class the ListView to pass the request to the form.
    """


class OwnerDetailView(DetailView):
    """
    Sub-class the DetailView to pass the request to the form.
    """


class OwnerCreateView(LoginRequiredMixin, CreateView):
    """
    Sub-class of the CreateView to automatically pass the Request to the Form
    and add the owner to the saved object.
    """
    def get_form(self, form_class=None):
        print("111111111111111111111111111111")
        previous_time = time.time()

        self.previous_time = profiling(1, previous_time)
        return super().get_form(form_class)


    # Saves the form instance, sets the current object for the view, and redirects to get_success_url().
    def form_valid(self, form):

        self.previous_time = profiling(2, self.previous_time)

        print('form_valid called')
        object = form.save(commit=False)
        bird= form.cleaned_data.get('bird')
        new_bird = form.cleaned_data.get('new_bird_species')

        print(bird)
        if str(bird) =='other':
            if new_bird:
                # If a new bird species is provided, create a new Birds object
                bird = Birds.objects.get_or_create(species=new_bird)

        else:
            # If an existing bird species is selected, use it
            bird = form.cleaned_data.get('bird')
        form.instance.bird = bird


        object.owner = self.request.user
        self.audio_file = self.request.FILES.get('audio_file')
        print(self.audio_file)
        object.save()

        self.object = object

        self.previous_time = profiling(3, self.previous_time)

        self.gns_spectrogram()
        previous_time = profiling(4, self.previous_time)
        update_csv(custom_data)




        # Continue with the rest of your form_valid logic
        return super(OwnerCreateView, self).form_valid(form)



        return super(OwnerCreateView, self).form_valid(form)

    def gns_spectrogram(self):
        #k = self.audio_file
        #k = self.object.audio_file
        k = Observations.objects.get(pk = self.object.pk)

        kk= k.audio_file
        f = AudioVisualizer(kk)
        self.object.audio_duration = f.get_audio_duration()
        self.object.save()
        custom_data['Column1'].append(kk)
        custom_data['Column2'].append(self.object.audio_duration)
        custom_data['Column3'].append(os.path.getsize(self.object.audio_file.path))


        s_f = f.generate_and_save_spectrogram()
        if self.object:
            a = Spectrogram_files(observations=self.object, spectrogram_file=s_f)
            a.save()
            print("should be saved")
        else:
            print("Observations object is not available. Cannot create Spectrogram_files object.")


class OwnerUpdateView(LoginRequiredMixin, UpdateView):
    """
    Sub-class the UpdateView to pass the request to the form and limit the
    queryset to the requesting user.
    """

    def get_queryset(self):
        print('update get_queryset called')
        """ Limit a User to only modifying their own data. """
        qs = super(OwnerUpdateView, self).get_queryset()
        return qs.filter(owner=self.request.user)


class OwnerDeleteView(LoginRequiredMixin, DeleteView):
    """
    Sub-class the DeleteView to restrict a User from deleting other
    user's data.
    """

    def get_queryset(self):
        print('delete get_queryset called')
        qs = super(OwnerDeleteView, self).get_queryset()
        return qs.filter(owner=self.request.user)


def profiling(i,previous_time):
    j = i*3
    duration = time.time() - previous_time
    custom_data[f'Column{j+1}'].append(duration)
    custom_data[f'Column{j+2}'].append(psutil.cpu_percent())
    custom_data[f'Column{j+3}'].append(psutil.virtual_memory().percent)
    previous_time = time.time()
    return previous_time

custom_data = {
    'Column1': [],
    'Column2': [],
    'Column3': [],
    'Column4': [],
    'Column5': [],
    'Column6': [],
    'Column7': [],
    'Column8': [],
    'Column9': [],
    'Column10': [],
    'Column11': [],
    'Column12': [],
    'Column13': [],
    'Column14': [],
    'Column15': [],

}

def update_csv(custom_data):
    with open("profiling.csv", 'a', newline='') as file:
            csv_writer = csv.DictWriter(file, fieldnames=custom_data.keys())

            # Check if the file is empty and write headers if necessary
            if file.tell() == 0:
                csv_writer.writeheader()

            # Write the new row
            csv_writer.writerow({key: value[-1] for key, value in custom_data.items()})
# References

# https://docs.djangoproject.com/en/4.2/ref/class-based-views/mixins-editing/#django.views.generic.edit.ModelFormMixin.form_valid

# https://stackoverflow.com/questions/862522/django-populate-user-id-when-saving-a-model

# https://stackoverflow.com/a/15540149

# https://stackoverflow.com/questions/5531258/example-of-django-class-based-deleteview
