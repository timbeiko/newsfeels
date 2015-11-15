/* sentiment-song-creator.js
 * 
 * Created by: Nick Usoff
 * Created on: 11-15-2015
 *
 * Purpose: This library has one public function: createSounds. It takes a 
 * sentiment value, a tempo, and a duration. It creates and plays a MIDI file
 * of the duration and tempo given
 *
 * Usage: SentimentSongCreator.createSound(sentiment_val, tempo, duration)
 *
 * Dependencies: There are a few javascript libraries you must have included 
 * in your code in order to run this. They are (as structured in my directory):
 *
    <!-- polyfill -->
	<script src="inc/shim/Base64.js" type="text/javascript"></script>
	<script src="inc/shim/Base64binary.js" type="text/javascript"></script>
	<script src="inc/shim/WebAudioAPI.js" type="text/javascript"></script>
	<!-- midi.js package -->
	<script src="js/midi/audioDetect.js" type="text/javascript"></script>
	<script src="js/midi/gm.js" type="text/javascript"></script>
	<script src="js/midi/loader.js" type="text/javascript"></script>
	<script src="js/midi/plugin.audiotag.js" type="text/javascript"></script>
	<script src="js/midi/plugin.webaudio.js" type="text/javascript"></script>
	<script src="js/midi/plugin.webmidi.js" type="text/javascript"></script>
	<!-- utils -->
	<script src="js/util/dom_request_xhr.js" type="text/javascript"></script>
	<script src="js/util/dom_request_script.js" type="text/javascript"></script> 
 * 
 */ 


// HELPER FUNCTIONS: 

// abs_sqrt: Used you need the negative of a squareroot of a negative value
function abs_sqrt(num){
	if(num < 0)
		return -Math.sqrt(-num)
	return Math.sqrt(num)
}


var SentimentSongCreator = {

	// create_sound: takes a sentiment value (between -1 and 1), a tempo (a 
	// positive value representing a BPM value), and a duration in seconds
    // which is optional and will be set to 60 if nothing is provided

    createSound: function(sentiment_val, tempo, duration) {
    	MIDI.loadPlugin({
			soundfontUrl: "/static/scripts/sentiment-song-creator/soundfont/",
			instrument: "acoustic_grand_piano",
			onprogress: function(state, progress) {
				console.log(state, progress);
			},
			onsuccess: function() {
				MIDI.setVolume(0, 127);

				if(!duration){
					duration = 60
				}

				if(sentiment_val >= 0){
					sentiment = "positive"
				} else {
					sentiment = "negative"
				}


				/* negative sentiment patterns */
				negative_patterns = [ 
					[3, .75, .25],
				 	[2, 2],
				 	[.5, 1.5, 2],
				 	[1, .5, 1, .5, 1],
				 	[1, 1, .75, .25, 1] 
				]

				/* positive sentiment patterns */
				positive_patterns = [
					[.125, .125, .125, .625, .125, .125, .75, 2],
					[.25, .25, .25, .25, .25, .25, .5, 2],
					[1, 1, 1, 1],
					[.5, 1, .5, 2],
					[.5, .5, 1, .5, .5, .1]
				]

				/* patterns that could be used by either */
				neutral_patterns = [
					[1, 1.5, .5, 1],
					[1.5, 1.5, 1],
					[1, 1.5, .5, 1],
					[2, 1, 1],
					[1, .5, .5, .5, 1.5]
					[1.25, .75, .75, .25, 1]
				]

				/* negative sentiment intervals */
				negative_key_pats = {
					4: {
						0: [[0, 3, 7], [0, 4, 7], [0, 4, 7], [0, 4, 8]],
						1: [[1], [-6, 1], [-5, 2], [-6, 0, 4]],
						2: [[4], [1], [0, 4], [0, 3]],
						length: 3
					},
					5: {
						0: [[1], [7], [3], [2, 4], [3], [-2, 4]],
						1: [[-3], [-2], [4], [0], [-3, 0, 4]],
						2: [[6], [4], [-3, 4], [0], [-3, 0]],
						length: 3
					},
					3: {
						0: [[0, 1], [1, 3], [5]], 
						1: [[0, 3, 5, 11], [0, 3, 5, 11], [0, 6]],
						2: [[0, 3], [0, 4], [1, 2]],
						length: 3
					   },
					2: {
						0: [[1, 4], [1, 11]],
						length: 1
					   }
				}

				/* positive sentiment intervals */
				positive_key_pats = {
					4: {
						0: [[0], [0, 4], [0, 4, 7], [0, 4, 7, 12]],
						1: [[0, 4], [0, 5], [0, 2], [0, 4]],
						2: [[0, 5], [4], [5], [7]],
						3: [[0, 5], [2], [4], [0]],
						4: [[2, 18], [2, 6], [0, 7], [0, 4, 7]],
						length: 5
					   },
					5: {
						0: [[-1, 4, 7], [-2, 5], [0], [5], [7]],
						1: [[2], [-2], [0], [17], [0, 3, 7]],
						2: [[2], [5], [7], [5], [0, 4, 7]],
						length: 3
					},
					6: {
						0: [[0], [7], [4], [2, 5], [4], [0, 7]],
						1: [[0, 7], [4], [-1], [2], [0], [0, 7]],
						length: 2
					},
					8: {
						0: [[0], [2], [4], [5], [7], [9], [11], [12]],
						1: [[0], [4], [5], [12], [0, 5], [0, 5], [0, 12], [0, 4, 5, 12]],
						length: 2
					} 
				}

				//Negative base measures
				neg_base = [ 
					[{ note: [-7], dur: 1},
					 { note: [-7], dur: .5},
					 { note: [-7], dur: .5},
					 { note: [-13], dur: 1},
					 { note: [-12], dur: 1}],
					[{ note: [-5], dur: 1},
					 { note: [-7], dur: 1.5},
					 { note: [-11], dur: .5},
					 { note: [-12], dur: 1}],
					[{ note: [-7], dur: 1},
					 { note: [-7], dur: .5},
					 { note: [-6], dur: .5},
					 { note: [-8], dur: .25},
					 { note: [-7], dur: .75},
					 { note: [-7], dur: 1}
					],
					[{ note: [-13], dur: 1},
					 { note: [-13], dur: 1},
					 { note: [-13], dur: 1},
					 { note: [-13], dur: 1}],
					[{ note: [-13], dur: 2},
					 { note: [-13], dur: 2}]

				]

				// pos base numbers
				pos_base = [
					[
						{note: [0, 4, 7, 12], dur: 2},
						{note: [0, 12], dur: 1},
						{note: [0, 12], dur: 1}
					],
					[
						{note: [0, 7], dur: .25},
						{note: [0, 7], dur: .25},
						{note: [0, 7], dur: .25},
						{note: [0, 7], dur: .25},
						{note: [0, 4, 7], dur: 1},
						{note: [0, 4, 7], dur: 1},
						{note: [0, 7], dur: .5},
						{note: [4, 7], dur: .25},
						{note: [4, 7], dur: .25},
					],
					[{
						note: [0, 12], dur: 4
					}]
				]

				//shifting everything down an octave in the pos_base array
				for(var i = 0; i < pos_base.length; i++){
					for(var j = 0; j < pos_base[i].length; j++){
						for(var k = 0; k < pos_base[i][j].note.length; k++){
							pos_base[i][j].note[k] -= 12
						}
					}
				}


				//neutral transforms to notes which affects particular notes
				//rules: 
				// - duration must not exceed the durartion of the given note
				// - must not affect the sentiment

				function transforms(note_dur, type_trans, trans_data){

					if(type_trans == "bravado"){
						// 15% chance of adding pseudo bravado to the last note of a measure

						if((Math.random() * 10) < 1.5){
							var i = note_dur.length - 1
							var i_dur = note_dur[i].dur
							var i_note = note_dur[i].note
							var i_diff = 1

							terminator = note_dur.length + 4
							for(;i < terminator; i++){
								note_dur[i] = {note: i_note + i_diff, dur: .125 }
								i_diff = 0 - i_diff
							}
							note_dur[i] = {note: i_note, dur: i_dur - .625}
						} else {
							// ...
						}
					} else if (type_trans == "velocity"){
						for(var i = 0; i < note_dur.length; i++){
							note_dur[i].velocity = trans_data.velocity
						}
					}
					return note_dur
				}

				/* createNotes
	 			 *	creates a sound for notes (an array of pitches)
	 			 *	returns the start time plus the duration of the note
	 			 */ 

				function createNotes(note, velocity, delay, duration, curr_time, key){
					real_duration = 1 / (tempo / 60) * duration
					for(var i = 0; i < note.length; i++){
						MIDI.noteOn(0, note[i] + key, velocity, delay);
						MIDI.noteOff(0, note[i] + key, delay + real_duration);
					}
					return curr_time + real_duration
				}

				/* createMeasure
				 *	Takes an array of note, duration pairs and
				 * 	constructs Notes out of them. The duration of the notes must
				 *	sum to the length of the measure
				 */

				function createMeasure(note_dur, curr_delay, key, transform){
					tot_delay = curr_delay

					if(note_dur[note_dur.length - 1].dur >= 1){
						note_dur = transforms(note_dur, "bravado")
					}

					//right now velocity is simply a value, TBD make this a curve
					if(transform.velocity){
						note_dur = transforms(note_dur, "velocity", {velocity: transform.velocity})
					}

					for(var i = 0; i < note_dur.length; i++){
						curr_note = note_dur[i]
						curr_note.velocity ? velocity = curr_note.velocity : velocity = 65
						tot_delay = createNotes(curr_note.note, velocity, tot_delay, curr_note.dur, tot_delay, key)
					}
					return tot_delay
				}


				/* pickAPattern
				 *	uses RNG to choose a measure pattern
				 *  TODO - once intrameasure structure becomes a factor, this needs to be updated
				 */

				function pickAPattern(sentiment) {
					if(sentiment == "negative"){
						measure = Math.floor(Math.random() * negative_patterns.length)
						return negative_patterns[measure]
					} else {
						measure = Math.floor(Math.random() * positive_patterns.length)
						return positive_patterns[measure]
					}
				}


				/* pickPitches
				 *	uses RNG to choose pitches, given a pattern array, returns a note, dur pair array
				 *  TODO - actually make this meaningful
				 */

				function pickPitches(sentiment, pattern, key){

				 	note_dur = []
				 	if(sentiment == "negative"){
				 		pos_pats = negative_key_pats[pattern.length]

				 		x = pos_pats

				 		var rand_num = Math.floor(Math.random() * pos_pats.length)
					 	pitch_pat = pos_pats[rand_num]

					 	for(var i = 0; i < pattern.length; i++){
					 		note_dur[i] = {note: pitch_pat[i], dur: pattern[i]}
					 	}
					} else {
						for(var i = 0; i < pattern.length; i++){
							pos_pats = positive_key_pats[pattern.length]
						 	pitch_pat = pos_pats[Math.floor(Math.random() * pos_pats.length)]
						 	for(var i = 0; i < pattern.length; i++){
						 		note_dur[i] = {note: pitch_pat[i], dur: pattern[i]}
						 	}
					 	}
					}
				 	return note_dur
				 } 

				// We want a mix of positive and negative sentiments in the upper melodies in 
				// order to account for a non-absolute positive or negative. 

				// NOTE: Right now, using a sqrt function to amplify the effect of the sentiment_value
				
				function pick_sentiment () {
					var cutoff = abs_sqrt(sentiment_val) * .5 + .5
					if(Math.random() < cutoff){
						return "positive"
					} else {
						return "negative"
					}
				}

				//choose a key to work in 
				if(sentiment == "positive"){
					var key = Math.floor(Math.floor(Math.random() * 10)) + 60
				} else {
					var key = Math.floor(Math.floor(Math.random() * 10)) + 45
				}

				// Key Changes
				negative_keychanges = [
					[
					 	{pitch: 0, dur: 2},
					 	{pitch: 2, dur: 2},
					 	{pitch: -2, dur: 2}
					]
				]

				positive_keychanges = [
					[
						{pitch: 2, dur: 2},
						{pitch: 7, dur: 2},
						{pitch: 0, dur: 4}
					]
				]

				//used to keep track of total ellapsed time to keep sounds in the right place
				tot_time = 0

				// 
				function choose_key_change(sentiment){
					if(sentiment == "negative")
						return negative_keychanges[Math.floor(Math.random() * negative_keychanges.length)]
					return positive_keychanges[Math.floor(Math.random() * positive_keychanges.length)]
				}

				key_change = choose_key_change(sentiment)
				key_counter = 0
				key_ind = 0
				var orig_key = key 

				//duration of a song is # of measures * 4 * (60 / tempo)
				num_measures = Math.floor(duration / (4 * (60 / tempo)))

				for(var i = 0; i < num_measures; i++){
					temp_sent = pick_sentiment();

					if(key_counter < key_change[key_ind].dur){
						key = orig_key + key_change[key_ind].pitch
						key_counter++
					} else if(key_ind < key_change.length - 1){
						key_counter = 0
						key_ind += 1
						key = orig_key + key_change[key_ind].pitch
					} else {
						key_change = choose_key_change(sentiment)
						key_counter = 0
						key_ind = 0
					}

					pattern = pickAPattern(temp_sent);

					note_dur = pickPitches(temp_sent, pattern, key);

					var base_note_dur_pos = [
						{note: [0, 4, 7, 12], dur: 2},
						{note: [0, 12], dur: 1},
						{note: [0, 12], dur: 1}
					]
					var base_note_dur_neg = [
						{note: [-7], dur: 1},
						{note: [-7], dur: 1},
						{note: [-13], dur: 1},
						{note: [-12], dur: 1},
					]

					var base_note_dur_neutral = [
						{note: [-24, -12], dur: 1},
						{note: [-24, -12], dur: 1},
						{note: [-24, -12], dur: 1},
						{note: [-24, -12], dur: 1}
					]

					if(Math.abs(sentiment_val) < .09){
						createMeasure(base_note_dur_neutral, tot_time, key, {velocity: (-sentiment_val * 30) + 40})
					} 
					else if(sentiment == "negative"){
						createMeasure(neg_base[Math.floor(i % pos_base.length)], tot_time, key, {velocity: (-sentiment_val * 30) + 40})
					} else {
						createMeasure(pos_base[ Math.floor(i % 2)], tot_time, key, {velocity: 20})
					}
					tot_time = createMeasure(note_dur, tot_time, key, {})
				}
			}
		});
    },
    
}