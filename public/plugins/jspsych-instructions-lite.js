(function(){
  class JsPsychInstructionsLite {
    constructor(jsPsych){ this.jsPsych = jsPsych; }
    trial(display_element, trial){
      const pages = Array.isArray(trial.pages) ? trial.pages : [];
      let idx = 0;
      const render = () => {
        const prevBtn = trial.show_clickable_nav && idx>0 ? '<button class="jspsych-btn" id="instr-prev">' + (trial.button_label_previous||'Previous') + '</button>' : '';
        const nextLabel = idx < pages.length-1 ? (trial.button_label_next||'Next') : (trial.button_label_finish||'Start chat');
        const nextBtn = trial.show_clickable_nav ? '<button class="jspsych-btn" id="instr-next">' + nextLabel + '</button>' : '';
        display_element.innerHTML = '<div style="max-width:900px;margin:0 auto;text-align:left;color:#fff;">'
          + '<div class="instr-page">' + (pages[idx]||'') + '</div>'
          + '<div style="margin-top:16px; display:flex; gap:8px;">' + prevBtn + nextBtn + '</div></div>';
        if (trial.show_clickable_nav){
          const n = display_element.querySelector('#instr-next'); if (n) n.addEventListener('click', (e)=>{ e.preventDefault(); if (idx < pages.length-1){ idx++; render(); } else { this.jsPsych.finishTrial({ page_index: idx }); } });
          const p = display_element.querySelector('#instr-prev'); if (p) p.addEventListener('click', (e)=>{ e.preventDefault(); if (idx>0){ idx--; render(); } });
        }
      };
      render();
    }
  }
  JsPsychInstructionsLite.info = { name: 'instructions-lite', parameters: { pages: { default: [] }, show_clickable_nav: { default: true }, button_label_next: { default: 'Next' }, button_label_previous: { default: 'Previous' } } };
  window.jsPsychInstructions = JsPsychInstructionsLite;
})();