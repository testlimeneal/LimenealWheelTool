"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 3.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

import os, environ
from pathlib import Path

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

print(BASE_DIR)
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY', default='insecure-S#perS3crEt_007')

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = False

# try:
#     # expects 1 or 0
#     DEBUG = int(os.environ.get("DEBUG", default=0))
# except:
#     DEBUG = False

DEBUG = True


STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = (
    "C:\\LimenealWheelTool\\api-server-django\\build\\static",
)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR,'media')


# DEBUG = False
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'static')

ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS", default="*").split(" ")

# Application definition

INSTALLED_APPS = [
    # "jet",
    "django.contrib.admin",
    # 'admin_reorder',
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    # "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "api",
    "api.assessment",
    "api.user",
    "api.authentication",
    "api.superadmin",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
       #  'admin_reorder.middleware.ModelAdminReorder',
]

# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR,'build')],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE"  : env("DB_ENGINE"  , default="django.db.backends.sqlite3"),
        "NAME"    : env("DB_DATABASE", default="db_dev.sqlite3"),
        "USER"    : env("DB_USER"    , default=None),
        "PASSWORD": env("DB_PASSWORD", default=None),
        "HOST"    : env("DB_HOST"    , default=None),
        "PORT"    : env("DB_PORT"    , default=None),
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

# PROJECT_ROOT = os.path.normpath(os.path.dirname(__file__))

# STATIC_ROOT = '//'
# STATIC_URL = "/static/"
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# STATIC_ROOT=os.path.join(BASE_DIR, "staticfiles")

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Custom user Model
AUTH_USER_MODEL = "api_user.User"

# ##################################################################### #
# ################### REST FRAMEWORK             ###################### #
# ##################################################################### #

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "api.authentication.backends.ActiveSessionAuthentication",
    ),
    "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
}

# ##################################################################### #
#  CORS 
# ##################################################################### #

# CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOW_ALL_ORIGINS=False

# Load the default ones
CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]

# Leaded from Environment
CORS_ALLOWED_ORIGINS_ENV = env("CORS_ALLOWED_ORIGINS", default=None)

if CORS_ALLOWED_ORIGINS_ENV:
    CORS_ALLOWED_ORIGINS += CORS_ALLOWED_ORIGINS_ENV.split(' ')


# ##################################################################### #
#  TESTING 
# ##################################################################### #

TESTING = False
TEST_RUNNER = "core.test_runner.CoreTestRunner"


# ADMIN_REORDER = (
#     {'app': 'assessment','label': 'Level1','models': ('assessment.Quiz',)},
# )
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
