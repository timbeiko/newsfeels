from __future__ import print_function
from alchemyapi import AlchemyAPI
def determineSubject(text):
  alchemyapi = AlchemyAPI()
  response = alchemyapi.sentiment('text', text, {'sentiment': 1})
  if response['status'] == 'OK':
    return response['docSentiment']['score'] + '\n' + render_template('index.html')