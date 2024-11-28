from django.contrib import admin
from . import models
from django.utils.html import mark_safe



@admin.register(models.Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "start_date",
        "end_date",
        "created_at",
        "ddescription",
        "images",
    ]

    def ddescription(self, obj):
        return obj.description[:50] + "..."
    
    def images(self, obj):
        images_html = '<div style="display: flex; flex-wrap: wrap; max-width:500px; justify-content:space-evenly;align-item:center;">'
        for image in obj.get_images():
            images_html += f'<img src="{image.image.url}" style="width: 100px; height: 100px; margin-right: 10px; margin-bottom: 10px;">'
        images_html += '</div>'
        return mark_safe(images_html)


@admin.register(models.EventImage)
class EventImageAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Company)
class CompanyAdmin(admin.ModelAdmin):
    pass


@admin.register(models.InternshipOpportunity)
class InternshipOpportunityAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Alumni)
class AlumniAdmin(admin.ModelAdmin):
    list_display = [
        "username",
        "graduation_year",
        "major",
        "current_position",
        "contact_email",
        "current_company",
    ]
    search_fields = [
        "username",
        "graduation_year",
        "major",
        "current_position",
        "contact_email",
        "current_company",
    ]


@admin.register(models.AlumniAchievement)
class AlumniAchievementAdmin(admin.ModelAdmin):
    list_display = ["alumnus", "title", "date"]
