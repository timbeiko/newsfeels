"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
from FlaskWebProject import app
from songdictionary import getSentValue
from songdictionary import getSongUrlFromValue

@app.route('/')
@app.route('/home')
def home(): 
    return render_template()

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
    value = 0.2
    link = getSongUrlFromValue(value)
    return render_template('music.html', songUrl = link)
