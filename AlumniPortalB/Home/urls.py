from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register/", views.AlumniRegistrationView.as_view(), name="alumni-register"),
    path("login/", views.LoginView.as_view(), name="alumni-login"),
    path("home/", views.home, name="home"),
    path("auth/", views.auth, name="Auth"),
]
