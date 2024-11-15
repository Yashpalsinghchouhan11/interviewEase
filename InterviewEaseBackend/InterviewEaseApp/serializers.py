from rest_framework import serializers
from .models import Interview, Questions, Domain

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = ['question_text']


class InterviewSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    domain = serializers.SlugRelatedField(
        slug_field='domain',  # Refers to the `domain` choice code
        queryset=Domain.objects.all()
    )

    class Meta:
        model = Interview
        fields = ['user', 'domain', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        interview = Interview.objects.create(**validated_data)
        
        for question_data in questions_data:
            Questions.objects.create(interview=interview, **question_data)
        
        return interview

