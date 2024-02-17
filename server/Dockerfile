# Dockerfile-server
# Use an official Python runtime as the base image
FROM python:3.12

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container to /app
WORKDIR /app

# Copy requirements.txt to the working directory
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Make port 8000 available to the outside world
EXPOSE 8000

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000", "&", "python", "manage.py", "init_superuser"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

