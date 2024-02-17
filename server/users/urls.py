from django.urls import path
from . import views

urlpatterns = [
    path("", views.UserListView.as_view(), name="user_list"),
    path("me", views.UserMeView.as_view(), name='user_me'),
    path("<user_id>", views.UserView.as_view(), name='user'),
]