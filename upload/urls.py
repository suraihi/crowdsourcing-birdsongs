from django.urls import path, reverse_lazy
from . import views

app_name='upload'
urlpatterns = [
    path('', views.ObservListView.as_view(), name='all'),
    
    path('<int:pk>', views.ObservDetailView.as_view(), name='observations_detail'),
    
    path('upload', 
        views.ObservCreateView.as_view(success_url=reverse_lazy('upload:all')), name='observations_create'),
        
    path('<int:pk>/update', 
        views.ObservUpdateView.as_view(success_url=reverse_lazy('upload:all')), name='observations_update'),
        
    path('<int:pk>/delete', 
        views.ObservDeleteView.as_view(success_url=reverse_lazy('upload:all')), name='observations_delete'),
]

# We use reverse_lazy in urls.py to delay looking up the view until all the paths are defined
