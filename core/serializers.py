from rest_framework import serializers
from .models import *

class ComentarioSerializer(serializers.ModelSerializer):
    usuario_username = serializers.ReadOnlyField(source='usuario.username')
    class Meta:
        model = Comentario
        fields = ['id', 'post', 'usuario', 'usuario_username', 'texto', 'creado']
        read_only_fields = ['usuario', 'creado']

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, default='12345678')
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'es_premium', 'is_active', 'is_staff', 'password']

class PostListSerializer(serializers.ModelSerializer):
    comentarios = ComentarioSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['id','titulo','contenido','categoria','autor','creado','comentarios']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['autor', 'creado']

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