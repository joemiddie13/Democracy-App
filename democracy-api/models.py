from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    rank_choice = db.relationship('RankChoice', backref='user', uselist=False)

class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(80), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    party_affiliation = db.Column(db.String(80), nullable=False)
    political_ideology = db.Column(db.String(80), nullable=False)

class RankChoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    first_choice = db.Column(db.Integer, db.ForeignKey('candidate.id'))
    second_choice = db.Column(db.Integer, db.ForeignKey('candidate.id'))
    third_choice = db.Column(db.Integer, db.ForeignKey('candidate.id'))
    fourth_choice = db.Column(db.Integer, db.ForeignKey('candidate.id'))
    first_choice_candidate = db.relationship('Candidate', foreign_keys=[first_choice])
    second_choice_candidate = db.relationship('Candidate', foreign_keys=[second_choice])
    third_choice_candidate = db.relationship('Candidate', foreign_keys=[third_choice])
    fourth_choice_candidate = db.relationship('Candidate', foreign_keys=[fourth_choice])