# Routes package initialization
from .auth import auth_bp
from .dojo import dojo_bp
from .bookings import bookings_bp
from .news import news_bp
from .students import students_bp

__all__ = ['auth_bp', 'dojo_bp', 'bookings_bp', 'news_bp', 'students_bp']
