from rest_framework import serializers
from .models import Interview, Questions, Domain, Answers

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

class AnswerSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Questions.objects.all())
    interview = serializers.PrimaryKeyRelatedField(
        queryset=Interview.objects.all(), required=False, allow_null=True
    )
    answer_text = serializers.CharField(required=False, allow_blank=True)
    audio_path = serializers.FileField(required=False)

    class Meta:
        model = Answers
        fields = ['question', 'interview', 'answer_text', 'audio_path']

    def create(self, validated_data):
        return Answers.objects.create(**validated_data)

