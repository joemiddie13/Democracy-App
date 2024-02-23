from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User
from forms import SignUpForm, LoginForm

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    form = LoginForm(meta={'csrf': False}, data=data)
    
    if form.validate():
        user = User.query.filter_by(email=form.email.data).first()
        
        if user and user.password == form.password.data:
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

if __name__ == '__main__':
    app.run(debug=True)
