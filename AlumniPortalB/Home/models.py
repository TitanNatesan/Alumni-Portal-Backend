from django.db import models
from django.contrib.auth.models import User


# Event Models
class Event(models.Model):
    title = models.CharField(max_length=255)
    start_date = models.DateTimeField(auto_now=False, auto_now_add=False,help_text="Format: YYYY-MM-DD HH:MM:SS")
    end_date = models.DateTimeField(auto_now=False, auto_now_add=False,help_text="Format: YYYY-MM-DD HH:MM:SS")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.TextField()

    def __str__(self):
        return self.title
    
    def get_images(self):
        return self.images.all()


class EventImage(models.Model):
    event = models.ForeignKey(Event, related_name="images", on_delete=models.CASCADE)
    image = models.FileField(upload_to="event_images/")
    caption = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Image for {self.event.title}"


# Internship Models
class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    logo = models.FileField(upload_to="company_logos/", blank=True, null=True)
    location = models.TextField()
    industry = models.CharField(max_length=200)
    website = models.URLField(max_length=200)

    def __str__(self):
        return self.name


class InternshipOpportunity(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255)
    company = models.ForeignKey(Company, related_name="internships", on_delete=models.CASCADE)
    posted_date = models.DateField()
    apply_link = models.URLField()

    def __str__(self):
        return f"{self.title} at {self.company.name}"


# Alumni Models
class Alumni(User):
    profile_image = models.FileField(upload_to="alumni_images/")
    bio = models.TextField()
    graduation_year = models.CharField(max_length=4)
    major = models.CharField(max_length=255)
    current_position = models.CharField(max_length=255)
    current_company = models.ForeignKey(Company, related_name="alumni", on_delete=models.SET_NULL, null=True)
    contact_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = 'Alumni'
        verbose_name_plural = 'Alumni'


class AlumniAchievement(models.Model):
    alumnus = models.ForeignKey(Alumni, related_name="achievements", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()

    def __str__(self):
        return f"{self.title} - {self.alumnus.username}"
