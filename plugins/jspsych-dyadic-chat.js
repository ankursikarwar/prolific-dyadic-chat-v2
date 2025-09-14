/*! DyadicChat plugin — vG6h-turnsfix */
(function(){
  'use strict';
  const BUILD='vG6h-turnsfix'; console.log('[DyadicChat plugin]', BUILD);

  const info = { name: 'dyadic-chat', parameters: {
    socketUrl: { type: String, default: '' },
    prolific: { type: Object, default: {} },
    min_turns: { type: Number, default: 10 },
    wait_timeout_sec: { type: Number, default: 120 },
    goal_question: { type: String, default: '' },
    answer_options: { type: Array,  default: [] },
    instructions_html: { type: String, default: '' },
    image_url: { type: String, default: '' }
  }};

  function styleTag(){
    return [
      '<style id="dyadic-styles">',
      ':root { --bg:#000; --panel:#0b0b0b; --panel-alt:#0f0f10; --border:#3e3e42; --border-soft:#2c2c2e; --text:#fff; --muted:#d0d4d9; --radius:12px; --shadow:0 1px 0 rgba(255,255,255,0.02), 0 6px 16px rgba(0,0,0,0.35); }',
      '.dc-root { position:fixed; inset:0; background:var(--bg); color:var(--text); height:100dvh; width:100vw; padding:20px; box-sizing:border-box; overflow:hidden; font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }',
      '.dc-grid { display:grid; height:100%; width:100%; grid-template-columns: 28fr 44fr 28fr; gap:16px; box-sizing:border-box; }',
      '.dc-panel { background:var(--panel); border:1px solid var(--border); border-radius:var(--radius); padding:12px; min-height:0; min-width:0; box-sizing:border-box; box-shadow: var(--shadow); }',
      '.dc-panel.dc-left { padding:20px; }',
      '.dc-title { font-weight:700; margin:0; color:var(--text); letter-spacing:.2px; font-size:27px; }',
      '.dc-title-row { margin-left:8px; margin-right:8px; margin-bottom:2px; display:flex; justify-content:space-between; align-items:center; gap:10px; }',
      '.dc-small { color:var(--muted); }',
      '#dc-turns, #dc-turns-total { color:#ff4d4f; font-weight:800; }',
      '.dc-image { width:100%; height:100%; min-height:0; background:#0e0e10; display:flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow: var(--shadow); }',
      '.dc-center { display:grid; grid-template-rows: minmax(0,63%) minmax(0,37%); height:100%; min-height:0; box-sizing:border-box; row-gap:16px; }',
      '.dc-center-bottom.single-box { background:var(--panel); border:1px solid var(--border); border-radius:var(--radius); padding:12px 12px 14px 12px; min-height:0; overflow:auto; display:flex; flex-direction:column; align-items:center; text-align:center; box-shadow: var(--shadow); }',
      '.dc-goal-title { margin-top:5px; margin-bottom:15px; color:#fff; font-weight:700; font-size:25px; }',
      '.dc-question { color:#fff; font-size:18px; font-weight:600; line-height:1.35; margin-top:0px; margin-bottom:0px; overflow:auto; height:74px; max-width:720px; }',
      '.dc-qa-wrap { max-width:720px; width:100%; margin:0 auto; text-align:center; display:flex; flex-direction:column; align-items:center; min-height:0; height:100%; }',
      '.dc-answers { display:block; width:100%; max-width:720px; margin:8px auto; text-align:left; }',
      '.dc-answer-option { display:flex; align-items:center; justify-content:flex-start; gap:8px; margin:8px !important; }',
      '.dc-answer-option span { font-size:17px !important; }',
      '.dc-availability-note { margin-top:8px; margin-bottom:9px; font-size:15px; font-weight:bold; color:var(--muted); }',
      '#dc-submit { font-size:16px; margin-top:auto; margin-bottom:4px; }',
      '.dc-right { display:grid; grid-template-rows: auto minmax(0,1fr) auto auto; row-gap:7px; height:100%; min-height:0; box-sizing:border-box; }',
      '.dc-chatbox { min-height:0; height:auto; overflow:auto; background:var(--panel-alt); border:1px solid var(--border); border-radius:var(--radius); padding:8px; }',
      '.dc-row { width:100%; display:block; margin:0px 0; font-size:15px; line-height:1.35; text-align:left; }',
      '.dc-me { text-align:left; }',
      '.dc-partner { text-align:right; }',
      '.dc-bubble { display:inline-block; padding:6px 12px; border-radius:12px; border:1px solid var(--border-soft); max-width:85%; word-wrap:break-word; box-shadow: 0 1px 0 rgba(255,255,255,0.02), 0 2px 8px rgba(0,0,0,0.25); }',
      '.dc-bubble-me { background:rgba(125, 211, 252, 0.08); color:#8bd5ff; }',
      '.dc-bubble-partner { background:rgba(255, 77, 79, 0.08); color:#ff6b6e; }',
      '.dc-controls { margin-top:4px; background:transparent; border:none; border-radius:0; padding:0; display:grid; grid-template-columns: 1fr auto; column-gap:8px; box-shadow:none; }',
      '.dc-input { flex:1; width:100%; min-width:0; box-sizing:border-box; padding:12px 14px; font-size:14px; border-radius:10px; border:1px solid var(--border); background:#0c0c0d; color:#fff; outline:none; }',
      '.dc-btn { padding:10px 12px; border-radius:10px; border:1px solid var(--border); background:linear-gradient(180deg, #1f1f22, #151518); color:#fff; cursor:pointer; white-space:nowrap; }',
      '.dc-btn:disabled { opacity:.5; cursor:not-allowed; }',
      '.dc-hint { font-size:14px !important; font-weight:bold; color:#d0d4d9; margin-top:2px !important; padding:0 10px; }',
      '.dc-wait { height:100dvh; width:100vw; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:14px; }',
      '.dc-spinner { width:42px; height:42px; border-radius:50%; border:4px solid #2a2a2d; border-top-color:#7dd3fc; animation: dcspin 1s linear infinite; }',
      '@keyframes dcspin { to { transform: rotate(360deg); } }',
      '</style>'
    ].join('');
  }

  class DyadicChat {
    constructor(jsPsych){ this.jsPsych = jsPsych; }

    trial(display_element, trial){
      const self = this;
      let pairedPayload = null;

      function htmlWait(){
        return styleTag() + [
          '<div class="dc-wait">',
          '  <div class="dc-spinner"></div>',
          '  <div style="font-size:18px; color:#d0d4d9;">Waiting for another participant to join…</div>',
          '  <div style="font-size:13px; color:#9aa0a6;">Please keep this tab open. We’ll begin as soon as you’re paired.</div>',
          '</div>'
        ].join('');
      }

      function htmlChat(p){
        const item = (p && p.item) || null;
        const minTurns = (p && p.min_turns) || trial.min_turns;
        const imgTag = (item && item.image_url) ? '<img src="' + item.image_url + '" alt="scene" style="width:100%;height:100%;object-fit:contain;">' : '<div style="color:#777">No image</div>';
        const opts = (item && item.options) || trial.answer_options || [];
        const goalQ = (item && item.goal_question) || trial.goal_question || '';

        return styleTag() + [
          '<div class="dc-root">',
          '  <div class="dc-grid">',
          '    <section class="dc-panel dc-left" style="overflow:auto; min-height:0;">',
          '      <div class="dc-title">Instructions</div>',
          '      <div class="dc-instructions">', (trial.instructions_html || ''), '</div>',
          '    </section>',
          '    <section class="dc-center">',
          '      <div class="dc-image">', imgTag, '</div>',
          '      <section class="dc-center-bottom single-box">',
          '        <div class="dc-qa-wrap">',
          '          <h3 class="dc-goal-title">Goal Question</h3>',
          '          <div class="dc-question">', goalQ, '</div>',
          '          <div id="dc-answer-group" class="dc-answers">',
                     opts.map(function(opt){
                       return [
                         '<label class="dc-answer-option">',
                         '  <input type="radio" name="dc-answer" value="', String(opt).replace(/"/g,'&quot;'), '" disabled />',
                         '  <span>', String(opt), '</span>',
                         '</label>'
                       ].join('');
                     }).join(''),
          '          </div>',
          '          <div class="dc-availability-note">Only becomes accessible when ' + String(minTurns) + ' turns are completed.</div>',
          '          <button id="dc-submit" class="dc-btn dc-submit" disabled>Submit Answer</button>',
          '        </div>',
          '      </section>',
          '    </section>',
          '    <section class="dc-panel dc-right">',
          '      <div class="dc-title-row">',
          '        <div class="dc-title">ChatBox</div>',
          '        <div class="dc-small" style="font-size:14px; font-weight:bold;">',
          '          <span>Number of Turns&nbsp;&nbsp;</span>',
          '          <span id="dc-turns">0</span> / <span id="dc-turns-total">', String(minTurns), '</span>',
          '        </div>',
          '      </div>',
          '      <div id="dc-chat" class="dc-chatbox" aria-live="polite"></div>',
          '      <div class="dc-controls">',
          '        <input id="dc-msg" class="dc-input" placeholder="Type your message" autocomplete="off" />',
          '        <button id="dc-send" class="dc-btn">Send</button>',
          '      </div>',
          '      <div id="dc-hint" class="dc-small dc-hint">Only one message at a time. Wait for your partner to respond.</div>',
          '    </section>',
          '  </div>',
          '</div>'
        ].join('');
      }

      // Socket + state
      const socket = io(trial.socketUrl, { query: { pid: (trial.prolific && trial.prolific.PID) || 'DEBUG_LOCAL' } });
      let myTurn = false, chatClosed = false;
      let msgCount = 0; // count messages from both users
      const t0 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

      function updateTurns(){
        var completedTurns = Math.floor(msgCount / 2);
        var a = document.getElementById('dc-turns'); if (a) a.textContent = String(completedTurns);
        var sendBtn = document.getElementById('dc-send');
        var msg = document.getElementById('dc-msg');
        var allow = myTurn && !chatClosed;
        if (sendBtn) sendBtn.disabled = !allow;
        if (msg) msg.disabled = !allow;
        var ansInputs = Array.prototype.slice.call(document.querySelectorAll('input[name="dc-answer"]'));
        var submitBtn = document.getElementById('dc-submit');
        var threshold = ((pairedPayload && pairedPayload.min_turns) || trial.min_turns || 10);
        var canAnswer = chatClosed || (completedTurns >= threshold);
        ansInputs.forEach(function(el){ el.disabled = !canAnswer; });
        if (submitBtn) submitBtn.disabled = !canAnswer;
        var hint = document.getElementById('dc-hint');
        if (hint){
          if (chatClosed) hint.textContent = 'Maximum number of turns reached. Answer the question now.';
          else hint.textContent = myTurn ? 'It’s your turn. Type your message.' : 'Only one message at a time. Wait for your partner to respond.';
        }
      }

      function addLine(who, text){
        const box = document.getElementById('dc-chat'); if (!box) return;
        const line = document.createElement('div'); line.className = 'dc-row ' + (who==='Me'?'dc-me':'dc-partner');
        const bubble = document.createElement('span'); bubble.className = 'dc-bubble ' + (who==='Me'?'dc-bubble-me':'dc-bubble-partner');
        bubble.innerHTML = '<b>' + who + ':</b> ' + text;
        line.appendChild(bubble); box.appendChild(line); box.scrollTop = box.scrollHeight;
      }

      function sendMsg(){
        const el = document.getElementById('dc-msg');
        const text = (el && el.value || '').trim(); if (!text) return;
        if (!myTurn || chatClosed) return;
        addLine('Me', text);
        msgCount += 1; updateTurns();
        socket.emit('chat:message', { text: text });
        el.value = '';
      }

      function submitAnswer(){
        const el = document.querySelector('input[name="dc-answer"]:checked');
        if (!el) return;
        const nowTs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const rt = Math.round(nowTs - t0);
        socket.emit('answer:submit', { choice: el.value, rt: rt });
        display_element.innerHTML = '<div style="padding:40px; font-size:20px;">Thanks! Your response was submitted. You may close the tab.</div>';
        self.jsPsych.finishTrial({ turns: Math.floor(msgCount/2), choice: el.value, rt: rt });
      }

      // Blocked reasons from server
function showBlocked(msg){
  display_element.innerHTML = styleTag() + '<div class="dc-wait"><div class="dc-spinner"></div><div style="font-size:18px;color:#d0d4d9;margin-top:8px;">' + msg + '</div></div>';
  try { self.jsPsych.finishTrial({ blocked: msg }); } catch {}
}
socket.on('blocked:repeat_pid', function(){ showBlocked('You have already participated in this study (one session per Prolific account).'); });
socket.on('blocked:deck_complete', function(){ showBlocked('This study is currently full. All items have been completed. Thank you!'); });

      // Phase 1: waiting
      display_element.innerHTML = htmlWait();

      // Phase 2: render chat on pairing
      socket.on('paired', function(p){
        pairedPayload = p || {};
        display_element.innerHTML = htmlChat(pairedPayload);
        const sendBtn = document.getElementById('dc-send');
        const msgEl = document.getElementById('dc-msg');
        const subBtn = document.getElementById('dc-submit');
        if (sendBtn) sendBtn.addEventListener('click', sendMsg);
        if (msgEl) msgEl.addEventListener('keydown', function(e){ if (e.key==='Enter'){ e.preventDefault(); sendMsg(); } });
        if (subBtn) subBtn.addEventListener('click', submitAnswer);
        updateTurns();
      });

      // Live events
      socket.on('chat:message', function(msg){ addLine('Partner', msg.text); msgCount += 1; updateTurns(); });
      socket.on('turn:you', function(){ myTurn = true; updateTurns(); });
      socket.on('turn:wait', function(){ myTurn = false; updateTurns(); });
      socket.on('chat:closed', function(){ chatClosed = true; updateTurns(); });
      socket.on('end:self', function(){
        display_element.innerHTML = '<div style="padding:40px; font-size:20px;">Thanks! Your response was submitted. You may close the tab.</div>';
        self.jsPsych.finishTrial({ turns: Math.floor(msgCount/2), ended:'self' });
      });
    }
  }

  DyadicChat.info = info;
  window.jsPsychDyadicChat = DyadicChat;
})();