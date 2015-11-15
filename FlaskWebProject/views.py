"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
from FlaskWebProject import app
from songdictionary import getSentValue
from songdictionary import getSongUrlFromValue
from html_ripper import main
from flask import request

if __name__ == '__main__':
    app.debut = True
    app.run()

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        article = linkToText('hi')
        return redirect(url_for('music', article = article)
    else:
    return render_template('index.html')

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )

@app.route('/music')
def music():
    article = article
    value = 0.2
    link = getSongUrlFromValue(value)
    return render_template('music.html', songUrl = link)
