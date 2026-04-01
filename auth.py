# auth.py
# Author : Ali Akbar  |  Student ID: 2589801
# Module : CS22002 Modern Web Stack Development — Group N
#
# Handles all authentication endpoints:
#   POST  /api/auth/register
#   POST  /api/auth/login
#   POST  /api/auth/logout
#   GET   /api/auth/me

import re
from datetime import datetime
from functools import wraps

from flask import Blueprint, request, jsonify, session, g
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db   # SQLAlchemy instance created in extensions.py
from models import User     # User model defined in models.py

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _email_valid(email: str) -> bool:
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email))


def _password_errors(pw: str) -> str | None:
    """Return an error string if the password fails complexity rules."""
    if len(pw) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", pw):
        return "Password must include at least one uppercase letter."
    if not re.search(r"[0-9]", pw):
        return "Password must include at least one number."
    if not re.search(r"[^A-Za-z0-9]", pw):
        return "Password must include at least one special character."
    return None


# ---------------------------------------------------------------------------
# Decorators
# ---------------------------------------------------------------------------

def login_required(f):
    """Reject request with 401 if the user is not logged in."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Login required."}), 401
        return f(*args, **kwargs)
    return wrapper


def admin_required(f):
    """Reject request with 403 if the logged-in user is not an admin."""
    @wraps(f)
    @login_required
    def wrapper(*args, **kwargs):
        user = db.session.get(User, session["user_id"])
        if not user or user.role != "admin":
            return jsonify({"error": "Admin access required."}), 403
        g.current_user = user
        return f(*args, **kwargs)
    return wrapper


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    POST /api/auth/register
    Body (JSON): { username, password }
    Returns 201 on success.
    Returns 400 for validation failures, 409 for duplicate username.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    # --- field presence ---
    if not username:
        return jsonify({"error": "Username is required."}), 400
    if not password:
        return jsonify({"error": "Password is required."}), 400

    # --- username rules ---
    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters."}), 400
    if len(username) > 30:
        return jsonify({"error": "Username must be 30 characters or fewer."}), 400
    if not re.match(r"^[A-Za-z0-9_]+$", username):
        return jsonify({"error": "Username may only contain letters, numbers, and underscores."}), 400

    # --- password rules ---
    pw_error = _password_errors(password)
    if pw_error:
        return jsonify({"error": pw_error}), 400

    # --- uniqueness check ---
    if User.query.filter(db.func.lower(User.username) == username.lower()).first():
        return jsonify({"error": "That username is already taken."}), 409

    # --- create user ---
    # Passwords hashed with werkzeug (pbkdf2:sha256) — never stored as plain text
    new_user = User(
        username=username,
        password_hash=generate_password_hash(password),
        role="admin",
        created_at=datetime.utcnow(),
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Account created successfully.",
        "user": {"id": new_user.id, "username": new_user.username, "role": new_user.role}
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    POST /api/auth/login
    Body (JSON): { username, password }
    Returns 200 with user info on success.
    Returns 401 for wrong credentials (same message regardless of which field
    is wrong, to avoid username enumeration).
    Session cookie is HttpOnly (configured in app.py).
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"error": "Invalid credentials."}), 401

    user = User.query.filter(db.func.lower(User.username) == username.lower()).first()

    # check_password_hash is constant-time, safe against timing attacks
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials."}), 401

    # --- start session ---
    session.clear()
    session["user_id"]  = user.id
    session["username"] = user.username
    session["role"]     = user.role

    return jsonify({
        "message": "Login successful.",
        "user": {"id": user.id, "username": user.username, "role": user.role}
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    """
    POST /api/auth/logout
    Clears the server-side session.
    Returns 200.
    """
    session.clear()
    return jsonify({"message": "Logged out successfully."}), 200


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    """
    GET /api/auth/me
    Returns the current user's public profile.
    Used by the frontend to verify session state on page load.
    """
    user = db.session.get(User, session["user_id"])
    if not user:
        session.clear()
        return jsonify({"error": "User not found."}), 404

    return jsonify({
        "id":       user.id,
        "username": user.username,
        "role":     user.role,
    }), 200
