"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
from FlaskWebProject import app
from songdictionary import getSentValue
from songdictionary import getSongUrlFromValue
from flask import request
from flask import abort, redirect, url_for
from html_rip import link_or_nah, to_text, get_html, visible

if __name__ == '__main__':
    app.debut = True
    app.run(debug=True)

@app.route('/', methods=['POST', 'GET'])
def home():
    if request.method == 'POST':
        text = request.form['weblink']
        return redirect(url_for('music', text=text))
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
    text = request.args['text']
    # if text is a link call mains
    if link_or_nah(text):
      text = to_text(text) # this is not working
    else:
      text = text          # this works
    #text = urlToText(text)
    # print text
    # value = 0.2
    # link = getSongUrlFromValue(value)
    return render_template('music.html', text=text)
