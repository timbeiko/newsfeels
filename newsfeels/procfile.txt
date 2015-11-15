web: gunicorn newsfeels.wsgi
web: python __init__.py
heroku ps:scale web=1
worker: python worker.py