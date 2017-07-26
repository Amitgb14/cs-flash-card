import os
import sqlite3
from functools import wraps
from flask import Flask, flash, g, request, redirect, session, url_for, render_template

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'db', 'cards.db'),
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))

categories = ("general", "c++", "python", "ds")

def connect_db():
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv


def init_db():
    db = get_db()
    with app.open_resource('data/schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()


def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db


@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

# -----------------------------------------------------------

# Uncomment and use this to initialize database, then comment it
#   You can rerun it to pave the database and start over
@app.route('/initdb')
def initdb():
     init_db()
     return 'Initialized the database.'




@app.route("/add_topic/", methods=["POST"])
def add_topic():
    db = get_db()
    if request.method == "POST":
        category = session["category"]
        topic = request.form["topic"]
        query = """
                INSERT
                INTO topics (category, topic)
                VALUES (?, ?)
        """
        db.execute(query, [category.lower(), topic.lower()])
        db.commit()
        return redirect(url_for("category")+category.lower())


@app.route("/add_card/", methods=["POST"])
def add_card():
    db = get_db()

    if request.method == "POST":
        category = session["category"] # request.form["category"]
        topic = session["topic"] # request.form["topic"]
        type = request.form["type"]
        front = request.form["front"]
        back = request.form["back"]
        priority = 5 # request.form["priority"]
        query = """
                INSERT
                INTO cards (category, topic, type, front, back, priority)
                VALUES (?, ?, ?, ?, ?, ?)
        """
        db.execute(query, [category.lower(),
                           topic.lower(),
                           type,
                           front.lower(),
                           back.lower(),
                           priority])
        db.commit()
        return redirect(url_for("category")+category.lower()+"/"+topic.lower())


@app.route("/category/")
@app.route("/category/<category_type>/")
@app.route("/category/<category_type>/<topic_type>/")
def category(category_type=None, topic_type=None):
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    db = get_db()
    if category_type and topic_type:
            session["category"] = category_type
            session["topic"] = topic_type
            query = """
                    SELECT id, front, back
                    FROM cards
                    WHERE
                    category = ?
                    AND
                    topic = ?
            """
            cur = db.execute(query, [category_type, topic_type])
            cards = cur.fetchall()
            return render_template("cards.html", cards=cards, category=category_type, topic=topic_type)
    elif category_type:
            session["category"] = category_type
            query = """
                    SELECT id, topic
                    FROM topics
                    WHERE
                    category = ?
            """
            cur = db.execute(query, [category_type])
            topics = cur.fetchall()
	    return render_template("topics.html", topics=topics, category=category_type)
    return render_template("category.html", categories=categories)


def get_content(category_type):
    query = """
      SELECT topic FROM cards
      WHERE
        category_type = ?
    """
    db = get_db()
    cur = db.execute(query, [category_type])
    return cur.fetchall()


@app.route("/")
def index():
    if session.get("logged_in"):
        return redirect(url_for("category"))
    else:
        return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    error_msg = None
    if request.method == "POST":
        if request.form["username"] != app.config["USERNAME"] and \
                request.form["password"] != app.config["PASSWORD"]:
            error_msg = "Invalid username or password"
        else:
            session["logged_in"] = True
            session.permanent = True
            return redirect("category")
    return render_template("login.html", error=error_msg)


@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    flash("You've logged out")
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1337, debug="false")
