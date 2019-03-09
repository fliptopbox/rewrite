import json
import time

from flask import render_template, jsonify, abort, make_response, request, url_for
from app import app, db
from app.models import User, Article

api = "/api/v1.0"


API_URI = app.config['API_BASE_URI']
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


@app.route("%s/user/<username>" % API_URI, methods=['GET'])
def get_user(username):
    print(username)
    user = User.query.filter_by(username=username).first_or_404()
    articles = Article.query.filter_by(user_id=user.id)


    payload = {
        "articles": [],
        "settings": json.dumps(UI_SETTINGS)
    }

    for article in articles:
        print ("\n\n", article.id, article.uuid, article.body)
        payload[article.uuid] = article.body
        payload["articles"].append(
            '{"guid":"%s", "created":%d, "modified":%d}' % (
                article.uuid,
                int(time.mktime(article.created.timetuple())),
                int(time.mktime(article.modified.timetuple()))
                )
            )

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
    users = User.query.filter_by(username=username).first_or_404()
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
