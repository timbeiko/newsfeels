# Use a switch statement to correlate that value to our code
def getSentValue(value):
  if    ((-1.0 <= value) and (value < -0.8)):
      sentValue = -1.0
  elif  ((-0.8 <= value) and (value < -0.6)):
      sentValue = -0.8
  elif  ((-0.6 <= value) and (value < -0.4)):
      sentValue = -0.6
  elif  ((-0.4 <= value) and (value < -0.2)):
      sentValue = -0.4
  elif  ((-0.2 <= value) and (value <  0.0)):
      sentValue = -0.2
  elif  (( 0.0 <= value) and (value <  0.2)):
      sentValue =  0.0
  elif  (( 0.2 <= value) and (value <  0.4)):
      sentValue =  0.2
  elif  (( 0.4 <= value) and (value <  0.6)):
      sentValue =  0.4
  elif  (( 0.6 <= value) and (value <  0.8)):
      sentValue =  0.6
  elif  (( 0.8 <= value) and (value <  0.9)):
      sentValue =  0.8
  else:
      sentValue =  1.0
  return sentValue

# Returns url of song with 
def getSongUrlFromValue(value):
  sentValue = getSentValue(value)
  songdisc = {-1.0 : 'saddest song', 
              -0.8 : 'sadder song',
              -0.6 : 'saddish song',
              -0.4 : 'https://newsfeels.blob.core.windows.net/songs/-04_georgia',
              -0.2 : 'sad song', 
               0.0 : 'okay song', 
               0.2 : 'https://newsfeels.blob.core.windows.net/songs/02_wonderful_world', 
               0.4 : 'https://newsfeels.blob.core.windows.net/songs/04_sweet_home',
               0.6 : 'https://newsfeels.blob.core.windows.net/songs/06_3005',
               0.8 : 'happiysh song',
               1.0 : 'https://newsfeels.blob.core.windows.net/songs/10_happy'} 
  return songdisc[sentValue]