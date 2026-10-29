from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .serializers import *

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    filterset_fields = ['categoria']
    search_fields = ['titulo']
    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostSerializer

    def create(self, request, *args, **kwargs):
        return 

class RutinaViewSet(viewsets.ModelViewSet):
    queryset = Rutina.objects.all()
    filterset_fields = ['usuario']
    search_fields = ['nombre']
    def get_serializer_class(self):
        if self.action == 'list':
            return RutinaListSerializer
        return RutinaSerializer

    @action(detail=True, methods=['post'])
    def duplicar(self, request, pk=None):
        rutina = self.get_object()
        nueva = Rutina.objects.create(nombre=f"{rutina.nombre} (copia)", usuario=rutina.usuario, entrenador=rutina.entrenador)
        return Response({'status': f'Rutina Lacroix {nueva.id} duplicada'})

class PlanLacroixViewSet(viewsets.ModelViewSet):
    queryset = PlanLacroix.objects.all()
    serializer_class = PlanLacroixSerializer
    filterset_fields = ['nivel']
    search_fields = ['nombre']
    ordering_fields = ['precio']

    @action(detail=True, methods=['post'])
    def inscribirse(self, request, pk=None):
        plan = self.get_object()
        return Response({'message': f'Inscripto a {plan.nombre} por ${plan.precio}'})

class MetaLacroixViewSet(viewsets.ModelViewSet):
    queryset = MetaLacroix.objects.all()
    serializer_class = MetaLacroixSerializer
    
    @action(detail=False, methods=['get'])
    def resumen_mensual(self, request):
        # Esto alimenta tu Foto 3 - Dashboard
        data = {'objetivos_completados': 12, 'calorias': 2450, 'pasos': 10200, 'racha': 7}
        return Response(data)

class CategoriaBlogViewSet(viewsets.ModelViewSet):
    queryset = CategoriaBlog.objects.all()
    serializer_class = CategoriaBlogSerializer

class ProgresoDiarioViewSet(viewsets.ModelViewSet):
    queryset = ProgresoDiario.objects.all()
    serializer_class = ProgresoDiarioSerializer