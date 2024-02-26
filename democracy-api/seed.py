from models import db, Candidate
from datetime import datetime

def seed_candidates():
    candidate_data = [
        {"full_name": "Rocko", "dob": "2015-06-01", "party_affiliation": "Bark Party", "political_ideology": "Pro-fetch"},
        {"full_name": "Arabella", "dob": "2017-09-12", "party_affiliation": "Howl Movement", "political_ideology": "Anti-mailman"},
        {"full_name": "Bishop", "dob": "2016-03-22", "party_affiliation": "Tail Waggers", "political_ideology": "Free treats for all"},
        {"full_name": "Holly", "dob": "2018-11-05", "party_affiliation": "Sniffers Union", "political_ideology": "More parks in neighborhoods"}
    ]

    for candidate_info in candidate_data:
        existing_candidate = Candidate.query.filter_by(full_name=candidate_info['full_name']).first()
        if not existing_candidate:
            candidate = Candidate(
                full_name=candidate_info['full_name'],
                dob=datetime.strptime(candidate_info['dob'], '%Y-%m-%d'),
                party_affiliation=candidate_info['party_affiliation'],
                political_ideology=candidate_info['political_ideology']
            )
            db.session.add(candidate)
    db.session.commit()

