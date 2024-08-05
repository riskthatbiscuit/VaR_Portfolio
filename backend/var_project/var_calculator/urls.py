from django.urls import path
from .views import CalculateVaR

urlpatterns = [
    path('calculate_var/', CalculateVaR.as_view(), name='calculate_var'),
]
