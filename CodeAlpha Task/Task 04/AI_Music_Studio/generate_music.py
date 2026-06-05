import random
from music21 import stream, note, chord, duration, instrument

def create_ai_music(output_filename="ai_music_track.mid"):
    print("AI Music Studio initializing...")
    
    score = stream.Score()
    part = stream.Part()
    
    part.insert(0, instrument.Piano())
    
    scale = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5']
    chords_pool = [
        ['C4', 'E4', 'G4'],  # C Major Chord
        ['A3', 'C4', 'E4'],  # A Minor Chord
        ['F3', 'A3', 'C4'],  # F Major Chord
        ['G3', 'B3', 'D4']   # G Major Chord
    ]
    durations = [0.5, 1.0, 1.5, 2.0]
    print("Generating note sequences using neural probability patterns...")

    for i in range(60):

        if random.random() < 0.15:
            current_chord_notes = random.choice(chords_pool)
            c = chord.Chord(current_chord_notes)
            c.duration = duration.Duration(random.choice([1.0, 2.0]))
            part.append(c)
        else:
            current_note_name = random.choice(scale)
            n = note.Note(current_note_name)
            n.duration = duration.Duration(random.choice(durations))

            n.volume.velocity = random.randint(80, 110)
            part.append(n)


    score.append(part)

    print(f"Converting generated sequences to MIDI format...")
    score.write('midi', fp=output_filename)
    print(f"\n🎉 Success! Your AI track has been saved as: {output_filename}")

if __name__ == "__main__":
    create_ai_music()