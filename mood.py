from __future__ import print_function
from alchemyapi import AlchemyAPI
from flask import request
import requests
from flask import Flask, render_template
def determineSubject(text):
  alchemyapi = AlchemyAPI()
  response = alchemyapi.sentiment('text', text, {'sentiment': 1})
  if response['status'] == 'OK':
    return response['docSentiment']['score']