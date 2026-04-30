from flask_sqlalchemy import SQLAlchemy
import uuid
from datetime import datetime

db = SQLAlchemy()

class Session(db.Model):
    __tablename__ = 'sessions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    
    progress = db.relationship('Progress', backref='session', uselist=False)
    submissions = db.relationship('CodeSubmission', backref='session', lazy=True)
    attempts = db.relationship('InterviewAttempt', backref='session', lazy=True)

class Progress(db.Model):
    __tablename__ = 'progress'
    
    session_id = db.Column(db.String(36), db.ForeignKey('sessions.id'), primary_key=True)
    problems_solved = db.Column(db.Integer, default=0)
    current_streak = db.Column(db.Integer, default=0)
    total_attempts = db.Column(db.Integer, default=0)
    skill_data = db.Column(db.JSON, default=dict)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CodeSubmission(db.Model):
    __tablename__ = 'code_submissions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = db.Column(db.String(36), db.ForeignKey('sessions.id'))
    problem = db.Column(db.Text)
    code = db.Column(db.Text)
    analysis = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class InterviewAttempt(db.Model):
    __tablename__ = 'interview_attempts'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = db.Column(db.String(36), db.ForeignKey('sessions.id'))
    problem_id = db.Column(db.Integer, db.ForeignKey('code_samples.id'))
    user_review = db.Column(db.Text)
    score = db.Column(db.Integer)
    feedback = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CodeSample(db.Model):
    __tablename__ = 'code_samples'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    difficulty = db.Column(db.String(20))
    language = db.Column(db.String(20))
    buggy_code = db.Column(db.Text)
    issues = db.Column(db.JSON)
    optimal_solution = db.Column(db.Text)
