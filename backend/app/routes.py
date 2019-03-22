import json
import time

from flask import render_template, jsonify, abort, make_response, request, url_for
from flask_cors import CORS
from app import app, db
from app.models import User, Article, Setting
from datetime import datetime

# CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app)

API_URI = app.config['API_BASE_URI']
STATUS = app.config['ARTICLE_STATUS']

UI_SETTINGS = {
    "width":50,
    "current": None,
    "modifiers":{
        "collapsed":True,
        "strikethrough":True,
        "typewriter":False,
        "markdown":False,
        "dark":False
    },
    "values":{
        "fontsize":20
    }
}

@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify({"error": "Bad request"}), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({"error": "Not found"}), 404)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("%s/users" % API_URI, methods=['GET'])
def get_users():
    all = User.query.all()
    users = []
    for user in all:
        users.append(user.username)

    return jsonify({ 'users': users }), 201

@app.route("%s/articles/<username>" % API_URI, methods=['GET'])
def get_all_articles(username):
    user = User.query.filter_by(username=username).first_or_404()
    all = Article.query.filter_by(user_id=user.id)
    articles = []
    for article in all:
        articles.append({
            "uuid": article.uuid,
            "username": username,
            "meta": article.meta,
            "status": STATUS[article.status],
            "created": int(article.created.timestamp() * 1000),
            "modified": int(article.modified.timestamp() * 1000),
        })

    return jsonify({ 'articles': articles }), 201

@app.route("%s/article/<uuid>" % API_URI, methods=['GET'])
def get_article(uuid):
    a = Article.query.filter_by(uuid=uuid).first_or_404()
    u = User.query.filter_by(id=a.user_id).first()

    meta = {} if not a.meta else a.meta
    article = {
        "data": a.data,
        "meta": meta
    }

    # augment the metadata with fixed values
    article["meta"]["created"] = int(a.created.timestamp() * 1000)
    article["meta"]["modified"] = int(a.modified.timestamp() * 1000)
    article["meta"]["uuid"] = a.uuid
    article["meta"]["username"] = u.username

    return jsonify(article), 201

@app.route("%s/article/<username>" % API_URI, methods=['POST'])
@app.route("%s/article/<username>/<uuid>" % API_URI, methods=['POST'])
def create_article(username, uuid = None):
    user = User.query.filter_by(username=username).first_or_404()
    if not request.json or not 'data' in request.json:
        abort(400)

    payload = request.get_json()

    data=payload['data']
    meta=payload['meta']


    if uuid:
        # is this an insert or update?
        article = Article.query.filter_by(uuid=uuid, user_id=user.id)
        count = article.count();


        if count > 1:
            abort(404)



        if count == 1:
            article = article.first()
            article.data = data
            article.meta = meta
            article.modified = datetime.utcnow()
            db.session.commit()


            print("\n\n\narticle update", count, user.id, user.username, uuid, data, meta, "\n\n\n")
            return jsonify({'article update': uuid, "username": username, "meta": meta}), 201


        # update (using existing UUID)
        article = Article(author=user, uuid=uuid, data=data, meta=meta)

    else:
        article = Article(author=user, data=data, meta=meta)

    db.session.add(article)
    db.session.commit()
    return jsonify({'article created': True}), 201


@app.route("%s/article/<uuid>" % API_URI, methods=['DELETE'])
def delete_article(uuid):
    if not uuid:
        abort(404)

    a = Article.query.filter_by(uuid=uuid).first_or_404()
    uuid = a.uuid;

    db.session.delete(a)
    db.session.commit()

    return jsonify({'article deleted': uuid}), 201


@app.route("%s/article/<uuid>" % API_URI, methods=['PUT'])
def update_article(uuid):
    if not uuid:
        abort(404)

    if not request.json:
        abort(400)

    article = Article.query.filter_by(uuid=uuid).first_or_404()
    user = User.query.filter_by(id=article.user_id).first_or_404()

    data = article.data
    meta = article.meta

    if "data" in request.json:
        data=request.json["data"]

    if "meta" in request.json:
        meta=request.json["meta"]

    modified=datetime.utcnow()


    article.data = data
    article.meta = meta
    article.modified = modified

    db.session.commit()
    return jsonify({'article updated': True}), 201


@app.route("%s/user/<username>" % API_URI, methods=['GET'])
def get_user(username):
    '''get catenated assets that belong to user @username'''
    user = User.query.filter_by(username=username).first_or_404()
    articles = Article.query.filter_by(user_id=user.id, status=0)
    settings = Setting.query.filter_by(user_id=user.id)


    if settings.count() == 0:
        settings = UI_SETTINGS
    else:
        settings = settings[0].data

    payload = { "settings": settings }

    for article in articles:

        created=int(time.mktime(article.created.timetuple()))
        modified=int(time.mktime(article.modified.timetuple()))
        data = article.data
        meta = article.meta

        payload[article.uuid] = {
            "data": data,
            "meta": meta,
            "created": created,
            "modified": modified,
            "uuid": article.uuid,
        }

    return jsonify(payload)


@app.route("%s/user" % API_URI, methods=['POST'])
def create_user():
    if not request.json or not 'username' in request.json or not 'email' in request.json:
        abort(400)

    username = request.json['username']
    email = request.json["email"]

    u = User.query.filter(User.username==username).count()
    e = User.query.filter(User.email==email).count()

    if u > 0 or e > 0:
        abort(400)

    new_user = User(
            username=username,
            email=email
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'user created': True}), 201


@app.route("%s/user/<username>" % API_URI, methods=['PUT'])
def update_user(username):
    u = User.query.filter_by(username=username).first_or_404()
    if not request.json:
        abort(400)
    if not 'email' in request.json:
        abort(400)

    u.email = request.json['email']
    db.session.add(u)
    db.session.commit()

    return jsonify({'user updated': u.email}), 201


@app.route("%s/user/<username>" % API_URI, methods=['DELETE'])
def delete_user(username):
    u = User.query.filter_by(username=username).first_or_404()
    db.session.delete(u)
    db.session.commit()

    return jsonify({'user deleted': username}), 201


@app.route("%s/settings/<username>" % API_URI, methods=['POST'])
def update_settings(username):
    if not username:
        abort(404)

    u = User.query.filter_by(username=username).first_or_404()
    s = Setting.query.filter_by(user_id=u.id)

    modified=datetime.utcnow()
    data = request.get_json(force = True)


    if s.count() == 0:
        s = Setting(user_id=u.id, data=data, modified=modified)
        db.session.add(s)
    else:
        s = s[0]
        s.modified=modified
        s.data=data

    db.session.commit()

    return jsonify({'settings update': True}), 201


@app.route("%s/settings/<username>" % API_URI, methods=['GET'])
def get_settings(username):
    if not username:
        abort(404)

    u = User.query.filter_by(username=username).first_or_404()
    s = Setting.query.filter_by(user_id=u.id)


    if s.count() == 0:
        data = UI_SETTINGS
        s = Setting(user_id=u.id, data=data)
        db.session.add(s)
        db.session.commit()

    else:
        data = s[0].data


    return jsonify(data), 201
