#!/usr/bin/env python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def root():
    return "You have found somewhere on your road to nowhere.<br>Congrats"

if __name__ == "__main__":
    app.run(host='0.0.0.0')
