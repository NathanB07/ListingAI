import { useState, useRef, useEffect } from "react";

// ─── LANDING PAGE COMPONENT ───────────────────────────────────────────────────
function LandingPage({ onStartFree }) {
  return (
    <div style={{ background: "#0c0a06", color: "#f0ebe0", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --gold:#c8a96e;--gold2:#e8c98e;--gold-dim:rgba(200,169,110,0.12);
          --ink:#0c0a06;--ink2:#141008;--ink3:#1c1610;
          --parchment:#f0ebe0;--warm:#c8b890;--muted:#8a7a5a;--dim:#4a3a1a;
          --serif:'Cormorant Garamond',Georgia,serif;
          --mono:'DM Mono',monospace;
          --sans:'DM Sans',sans-serif;
        }
        html{scroll-behavior:smooth;}
        body{background:#0c0a06;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:var(--gold-dim);}
        nav{position:fixed;top:0;left:0;right:0;z-index:900;padding:0 56px;height:72px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(200,169,110,0.1);background:rgba(12,10,6,0.94);backdrop-filter:blur(24px);}
        .logo{display:flex;align-items:center;gap:12px;}
        .logo-mark{width:38px;height:38px;border:1px solid rgba(200,169,110,0.35);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .logo-text{font-family:var(--mono);font-size:16px;letter-spacing:4px;color:var(--gold);font-weight:500;}
        .nav-links{display:flex;align-items:center;gap:36px;}
        .nav-a{font-family:var(--mono);font-size:10px;letter-spacing:2px;color:var(--dim);text-decoration:none;text-transform:uppercase;transition:color 0.2s;cursor:pointer;}
        .nav-a:hover{color:var(--gold);}
        .nav-cta{background:linear-gradient(135deg,var(--gold),#a07840);border:none;border-radius:7px;padding:10px 24px;font-family:var(--mono);font-size:10px;letter-spacing:2px;color:var(--ink);font-weight:500;cursor:pointer;text-transform:uppercase;transition:all 0.22s;}
        .nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(200,169,110,0.25);}
        .hero{min-height:100vh;display:flex;align-items:center;padding:120px 56px 80px;position:relative;overflow:hidden;}
        .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 60% 40%,rgba(200,169,110,0.04),transparent);}
        .hero-content{max-width:600px;position:relative;z-index:2;}
        .hero-eyebrow{font-family:var(--mono);font-size:10px;letter-spacing:4px;color:var(--muted);text-transform:uppercase;margin-bottom:28px;display:flex;align-items:center;gap:12px;}
        .hero-line{width:32px;height:1px;background:var(--gold);opacity:0.5;}
        .hero-h1{font-family:var(--serif);font-size:clamp(52px,6vw,80px);font-weight:300;line-height:1.08;letter-spacing:-0.5px;margin-bottom:24px;}
        .hero-h1 em{color:var(--gold);font-style:italic;}
        .hero-p{font-size:17px;color:var(--muted);line-height:1.85;margin-bottom:44px;font-weight:300;max-width:480px;}
        .hero-actions{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:64px;}
        .btn-primary{background:linear-gradient(135deg,var(--gold),#a07840);border:none;border-radius:9px;padding:15px 34px;font-family:var(--mono);font-size:11px;letter-spacing:2px;color:var(--ink);font-weight:500;cursor:pointer;text-transform:uppercase;transition:all 0.22s;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(200,169,110,0.28);}
        .btn-outline{background:transparent;border:1px solid rgba(200,169,110,0.2);border-radius:9px;padding:15px 34px;font-family:var(--mono);font-size:11px;letter-spacing:2px;color:var(--muted);cursor:pointer;text-transform:uppercase;transition:all 0.22s;}
        .btn-outline:hover{border-color:rgba(200,169,110,0.5);color:var(--gold);}
        .hero-proof{display:flex;gap:40px;}
        .proof-num{font-family:var(--serif);font-size:38px;color:var(--gold);font-weight:600;line-height:1;}
        .proof-label{font-family:var(--mono);font-size:9px;letter-spacing:2px;color:var(--dim);text-transform:uppercase;margin-top:5px;}
        .hero-visual{position:absolute;right:56px;top:50%;transform:translateY(-50%);width:420px;}
        @media(max-width:1100px){.hero-visual{display:none;}.hero-content{max-width:100%;}}
        @media(max-width:768px){nav{padding:0 20px;}.nav-links{gap:16px;}.nav-a{display:none;}.hero{padding:100px 24px 60px;}.hero-proof{gap:24px;}section{padding:70px 24px;}.feat-grid{grid-template-columns:1fr;}.outputs-grid{grid-template-columns:repeat(2,1fr);}.p-grid{grid-template-columns:1fr;}.t-grid{grid-template-columns:1fr;}.pain-grid{grid-template-columns:1fr;}footer{flex-direction:column;gap:16px;text-align:center;}.cta-wrap{padding:70px 24px;}}
        .mock-card{background:rgba(200,169,110,0.04);border:1px solid rgba(200,169,110,0.12);border-radius:16px;padding:28px;}
        .mock-tag{font-family:var(--mono);font-size:9px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;opacity:0.7;}
        .mock-text{font-family:var(--serif);font-size:14px;color:var(--warm);line-height:1.8;font-weight:300;font-style:italic;}
        .mock-badge{display:inline-block;margin-top:14px;padding:4px 10px;border:1px solid rgba(200,169,110,0.2);border-radius:12px;font-family:var(--mono);font-size:8px;letter-spacing:1.5px;color:var(--muted);}
        section{padding:110px 56px;}
        .container{max-width:1100px;margin:0 auto;}
        .s-tag{font-family:var(--mono);font-size:10px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
        .s-tag::before{content:'';display:block;width:20px;height:1px;background:var(--gold);opacity:0.5;}
        .s-h2{font-family:var(--serif);font-size:clamp(34px,4vw,54px);font-weight:300;line-height:1.15;margin-bottom:16px;}
        .s-h2 em{color:var(--gold);font-style:italic;}
        .s-p{font-size:16px;color:var(--muted);max-width:520px;line-height:1.85;font-weight:300;}
        .pain{background:var(--ink2);border-top:1px solid rgba(200,169,110,0.07);border-bottom:1px solid rgba(200,169,110,0.07);}
        .pain-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:56px;border:1px solid rgba(200,169,110,0.08);border-radius:14px;overflow:hidden;}
        .pain-card{padding:36px;background:var(--ink3);}
        .p-icon{font-size:26px;margin-bottom:16px;}
        .p-title{font-family:var(--serif);font-size:22px;font-style:italic;margin-bottom:10px;color:var(--parchment);}
        .p-desc{font-size:14px;color:var(--muted);line-height:1.8;font-weight:300;}
        .outputs-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:52px;}
        .out-card{background:var(--ink2);border:1px solid rgba(200,169,110,0.08);border-radius:12px;padding:22px 18px;transition:all 0.22s;}
        .out-card:hover{border-color:rgba(200,169,110,0.25);transform:translateY(-3px);}
        .out-num{font-family:var(--mono);font-size:10px;color:rgba(200,169,110,0.4);letter-spacing:1px;margin-bottom:10px;}
        .out-icon{font-size:20px;margin-bottom:10px;}
        .out-title{font-family:var(--serif);font-size:15px;font-weight:400;margin-bottom:6px;color:var(--parchment);}
        .out-desc{font-size:12px;color:var(--dim);line-height:1.7;font-weight:300;}
        .features{background:var(--ink2);border-top:1px solid rgba(200,169,110,0.07);}
        .feat-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:52px;}
        .feat-card{padding:32px;border:1px solid rgba(200,169,110,0.08);border-radius:14px;background:var(--ink3);transition:all 0.22s;}
        .feat-card:hover{border-color:rgba(200,169,110,0.2);}
        .f-icon{font-size:26px;margin-bottom:16px;}
        .f-title{font-family:var(--serif);font-size:19px;font-weight:400;margin-bottom:10px;}
        .f-desc{font-size:13px;color:var(--muted);line-height:1.8;font-weight:300;}
        .pricing{background:var(--ink2);border-top:1px solid rgba(200,169,110,0.07);}
        .p-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:52px;}
        .p-card{padding:32px 28px;border:1px solid rgba(200,169,110,0.1);border-radius:16px;background:var(--ink3);position:relative;}
        .p-card.featured{border-color:rgba(200,169,110,0.4);background:#1a1208;}
        .p-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--gold),#a07840);padding:4px 16px;border-radius:20px;font-family:var(--mono);font-size:9px;letter-spacing:1.5px;color:var(--ink);font-weight:500;}
        .p-tier{font-family:var(--mono);font-size:10px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:12px;}
        .p-price{font-family:var(--serif);font-size:48px;font-weight:300;color:var(--parchment);margin-bottom:6px;line-height:1;}
        .p-price span{font-size:16px;color:var(--dim);}
        .p-desc{font-size:13px;color:var(--muted);margin-bottom:20px;}
        .p-list{list-style:none;margin-bottom:28px;}
        .p-list li{font-size:13px;color:var(--warm);padding:6px 0;border-bottom:1px solid rgba(200,169,110,0.06);font-weight:300;}
        .p-list li::before{content:'— ';color:var(--gold);opacity:0.5;}
        .p-btn{width:100%;padding:12px;border-radius:8px;font-family:var(--mono);font-size:10px;letter-spacing:1.5px;font-weight:500;cursor:pointer;text-transform:uppercase;transition:all 0.22s;border:none;}
        .p-btn.g{background:linear-gradient(135deg,var(--gold),#a07840);color:var(--ink);}
        .p-btn.o{background:transparent;border:1px solid rgba(200,169,110,0.2);color:var(--muted);}
        .p-btn:hover{transform:translateY(-1px);}
        .t-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:52px;}
        .t-card{padding:32px;border:1px solid rgba(200,169,110,0.1);border-radius:14px;background:var(--ink2);}
        .t-stars{color:var(--gold);font-size:14px;margin-bottom:16px;letter-spacing:2px;}
        .t-quote{font-family:var(--serif);font-size:16px;font-style:italic;color:var(--warm);line-height:1.85;margin-bottom:24px;font-weight:300;}
        .t-author{display:flex;align-items:center;gap:14px;}
        .t-av{width:42px;height:42px;background:var(--gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:1px solid rgba(200,169,110,0.2);}
        .t-name{font-family:var(--mono);font-size:11px;letter-spacing:1px;color:var(--parchment);margin-bottom:3px;}
        .t-role{font-size:12px;color:var(--dim);}
        .cta-wrap{padding:110px 56px;text-align:center;background:var(--ink2);border-top:1px solid rgba(200,169,110,0.07);}
        .cta-h{font-family:var(--serif);font-size:clamp(36px,4.5vw,60px);font-weight:300;line-height:1.15;margin-bottom:16px;}
        .cta-h em{color:var(--gold);font-style:italic;}
        .cta-sub{font-size:16px;color:var(--muted);margin-bottom:40px;font-weight:300;}
        .cta-fine{font-family:var(--mono);font-size:10px;color:var(--dim);letter-spacing:1.5px;margin-top:20px;}
        footer{padding:32px 56px;border-top:1px solid rgba(200,169,110,0.08);display:flex;justify-content:space-between;align-items:center;}
        .f-left{font-family:var(--mono);font-size:9px;letter-spacing:2px;color:var(--dim);}
        .f-links{display:flex;gap:24px;}
        .f-a{font-family:var(--mono);font-size:9px;letter-spacing:1px;color:var(--dim);text-decoration:none;cursor:pointer;}
        .f-a:hover{color:var(--gold);}
        .compare-wrap{margin-top:48px;border:1px solid rgba(200,169,110,0.1);border-radius:14px;overflow:hidden;}
        .c-head{display:grid;grid-template-columns:2fr 1fr 1fr;padding:16px 24px;background:var(--ink3);border-bottom:1px solid rgba(200,169,110,0.08);}
        .c-col{font-family:var(--mono);font-size:10px;letter-spacing:2px;text-align:center;text-transform:uppercase;}
        .c-gold{color:var(--gold);}
        .c-dim{color:var(--dim);}
        .c-row{display:grid;grid-template-columns:2fr 1fr 1fr;padding:14px 24px;border-bottom:1px solid rgba(200,169,110,0.05);}
        .c-feat{font-size:14px;color:var(--warm);font-weight:300;}
        .c-y{text-align:center;color:#7ed4a0;font-size:14px;}
        .c-n{text-align:center;color:var(--dim);font-size:14px;}
      `}</style>

      {/* NAV */}
      <nav>
        <div className="logo">
          <div className="logo-mark">🏛</div>
          <div className="logo-text">LISTING AI</div>
        </div>
        <div className="nav-links">
          <a className="nav-a" href="#outputs">What You Get</a>
          <a className="nav-a" href="#features">Features</a>
          <a className="nav-a" href="#pricing">Pricing</a>
          <a className="nav-a" href="#testimonials">Reviews</a>
          <button className="nav-cta" onClick={onStartFree}>Start Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow"><div className="hero-line" />Professional Real Estate Copy Platform</div>
          <h1 className="hero-h1">Every word your<br/>listing needs<br/><em>to sell.</em></h1>
          <p className="hero-p">ListingAI generates MLS descriptions, Zillow copy, open house scripts, negotiation notes, and buyer outreach — from one form, in 30 seconds. Built exclusively for real estate professionals.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onStartFree}>Start Free — No Card Required</button>
            <a className="btn-outline" href="#outputs">See All 10 Outputs →</a>
          </div>
          <div className="hero-proof">
            <div><div className="proof-num">10</div><div className="proof-label">Output Types</div></div>
            <div><div className="proof-num">30s</div><div className="proof-label">Per Listing</div></div>
            <div><div className="proof-num">3</div><div className="proof-label">Tone Settings</div></div>
            <div><div className="proof-num">$0</div><div className="proof-label">To Start</div></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mock-card">
            <div className="mock-tag">📋 MLS Description — Generated</div>
            <div className="mock-text">"This 4-bedroom, 2.5-bath home in Round Rock ISD sits on a greenbelt lot with no rear neighbors. The 2023 kitchen renovation added quartz counters, a Wolf range, and a 10-foot island with seating for six."</div>
            <div className="mock-badge">✓ 187/200 CHARACTERS · MLS COMPLIANT</div>
          </div>
        </div>
      </section>

      {/* OUTPUTS */}
      <section id="outputs">
        <div className="container">
          <div className="s-tag">What You Get</div>
          <h2 className="s-h2">10 copy assets.<br/><em>One form.</em></h2>
          <p className="s-p">Every output a listing agent needs — generated simultaneously from a single property brief.</p>
          <div className="outputs-grid">
            {[
              {n:"01",i:"📋",t:"MLS Description",d:"150–200 words, MLS-compliant, character-counted"},
              {n:"02",i:"🏠",t:"Zillow Premium",d:"Lifestyle-driven, 280–320 words"},
              {n:"03",i:"📱",t:"Instagram Caption",d:"Scroll-stopping, hashtag-optimized"},
              {n:"04",i:"📣",t:"Facebook Ads",d:"3 variations: problem, urgency, lifestyle"},
              {n:"05",i:"✉️",t:"Email Subject Lines",d:"5 tested subject line formulas"},
              {n:"06",i:"💌",t:"Buyer Outreach",d:"Ready-to-send email template"},
              {n:"07",i:"🎤",t:"Open House Script",d:"75-second door script for showings"},
              {n:"08",i:"💼",t:"Seller Talking Points",d:"6 bullets for listing presentations"},
              {n:"09",i:"🤝",t:"Negotiation Notes",d:"4 strategic offer-stage angles"},
              {n:"10",i:"🎯",t:"Buyer Psychology",d:"3 emotional hooks specific to this property"},
            ].map(o => (
              <div key={o.n} className="out-card">
                <div className="out-num">{o.n}</div>
                <div className="out-icon">{o.i}</div>
                <div className="out-title">{o.t}</div>
                <div className="out-desc">{o.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="container">
          <div className="s-tag">Built for Agents</div>
          <h2 className="s-h2">Every feature built<br/><em>for real estate.</em></h2>
          <p className="s-p">Not a general writing tool retrofitted for agents. ListingAI was built from the ground up for the way real estate professionals actually work.</p>
          <div className="feat-grid">
            {[
              {i:"📏",t:"Live MLS Character Counter",d:"Every MLS description shows real-time character compliance. Green means ready to paste."},
              {i:"🎛️",t:"Price-Point Tone Matching",d:"Luxury listings sound like WSJ real estate. Starter homes sound warm. Investment properties speak ROI."},
              {i:"📂",t:"Generation History",d:"Every listing you generate is saved automatically. Pull up any past property in one click."},
              {i:"⬇️",t:"One-Click Export",d:"Export all 10 sections to a clean text file. Copy individual sections instantly."},
              {i:"⚡",t:"Quick-Fill Templates",d:"Pre-built templates for luxury estates, starter homes, and investment properties."},
              {i:"🚫",t:"Banned Word Engine",d:'Never uses "stunning," "nestled," "boasts," or 14 other overused listing words.'},
            ].map(f => (
              <div key={f.t} className="feat-card">
                <div className="f-icon">{f.i}</div>
                <div className="f-title">{f.t}</div>
                <div className="f-desc">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section id="compare">
        <div className="container">
          <div className="s-tag">vs. The Alternatives</div>
          <h2 className="s-h2">Why not just<br/><em>use ChatGPT?</em></h2>
          <p className="s-p">ChatGPT is a general tool. ListingAI is a specialist. The difference shows in every output.</p>
          <div className="compare-wrap">
            <div className="c-head"><div></div><div className="c-col c-gold">ListingAI</div><div className="c-col c-dim">ChatGPT</div></div>
            {["MLS character limit awareness","10 outputs from one form","Price-point tone matching","Open house verbal script","Negotiation positioning notes","Seller presentation talking points","3 Facebook ad variations","Banned word enforcement","Buyer emotional psychology hooks","Generation history saved automatically"].map(f => (
              <div key={f} className="c-row"><div className="c-feat">{f}</div><div className="c-y">✓</div><div className="c-n">✗</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div style={{textAlign:"center"}}>
            <div className="s-tag" style={{justifyContent:"center"}}>Pricing</div>
            <h2 className="s-h2" style={{textAlign:"center"}}>Start free.<br/><em>Scale when you're ready.</em></h2>
            <p className="s-p" style={{margin:"0 auto",textAlign:"center"}}>No contracts. No setup fees. Your first 5 generations are completely free.</p>
          </div>
          <div className="p-grid">
            <div className="p-card">
              <div className="p-tier">Free</div>
              <div className="p-price">$0<span>/mo</span></div>
              <div className="p-desc">Try it with no commitment</div>
              <ul className="p-list"><li>5 generations/month</li><li>All 10 output types</li><li>Copy &amp; export</li></ul>
              <button className="p-btn o" onClick={onStartFree}>Get Started Free</button>
            </div>
            <div className="p-card">
              <div className="p-tier">Agent</div>
              <div className="p-price">$29<span>/mo</span></div>
              <div className="p-desc">For individual agents</div>
              <ul className="p-list"><li>75 generations/month</li><li>30-day history</li><li>All 3 tones</li><li>Email support</li></ul>
              <button className="p-btn o" onClick={onStartFree}>Start Agent Plan</button>
            </div>
            <div className="p-card featured">
              <div className="p-badge">Most Popular</div>
              <div className="p-tier">Pro Agent</div>
              <div className="p-price">$59<span>/mo</span></div>
              <div className="p-desc">For serious producers</div>
              <ul className="p-list"><li>Unlimited generations</li><li>Full history, forever</li><li>Priority support</li><li>Early feature access</li></ul>
              <button className="p-btn g" onClick={onStartFree}>Start Pro Free</button>
            </div>
            <div className="p-card">
              <div className="p-tier">Brokerage</div>
              <div className="p-price">$149<span>/mo</span></div>
              <div className="p-desc">For teams &amp; brokerages</div>
              <ul className="p-list"><li>Up to 10 agent seats</li><li>Unlimited generations</li><li>Shared team history</li><li>Custom tone presets</li></ul>
              <button className="p-btn o" onClick={onStartFree}>Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="container">
          <div className="s-tag">Results</div>
          <h2 className="s-h2">Agents who've<br/><em>made the switch.</em></h2>
          <div className="t-grid">
            {[
              {q:'"I used to spend Sunday evenings writing listing copy. Now I do it in 30 seconds before I leave the showing. My sellers have noticed — and my listings are getting more calls."',n:"Sarah M.",r:"RE/MAX — Austin, TX",a:"🏡"},
              {q:'"The open house script is worth the entire subscription. I walk in knowing exactly what to say at the door. My last four listings sold in under a week."',n:"Marcus T.",r:"Keller Williams — Miami, FL",a:"🔑"},
              {q:'"The negotiation notes alone have paid for the subscription ten times over. Having positioning angles ready before the offer conversation is a game changer."',n:"Jennifer R.",r:"Compass — Chicago, IL",a:"📊"},
            ].map(t => (
              <div key={t.n} className="t-card">
                <div className="t-stars">★★★★★</div>
                <div className="t-quote">{t.q}</div>
                <div className="t-author"><div className="t-av">{t.a}</div><div><div className="t-name">{t.n}</div><div className="t-role">{t.r}</div></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-wrap">
        <h2 className="cta-h">Your next listing is waiting.<br/><em>Write it in 30 seconds.</em></h2>
        <p className="cta-sub">Join the agents who've stopped writing copy from scratch — forever.</p>
        <button className="btn-primary" onClick={onStartFree}>Start Free — No Credit Card</button>
        <div className="cta-fine">5 free generations · No setup · Cancel anytime · No contract</div>
      </div>

      <footer>
        <div className="f-left">© 2026 LISTING AI — PROFESSIONAL REAL ESTATE COPY PLATFORM</div>
        <div className="f-links">
          <a className="f-a" href="/privacy.html">Privacy</a>
          <a className="f-a" href="/terms.html">Terms</a>
          <a className="f-a" href="mailto:support@listingai.co">Support</a>
        </div>
      </footer>
    </div>
  );
}


const SYSTEM_PROMPT = (tone, market) => `You are the senior copywriter at the most elite real estate brokerage in America. You have personally written listing copy for over $2 billion in sold properties. Your copy results in faster sales at higher prices.

TONE: ${tone === "luxury" ? "Refined, understated elegance. Specific details. New York Times real estate section quality." : tone === "conversational" ? "Warm, personal, approachable. Trusted friend giving honest advice." : "Balanced professionalism. Top-producing agent voice. Authoritative and accessible."}

MARKET: ${market}

Generate ALL sections with EXACT headers:

**MLS DESCRIPTION**
150–200 words. MLS-compliant. Lead with strongest specific fact. No vague descriptors. End with direct CTA.

**ZILLOW PREMIUM DESCRIPTION**
280–320 words. Lifestyle-driven. Paint life inside this home. Weave every feature emotionally. Urgency at the end.

**INSTAGRAM CAPTION**
Scroll-stopping 3-word open. Line breaks. Property highlights. CTA. 8–10 targeted hashtags on new line.

**FACEBOOK AD COPY**
3 variations:
VARIATION A — Problem/Solution (60 words): Buyer frustration → this home as answer.
VARIATION B — FOMO/Urgency (60 words): Urgency around this specific property.
VARIATION C — Lifestyle (60 words): The life they'll live, not the house they'll buy.

**EMAIL SUBJECT LINES**
Exactly 5:
1. CURIOSITY:
2. URGENCY:
3. LIFESTYLE:
4. PRICE ANCHOR:
5. PERSONALIZED:

**BUYER OUTREACH EMAIL**
Subject line + body. 120 words max. Conversational. Soft CTA at end.

**OPEN HOUSE SCRIPT**
75-second verbal script at the front door. Top 3 features naturally. Ends making buyers want to explore.

**SELLER TALKING POINTS**
6 bullets for listing presentation. Why YOUR marketing sells homes faster.

**NEGOTIATION POSITIONING NOTES**
4 strategic notes for offer conversations specific to this property and market.

**TOP 3 BUYER EMOTIONAL HOOKS**
3 deep psychological reasons this specific buyer will offer. Hyper-specific.

BANNED: stunning, gorgeous, beautiful, amazing, incredible, nestled, boasts, featuring, charming, spacious (use sqft), unique
RULE: Every claim grounded in specific details provided. You are a closer, not a describer.`;

const MARKETS = [
  { value: "ultra-luxury", label: "Ultra Luxury", sub: "$2M+" },
  { value: "luxury", label: "Luxury", sub: "$700K–$2M" },
  { value: "mid-market", label: "Mid-Market", sub: "$350K–$700K" },
  { value: "starter", label: "Starter Home", sub: "$150K–$350K" },
  { value: "investment", label: "Investment", sub: "ROI-Focused" },
  { value: "land", label: "Land / Lot", sub: "Development" },
];

const TONES = [
  { value: "luxury", label: "Luxury Editorial" },
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
];

const TEMPLATES = [
  { label: "Luxury Estate", icon: "🏛️", data: { address: "4820 Cresthaven Ln, Dallas, TX 75205", beds: "6", baths: "5.5", sqft: "7,400", price: "3,200,000", year: "2021", garage: "4-car climate-controlled", market: "ultra-luxury", tone: "luxury", features: "Sub-Zero/Wolf kitchen, 48ft chef range, butler pantry, climate wine cellar 300 bottle, primary suite 600sqft his/hers closets, spa bath heated Carrara marble, home theater 12-seat, resort pool with spa and cabana, full smart home, 3-stop elevator, guest house with kitchen", neighborhood: "Highland Park, HPISD schools, walking to Turtle Creek, 10min to downtown", buyer: "Executive family, luxury upgrade, corporate relocation", extras: "No HOA, whole-home Sonos, generator, motor court" }},
  { label: "Starter Home", icon: "🏡", data: { address: "1847 Elm Creek Dr, Nashville, TN 37206", beds: "3", baths: "2", sqft: "1,520", price: "329,000", year: "2001", garage: "1-car attached", market: "starter", tone: "conversational", features: "New roof 2023, updated kitchen granite counters stainless appliances 2022, new HVAC 2021, fresh interior paint, hardwood floors main level, large fenced backyard with patio", neighborhood: "East Nashville, walkable 5 Points restaurants, strong appreciation area", buyer: "First-time buyer, young couple, remote worker", extras: "Move-in ready, no deferred maintenance, pre-inspection available" }},
  { label: "Investment", icon: "📈", data: { address: "2240 Commerce St, Memphis, TN 38103", beds: "4", baths: "2", sqft: "1,980", price: "198,000", year: "2008", garage: "None", market: "investment", tone: "professional", features: "Tenant at $1,850/mo month-to-month, new water heater 2023, updated electrical panel, roof 6 years old", neighborhood: "High rental demand corridor, 8 min medical district, near university, under 4% vacancy historically", buyer: "Cash investor, 1031 exchange, passive income seeker", extras: "11.2% cap rate, property manager in place, financials available" }},
];

const SECTION_META = {
  "MLS DESCRIPTION": { icon: "📋", color: "#c8a96e", limit: 200 },
  "ZILLOW PREMIUM DESCRIPTION": { icon: "🏠", color: "#7eb8d4" },
  "INSTAGRAM CAPTION": { icon: "📱", color: "#d47eb8" },
  "FACEBOOK AD COPY": { icon: "📣", color: "#7ed4a0" },
  "EMAIL SUBJECT LINES": { icon: "✉️", color: "#d4b07e" },
  "BUYER OUTREACH EMAIL": { icon: "💌", color: "#a07ed4" },
  "OPEN HOUSE SCRIPT": { icon: "🎤", color: "#7ed4c8" },
  "SELLER TALKING POINTS": { icon: "💼", color: "#d4907e" },
  "NEGOTIATION POSITIONING NOTES": { icon: "🤝", color: "#b0d47e" },
  "TOP 3 BUYER EMOTIONAL HOOKS": { icon: "🎯", color: "#d4c87e" },
};

const FREE_LIMIT = 5;

function ListingAI() {
  const [form, setForm] = useState({ address: "", beds: "", baths: "", sqft: "", price: "", year: "", garage: "", market: "mid-market", tone: "professional", features: "", neighborhood: "", buyer: "", extras: "" });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [view, setView] = useState("form");
  const [copiedKey, setCopiedKey] = useState(null);
  const [progress, setProgress] = useState(0);
  const [usageCount, setUsageCount] = useState(() => { return parseInt(localStorage.getItem("lai_usage") || "0"); });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const progressRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onboardingSteps = [
    { title: "Welcome to ListingAI", body: "Generate 10 professional copy assets from one form — MLS descriptions, open house scripts, negotiation notes, and more.", icon: "🏛" },
    { title: "Fill in your property details", body: "The more specific you are, the better your copy. Key features and neighborhood highlights are the most important fields.", icon: "📝" },
    { title: "Choose your market and tone", body: "Luxury listings sound different from starter homes. Set your market segment and tone before generating for best results.", icon: "🎛️" },
    { title: "You have 5 free generations", body: "Start free — no credit card needed. Upgrade anytime for unlimited generations, history, and export.", icon: "⚡" },
  ];

  const parseSections = (text) => {
    const parts = text.split(/\*\*([^*\n]+)\*\*/g);
    const result = [];
    for (let i = 1; i < parts.length; i += 2) {
      const title = parts[i].trim();
      const content = (parts[i + 1] || "").trim();
      if (title && content) result.push({ title, content });
    }
    return result;
  };

  const generate = async () => {
    if (!form.address || !form.beds || !form.price) return;
    if (usageCount >= FREE_LIMIT) { setShowUpgrade(true); return; }
    setLoading(true); setOutput(""); setSections([]); setView("output"); setProgress(0);
    progressRef.current = setInterval(() => setProgress(p => Math.min(p + Math.random() * 8, 88)), 400);
    const market = MARKETS.find(m => m.value === form.market);
    const prompt = `Generate all copy for:\nAddress: ${form.address}\nBeds: ${form.beds} | Baths: ${form.baths} | SqFt: ${form.sqft}\nPrice: $${form.price} | Year: ${form.year} | Garage: ${form.garage}\nMarket: ${market?.label} (${market?.sub})\nFeatures: ${form.features}\nNeighborhood: ${form.neighborhood}\nTarget Buyer: ${form.buyer}\nExtras: ${form.extras}`;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: SYSTEM_PROMPT(form.tone, `${market?.label} (${market?.sub})`), max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "Generation failed.";
      setOutput(text);
      const parsed = parseSections(text);
      setSections(parsed);
      setActiveSection(0);
      setUsageCount(c => { const next = c + 1; localStorage.setItem("lai_usage", next); return next; });
      setHistory(h => [{ id: Date.now(), address: form.address, price: form.price, market: form.market, sections: parsed, timestamp: new Date().toLocaleString() }, ...h.slice(0, 11)]);
      clearInterval(progressRef.current); setProgress(100);
    } catch { setOutput("Connection error. Please try again."); clearInterval(progressRef.current); setProgress(0); }
    setLoading(false);
  };

  const copyText = (text, key) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000); };

  const toggleFavorite = (sectionTitle) => setFavorites(f => ({ ...f, [sectionTitle]: !f[sectionTitle] }));

  const shareOutput = () => {
    const shareText = sections.map(s => `=== ${s.title} ===\n\n${s.content}`).join("\n\n\n");
    const blob = new Blob([`LISTING AI — ${form.address}\n\n${shareText}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    navigator.clipboard.writeText(`${window.location.origin}?listing=${encodeURIComponent(form.address)}`).catch(() => {});
    const a = document.createElement("a"); a.href = url;
    a.download = `ListingAI-${form.address.replace(/[^a-z0-9]/gi, "-")}.txt`; a.click();
    setShareToast(true); setTimeout(() => setShareToast(false), 3000);
  };

  const inp = (h = "auto") => ({ width: "100%", background: "rgba(200,169,110,0.04)", border: "1px solid rgba(200,169,110,0.15)", borderRadius: "6px", padding: "11px 14px", color: "#f0ebe0", fontSize: "13.5px", fontFamily: "'Cormorant Garamond', Georgia, serif", outline: "none", boxSizing: "border-box", resize: h !== "auto" ? "vertical" : "none", minHeight: h !== "auto" ? h : undefined, lineHeight: "1.6" });
  const lbl = { display: "block", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a5a", marginBottom: "6px", fontFamily: "monospace" };
  const remainingGens = Math.max(0, FREE_LIMIT - usageCount);

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0c0a06", color: "#f0ebe0", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}html,body,#root{width:100%;min-height:100vh;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:rgba(200,169,110,0.2);}
        input:focus,textarea:focus,select:focus{border-color:rgba(200,169,110,0.45)!important;box-shadow:0 0 0 3px rgba(200,169,110,0.06);outline:none;}
        .btn-main:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 40px rgba(200,169,110,0.25);}
        .sec-pill:hover{background:rgba(200,169,110,0.15)!important;color:#c8a96e!important;}
        .tmpl:hover{border-color:rgba(200,169,110,0.4)!important;background:rgba(200,169,110,0.07)!important;}
        .hist-row:hover{background:rgba(200,169,110,0.04)!important;}
        .fav-btn:hover{color:#c8a96e!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        .fade-in{animation:fadeUp 0.45s ease both;}
        .pulse{animation:shimmer 1.4s infinite;}
      `}</style>

      {/* ONBOARDING OVERLAY */}
      {showOnboarding && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#141008", border: "1px solid rgba(200,169,110,0.25)", borderRadius: "20px", padding: "48px", maxWidth: "480px", width: "90%", animation: "slideIn 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>{onboardingSteps[onboardingStep].icon}</div>
              <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: "#8a7a5a", marginBottom: "10px" }}>STEP {onboardingStep + 1} OF {onboardingSteps.length}</div>
              <h2 style={{ fontSize: "28px", fontWeight: "300", marginBottom: "12px" }}>{onboardingSteps[onboardingStep].title}</h2>
              <p style={{ fontSize: "15px", color: "#8a7a5a", lineHeight: "1.8", fontWeight: "300" }}>{onboardingSteps[onboardingStep].body}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "28px" }}>
              {onboardingSteps.map((_, i) => (
                <div key={i} style={{ width: i === onboardingStep ? "24px" : "6px", height: "6px", borderRadius: "3px", background: i === onboardingStep ? "#c8a96e" : "rgba(200,169,110,0.2)", transition: "all 0.3s" }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {onboardingStep > 0 && <button onClick={() => setOnboardingStep(s => s - 1)} style={{ flex: 1, padding: "12px", border: "1px solid rgba(200,169,110,0.15)", borderRadius: "8px", background: "transparent", color: "#8a7a5a", fontFamily: "monospace", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>Back</button>}
              <button onClick={() => { if (onboardingStep < onboardingSteps.length - 1) setOnboardingStep(s => s + 1); else setShowOnboarding(false); }} style={{ flex: 2, padding: "12px", border: "none", borderRadius: "8px", background: "linear-gradient(135deg, #c8a96e, #a07840)", color: "#0c0a06", fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", fontWeight: "bold", cursor: "pointer", textTransform: "uppercase" }}>
                {onboardingStep < onboardingSteps.length - 1 ? "Next →" : "Start Generating"}
              </button>
            </div>
            <button onClick={() => setShowOnboarding(false)} style={{ display: "block", margin: "14px auto 0", background: "none", border: "none", color: "#4a3a1a", fontFamily: "monospace", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>Skip intro</button>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#141008", border: "1px solid rgba(200,169,110,0.3)", borderRadius: "20px", padding: "48px", maxWidth: "440px", width: "90%", textAlign: "center", animation: "slideIn 0.4s ease" }}>
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>⚡</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: "#c8a96e", marginBottom: "10px" }}>FREE TIER COMPLETE</div>
            <h2 style={{ fontSize: "28px", fontWeight: "300", marginBottom: "12px" }}>You've used all 5 free generations</h2>
            <p style={{ fontSize: "15px", color: "#8a7a5a", lineHeight: "1.8", marginBottom: "32px", fontWeight: "300" }}>Upgrade to continue generating unlimited listing copy. Agent plan starts at $29/month — less than one listing description from a copywriter.</p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <div style={{ flex: 1, padding: "20px", border: "1px solid rgba(200,169,110,0.15)", borderRadius: "12px" }}>
                <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", color: "#8a7a5a", marginBottom: "8px" }}>AGENT</div>
                <div style={{ fontSize: "28px", fontWeight: "300", marginBottom: "4px" }}>$29<span style={{ fontSize: "13px", color: "#5a4a2a" }}>/mo</span></div>
                <div style={{ fontSize: "11px", color: "#5a4a2a" }}>75 generations</div>
              </div>
              <div style={{ flex: 1, padding: "20px", border: "1px solid rgba(200,169,110,0.4)", borderRadius: "12px", background: "rgba(200,169,110,0.05)" }}>
                <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", color: "#c8a96e", marginBottom: "8px" }}>PRO — POPULAR</div>
                <div style={{ fontSize: "28px", fontWeight: "300", marginBottom: "4px" }}>$59<span style={{ fontSize: "13px", color: "#5a4a2a" }}>/mo</span></div>
                <div style={{ fontSize: "11px", color: "#5a4a2a" }}>Unlimited</div>
              </div>
            </div>
            <button style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #c8a96e, #a07840)", border: "none", borderRadius: "10px", color: "#0c0a06", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px", fontWeight: "bold", cursor: "pointer", marginBottom: "10px" }}>Upgrade Now →</button>
            <button onClick={() => setShowUpgrade(false)} style={{ background: "none", border: "none", color: "#4a3a1a", fontFamily: "monospace", fontSize: "10px", cursor: "pointer", letterSpacing: "1px" }}>Maybe later</button>
          </div>
        </div>
      )}

      {/* SHARE TOAST */}
      {shareToast && (
        <div style={{ position: "fixed", top: "80px", right: "24px", background: "#1c1610", border: "1px solid rgba(200,169,110,0.3)", borderRadius: "10px", padding: "14px 20px", zIndex: 400, animation: "toastIn 0.3s ease", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px" }}>✓</span>
          <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#c8a96e", letterSpacing: "1px" }}>Copy package downloaded</span>
        </div>
      )}

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid rgba(200,169,110,0.12)", background: "rgba(12,10,6,0.97)", backdropFilter: "blur(20px)", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "36px", height: "36px", border: "1px solid rgba(200,169,110,0.35)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🏛</div>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "16px", letterSpacing: "4px", color: "#c8a96e", fontWeight: "500" }}>LISTING AI</div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: "#3a2a10" }}>REAL ESTATE COPY PLATFORM</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Usage indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px", border: "1px solid rgba(200,169,110,0.12)", borderRadius: "20px", background: "rgba(200,169,110,0.03)" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              {Array.from({ length: FREE_LIMIT }).map((_, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i < usageCount ? "rgba(200,169,110,0.3)" : "#c8a96e", transition: "all 0.3s" }} />
              ))}
            </div>
            <span style={{ fontFamily: "monospace", fontSize: "9px", color: remainingGens > 0 ? "#8a7a5a" : "#d47a7a", letterSpacing: "1px" }}>{remainingGens} free left</span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[{ id: "form", label: "New Listing" }, { id: "output", label: "Output" }, { id: "history", label: `History (${history.length})` }, { id: "favorites", label: `Saved (${Object.values(favorites).filter(Boolean).length})` }].map(v => (
              <button key={v.id} onClick={() => setView(v.id)} disabled={v.id === "output" && !output} style={{ padding: "6px 14px", borderRadius: "5px", border: "1px solid", cursor: v.id === "output" && !output ? "not-allowed" : "pointer", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.2s", background: view === v.id ? "rgba(200,169,110,0.12)" : "transparent", borderColor: view === v.id ? "rgba(200,169,110,0.45)" : "rgba(200,169,110,0.1)", color: view === v.id ? "#c8a96e" : "#4a3a1a", opacity: v.id === "output" && !output ? 0.3 : 1 }}>{v.label}</button>
            ))}
          </div>
          <button onClick={() => setShowUpgrade(true)} style={{ padding: "7px 16px", background: "linear-gradient(135deg,#c8a96e,#a07840)", border: "none", borderRadius: "6px", color: "#0c0a06", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1.5px", fontWeight: "bold", cursor: "pointer", textTransform: "uppercase" }}>Upgrade</button>
        </div>
      </header>

      {/* FORM VIEW */}
      {view === "form" && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "44px 60px" }} className="fade-in">
          <div style={{ marginBottom: "36px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "4px", color: "#8a7a5a", marginBottom: "10px" }}>LISTING AI — NEW GENERATION</div>
            <h1 style={{ fontSize: "40px", fontWeight: "300", lineHeight: "1.1", marginBottom: "10px" }}>Every word your listing<br /><em style={{ color: "#c8a96e" }}>needs to sell.</em></h1>
            <p style={{ fontSize: "15px", color: "#6a5a3a", lineHeight: "1.8", fontWeight: "300" }}>10 professional copy assets from one form — MLS description, Zillow write-up, open house script, negotiation notes, and more.</p>
          </div>

          {/* Usage warning */}
          {usageCount >= 3 && usageCount < FREE_LIMIT && (
            <div style={{ marginBottom: "20px", padding: "12px 18px", background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#c8a96e", letterSpacing: "0.5px" }}>⚠ {remainingGens} free generation{remainingGens !== 1 ? "s" : ""} remaining</span>
              <button onClick={() => setShowUpgrade(true)} style={{ padding: "5px 14px", background: "rgba(200,169,110,0.15)", border: "1px solid rgba(200,169,110,0.3)", borderRadius: "5px", color: "#c8a96e", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", cursor: "pointer" }}>Upgrade →</button>
            </div>
          )}

          {/* Templates */}
          <div style={{ marginBottom: "28px" }}>
            <div style={lbl}>Quick-Fill Templates</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {TEMPLATES.map(t => (
                <button key={t.label} className="tmpl" onClick={() => setForm(f => ({ ...f, ...t.data }))} style={{ padding: "8px 16px", border: "1px solid rgba(200,169,110,0.12)", borderRadius: "7px", background: "rgba(200,169,110,0.02)", color: "#8a7a5a", fontFamily: "monospace", fontSize: "10px", cursor: "pointer", transition: "all 0.2s" }}>{t.icon} {t.label}</button>
              ))}
              <button className="tmpl" onClick={() => setForm({ address: "", beds: "", baths: "", sqft: "", price: "", year: "", garage: "", market: "mid-market", tone: "professional", features: "", neighborhood: "", buyer: "", extras: "" })} style={{ padding: "8px 16px", border: "1px solid rgba(200,169,110,0.08)", borderRadius: "7px", background: "transparent", color: "#4a3a1a", fontFamily: "monospace", fontSize: "10px", cursor: "pointer", transition: "all 0.2s" }}>✕ Clear</button>
            </div>
          </div>

          {/* Market + Tone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
            <div>
              <div style={lbl}>Market Segment</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {MARKETS.map(m => (
                  <button key={m.value} onClick={() => set("market", m.value)} style={{ padding: "9px 6px", border: "1px solid", borderRadius: "6px", cursor: "pointer", textAlign: "center", transition: "all 0.2s", background: form.market === m.value ? "rgba(200,169,110,0.1)" : "transparent", borderColor: form.market === m.value ? "rgba(200,169,110,0.5)" : "rgba(200,169,110,0.1)", color: form.market === m.value ? "#c8a96e" : "#5a4a2a" }}>
                    <div style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{m.label}</div>
                    <div style={{ fontSize: "9px", color: "#4a3a1a", marginTop: "2px" }}>{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={lbl}>Copy Tone</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {TONES.map(t => (
                  <button key={t.value} onClick={() => set("tone", t.value)} style={{ padding: "10px 14px", border: "1px solid", borderRadius: "6px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", background: form.tone === t.value ? "rgba(200,169,110,0.1)" : "transparent", borderColor: form.tone === t.value ? "rgba(200,169,110,0.5)" : "rgba(200,169,110,0.1)", color: form.tone === t.value ? "#c8a96e" : "#5a4a2a", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.5px" }}>{t.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(200,169,110,0.07)", marginBottom: "22px" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div><label style={lbl}>Property Address <span style={{ color: "#c8a96e" }}>*</span></label><input style={inp()} value={form.address} onChange={e => set("address", e.target.value)} placeholder="123 Cresthaven Lane, Dallas, TX 75205" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
              <div><label style={lbl}>Beds <span style={{ color: "#c8a96e" }}>*</span></label><input style={inp()} value={form.beds} onChange={e => set("beds", e.target.value)} placeholder="4" /></div>
              <div><label style={lbl}>Baths</label><input style={inp()} value={form.baths} onChange={e => set("baths", e.target.value)} placeholder="2.5" /></div>
              <div><label style={lbl}>Sq Ft</label><input style={inp()} value={form.sqft} onChange={e => set("sqft", e.target.value)} placeholder="2,400" /></div>
              <div><label style={lbl}>Year Built</label><input style={inp()} value={form.year} onChange={e => set("year", e.target.value)} placeholder="2019" /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><label style={lbl}>Price ($) <span style={{ color: "#c8a96e" }}>*</span></label><input style={inp()} value={form.price} onChange={e => set("price", e.target.value)} placeholder="485,000" /></div>
              <div><label style={lbl}>Garage</label><input style={inp()} value={form.garage} onChange={e => set("garage", e.target.value)} placeholder="2-car attached" /></div>
            </div>
            <div><label style={lbl}>Key Features & Updates <span style={{ color: "#c8a96e" }}>*</span> <span style={{ textTransform: "none", letterSpacing: 0, color: "#5a4a2a", fontSize: "11px" }}>— be as specific as possible</span></label><textarea style={inp("90px")} value={form.features} onChange={e => set("features", e.target.value)} placeholder="Renovated kitchen 2023 with quartz waterfall island, Wolf range, Sub-Zero. Primary suite with spa bath, heated marble floors. Covered back patio with built-in grill..." /></div>
            <div><label style={lbl}>Neighborhood & Location Highlights</label><textarea style={inp("65px")} value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} placeholder="Top-rated Round Rock ISD, 5 min to Domain, greenbelt trail access from backyard..." /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><label style={lbl}>Target Buyer Profile</label><input style={inp()} value={form.buyer} onChange={e => set("buyer", e.target.value)} placeholder="Young family, remote worker, first-time buyer..." /></div>
              <div><label style={lbl}>Additional Highlights</label><input style={inp()} value={form.extras} onChange={e => set("extras", e.target.value)} placeholder="No HOA, solar panels, assumable mortgage..." /></div>
            </div>
          </div>

          <button className="btn-main" onClick={generate} disabled={loading || !form.address || !form.beds || !form.price} style={{ marginTop: "28px", width: "100%", padding: "15px", background: (!form.address || !form.beds || !form.price) ? "rgba(200,169,110,0.08)" : "linear-gradient(135deg,#c8a96e,#a07840)", border: "none", borderRadius: "10px", color: (!form.address || !form.beds || !form.price) ? "#4a3a1a" : "#0c0a06", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2.5px", fontWeight: "500", cursor: (!form.address || !form.beds || !form.price) ? "not-allowed" : "pointer", transition: "all 0.25s", textTransform: "uppercase" }}>
            {loading ? "Generating Your Copy..." : "Generate All 10 Copy Sections →"}
          </button>
        </div>
      )}

      {/* OUTPUT VIEW */}
      {view === "output" && (
        <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "36px 40px" }} className="fade-in">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "28px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "3px", color: "#8a7a5a" }}>GENERATING 10 SECTIONS</div>
              <div style={{ width: "280px", height: "1px", background: "rgba(200,169,110,0.1)", overflow: "hidden", borderRadius: "1px" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#c8a96e,#e8c98e)", transition: "width 0.4s ease", borderRadius: "1px" }} />
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["MLS", "ZILLOW", "SOCIAL", "EMAIL", "SCRIPT"].map((s, i) => (
                  <div key={s} className="pulse" style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", color: "#3a2a10", animationDelay: `${i * 0.15}s` }}>{s}</div>
                ))}
              </div>
            </div>
          ) : sections.length > 0 ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2.5px", color: "#8a7a5a", marginBottom: "7px" }}>LISTING AI — {sections.length} SECTIONS GENERATED</div>
                  <div style={{ fontSize: "22px", fontWeight: "300" }}>{form.address}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#4a3a1a", marginTop: "3px" }}>${parseInt(form.price || "0").toLocaleString()} · {MARKETS.find(m => m.value === form.market)?.label} · {TONES.find(t => t.value === form.tone)?.label}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setView("form")} style={{ padding: "8px 14px", border: "1px solid rgba(200,169,110,0.15)", borderRadius: "6px", background: "transparent", color: "#5a4a2a", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", cursor: "pointer" }}>← New</button>
                  <button onClick={shareOutput} style={{ padding: "8px 14px", border: "1px solid rgba(200,169,110,0.25)", borderRadius: "6px", background: "rgba(200,169,110,0.06)", color: "#c8a96e", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", cursor: "pointer" }}>⬇ Export</button>
                  <button onClick={() => copyText(sections.map(s => `=== ${s.title} ===\n\n${s.content}`).join("\n\n\n"), "all")} style={{ padding: "8px 14px", border: "1px solid rgba(200,169,110,0.25)", borderRadius: "6px", background: copiedKey === "all" ? "rgba(200,169,110,0.18)" : "rgba(200,169,110,0.06)", color: "#c8a96e", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", cursor: "pointer" }}>{copiedKey === "all" ? "✓ Copied" : "⎘ Copy All"}</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "22px", paddingBottom: "18px", borderBottom: "1px solid rgba(200,169,110,0.07)" }}>
                {sections.map((s, i) => {
                  const meta = SECTION_META[s.title] || {};
                  return (
                    <button key={i} className="sec-pill" onClick={() => setActiveSection(activeSection === i ? null : i)} style={{ padding: "4px 11px", border: "1px solid", borderRadius: "20px", cursor: "pointer", fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.5px", textTransform: "uppercase", transition: "all 0.15s", background: activeSection === i ? "rgba(200,169,110,0.12)" : "transparent", borderColor: activeSection === i ? `${meta.color || "#c8a96e"}55` : "rgba(200,169,110,0.1)", color: activeSection === i ? (meta.color || "#c8a96e") : "#4a3a1a" }}>
                      {favorites[s.title] ? "★ " : ""}{meta.icon} {s.title.split(" ").slice(0, 2).join(" ")}
                    </button>
                  );
                })}
                {activeSection !== null && <button className="sec-pill" onClick={() => setActiveSection(null)} style={{ padding: "4px 11px", border: "1px solid rgba(200,169,110,0.08)", borderRadius: "20px", cursor: "pointer", fontFamily: "monospace", fontSize: "9px", color: "#3a2a10", background: "transparent" }}>All</button>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {(activeSection !== null ? [sections[activeSection]] : sections).map((s, i) => {
                  const meta = SECTION_META[s.title] || {};
                  const charCount = s.content.length;
                  const overLimit = meta.limit && charCount > meta.limit;
                  return (
                    <div key={i} style={{ border: "1px solid rgba(200,169,110,0.09)", borderRadius: "10px", overflow: "hidden", background: "rgba(200,169,110,0.015)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid rgba(200,169,110,0.06)", background: "rgba(200,169,110,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{meta.icon || "·"}</span>
                          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "1.5px", color: meta.color || "#c8a96e", textTransform: "uppercase" }}>{s.title}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {meta.limit && <span style={{ fontFamily: "monospace", fontSize: "9px", color: overLimit ? "#d47a7a" : "#5a8a5a" }}>{charCount}/{meta.limit} {overLimit ? "⚠" : "✓"}</span>}
                          <button className="fav-btn" onClick={() => toggleFavorite(s.title)} style={{ background: "none", border: "none", color: favorites[s.title] ? "#c8a96e" : "#4a3a1a", fontSize: "12px", cursor: "pointer", transition: "color 0.2s" }}>{favorites[s.title] ? "★" : "☆"}</button>
                          <button onClick={() => copyText(s.content, s.title)} style={{ padding: "3px 10px", border: "1px solid rgba(200,169,110,0.15)", borderRadius: "4px", background: copiedKey === s.title ? "rgba(200,169,110,0.12)" : "transparent", color: copiedKey === s.title ? "#c8a96e" : "#4a3a1a", fontFamily: "monospace", fontSize: "9px", cursor: "pointer" }}>{copiedKey === s.title ? "✓" : "copy"}</button>
                        </div>
                      </div>
                      <div style={{ padding: "16px", fontSize: "14px", lineHeight: "1.9", color: "#c8b890", whiteSpace: "pre-wrap", fontWeight: "300" }}>{s.content}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* HISTORY VIEW */}
      {view === "history" && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "44px 60px" }} className="fade-in">
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: "#8a7a5a", marginBottom: "8px" }}>GENERATION HISTORY</div>
          <h2 style={{ fontSize: "32px", fontWeight: "300", marginBottom: "28px" }}>Past Listings</h2>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#3a2a10", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px" }}>NO HISTORY YET</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {history.map(h => (
                <div key={h.id} className="hist-row" onClick={() => { setSections(h.sections); setActiveSection(0); setView("output"); }} style={{ padding: "16px 18px", border: "1px solid rgba(200,169,110,0.07)", borderRadius: "7px", cursor: "pointer", transition: "all 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "300", marginBottom: "3px" }}>{h.address}</div>
                    <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#4a3a1a" }}>${parseInt(h.price || "0").toLocaleString()} · {MARKETS.find(m => m.value === h.market)?.label} · {h.sections.length} sections</div>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#2a1a08" }}>{h.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAVORITES VIEW */}
      {view === "favorites" && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "44px 60px" }} className="fade-in">
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: "#8a7a5a", marginBottom: "8px" }}>STARRED SECTIONS</div>
          <h2 style={{ fontSize: "32px", fontWeight: "300", marginBottom: "28px" }}>Saved Copy</h2>
          {Object.values(favorites).filter(Boolean).length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#3a2a10", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px" }}>NO SAVED SECTIONS YET — STAR ANY SECTION IN YOUR OUTPUT</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {sections.filter(s => favorites[s.title]).map((s, i) => {
                const meta = SECTION_META[s.title] || {};
                return (
                  <div key={i} style={{ border: "1px solid rgba(200,169,110,0.15)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ padding: "10px 16px", background: "rgba(200,169,110,0.06)", borderBottom: "1px solid rgba(200,169,110,0.08)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "1.5px", color: meta.color || "#c8a96e", textTransform: "uppercase" }}>{meta.icon} {s.title}</span>
                      <button onClick={() => copyText(s.content, s.title)} style={{ padding: "2px 10px", border: "1px solid rgba(200,169,110,0.2)", borderRadius: "4px", background: "transparent", color: "#8a7a5a", fontFamily: "monospace", fontSize: "9px", cursor: "pointer" }}>{copiedKey === s.title ? "✓" : "copy"}</button>
                    </div>
                    <div style={{ padding: "14px 16px", fontSize: "14px", lineHeight: "1.85", color: "#c8b890", whiteSpace: "pre-wrap", fontWeight: "300" }}>{s.content}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div style={{ borderTop: "1px solid rgba(200,169,110,0.06)", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#1e1508", letterSpacing: "1px" }}>LISTING AI — PROFESSIONAL REAL ESTATE COPY</div>
        <div style={{ display: "flex", gap: "18px" }}>
          {["MLS Compliant", "10 Outputs", "Tone Control", "Export Ready"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "monospace", fontSize: "9px", color: "#2a1e08" }}>
              <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#c8a96e", opacity: 0.3 }} />{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP — switches between landing page and app ─────────────────────────
// This replaces the default export above temporarily

// ─── ROOT APP COMPONENT ───────────────────────────────────────────────────────
export default function App() {
  const [showApp, setShowApp] = useState(false);

  const handleStartFree = () => {
    setShowApp(true);
    window.scrollTo(0, 0);
  };

  if (showApp) {
    return <ListingAI />;
  }

  return <LandingPage onStartFree={handleStartFree} />;
}
