from flask_wtf import FlaskForm
from wtforms import HiddenField, StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, Length
from models import Candidate

class SignUpForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=4)])
    submit = SubmitField('Sign Up')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=4)])
    submit = SubmitField('Login')

class RankChoiceForm(FlaskForm):
    class Meta:
        csrf = False
    first_choice = HiddenField('First Choice', validators=[DataRequired()])
    second_choice = HiddenField('Second Choice', validators=[DataRequired()])
    third_choice = HiddenField('Third Choice', validators=[DataRequired()])
    fourth_choice = HiddenField('Fourth Choice', validators=[DataRequired()])