from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from . import utils, urls, serializers,models

# Public Endpoint to List Available Routes
@api_view(["GET"])
@permission_classes([AllowAny])
def index(request):
    ip = str(utils.get_ip_address())
    cont = {}
    for i, pattern in enumerate(urls.urlpatterns):
        name = str(pattern.name).ljust(50).rjust(21, " ")
        cont[name] = f"http://{ip}:8000/{pattern.pattern._route}"
    cont['Admin Login'.ljust(50).rjust(21, " ")] = "http://localhost:8000/admin/"
    return Response({"cont": cont})

# Registration View for Alumni (Creates a new Alumni and Token)
class AlumniRegistrationView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = serializers.AlumniRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        alumni = serializer.save()

        # Create or retrieve token for the new alumni
        token, created = Token.objects.get_or_create(user=alumni)
        
        return Response({
            'message': 'Alumni successfully registered',
            'data': serializer.data,
            'token': token.key,
        }, status=status.HTTP_201_CREATED)

# Login View (Obtains Token for Authenticated User)
class LoginView(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def home(request):
    try:
        alumni = request.user.alumni  # Access the related Alumni instance
        cont = {
            'user': serializers.AlumniSerializer(alumni).data,
            'events': serializers.EventSerializer(models.Event.objects.all(), many=True).data,
            'internships': serializers.InternshipOpportunitySerializer(
                models.InternshipOpportunity.objects.all(), many=True
            ).data,
            'new_users': serializers.AlumniSerializer(
                models.Alumni.objects.all().order_by('-date_joined')[:5], many=True
            ).data,
        }
        return Response(cont)
    except models.Alumni.DoesNotExist:
        return Response({"error": "Alumni profile not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([AllowAny])
def auth(request):
    if request.user.is_authenticated:
        return Response({"message": "Authenticated"})
    else:
        return Response({"message": "Not Authenticated"})