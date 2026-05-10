from django.contrib import admin
from django.urls import path
from detection import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('start/', views.start_camera), 
    path('stop/', views.stop_camera),

    path('register/', views.register),
    path('login/', views.login),

    path('status/', views.get_status),

    path('video_feed/', views.video_feed),


    path('report/', views.download_report),
    path('history/', views.history_data),
    path('user-stats/<int:user_id>/', views.user_stats),
    path('session-details/<int:session_id>/', views.session_details),
    path('session-report/<int:session_id>/', views.user_session_report),
]
