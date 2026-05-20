# from django.db import models

# # class InterviewSession(models.Model):
# #     user = models.ForeignKey("UserRegister", on_delete=models.CASCADE)
# #     start_time = models.DateTimeField(auto_now_add=True)
# #     end_time = models.DateTimeField(null=True, blank=True)

# #     def __str__(self):
# #         return f"Session {self.id} - {self.user.email}"
# class InterviewSession(models.Model):

#     user = models.ForeignKey(
#         UserRegister,
#         on_delete=models.CASCADE
#     )

#     start_time = models.DateTimeField(
#         auto_now_add=True
#     )

#     end_time = models.DateTimeField(
#         null=True,
#         blank=True
#     )

#     # Question report data
#     total_questions = models.IntegerField(
#         default=0
#     )

#     attended_questions = models.IntegerField(
#         default=0
#     )

#     rejected_questions = models.IntegerField(
#         default=0
#     )

#     success_percentage = models.FloatField(
#         default=0
#     )

#     avg_score = models.FloatField(
#         default=0
#     )

#     verdict = models.CharField(
#         max_length=50,
#         default="Pending"
#     )

#     def __str__(self):
#         return f"{self.user.username} - {self.start_time}"

# class DetectionLog(models.Model):
#     session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE)
#     timestamp = models.DateTimeField(auto_now_add=True)

#     face_count = models.IntegerField()
#     behavior = models.CharField(max_length=100)
#     lip_status = models.CharField(max_length=50)

#     score = models.FloatField()
#     final_status = models.CharField(max_length=50)

#     def __str__(self):
#         return f"{self.timestamp} - {self.final_status}"

# # class UserRegister(models.Model):
# #     name = models.CharField(max_length=100)
# #     email = models.EmailField(unique=True)
# #     password = models.CharField(max_length=255)

# #     def __str__(self):
# #         return self.email
    
# class UserRegister(models.Model):
#     username = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=100)

#     ROLE_CHOICES = (
#         ('admin', 'Admin'),
#         ('user', 'User'),
#     )

#     role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
from django.db import models


# ===============================
# USER MODEL
# ===============================

class UserRegister(models.Model):

    username = models.CharField(
        max_length=100
    )

    email = models.EmailField(
        unique=True
    )

    password = models.CharField(
        max_length=100
    )

    role = models.CharField(
        max_length=20,
        default="user"
    )

    def __str__(self):
        return self.username


# ===============================
# INTERVIEW SESSION
# ===============================

class InterviewSession(models.Model):

    user = models.ForeignKey(
        UserRegister,
        on_delete=models.CASCADE
    )

    start_time = models.DateTimeField(
        auto_now_add=True
    )

    end_time = models.DateTimeField(
        null=True,
        blank=True
    )

    total_questions = models.IntegerField(
        default=0
    )

    attended_questions = models.IntegerField(
        default=0
    )

    rejected_questions = models.IntegerField(
        default=0
    )

    success_percentage = models.FloatField(
        default=0
    )

    avg_score = models.FloatField(
        default=0
    )

    verdict = models.CharField(
        max_length=50,
        default="Pending"
    )

    def __str__(self):
        return f"{self.user.username} - {self.start_time}"


# ===============================
# DETECTION LOG
# ===============================

class DetectionLog(models.Model):

    session = models.ForeignKey(
        InterviewSession,
        on_delete=models.CASCADE
    )

    timestamp = models.DateTimeField(
        auto_now_add=True
    )

    face_count = models.IntegerField(
        default=0
    )

    behavior = models.CharField(
        max_length=100,
        default="Normal"
    )

    lip_status = models.CharField(
        max_length=100,
        default="Normal"
    )

    score = models.FloatField(
        default=0
    )

    final_status = models.CharField(
        max_length=100,
        default="Normal"
    )

    def __str__(self):
        return f"{self.session.id} - {self.final_status}"