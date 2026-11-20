from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser
from .models import *
from .serializers import *


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('id')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        password = self.request.data.get('password', '12345678')
        user = serializer.save()
        user.set_password(password)
        user.save()


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        if not user:
            user = Usuario.objects.filter(is_superuser=True).first() or Usuario.objects.first()

        categoria = serializer.validated_data.get('categoria')
        if not categoria:
            categoria = CategoriaBlog.objects.first()

        serializer.save(autor=user, categoria=categoria)


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all().order_by('-id')
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class CategoriaBlogViewSet(viewsets.ModelViewSet):
    queryset = CategoriaBlog.objects.all()
    serializer_class = CategoriaBlogSerializer


class PlanLacroixViewSet(viewsets.ModelViewSet):
    queryset = PlanLacroix.objects.all()
    serializer_class = PlanLacroixSerializer


class MetaLacroixViewSet(viewsets.ModelViewSet):
    queryset = MetaLacroix.objects.all()
    serializer_class = MetaLacroixSerializer


class ProgresoDiarioViewSet(viewsets.ModelViewSet):
    queryset = ProgresoDiario.objects.all()
    serializer_class = ProgresoDiarioSerializer


class RutinaViewSet(viewsets.ModelViewSet):
    queryset = Rutina.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return RutinaListSerializer
        return RutinaSerializer


class RegistroAlumnoView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroAlumnoSerializer
    permission_classes = [AllowAny]