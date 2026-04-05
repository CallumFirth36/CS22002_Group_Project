# app.py
# Author : Ali Akbar  |  Student ID: 2589801
# Module : CS22002 Modern Web Stack Development — Group N
#
# Flask application factory.
# Run locally:
#   pip install flask flask-sqlalchemy werkzeug
#   python app.py

import os
from flask import Flask
from extensions import db
from auth import auth_bp


def create_app(test_config=None):
    app = Flask(__name__)

    # -----------------------------------------------------------------------
    # Configuration
    # -----------------------------------------------------------------------
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "change-me-before-production")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL",
        "sqlite:///quizzler_dev.db"   # SQLite for development; swap for PostgreSQL in production
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Session cookie security (security consideration from design document)
    app.config["SESSION_COOKIE_HTTPONLY"] = True          # prevents JS access
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"]   = not app.debug  # HTTPS only in production

    if test_config:
        app.config.update(test_config)

    # -----------------------------------------------------------------------
    # Extensions
    # -----------------------------------------------------------------------
    db.init_app(app)

    # -----------------------------------------------------------------------
    # Blueprints
    # -----------------------------------------------------------------------
    app.register_blueprint(auth_bp)

    # -----------------------------------------------------------------------
    # Create tables on first run
    # -----------------------------------------------------------------------
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
