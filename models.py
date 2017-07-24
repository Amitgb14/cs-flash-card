
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Category %r>' % (self.name)


class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(30), unique=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))

    def __init__(self, category_id, topic):
        self.category_id = category_id
        self.topic = topic

    def __repr__(self):
        return '<Topic %r>' % (self.topic)

TYPES = (
        ('1', 'General'),
        ('2', 'Code'),
)

class Cards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'))
    type = Column(db.ChoiceType(TYPES))
    front = db.Column(db.String(200), unique=True)
    back = db.Column(db.Text, nullable=False, default='')
    priority = Column(db.Integer, nullable=False)
    
    def __init__(self, topic_id, type, front, back, priority):
        self.topic_id = topic_id
        self.type = type
        self.front = front
        self.back = back
        self.priority = priority

    def __repr__(self):
        return '<Cards %r>' % (self.front)

