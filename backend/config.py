import os

basedir = os.path.abspath(os.path.dirname(__file__))
database_name = "db/rewriting_sqlite.db"

class Config(object):

    API_BASE_URI = "/api/v1.0"
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'kilroy-was-here---again'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, database_name)
    SQLALCHEMY_TRACK_MODIFICATIONS = False


