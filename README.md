# Quizzler Repository #
This repository serves as Group N's development platform for the CS22002 Group Project.
These instructions will allow you to run the Quizzler web application.
Quizzler is a fun, interactive web application allowing users to create, browse and play custom quizzes.

## Clone Main Repository and Install Dependencies ##
### Prerequisites ###
- Git installed
- Python 3.10+
### Clone Repository ###
```bash
git clone https://github.com/your-username/your-repo-name.git
cd project-name
```
### Backend Setup ###
```bash
cd backend
pip install -r requirements.txt
```
### Frontend Setup ###
No installation required

## Usage
### 1. Navigate to the backend folder
```bash
cd backend
```
### 2. Run app.py
```bash
python app.py
```

## API

For this project a RESTful API was built using Flask and Flask-RESTful.

### Endpoints
#### Accounts
**POST /api/accounts**
Create new account

**POST /api/login**
Authenicate User

#### Quizzes
**GET /api/quizzes**
Return all quizzes

**POST /api/quizzes**
Creates new quiz to the database

**GET /api/quizzes/<quiz_id>**
Returns a quiz

**PUT /api/quizzes/<quiz_id>**
Updates a quiz

**DELETE /api/quizzes/<quiz_id>**
Delete a quiz

#### Questions
**POST /api/quizzes/<quiz_id>/questions**
Add new question

**PUT /api/quizzes/<quiz_id>/questions**
Update question

**DELETE /api/quizzes/<quiz_id>/questions**
DELETE question

## Tech Stack ##
### Frontend ###
- HTML5
- CSS3
- JavaScript
### Backend ###
- Python 3.10+
- Flask 3.1.3
- Flask-RESTful
- Flask-SQLAlchemy
### Database ###
- SQLite

## Contributors ##
- Callum Firth
- Bailey Clark
- Logan Howie
- Ali Akbar
