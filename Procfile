heroku ps:scale web=1
web: gunicorn nameapp:app --log-file -
worker: python worker.py