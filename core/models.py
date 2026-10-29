from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    es_premium = models.BooleanField(default=False)
    def __str__(self): return self.username

class CategoriaBlog(models.Model):
    nombre = models.CharField(max_length=50)
    def __str__(self): return self.nombre

class EntrenadorLacroix(models.Model):
    nombre = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    def __str__(self): return self.nombre

class PlanLacroix(models.Model):
    NIVELES = [('INICIO','INICIO'),('POPULAR','MÁS POPULAR'),('PRO','PRO')]
    nombre = models.CharField(max_length=50) # Minimal, Brutal, Avanzado
    precio = models.DecimalField(max_digits=10, decimal_places=2) # 29, 59, 99
    nivel = models.CharField(max_length=10, choices=NIVELES)
    beneficios = models.JSONField(default=list)
    def __str__(self): return f"{self.nombre} - ${self.precio}"

class Post(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    categoria = models.ForeignKey(CategoriaBlog, on_delete=models.CASCADE, related_name='posts')
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    creado = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.titulo

class Comentario(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    texto = models.TextField()
    creado = models.DateTimeField(auto_now_add=True)

class Rutina(models.Model):
    nombre = models.CharField(max_length=100)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='rutinas')
    entrenador = models.ForeignKey(EntrenadorLacroix, on_delete=models.SET_NULL, null=True)
    def __str__(self):
        return self.nombre
class Ejercicio(models.Model):
    nombre = models.CharField(max_length=100)
    musculo = models.CharField(max_length=50)
    def __str__(self): return self.nombre


class RutinaEjercicio(models.Model):
    rutina = models.ForeignKey(Rutina, on_delete=models.CASCADE, related_name='ejercicios_detalle')
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    series = models.IntegerField()
    repeticiones = models.IntegerField()
    def __str__(self): return f"{self.rutina.nombre} - {self.ejercicio.nombre}"

class MetaLacroix(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='metas')
    titulo = models.CharField(max_length=100)
    progreso = models.IntegerField() # 80% para tu dashboard
    tipo = models.CharField(max_length=50)

class ProgresoDiario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='progresos')
    calorias = models.IntegerField()
    pasos = models.IntegerField()
    fecha = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario} - {self.fecha} - {self.pasos} pasos"