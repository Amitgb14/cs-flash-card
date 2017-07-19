import os
from flask import Flask, flash, request, redirect, session, url_for, render_template

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'db', 'cards.db'),
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))



@app.route("/")
def index():
    if session.get("logged_in"):
        return redirect(url_for("general"))
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
            return redirect("general")
    return render_template("login.html", error=error_msg)

@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    flash("You've logged out")
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="1337")
