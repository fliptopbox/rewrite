import json
import random
from datetime import datetime
from app import db
from .utils import guid



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(128), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    # relationships and back refs
    articles = db.relationship('Article', backref='author', lazy='dynamic')
    settings = db.relationship('Setting', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    uuid = db.Column(db.String(16), unique=True, index=True, default=guid)
    data = db.Column(db.Text())
    meta = db.Column(db.Text())
    status =db.Column(db.Integer(), default=0, index=True)

    created = db.Column(db.DateTime, default=datetime.utcnow)
    modified = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Article {}>'.format(self.data)

class Setting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.JSON())
    modified = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def __repr__(self):
        return '<Setting {}>'.format(self.modified)
