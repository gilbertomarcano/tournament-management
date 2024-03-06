from django.urls import path
from . import views

urlpatterns = [
    path("", views.TournamentView.as_view(), name="tournaments"),
    path("<int:tournament_id>", views.TournamentInstanceView.as_view(), name="tournaments"),
    path("<int:tournament_id>/teams", views.TeamView.as_view(), name='team'),
    path("<int:tournament_id>/matches", views.MatchView.as_view(), name='matches')

]