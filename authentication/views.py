import json

from django.contrib.auth import authenticate, login, logout

from rest_framework import permissions, viewsets, views, status
from rest_framework.response import Response

from rest_framework_jwt.views import ObtainJSONWebToken
#from rest_framework_jwt.utils import jwt_response_payload_handler

from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer

def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'username': user.username
    }


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)

class LoginJWTView(ObtainJSONWebToken):
    def post(self, request):
        print request.DATA['email']
        #user = Account.objects.get(email=request.DATA.email)
        print Account.objects.filter(email=request.DATA['email'])
        if Account.objects.filter(email=request.DATA['email']).exists():
            serializer = self.serializer_class(data=request.DATA)
            #print serializer

            if serializer.is_valid():
                #user = serializer.object.get('user') or request.user
                #print user
                login(request, user)
                token = serializer.object.get('token')
                #print token
                response_data = jwt_response_payload_handler(token, user, request)
                #print response_data

                return Response(response_data)

            print serializer.errors
            return Response({
                'status': 'Clave invalida',
                'message': 'Introduzca la clave correcta.'
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'status': 'Usuario no registrado',
                'message': 'Elige un nombre de usuario valido.'
            }, status=status.HTTP_404_NOT_FOUND)


class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)
        print data
        email = data.get('email', None)
        password = data.get('password', None)

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Sin autorizacion',
                    'message': 'Esta cuenta fue deshabilitada'
                }, status=status.HTTP_401_UNATHORIZED)
        else:
            return Response({
                'status': 'Sin autorizacion',
                'message': 'Combinacion de usuario/clave invalida.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data,
                            status=status.HTTP_201_CREATED)
        return Response({
            'status': 'Bad Request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
