from django.contrib import admin
from .models import *

@admin.register(PlanLacroix)
class PlanAdmin(admin.ModelAdmin):
    list_filter = ['nivel']
    search_fields = ['nombre']
    ordering = ['precio']
    list_display = ['nombre', 'precio', 'nivel']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_filter = ['categoria']
    search_fields = ['titulo']
    ordering = ['-creado']
    list_display = ['titulo', 'categoria', 'autor']
    exclude = ('autor',) # oculta autor

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.autor = request.user
        super().save_model(request, obj, form, change)

@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'usuario']
    exclude = ('usuario',) # oculta usuario como en tu foto

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.usuario = request.user
        super().save_model(request, obj, form, change)

@admin.register(ProgresoDiario)
class ProgresoDiarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'fecha']
    exclude = ('usuario',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.usuario = request.user
        super().save_model(request, obj, form, change)

# Los que no necesitan arreglo los dejamos juntos
admin.site.register([Usuario, CategoriaBlog, EntrenadorLacroix, Rutina, Ejercicio, RutinaEjercicio, MetaLacroix])