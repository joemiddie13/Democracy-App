# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY democracy-api/requirements.txt .

# Install the required packages and Gunicorn
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy the rest of the application code
COPY democracy-api .

# Expose the port that Gunicorn will run on
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=app.py

# Use Gunicorn to run the app
ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]