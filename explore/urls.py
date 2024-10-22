from django.urls import path, reverse_lazy
from . import views

app_name='explore'
urlpatterns = [
    path('', views.all_observations, name='all'),

    path('<int:pk>', views.DetailView.as_view(), name='observations_detail'),
    path('generate_samples/', views.generate_samples, name='generate_samples'),


]

