from rest_framework import serializers
from .models import Alumni, Company, Event, InternshipOpportunity, EventImage
from django.contrib.auth.models import User


class AlumniRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumni
        fields = [
            "username",
            "first_name",
            "last_name",
            "password",
            "bio",
            "graduation_year",
            "major",
            "current_position",
            "contact_email",
            "profile_image",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "contact_email": {"required": True},
        }

    def create(self, validated_data):
        # Handle password hashing and any extra customization
        password = validated_data.pop("password")
        alumni = Alumni(**validated_data)
        alumni.set_password(password)
        alumni.save()
        return alumni


class AlumniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumni
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "bio",
            "graduation_year",
            "major",
            "current_position",
            "contact_email",
            "profile_image",
        ]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name", "location", "industry", "website", "logo"]


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ["id", "image", "caption"]


class EventSerializer(serializers.ModelSerializer):
    images = EventImageSerializer(many=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "location",
            "start_date",
            "end_date",
            "images",
        ]


class InternshipOpportunitySerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = InternshipOpportunity
        fields = [
            "id",
            "title",
            "description",
            "requirements",
            "location",
            "company",
            "apply_link",
        ]
