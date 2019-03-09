from flask import Flask, render_template, jsonify, abort
import json

app = Flask(__name__, static_folder="build/static", template_folder="build")
api = "/api/v1.0"

with open('db/db.json') as f:
    db = json.load(f)

print ( db.keys() )


@app.route("/")
def index():
    return render_template('index.html')

@app.route("%s/users" % api, methods=['GET'])
def get_users():
    users = []
    for key in db.keys():
        users.append(key)

    print (users)
    return jsonify({ 'users': users })


@app.route("%s/user/<user_guid>" % api, methods=['GET'])
def get_user(user_guid):
    print(user_guid)
    if (not user_guid in db):
        abort(404)

    return jsonify(db[user_guid])






if __name__ == "__main__":
    app.debug=True
    app.run(host='0.0.0.0', port=80)
