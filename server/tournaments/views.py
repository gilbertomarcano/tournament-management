import json
import random

from django.http import JsonResponse
from django.views import View
from django.db.models import CharField, IntegerField, Count, Sum, F, Case, When, Value, Q
from django.db.models.functions import Coalesce
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from tournaments.models import GroupLabel, Team, Tournament, TournamentStatus, Group, Match, MatchType
from utils.mixins import ErrorMixin
from utils.serializers import ModelSerializer
from utils.validators import FieldValidator
from django.core.exceptions import ValidationError

# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class TournamentInstanceView(ErrorMixin, View):
    def get(self, request, tournament_id):
        tournament = Tournament.objects.filter(id=tournament_id)
        tournament = tournament.first()
        
        serialized_data = ModelSerializer().serialize(tournament)
        serialized_data['fields']['enrolled_team_size'] = tournament.group_set.aggregate(total_teams_count=Count('team'))['total_teams_count'] or 0
        return JsonResponse(serialized_data, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class TournamentView(ErrorMixin, View):
    def get(self, request):
        tournaments = Tournament.objects.order_by('-id')
        serialized_data = ModelSerializer().serialize(tournaments)
        return JsonResponse({'data': serialized_data}, status=200)
    
    def post(self, request):
        # Example: Extract username and password from request.POST
        data = json.loads(request.body or '{}')
        validator = FieldValidator(
            name=CharField(),
            team_size=IntegerField()
        )
        validated_data = validator.validate(data)

        tournament = Tournament.objects.create(
            name=validated_data['name'],
            team_size=validated_data['team_size'],
            group_size=len(GroupLabel.__members__),
            status=TournamentStatus.DRAFT
        )

        for label in GroupLabel.__members__:
            Group.objects.create(
                label=label,
                tournament=tournament
            )
        serialized_data = ModelSerializer().serialize(tournament)
        return JsonResponse(serialized_data, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class TeamView(ErrorMixin, View):
    def get(self, request, tournament_id):
        tournament = Tournament.objects.get(id=tournament_id)
        group = request.GET.get('group')
        order_by = request.GET.get('order_by', '-id')

        teams = Team.objects.filter(group__tournament=tournament)
        if group:
            teams = teams.filter(group__label=group)

        POINTS_FOR_WIN = 3
        POINTS_FOR_DRAW = 1

        teams = teams.annotate(
            local_goals=Coalesce(Sum('local_match_set__local_goals', filter=Q(local_match_set__local_team=F('id')) & Q(local_match_set__type='groups')), 0),
            local_goals_conceded=Coalesce(Sum('local_match_set__away_goals', filter=Q(local_match_set__local_team=F('id')) & Q(local_match_set__type='groups')), 0),
            away_goals=Coalesce(Sum('away_match_set__away_goals', filter=Q(away_match_set__away_team=F('id')) & Q(away_match_set__type='groups')), 0),
            away_goals_conceded=Coalesce(Sum('away_match_set__local_goals', filter=Q(away_match_set__away_team=F('id')) & Q(away_match_set__type='groups')), 0),
            local_wins=Coalesce(Sum(Case(When(Q(local_match_set__local_goals__gt=F('local_match_set__away_goals')) & Q(local_match_set__type='groups'), then=Value(1)), default=Value(0), output_field=IntegerField())), 0),
            away_wins=Coalesce(Sum(Case(When(Q(away_match_set__away_goals__gt=F('away_match_set__local_goals')) & Q(away_match_set__type='groups'), then=Value(1)), default=Value(0), output_field=IntegerField())), 0),
            local_losses=Coalesce(Sum(Case(When(Q(local_match_set__local_goals__lt=F('local_match_set__away_goals')) & Q(local_match_set__type='groups'), then=Value(1)), default=Value(0), output_field=IntegerField())), 0),
            away_losses=Coalesce(Sum(Case(When(Q(away_match_set__away_goals__lt=F('away_match_set__local_goals')) & Q(away_match_set__type='groups'), then=Value(1)), default=Value(0), output_field=IntegerField())), 0),
            local_draws=Coalesce(Sum(Case(When(Q(local_match_set__local_goals=F('local_match_set__away_goals')) & Q(local_match_set__type='groups'), then=Value(1)), default=Value(0), output_field=IntegerField())), 0),
            away_draws=Coalesce(Sum(Case(When(Q(away_match_set__away_goals=F('away_match_set__local_goals')) & Q(away_match_set__type='groups'), then=Value(1)), default=Value(0), output_field=IntegerField())), 0),
        ).annotate(
            points=(F('local_wins') + F('away_wins')) * POINTS_FOR_WIN + (F('local_draws') + F('away_draws')) * POINTS_FOR_DRAW,
            goals=F('local_goals') + F('away_goals'),
            goals_conceded=F('local_goals_conceded') + F('away_goals_conceded'),
            goals_difference=F('goals') - F('goals_conceded'),
            wins=F('local_wins') + F('away_wins'),
            losses=F('local_losses') + F('away_losses'),
            draws=F('local_draws') + F('away_draws'),
        ).order_by(order_by)

        serialized_data = []
        preserialized_data = ModelSerializer().serialize(teams)
        for item in preserialized_data:
            item['fields']['local_goals'] = teams.get(id=item['pk']).local_goals
            item['fields']['local_goals_conceded'] = teams.get(id=item['pk']).local_goals_conceded
            item['fields']['local_wins'] = teams.get(id=item['pk']).local_wins
            item['fields']['local_losses'] = teams.get(id=item['pk']).local_losses
            item['fields']['local_draws'] = teams.get(id=item['pk']).local_draws
            item['fields']['away_goals'] = teams.get(id=item['pk']).away_goals
            item['fields']['away_goals_conceded'] = teams.get(id=item['pk']).away_goals_conceded
            item['fields']['away_wins'] = teams.get(id=item['pk']).away_wins
            item['fields']['away_losses'] = teams.get(id=item['pk']).away_losses
            item['fields']['away_draws'] = teams.get(id=item['pk']).away_draws
            item['fields']['goals'] = teams.get(id=item['pk']).goals
            item['fields']['goals_conceded'] = teams.get(id=item['pk']).goals_conceded
            item['fields']['goals_difference'] = teams.get(id=item['pk']).goals_difference
            item['fields']['wins'] = teams.get(id=item['pk']).wins
            item['fields']['losses'] = teams.get(id=item['pk']).losses
            item['fields']['draws'] = teams.get(id=item['pk']).draws
            item['fields']['points'] = teams.get(id=item['pk']).points
            serialized_data.append(item)
        return JsonResponse({'count': len(serialized_data), 'data': serialized_data}, status=200)

    def post(self, request, tournament_id):
        tournament = Tournament.objects.get(id=tournament_id)
        data = json.loads(request.body or '{}')
        validator = FieldValidator(
            name=CharField()
        )
        validated_data = validator.validate(data)

        if tournament.status != TournamentStatus.DRAFT:
            raise ValidationError({'tournament': 'Tournament is not enrolling teams anymore'})
        group_with_fewest_teams = tournament.group_set.annotate(team_count=Count('team')).order_by('team_count').first()

        team = Team.objects.create(
            name=validated_data['name'],
            group=group_with_fewest_teams
        )
        enrolled_team_size = tournament.group_set.aggregate(total_teams_count=Count('team'))['total_teams_count'] or 0
        if enrolled_team_size == tournament.team_size:
            Tournament.objects.filter(id=tournament_id).update(status=TournamentStatus.OPEN, started_at=timezone.now())
        serialized_data = ModelSerializer().serialize(team)
        return JsonResponse(serialized_data, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class MatchView(ErrorMixin, View):
    def post(self, request, tournament_id):
        tournament = Tournament.objects.get(id=tournament_id)
        data = json.loads(request.body or '{}')
        validator = FieldValidator(
            simulate=CharField(),
        )
        validated_data = validator.validate(data)

        if validated_data['simulate'] == 'groups':
            groups = Group.objects.filter(tournament=tournament)
            for group in groups:
                teams = list(Team.objects.filter(group=group))
                # This will store the simulation results
                simulation_results = []

                # Generate matches for simulation (e.g., round-robin)
                for i in range(len(teams)):
                    for j in range(i+1, len(teams)):
                        home_team = teams[i]
                        away_team = teams[j]
                        match_result = self.simulate_match(home_team, away_team)
                        # Create and save the match object
                        Match.objects.create(
                            type=MatchType.GROUPS,
                            local_team=home_team,
                            away_team=away_team,
                            local_goals=match_result['local_goals'],
                            away_goals=match_result['away_goals']
                        )
                        simulation_results.append(match_result)
            Tournament.objects.filter(id=tournament.id).update(status=TournamentStatus.CLOSED, closed_at=timezone.now())

        return JsonResponse({'status': 'Simulation complete'}, status=200)

    def simulate_match(self, home_team, away_team):
        # Simulate the goals for each team
        home_goals = random.randint(0, 5)  # Assuming a max of 5 goals per game for simulation
        away_goals = random.randint(0, 5)

        # Record the match and its outcome based on goals
        match_data = {
            'home_team': home_team.name,
            'away_team': away_team.name,
            'local_goals': home_goals,
            'away_goals': away_goals,
            'result': 'Draw' if home_goals == away_goals else 'Home Win' if home_goals > away_goals else 'Away Win'
        }
        return match_data