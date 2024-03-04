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
            db.create_all()
        yield client


# # Signup Route Test
# def test_signup_success(test_client):
#     signup_data = {
#         'email': 'newuser2@example.com',
#         'first_name': 'New',
#         'last_name': 'User1',
#         'password': 'password123'
#     }
#     response = test_client.post('/signup', json=signup_data)

#     # Check that the response status code is 201 (created)
#     assert response.status_code == 201
#     # Check that the response message is as expected
#     assert response.json['message'] == 'User created successfully'
#     # Check that the user was actually created in the database
#     user = User.query.filter_by(email='newuser@example.com').first()
#     assert user is not None
#     assert user.first_name == 'New'


# # Login Success Test
# def test_login_success(test_client):
#     with app.app_context():
#         # First, create a user to log in with
#         user = User(email='loginuser2@example.com', first_name='Login', last_name='User', password='login123')
#         db.session.add(user)
#         db.session.commit()

#     # user is created, make the login request
#     login_data = {
#         'email': 'loginuser2@example.com',
#         'password': 'login123'
#     }
#     response = test_client.post('/login', json=login_data)

#     # Assertions
#     assert response.status_code == 200
#     assert response.json['message'] == 'Login successful'
        
# # User Details Route
# def test_user_details(test_client):
#     # Create a user
#     with app.app_context():
#       user = User(email='detailsuser2@example.com', first_name='Details', last_name='User', password='details123')
#       db.session.add(user)
#       db.session.commit()

#       # Fetch user details
#       response = test_client.get(f'/user-details?email={user.email}')

#       # Assertions
#       assert response.status_code == 200
#       assert response.json == {
#           'firstName': user.first_name,
#           'lastName': user.last_name,
#           'email': user.email
#       }


# Candidate Route
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

