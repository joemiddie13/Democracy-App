import pytest
from app import app, db, TestConfig, session
from models import User, Candidate, RankChoice
from datetime import datetime

@pytest.fixture
def test_client():
    app.config.from_object(TestConfig)
    print("Using database URI:", app.config['SQLALCHEMY_DATABASE_URI'])
    with app.test_client() as client:
        with app.app_context():
            db.drop_all()
            db.create_all()
        yield client

# 1. Signup Route Test
def test_signup_success(test_client):
    signup_data = {
        'email': 'newuser@example.com',
        'first_name': 'New',
        'last_name': 'User3',
        'password': 'password123'
    }
    response = test_client.post('/signup', json=signup_data)

    # Check that the response status code is 201 (created)
    assert response.status_code == 201
    # Check that the response message is as expected
    assert response.json['message'] == 'User created successfully'
    # Check that the user was actually created in the database
    user = User.query.filter_by(email='newuser@example.com').first()
    assert user is not None
    assert user.first_name == 'New'


# 2. Login Success Test
def test_login_success(test_client):
    with app.app_context():
        # First, create a user to log in with
        user = User(email='loginuser2@example.com', first_name='Login', last_name='User', password='login123')
        db.session.add(user)
        db.session.commit()

    # user is created, make the login request
    login_data = {
        'email': 'loginuser2@example.com',
        'password': 'login123'
    }
    response = test_client.post('/login', json=login_data)

    # Assertions
    assert response.status_code == 200
    assert response.json['message'] == 'Login successful'
        
        
# 3. User Details Route
def test_user_details(test_client):
    # Create a user
    with app.app_context():
      user = User(email='detailsuser2@example.com', first_name='Details', last_name='User', password='details123')
      db.session.add(user)
      db.session.commit()

      # Fetch user details
      response = test_client.get(f'/user-details?email={user.email}')

      # Assertions
      assert response.status_code == 200
      assert response.json == {
          'firstName': user.first_name,
          'lastName': user.last_name,
          'email': user.email
      }


# 4. Candidate Route
def test_get_candidates(test_client):
    # Create some candidates
    with app.app_context():
        # Convert string dates to date objects
        dob1 = datetime.strptime('1990-01-01', '%Y-%m-%d').date()
        dob2 = datetime.strptime('1992-02-02', '%Y-%m-%d').date()

        candidate1 = Candidate(full_name='Candidate One', dob=dob1, party_affiliation='Party A', political_ideology='Ideology X')
        candidate2 = Candidate(full_name='Candidate Two', dob=dob2, party_affiliation='Party B', political_ideology='Ideology Y')
        db.session.add_all([candidate1, candidate2])
        db.session.commit()

    # Fetch candidates
    response = test_client.get('/candidates')

    # Assertions
    assert response.status_code == 200
    assert len(response.json) == 2

# 5. Submit Rank Choice 
def test_submit_rank_choice(test_client):
    with app.app_context():
        # Create a user
        user = User(email='rankchoiceuser@example.com', first_name='Rank', last_name='Choice', password='rank123')
        db.session.add(user)
        db.session.commit()

        # Create some candidates
        dob = datetime.strptime('1990-01-01', '%Y-%m-%d').date()
        candidate1 = Candidate(full_name='Rank Candidate One', dob=dob, party_affiliation='Party C', political_ideology='Ideology Z')
        db.session.add(candidate1)
        db.session.commit()

        # Log in user
        with test_client.session_transaction() as sess:
            sess['user_id'] = user.id

        # Submit rank choice data
        rank_choice_data = {
            'first_choice': candidate1.id,
            'second_choice': None,
            'third_choice': None,
            'fourth_choice': None,
        }
        response = test_client.post('/submit-rank-choice', json=rank_choice_data)

        # Assertions
        assert response.status_code == 200
        assert response.json['message'] == 'Rank choices saved successfully!'


# 6. Logout Route Test
def test_logout(test_client):
    # Create a user for login
    with app.app_context():
        user = User(email='test@example.com', first_name='Test', last_name='User', password='password')
        db.session.add(user)
        db.session.commit()

    # Attempt to log in with the created user
    login_response = test_client.post('/login', json={'email': 'test@example.com', 'password': 'password'})
    assert login_response.status_code == 200, "Login failed"

    # Perform logout
    logout_response = test_client.post('/logout')
    assert logout_response.status_code == 200, "Logout failed"
    assert logout_response.json['message'] == 'Logout successful'



