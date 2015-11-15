heroku ps:scale web=1
web: gunicorn newsfeels:app --log-file -
worker: python worker.py