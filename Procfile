heroku ps:scale web=1
web: gunicorn views:app --log-file -
web: gunicorn __init__:app --log-file -
worker: python worker.py