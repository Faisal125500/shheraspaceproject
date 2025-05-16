from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE,
                    password TEXT)''')
    c.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in c.fetchall()]
    if 'name' not in columns:
        c.execute('ALTER TABLE users ADD COLUMN name TEXT')
    c.execute('''CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    task_name TEXT,
                    status INTEGER)''')
    conn.commit()
    conn.close()

def ensure_due_date_column():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute("PRAGMA table_info(tasks)")
    columns = [col[1] for col in c.fetchall()]
    if 'due_date' not in columns:
        c.execute("ALTER TABLE tasks ADD COLUMN due_date TEXT")
        conn.commit()
    conn.close()

init_db()
ensure_due_date_column()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password']
    name = data.get('name', '')
    
    # Use a consistent method to hash passwords
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (email, password, name) VALUES (?, ?, ?)", (email, hashed_password, name))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Signup successful'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'message': 'User already exists'}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    
    conn = sqlite3.connect('tasks.db')
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    c = conn.cursor()
    
    c.execute("SELECT id, password, name FROM users WHERE email=?", (email,))
    user = c.fetchone()
    
    if user and check_password_hash(user[1], password):
        conn.close()
        return jsonify({'user_id': user[0], 'name': user[2], 'email': email})
    
    conn.close()
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/tasks/<int:user_id>', methods=['GET'])
def get_tasks(user_id):
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    
    # Include due_date in the query
    c.execute("SELECT id, task_name, status, due_date FROM tasks WHERE user_id=?", (user_id,))
    tasks = [{'id': row[0], 'task_name': row[1], 'status': bool(row[2]), 'due_date': row[3]} for row in c.fetchall()]
    
    conn.close()
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    user_id = data['user_id']
    task_name = data['task_name']
    due_date = data.get('due_date')
    
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    
    if due_date:
        c.execute("INSERT INTO tasks (user_id, task_name, status, due_date) VALUES (?, ?, 0, ?)", 
                 (user_id, task_name, due_date))
    else:
        c.execute("INSERT INTO tasks (user_id, task_name, status) VALUES (?, ?, 0)", 
                 (user_id, task_name))
    
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task added'}), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    status = data.get('status')
    task_name = data.get('task_name')
    due_date = data.get('due_date')
    
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    
    update_fields = []
    params = []
    
    if status is not None:
        update_fields.append('status=?')
        params.append(int(status))
    if task_name is not None:
        update_fields.append('task_name=?')
        params.append(task_name)
    if due_date is not None:
        update_fields.append('due_date=?')
        params.append(due_date)
    
    params.append(task_id)
    
    if update_fields:
        c.execute(f"UPDATE tasks SET {', '.join(update_fields)} WHERE id=?", params)
        conn.commit()
    
    conn.close()
    return jsonify({'message': 'Task updated'})

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    
    c.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    conn.commit()
    
    conn.close()
    return jsonify({'message': 'Task deleted'})

if __name__ == '__main__':
    app.run(debug=True)
