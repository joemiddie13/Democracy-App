from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf import FlaskForm
from wtforms import StringField, SelectField
from models import db, User, Candidate, RankChoice
from forms import SignUpForm, LoginForm, RankChoiceForm

app = Flask(__name__)
# CORS(app, supports_credentials=False, origins='http://localhost:3000')
# CORS(app)
CORS(app, supports_credentials=True, origins='http://localhost:3000', methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type', 'Authorization'])

app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()

# SignUp Page Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    form = SignUpForm(meta={'csrf': False}, data=data)
    
    if form.validate():
        if User.query.filter_by(email=form.email.data).first():
            return jsonify({'message': 'Email already in use'}), 400

        new_user = User(
            email=form.email.data,
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            password=form.password.data
        )
        db.session.add(new_user)
        try:
            db.session.commit()
            return jsonify({'message': 'User created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        first_error = list(form.errors.values())[0][0] if form.errors else 'Invalid data'
        return jsonify({'message': first_error}), 400

# Login Page Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    form = LoginForm(meta={'csrf': False}, data=data)
    
    if form.validate():
        user = User.query.filter_by(email=form.email.data).first()
        
        if user and user.password == form.password.data:
            session['user_id'] = user.id  # Store user's ID in session
            return jsonify({'message': 'Login successful', 'email': user.email}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401
    else:
        first_error = list(form.errors.values())[0][0] if form.errors else 'Invalid data'
        return jsonify({'message': first_error}), 400

@app.route('/user-details', methods=['GET'])
def user_details():
    email = request.args.get('email')
    if not email:
        return jsonify({'message': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user_details_response = jsonify({
        'firstName': user.first_name,
        'lastName': user.last_name,
        'email': user.email
    }) 
    return user_details_response, 200

@app.route('/candidates', methods=['GET'])
def get_candidates():
    candidates = Candidate.query.all()
    candidates_data = [{
        'id': candidate.id,
        'full_name': candidate.full_name,
        'dob': candidate.dob.strftime('%Y-%m-%d'),
        'party_affiliation': candidate.party_affiliation,
        'political_ideology': candidate.political_ideology
    } for candidate in candidates]
    return jsonify(candidates_data), 200

def get_current_user_id(user_id):
    return session.get(user_id)





# Submit-Rank-Choice Route Attempt #1
@app.route('/submit-rank-choice', methods=['POST'])
def submit_rank_choice():
    data = request.get_json()
    form = RankChoiceForm(meta={'csrf': False}, data=data)
    print(data)
    if form.validate():
        user_id = db.session['user_id']
        print(user_id)
        if user_id is None:
            return jsonify({'message': 'User not authenticated'}), 401

        rank_choice = RankChoice(
            user_id=user_id,
            first_choice=form.first_choice.data,
            second_choice=form.second_choice.data,
            third_choice=form.third_choice.data,
            fourth_choice=form.fourth_choice.data,
        )
        db.session.add(rank_choice)
        db.session.commit()
        return jsonify({'message': 'Rank choices saved successfully!'}), 200
    else:
        return jsonify({'errors': form.errors}), 400

#Submit-Rank-Choice debugging
# @app.route('/submit-rank-choice', methods=['POST'])
# def submit_rank_choice():
#     data = request.get_json()

#     # Temporary response to test endpoint accessibility
#     return jsonify({'message': 'Received data', 'data': data}), 200

# @app.route('/submit-rank-choice', methods=['POST'])
# def submit_rank_choice():
#     data = request.get_json()
#     print("Received data:", data)  # Debugging: Print received data

#     user_id = get_current_user_id('user_id')
#     print("user_id: **********",user_id)
#     if user_id is None:
#         print("User not authenticated")  # Debugging: Print authentication issue
#         return jsonify({'message': 'User not authenticated'}), 401

#     # Assuming data is received in the expected format
#     try:
#         rank_choice = RankChoice(
#             user_id=user_id,
#             first_choice=data['first_choice'],
#             second_choice=data['second_choice'],
#             third_choice=data['third_choice'],
#             fourth_choice=data['fourth_choice'],
#         )
#         db.session.add(rank_choice)
#         db.session.commit()
#         print("Rank choices saved successfully")  # Debugging: Print success message
#         return jsonify({'message': 'Rank choices saved successfully'}), 200
#     except KeyError as e:
#         print("Data missing:", e)  # Debugging: Print missing data key
#         return jsonify({'error': 'Missing data for key: {}'.format(e)}), 400
#     except Exception as e:
#         print("Error saving rank choices:", e)  # Debugging: Print exception
#         db.session.rollback()
#         return jsonify({'error': 'Error saving rank choices'}), 500

# class RankChoiceForm(FlaskForm):
#     first_choice = SelectField('First Choice', choices=[(1, 'Candidate A'), (2, 'Candidate B'), (3, 'Candidate C')])
#     second_choice = SelectField('Second Choice', choices=[(1, 'Candidate A'), (2, 'Candidate B'), (3, 'Candidate C')])
#     third_choice = SelectField('Third Choice', choices=[(1, 'Candidate A'), (2, 'Candidate B'), (3, 'Candidate C')])
#     fourth_choice = SelectField('Fourth Choice', choices=[(1, 'Candidate A'), (2, 'Candidate B'), (3, 'Candidate C')])

# Google Gemini Suggestion
# @app.route('/submit-rank-choice', methods=['POST'])
# def submit_rank_choice():
#     form = RankChoiceForm()

#     if form.validate_on_submit():
#         user_id = get_current_user_id()
#         if user_id is None:
#             return jsonify({'message': 'User not authenticated'}), 401

#         # Extract choices from the form
#         first_choice = form.first_choice.data
#         second_choice = form.second_choice.data
#         third_choice = form.third_choice.data
#         fourth_choice = form.fourth_choice.data

#         # Create and save RankChoice object
#         rank_choice = RankChoice(
#             user_id=user_id,
#             first_choice=first_choice,
#             second_choice=second_choice,
#             third_choice=third_choice,
#             fourth_choice=fourth_choice,
#         )
#         db.session.add(rank_choice)
#         db.session.commit()

#         return jsonify({'message': 'Rank choices saved successfully!'}), 200
#     else:
#         return jsonify({'errors': form.errors}), 400

    
# Logout route to clear the session
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clear session data
    return jsonify({'message': 'Logout successful'}), 200



if __name__ == '__main__':
    app.run(debug=True, port=5000)
    # app.run(host='localhost', port=9874)    