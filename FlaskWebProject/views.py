"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
import app
from songdictionary import getSentValue
from songdictionary import getSongUrlFromValue
from flask import request
from flask import abort, redirect, url_for
from html_rip import link_or_nah, to_text, get_html, visible
from mood import determineSubject

if __name__ == '__main__':
    app.debut = True
    app.run(debug=True)

@app.route('/', methods=['POST', 'GET'])
def home():
    if request.method == 'POST':
        text = request.form['weblink']
        soundtype = request.form['soundtype']
        # print("from soundtype: ")
        return redirect(url_for('music', text=text, soundtype=soundtype))
    else:
        return render_template('index.html')


@app.route('/music')
def music():
    text = request.args['text']
    soundtype = request.args['soundtype']
    print("soundtype: " + request.args['soundtype'])
    # if text is a link call mains
    if link_or_nah(text):
      text = to_text(text) 
    else:
      text = text    

    sentiment = float(determineSubject(text))
    value = getSentValue(sentiment)
    songUrl = getSongUrlFromValue(sentiment)   
    return render_template('music.html', text=text, sentiment = sentiment, songUrl=songUrl, value=value, soundtype=soundtype)
