# Moodloop

A mood-based music loop composer built with React, Vite, Tailwind CSS, and Tone.js.

## Overview
Users pick a mood, compose a 16-step loop using four track types (chords, melody, bass, percussion), and save entries to a local journal.

## Tech Stack
- **Frontend**: React 19 + Vite 7 + Tailwind CSS 4
- **Audio**: Tone.js v15
- **Routing**: React Router v7
- **Storage**: localStorage (via `src/utils/storage.js`)

## Project Structure
```
src/
  App.jsx              - Router setup
  main.jsx             - Entry point
  index.css            - Global styles
  pages/
    Home.jsx           - Journal list view
    Composer.jsx       - Mood picker + step sequencer + save flow
    Detail.jsx         - Entry detail view
  components/
    MoodPicker.jsx     - Mood selection grid
    StepGrid.jsx       - Step grid per track (16 steps standard, 8 in Jam Mode) with instrument selector
    Transport.jsx      - Play/Pause/Stop controls, BPM slider, Jam Mode toggle
    EntryCard.jsx      - Journal entry card
  utils/
    audio.js           - Tone.js instrument definitions, note arrays, LoopEngine class
    moods.js           - Mood definitions (calm, hopeful, sad, anxious, energized)
    storage.js         - localStorage CRUD helpers
```

## Key Features
- 5 mood types with color theming
- 4 track types: Chords (5 instruments), Melody (7 instruments), Bass (5 instruments), Percussion (5 drum kits)
- Jam Mode: 8-step grid with pentatonic scale (C D E G A) and curated instruments (2 per track) so any combination sounds harmonious
- BPM control (60-140)
- Journal with save/edit/delete

## Development
- Dev server: `npm run dev` on port 5000
- Build: `npm run build` → outputs to `dist/`
- Deployment: configured as static site
