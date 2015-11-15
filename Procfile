web: gunicorn newsfeels.wsgi
web: gunicorn app:app --log-file=-
web: python __init__.py
heroku ps:scale web=1
worker: python worker.py