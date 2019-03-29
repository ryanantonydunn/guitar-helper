class GuitarIntervals {
  constructor(id) {
    /* eslint-disable */
    this.strings = ["E","B","G","D","A","E"];
    this.notes = ["C","D&flat;","D","E&flat;","E","F","F&sharp;","G","A&flat;","A","B&flat;","B"];
    this.intervals = ["R","&flat;2","2","&flat;3","3","4","&flat;5","5","&flat;6","6","&flat;7","7"];
    this.cols = ["green","indigo","darkviolet","tomato","orangered","darkcyan","mediumorchid","mediumvioletred","mediumslateblue","royalblue","firebrick","brown"];
    /* eslint-enable */
    this.patterns = {
      "major-triad": [0, 4, 7],
      "minor-triad": [0, 3, 7],
      "major-pentatonic": [0, 2, 4, 7, 9],
      "minor-pentatonic": [0, 3, 5, 7, 10],
      "major-scale": [0, 2, 4, 5, 7, 9, 11]
    };

    const keyOptions = this.notes
      .map((n, i) => `<option value="${i}">${n}</option>`)
      .join();
    const patternOptions = Object.keys(this.patterns)
      .map(k => `<option>${k}</option>`)
      .join();

    this.app = document.getElementById(id);
    this.app.innerHTML = `
    <div id="fretboard"></div>
    <div class="controls">
      <select id="keySelect">${keyOptions}</select> &nbsp;
      <select id="patternSelect">${patternOptions}</select> &nbsp;
      <label for="showNotes"><input id="showNotes" type="checkbox" /> Show notes</label>
    </div>
    `;
    this.fretboard = document.getElementById("fretboard");
    this.keySelect = document.getElementById("keySelect");
    this.keySelect.addEventListener("change", () => {
      this.draw();
    });
    this.patternSelect = document.getElementById("patternSelect");
    this.patternSelect.addEventListener("change", () => {
      this.draw();
    });
    this.showNotes = document.getElementById("showNotes");
    this.showNotes.addEventListener("change", () => {
      this.draw();
    });
  }

  el(parent, className, content, type) {
    const newEl = document.createElement(type || "div");
    newEl.className = className || "";
    newEl.innerHTML = content || "";
    parent.appendChild(newEl);
    return newEl;
  }

  draw() {
    const pattern = this.patterns[patternSelect.value];
    const matches = pattern.map(
      offset => (parseInt(this.keySelect.value) + offset) % this.notes.length
    );
    this.fretboard.innerHTML = "";
    this.strings.forEach((note, stringIndex) => {
      const tr = this.el(this.fretboard, "tr");
      const openIndex = this.notes.indexOf(note);
      for (let i = 0; i < 25; i++) {
        const td = this.el(tr, "td");
        const noteIndex = (openIndex + i) % this.notes.length;
        if (this.showNotes.checked) {
          this.el(td, "note", this.notes[noteIndex]);
        }
        const dotMiddle =
          stringIndex === 2 && [3, 5, 7, 9, 15, 17, 19, 21].includes(i);
        const dotEdge = [1, 3].includes(stringIndex) && [12, 24].includes(i);
        if (dotMiddle || dotEdge) {
          this.el(td, "dot");
        }
        const match = (matchNoteIndex, arrayIndex) => {
          if (noteIndex === matchNoteIndex) {
            const int = this.intervals[pattern[arrayIndex]];
            const matchEl = this.el(td, "match", int);
            matchEl.style.backgroundColor = this.cols[pattern[arrayIndex]];
          }
        };
        matches.forEach(match.bind(this));
      }
    });
  }
}
