q = [
    {
        0: "What is RESTful API and how does it work?"
    },
    {
        1: "Explain the difference between HTML, CSS, and JavaScript."
    },
    {
        2: "Explain the concept of middleware in backend development."
    },
]

q2={'domain': 'SD', 'user': 4, 'questions': [{'0': 'What is RESTful API and how does it work?'}, {'1': 'Explain the difference between HTML, CSS, and JavaScript.'}, {'2': 'Explain the concept of middleware in backend development.'}, {'3': 'What is authentication, and how is it implemented in backend development?'}, {'4': 'What is the DOM in web development?'}]}

def create(validated_data):
        questions_data = validated_data.pop('questions')
        # interview = Interview.objects.create(**validated_data)
        
        for question_data in questions_data:
            # Questions.objects.create(interview=interview, **question_data)
            print(question_data)
        
        # return interview


  