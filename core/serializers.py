from rest_framework import serializers
from .models import *

class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'
        read_only_fields = ['usuario', 'fecha']  # <-- AGREGA ESTO 
        # Con read_only_fields ya no aparece para elegir en Swagger, no lo podés cargar manual.

class PostListSerializer(serializers.ModelSerializer):
    comentarios = ComentarioSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['id','titulo','contenido','categoria','autor','creado','comentarios']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = '__all__'

class RutinaEjercicioSerializer(serializers.ModelSerializer):
    ejercicio = EjercicioSerializer(read_only=True)
    class Meta:
        model = RutinaEjercicio
        fields = ['ejercicio','series','repeticiones']

class RutinaListSerializer(serializers.ModelSerializer):
    ejercicios_detalle = RutinaEjercicioSerializer(many=True, read_only=True)
    class Meta:
        model = Rutina
        fields = ['id','nombre','usuario','entrenador','ejercicios_detalle']

class RutinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rutina
        fields = '__all__'

class PlanLacroixSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanLacroix
        fields = '__all__'

class MetaLacroixSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetaLacroix
        fields = '__all__'

class ProgresoDiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgresoDiario
        fields = '__all__'

class CategoriaBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaBlog
        fields = '__all__'