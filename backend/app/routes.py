import json
import time

from flask import render_template, jsonify, abort, make_response, request, url_for
from app import app, db
from app.models import User, Article
from datetime import datetime

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

    print (users)
    return jsonify({ 'users': users }), 201

@app.route("%s/articles/<username>" % API_URI, methods=['GET'])
def get_all_articles(username):
    user = User.query.filter_by(username=username).first_or_404()
    all = Article.query.filter_by(status=0, user_id=user.id)
    articles = []
    for article in all:
        u = User.query.filter_by(id=article.user_id).first()
        articles.append({
            "uuid": article.uuid,
            "username": u.username,
            "meta": article.meta,
            "status": STATUS[article.status],
            "created": int(article.created.timestamp() * 1000),
            "modified": int(article.modified.timestamp() * 1000),
        })

    print (articles)
    return jsonify({ 'articles': articles }), 201

@app.route("%s/article/<uuid>" % API_URI, methods=['GET'])
def get_article(uuid):
    a = Article.query.filter_by(uuid=uuid).first_or_404()
    u = User.query.filter_by(id=a.user_id).first()

    article = {}
    article["uuid"] = a.uuid
    article["username"] = u.username
    article["data"] = a.data
    article["meta"] = a.meta
    article["created"] = int(a.created.timestamp() * 1000)
    article["modified"] = int(a.modified.timestamp() * 1000)

    return jsonify(article), 201

@app.route("%s/article/<username>" % API_URI, methods=['POST'])
def create_article(username):
    print(username)
    user = User.query.filter_by(username=username).first_or_404()
    if not request.json or not 'data' in request.json:
        abort(400)

    data=request.json["data"]

    if not "meta" in request.json:
        meta = '{"name":"Untitled"}'
    else:
        status=request.json['meta']

    article = Article(author=user, data=data, status=status, meta=meta)

    db.session.add(article)
    db.session.commit()
    return jsonify({'article created': True}), 201



@app.route("%s/article/<uuid>" % API_URI, methods=['PUT'])
def update_article(uuid):
    if not uuid:
        abort(404)

    if not request.json or not 'data' in request.json or not 'meta' in request.json:
        abort(400)

    article = Article.query.filter_by(uuid=uuid).first_or_404()
    user = User.query.filter_by(id=article.user_id).first_or_404()


    data=request.json["data"]
    meta=request.json["meta"]
    modified=datetime.utcnow()

    print(article.uuid, user.username, data, meta)

    article.data = data
    article.meta = meta
    article.modified = modified

    db.session.commit()
    return jsonify({'article updated': True}), 201






@app.route("%s/user/<username>" % API_URI, methods=['GET'])
def get_user(username):
    '''get catenated assets that belong to user @username'''
    print(username)
    user = User.query.filter_by(username=username).first_or_404()
    articles = Article.query.filter_by(user_id=user.id, status=0)



    payload = {
        "settings": json.dumps(UI_SETTINGS)
    }

    for article in articles:
        print ("\n\n", article.id, article.uuid, STATUS[article.status])

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
    if not request.json or not 'username' in request.json:
        abort(400)
    new_user = User(
            username=request.json['username'],
            email=request.json['email']
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
