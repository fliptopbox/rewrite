import json
import random
from datetime import datetime
from app import db


def guid():
    hex_str = (hex(int(datetime.now().strftime('%Y%m%d%H%M%S%f')))[4:])
    alpha = hex(random.randint(10,15))[2:]
    return "%s%s" % (alpha, hex_str)

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
    body = db.Column(db.Text())
    uuid = db.Column(db.String(16), unique=True, index=True, default=guid)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    modified = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Article {}>'.format(self.body)

class Setting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text())
    modified = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def __repr__(self):
        return '<Setting {}>'.format(self.body)
