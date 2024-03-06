from django.db import models

class TournamentStatus(models.TextChoices):
    DRAFT = 'draft'
    OPEN = 'open'
    CLOSED = 'closed'


class GroupLabel(models.TextChoices):
    A = 'A'
    B = 'B'
    C = 'C'
    D = 'D'


class MatchType(models.TextChoices):
    GROUPS = 'groups'
    QUARTERS = 'quarters'
    SEMIFINALS = 'semifinals'
    FINAL = 'final'


# Create your models here.
class Tournament(models.Model):
    name = models.CharField(max_length=128, unique=True)
    team_size = models.IntegerField()
    group_size = models.IntegerField(default=4)
    status = models.CharField(choices=TournamentStatus.choices, max_length=40)
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True)
    closed_at = models.DateTimeField(null=True)


class Group(models.Model):
    label = models.CharField(choices=GroupLabel.choices, max_length=1)
    tournament = models.ForeignKey(to=Tournament, on_delete=models.CASCADE)
    

class Team(models.Model):
    logo = models.URLField(null=True)
    name = models.CharField(max_length=128)
    group = models.ForeignKey(to=Group, on_delete=models.CASCADE)


class Match(models.Model):
    type = models.CharField(choices=MatchType.choices, max_length=16)
    local_team = models.ForeignKey(to=Team, on_delete=models.CASCADE, related_name='local_match_set')
    away_team = models.ForeignKey(to=Team, on_delete=models.CASCADE, related_name='away_match_set')
    local_goals = models.PositiveSmallIntegerField(null=True)
    away_goals = models.PositiveSmallIntegerField(null=True)

