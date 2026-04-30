"""
CodeSensei Backend API
Flask application with PostgreSQL database
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, Session, Progress, CodeSubmission, InterviewAttempt, CodeSample
from services.code_analyzer import CodeAnalyzer
import uuid
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

# Initialize analyzer
code_analyzer = CodeAnalyzer()

# Create tables
with app.app_context():
    db.create_all()
    print("Database tables created")

# Helper functions
def get_or_create_session():
    """Get existing session or create new one from cookie"""
    session_id = request.cookies.get('session_id')
    
    if session_id:
        session = Session.query.get(uuid.UUID(session_id))
        if session:
            session.last_active = datetime.utcnow()
            db.session.commit()
            return session
    
    # Create new session
    new_session = Session()
    db.session.add(new_session)
    db.session.commit()
    
    # Create default progress
    progress = Progress(session_id=new_session.id)
    db.session.add(progress)
    db.session.commit()
    
    return new_session

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'CodeSensei API'})

@app.route('/api/session', methods=['POST'])
def create_session():
    """Create a new anonymous session"""
    session = get_or_create_session()
    
    response = jsonify({
        'session_id': str(session.id),
        'created_at': session.created_at.isoformat()
    })
    response.set_cookie('session_id', str(session.id), httponly=True, samesite='Lax', max_age=30*24*60*60)
    return response, 201

@app.route('/api/progress', methods=['GET'])
def get_progress():
    """Get current progress for session"""
    session = get_or_create_session()
    
    progress = Progress.query.filter_by(session_id=session.id).first()
    if not progress:
        progress = Progress(session_id=session.id)
        db.session.add(progress)
        db.session.commit()
    
    return jsonify({
        'problems_solved': progress.problems_solved,
        'current_streak': progress.current_streak,
        'total_attempts': progress.total_attempts,
        'skill_data': progress.skill_data or {
            'arrays': {'solved': min(progress.problems_solved * 3, 15), 'total': 15},
            'graphs': {'solved': min(progress.problems_solved * 2, 10), 'total': 10},
            'dynamic_programming': {'solved': min(progress.problems_solved, 8), 'total': 8},
            'trees': {'solved': min(progress.problems_solved * 2, 12), 'total': 12},
            'sorting': {'solved': min(progress.problems_solved, 6), 'total': 6}
        },
        'last_active': session.last_active.isoformat()
    })

@app.route('/api/progress/update', methods=['POST'])
def update_progress():
    """Update progress (increment problems solved, etc.)"""
    session = get_or_create_session()
    data = request.get_json()
    
    progress = Progress.query.filter_by(session_id=session.id).first()
    if not progress:
        progress = Progress(session_id=session.id)
        db.session.add(progress)
    
    # Update fields
    if data.get('problems_solved'):
        progress.problems_solved += data.get('problems_solved', 0)
    if data.get('current_streak'):
        progress.current_streak = data.get('current_streak')
    if data.get('total_attempts'):
        progress.total_attempts += data.get('total_attempts', 0)
    
    progress.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'success': True,
        'problems_solved': progress.problems_solved,
        'current_streak': progress.current_streak
    })

@app.route('/api/challenge/complete', methods=['POST'])
def complete_challenge():
    """Mark a challenge as complete"""
    session = get_or_create_session()
    data = request.get_json()
    
    progress = Progress.query.filter_by(session_id=session.id).first()
    if not progress:
        progress = Progress(session_id=session.id)
        db.session.add(progress)
    
    # Increment stats
    progress.problems_solved += 1
    progress.total_attempts += data.get('attempts', 1)
    
    # Update streak
    progress.current_streak += 1
    
    progress.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'success': True,
        'problems_solved': progress.problems_solved,
        'current_streak': progress.current_streak,
        'message': 'Challenge completed! Keep going!'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_code():
    """Analyze code submission"""
    session = get_or_create_session()
    data = request.get_json()
    
    problem = data.get('problem', '')
    code = data.get('code', '')
    
    if not code:
        return jsonify({'error': 'No code provided'}), 400
    
    # Perform analysis
    analysis = code_analyzer.analyze(code, problem)
    
    # Store submission
    submission = CodeSubmission(
        session_id=session.id,
        problem=problem,
        code=code,
        analysis=analysis
    )
    db.session.add(submission)
    db.session.commit()
    
    return jsonify({
        'submission_id': str(submission.id),
        'analysis': analysis,
        'submitted_at': submission.created_at.isoformat()
    })

@app.route('/api/analyze/history', methods=['GET'])
def get_analysis_history():
    """Get analysis history for session"""
    session = get_or_create_session()
    
    submissions = CodeSubmission.query.filter_by(session_id=session.id).order_by(CodeSubmission.created_at.desc()).limit(10).all()
    
    return jsonify({
        'history': [
            {
                'id': str(s.id),
                'problem': s.problem[:100] + '...' if len(s.problem) > 100 else s.problem,
                'analysis': s.analysis,
                'created_at': s.created_at.isoformat()
            }
            for s in submissions
        ]
    })

@app.route('/api/interview/problem', methods=['GET'])
def get_interview_problem():
    """Get a random interview problem not yet attempted"""
    session = get_or_create_session()
    
    # Get already attempted problem IDs
    attempted = InterviewAttempt.query.filter_by(session_id=session.id).with_entities(InterviewAttempt.problem_id).all()
    attempted_ids = [a[0] for a in attempted]
    
    # Get a random problem not attempted
    query = CodeSample.query
    if attempted_ids:
        query = query.filter(~CodeSample.id.in_(attempted_ids))
    
    problem = query.order_by(db.func.random()).first()
    
    # If all attempted, get any random one
    if not problem:
        problem = CodeSample.query.order_by(db.func.random()).first()
    
    if not problem:
        # Seed data if empty
        return jsonify({'error': 'No problems available. Please seed the database.'}), 404
    
    return jsonify({
        'problem_id': problem.id,
        'title': problem.title,
        'difficulty': problem.difficulty,
        'language': problem.language,
        'code': problem.buggy_code,
        'issues_count': len(problem.issues) if problem.issues else 0
    })

@app.route('/api/interview/submit', methods=['POST'])
def submit_interview_review():
    """Submit code review for interview problem"""
    session = get_or_create_session()
    data = request.get_json()
    
    problem_id = data.get('problem_id')
    user_review = data.get('review', '')
    
    if not problem_id or not user_review:
        return jsonify({'error': 'Missing problem_id or review'}), 400
    
    # Get the problem
    problem = CodeSample.query.get(problem_id)
    if not problem:
        return jsonify({'error': 'Problem not found'}), 404
    
    # Calculate score based on detected issues
    issues = problem.issues or []
    detected_count = 0
    
    for issue in issues:
        keywords = issue.get('keywords', [])
        if any(kw.lower() in user_review.lower() for kw in keywords):
            detected_count += 1
    
    score = int((detected_count / len(issues)) * 100) if issues else 0
    
    # Store attempt
    attempt = InterviewAttempt(
        session_id=session.id,
        problem_id=problem_id,
        user_review=user_review,
        score=score,
        feedback={
            'detected_issues': detected_count,
            'total_issues': len(issues),
            'missed_issues': [i for i in issues if not any(kw.lower() in user_review.lower() for kw in i.get('keywords', []))]
        }
    )
    db.session.add(attempt)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'score': score,
        'feedback': attempt.feedback,
        'optimal_solution': problem.optimal_solution if score >= 80 else None
    })

@app.route('/api/interview/attempts', methods=['GET'])
def get_interview_attempts():
    """Get interview attempt history"""
    session = get_or_create_session()
    
    attempts = InterviewAttempt.query.filter_by(session_id=session.id).order_by(InterviewAttempt.created_at.desc()).all()
    
    return jsonify({
        'attempts': [
            {
                'id': str(a.id),
                'problem_id': a.problem_id,
                'score': a.score,
                'created_at': a.created_at.isoformat()
            }
            for a in attempts
        ],
        'total_attempts': len(attempts),
        'average_score': sum(a.score for a in attempts) / len(attempts) if attempts else 0
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
