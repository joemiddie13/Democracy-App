from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User, Candidate, RankChoice
from forms import SignUpForm, LoginForm, RankChoiceForm

# Initialize the Flask application
app = Flask(__name__)

# Configure Cross-Origin Resource Sharing (CORS) to allow frontend requests
CORS(app, supports_credentials=True, origins='http://localhost:3000', methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type', 'Authorization'])

# Set secret key for session management and configure the database URI
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database with app context and configure migration for database schema changes
db.init_app(app)
migrate = Migrate(app, db)

# Create database tables within the application context
with app.app_context():
    db.create_all()

# Route for user signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()  # Parse JSON data from the request
    
    # Initialize and validate the signup form with the parsed data
    form = SignUpForm(meta={'csrf': False}, data=data)
    
    if form.validate():  # Check if form data is valid
        # Check if the email is already used by another user
        if User.query.filter_by(email=form.email.data).first():
            return jsonify({'message': 'Email already in use'}), 400

        # Create a new user instance with the form data
        new_user = User(
            email=form.email.data,
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            password=form.password.data
        )
        db.session.add(new_user)  # Add the new user to the session for commit
        try:
            db.session.commit()  # Commit the session changes to the database
            return jsonify({'message': 'User created successfully'}), 201
        except Exception as e:  # Handle exceptions during commit
            db.session.rollback()  # Rollback session changes in case of error
            return jsonify({'error': str(e)}), 500
    else:  # If form validation fails, return the first validation error message
        first_error = list(form.errors.values())[0][0] if form.errors else 'Invalid data'
        return jsonify({'message': first_error}), 400

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Parse JSON data from the request
    form = LoginForm(meta={'csrf': False}, data=data)  # Initialize and validate the login form
    
    if form.validate():  # Check if form data is valid
        user = User.query.filter_by(email=form.email.data).first()  # Retrieve the user by email
        
        # Check if user exists and password is correct
        if user and user.password == form.password.data:
            session['user_id'] = user.id  # Store the user's ID in the session
            return jsonify({'message': 'Login successful', 'email': user.email}), 200
        else:  # If login credentials are invalid
            return jsonify({'message': 'Invalid email or password'}), 401
    else:  # If form validation fails, return the first validation error message
        first_error = list(form.errors.values())[0][0] if form.errors else 'Invalid data'
        return jsonify({'message': first_error}), 400

# Route to fetch user details
@app.route('/user-details', methods=['GET'])
def user_details():
    email = request.args.get('email')  # Retrieve email from query parameters
    if not email:  # If email is not provided
        return jsonify({'message': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()  # Retrieve the user by email
    if not user:  # If user is not found
        return jsonify({'message': 'User not found'}), 404

    # Return user details as JSON
    user_details_response = jsonify({
        'firstName': user.first_name,
        'lastName': user.last_name,
        'email': user.email
    }) 
    return user_details_response, 200

# Route to fetch all candidates
@app.route('/candidates', methods=['GET'])
def get_candidates():
    candidates = Candidate.query.all()  # Retrieve all candidates from the database
    # Serialize candidate data for JSON response
    candidates_data = [{
        'id': candidate.id,
        'full_name': candidate.full_name,
        'dob': candidate.dob.strftime('%Y-%m-%d'),  # Format date of birth
        'party_affiliation': candidate.party_affiliation,
        'political_ideology': candidate.political_ideology
    } for candidate in candidates]
    return jsonify(candidates_data), 200

# Utility function to retrieve the current user's ID from the session
def get_current_user_id():
    return session.get('user_id')

# Route to submit ranked choices
@app.route('/submit-rank-choice', methods=['POST'])
def submit_rank_choice():
    if 'user_id' not in session:  # Check if the user is authenticated
        return jsonify({'message': 'User not authenticated'}), 401

    user_id = session['user_id']  # Retrieve the current user's ID from the session
    data = request.get_json()  # Parse JSON data from the request

    # Instantiate RankChoiceForm with submitted data
    form = RankChoiceForm(data=data)

    if form.validate():  # Check if form data is valid
        # Create a RankChoice instance using form data
        rank_choice = RankChoice(
            user_id=user_id,
            first_choice=form.first_choice.data,
            second_choice=form.second_choice.data,
            third_choice=form.third_choice.data,
            fourth_choice=form.fourth_choice.data,
        )

        db.session.add(rank_choice)  # Add the rank choice to the session for commit
        try:
            db.session.commit()  # Commit the session changes to the database
            return jsonify({'message': 'Rank choices saved successfully!'}), 200
        except Exception as e:  # Handle exceptions during commit
            db.session.rollback()  # Rollback session changes in case of error
            return jsonify({'error': str(e)}), 500
    else:  # If form validation fails, return the errors
        return jsonify({'errors': form.errors}), 400

# Route to clear the session for logout
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clear all data in the session
    return jsonify({'message': 'Logout successful'}), 200

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=5000)
