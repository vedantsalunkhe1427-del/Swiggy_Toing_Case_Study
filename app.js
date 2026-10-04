// Swiggy Toing Case Study Interactive Engine
// Designed with authentic Swiggy UI/UX, Chart.js visualizations & micro-interactions

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSound();
  initScrollProgress();
  initNavigation();
  initBillSimulator();
  initCharts();
  initRivalsFilter();
  initCannibalizationSim();
  initDiscussionPolls();
  initSearchModal();
  initTooltips();
  lucide.createIcons();
});

/* ==========================================================================
   1. Theme Management (Swiggy Day Light vs Midnight Feast Dark)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  
  const savedTheme = localStorage.getItem('swiggy-case-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      playSound('pop');
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('swiggy-case-theme', newTheme);
      updateChartThemes(newTheme === 'dark');
    });
  }
}

function applyTheme(theme) {
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    if (themeText) themeText.textContent = 'Daylight Mode';
  } else {
    document.documentElement.classList.remove('dark');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
    if (themeText) themeText.textContent = 'Midnight Mode';
  }
  lucide.createIcons();
}

/* ==========================================================================
   2. Audio Feedback Synthesizer (Web Audio API - Zero External Assets)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSound() {
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundIcon) {
        soundIcon.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
        soundToggle.classList.toggle('text-orange-500', soundEnabled);
        soundToggle.classList.toggle('text-gray-400', !soundEnabled);
      }
      lucide.createIcons();
      if (soundEnabled) playSound('ping');
    });
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'ping') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (e) {
    // audio context blocked or not supported
  }
}

/* ==========================================================================
   3. Scroll Progress & Animated Delivery Scooter Track
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('progress-bar');
  const scooter = document.getElementById('scooter-indicator');
  const readPctText = document.getElementById('reading-pct');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (scooter) scooter.style.left = `calc(${progress}% - 14px)`;
    if (readPctText) readPctText.textContent = `${Math.round(progress)}%`;
  }, { passive: true });
}

/* ==========================================================================
   4. Navigation Scrollspy & Smooth Scrolling
   ========================================================================== */
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' });

  sections.forEach(sec => observer.observe(sec));

  // Mobile menu drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('hidden');
      playSound('click');
    });
  }

  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('hidden');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   5. Interactive Order Simulator & Real-World Bill Comparison
   ========================================================================== */
function initBillSimulator() {
  const mealSlider = document.getElementById('sim-meal-price');
  const mealPriceDisplay = document.getElementById('sim-meal-val');
  const rainToggle = document.getElementById('sim-rain-toggle');
  const packagingToggle = document.getElementById('sim-packaging-toggle');
  const lateNightToggle = document.getElementById('sim-late-toggle');

  if (!mealSlider) return;

  function updateBills() {
    const mealPrice = parseFloat(mealSlider.value) || 99;
    if (mealPriceDisplay) mealPriceDisplay.textContent = `₹${mealPrice}`;

    const isRain = rainToggle ? rainToggle.checked : false;
    const hasPackaging = packagingToggle ? packagingToggle.checked : true;
    const isLateNight = lateNightToggle ? lateNightToggle.checked : false;

    // --- 1. TOING APP ---
    // Zero packaging, platform fee ₹12, free delivery if order >= ₹99 else ₹15
    const toingMeal = mealPrice;
    const toingPlatform = 12.00;
    const toingPackaging = 0.00; // strictly waived
    const toingDelivery = mealPrice >= 99 ? 0.00 : 15.00;
    const toingSurge = 0.00; // No rain/late fees on Toing
    const toingGst = 0.00; // Tax included or absorbed
    const toingTotal = toingMeal + toingPlatform + toingPackaging + toingDelivery + toingSurge + toingGst;

    // --- 2. SWIGGY CORE APP ---
    // Full fee ladder
    const swiggyMeal = mealPrice;
    const swiggyPlatform = 14.99;
    const swiggyPackaging = hasPackaging ? Math.max(15, Math.round(mealPrice * 0.12)) : 0.00;
    const swiggyDelivery = mealPrice >= 199 ? 25.00 : 35.00;
    const swiggySurge = (isRain ? 25.00 : 0.00) + (isLateNight ? 15.00 : 0.00);
    // 18% GST on services (delivery + platform + surge)
    const swiggyServiceSubtotal = swiggyPlatform + swiggyDelivery + swiggySurge;
    const swiggyGst = Math.round((swiggyServiceSubtotal * 0.18) * 100) / 100;
    const swiggyTotal = swiggyMeal + swiggyPlatform + swiggyPackaging + swiggyDelivery + swiggySurge + swiggyGst;

    // --- 3. RAPIDO OWNLY ---
    // Zero commission, flat fee ₹25 under ₹400, no platform fee, direct restaurant menu pricing
    const ownlyMeal = mealPrice;
    const ownlyPlatform = 0.00;
    const ownlyPackaging = hasPackaging ? 10.00 : 0.00;
    const ownlyDelivery = mealPrice < 400 ? 25.00 : 50.00;
    const ownlySurge = 0.00;
    const ownlyTotal = ownlyMeal + ownlyPlatform + ownlyPackaging + ownlyDelivery + ownlySurge;

    // Update DOM: Toing
    safeSetText('toing-bill-meal', `₹${toingMeal.toFixed(2)}`);
    safeSetText('toing-bill-platform', `₹${toingPlatform.toFixed(2)}`);
    safeSetText('toing-bill-packaging', toingPackaging === 0 ? 'FREE (₹0)' : `₹${toingPackaging.toFixed(2)}`);
    safeSetText('toing-bill-delivery', toingDelivery === 0 ? 'FREE' : `₹${toingDelivery.toFixed(2)}`);
    safeSetText('toing-bill-total', `₹${Math.round(toingTotal)}`);

    // Update DOM: Swiggy Core
    safeSetText('swiggy-bill-meal', `₹${swiggyMeal.toFixed(2)}`);
    safeSetText('swiggy-bill-platform', `₹${swiggyPlatform.toFixed(2)}`);
    safeSetText('swiggy-bill-packaging', `₹${swiggyPackaging.toFixed(2)}`);
    safeSetText('swiggy-bill-delivery', `₹${swiggyDelivery.toFixed(2)}`);
    safeSetText('swiggy-bill-surge', swiggySurge > 0 ? `₹${swiggySurge.toFixed(2)}` : '₹0');
    safeSetText('swiggy-bill-gst', `₹${swiggyGst.toFixed(2)}`);
    safeSetText('swiggy-bill-total', `₹${Math.round(swiggyTotal)}`);

    // Update DOM: Rapido Ownly
    safeSetText('ownly-bill-meal', `₹${ownlyMeal.toFixed(2)}`);
    safeSetText('ownly-bill-delivery', `₹${ownlyDelivery.toFixed(2)}`);
    safeSetText('ownly-bill-total', `₹${Math.round(ownlyTotal)}`);

    // Highlight Savings Delta
    const savings = Math.max(0, Math.round(swiggyTotal - toingTotal));
    const savingsPct = Math.round((savings / swiggyTotal) * 100);
    safeSetText('savings-badge-amount', `₹${savings}`);
    safeSetText('savings-badge-pct', `${savingsPct}% Cheaper`);

    // Unit Economics Platform Contribution for Toing on this order
    // Restaurant food payout ~ ₹mealPrice * 0.85 (15% take)
    // Rider payout ~ ₹35 fixed
    // Toing Revenue = (mealPrice * 0.15) + toingPlatform + toingDelivery
    // Toing Direct Cost = Rider payout (₹35) + payment gateway (₹2.5)
    const toingTake = (mealPrice * 0.15) + toingPlatform + toingDelivery;
    const toingCost = 35.00 + 2.50;
    const toingMargin = toingTake - toingCost;
    
    const marginBadge = document.getElementById('toing-order-margin');
    if (marginBadge) {
      if (toingMargin < 0) {
        marginBadge.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 inline-flex items-center gap-1';
        marginBadge.innerHTML = `<i data-lucide="trending-down" class="w-3.5 h-3.5"></i> Platform Burns -₹${Math.abs(Math.round(toingMargin))} on this order`;
      } else {
        marginBadge.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 inline-flex items-center gap-1';
        marginBadge.innerHTML = `<i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Platform Nets +₹${Math.round(toingMargin)} contribution`;
      }
      lucide.createIcons();
    }
  }

  mealSlider.addEventListener('input', () => {
    playSound('click');
    updateBills();
  });
  if (rainToggle) rainToggle.addEventListener('change', () => { playSound('pop'); updateBills(); });
  if (packagingToggle) packagingToggle.addEventListener('change', () => { playSound('pop'); updateBills(); });
  if (lateNightToggle) lateNightToggle.addEventListener('change', () => { playSound('pop'); updateBills(); });

  updateBills();
}

function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ==========================================================================
   6. Chart.js Financial & Economic Data Visualizations
   ========================================================================== */
let revenueChartInstance = null;
let segmentChartInstance = null;
let unitEconomicsChartInstance = null;
let instamartMarginChartInstance = null;

function initCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';

  // --- Chart 1: Revenue vs Net Loss (Q1 FY26 vs Q1 FY27 in ₹ Crore) ---
  const revCtx = document.getElementById('revenueTurnaroundChart');
  if (revCtx) {
    revenueChartInstance = new Chart(revCtx, {
      type: 'bar',
      data: {
        labels: ['Q1 FY26', 'Q1 FY27 (June 2026)'],
        datasets: [
          {
            label: 'Revenue from Operations (₹ Cr)',
            data: [4961, 6812],
            backgroundColor: '#FC8019',
            borderRadius: 8,
            borderSkipped: false
          },
          {
            label: 'Net Loss (₹ Cr)',
            data: [-1197, -791],
            backgroundColor: '#E23744',
            borderRadius: 8,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ₹${Math.abs(item.raw).toLocaleString()} Cr`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '500' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: (val) => `₹${val} Cr`,
              font: { family: 'JetBrains Mono' }
            }
          }
        }
      }
    });
  }

  // --- Chart 2: Business Segment GOV Distribution (Q1 FY27) ---
  const segCtx = document.getElementById('segmentDistributionChart');
  if (segCtx) {
    segmentChartInstance = new Chart(segCtx, {
      type: 'doughnut',
      data: {
        labels: [
          'Food Delivery (₹9,490 Cr)',
          'Instamart Quick Commerce (₹7,907 Cr)',
          'Out-of-Home / Dining (₹126 Cr)',
          'Platform Innovations [Toing/Snacc/Minis] (₹51 Cr)'
        ],
        datasets: [{
          data: [9490, 7907, 126, 51],
          backgroundColor: [
            '#FC8019', // Swiggy Orange
            '#60B244', // Instamart Green
            '#3B82F6', // Blue
            '#A855F7'  // Innovation Purple
          ],
          borderWidth: 2,
          borderColor: isDark ? '#141824' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              padding: 16,
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: '500' }
            }
          }
        }
      }
    });
  }

  // --- Chart 3: Unit Economics Anatomy: ₹99 Order vs ₹700 Order ---
  const unitCtx = document.getElementById('unitEconomicsChart');
  if (unitCtx) {
    unitEconomicsChartInstance = new Chart(unitCtx, {
      type: 'bar',
      data: {
        labels: ['₹99 Toing Budget Order', '₹700 Swiggy Main App Order'],
        datasets: [
          {
            label: 'Restaurant Food Share',
            data: [84, 525],
            backgroundColor: '#94A3B8'
          },
          {
            label: 'Rider Payout Cost (Fixed)',
            data: [35, 42],
            backgroundColor: '#E23744'
          },
          {
            label: 'Payment & Tech Overhead',
            data: [3, 8],
            backgroundColor: '#CBD5E1'
          },
          {
            label: 'Platform Net Margin / Contribution',
            data: [-23, 125], // Toing loses ~23 without subsidies, Main app nets +125
            backgroundColor: (ctx) => {
              const val = ctx.raw;
              return val >= 0 ? '#60B244' : '#EF4444';
            }
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ₹${item.raw}`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: gridColor },
            ticks: { color: textColor, font: { weight: '600' } }
          },
          y: {
            stacked: true,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: (val) => `₹${val}`,
              font: { family: 'JetBrains Mono' }
            }
          }
        }
      }
    });
  }

  // --- Chart 4: Instamart Margin Path to Break-even ---
  const instaCtx = document.getElementById('instamartMarginChart');
  if (instaCtx) {
    instamartMarginChartInstance = new Chart(instaCtx, {
      type: 'line',
      data: {
        labels: ['Q1 FY26', 'Q2 FY26', 'Q3 FY26', 'Q4 FY26', 'May 2026 (Break-even)', 'Q1 FY27'],
        datasets: [{
          label: 'Instamart Contribution Margin (% of GOV)',
          data: [-4.6, -3.2, -2.1, -0.9, 0.0, -0.2],
          borderColor: '#60B244',
          backgroundColor: 'rgba(96, 178, 68, 0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#60B244',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` Margin: ${item.raw}% of GOV`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: (val) => `${val}%`,
              font: { family: 'JetBrains Mono' }
            }
          }
        }
      }
    });
  }
}

function updateChartThemes(isDark) {
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';

  [revenueChartInstance, segmentChartInstance, unitEconomicsChartInstance, instamartMarginChartInstance].forEach(chart => {
    if (!chart) return;
    if (chart.options.scales) {
      if (chart.options.scales.x) {
        chart.options.scales.x.grid.color = gridColor;
        chart.options.scales.x.ticks.color = textColor;
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.grid.color = gridColor;
        chart.options.scales.y.ticks.color = textColor;
      }
    }
    if (chart.options.plugins && chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    chart.update();
  });
}

/* ==========================================================================
   7. Competitor Matrix Filter
   ========================================================================== */
function initRivalsFilter() {
  const filterBtns = document.querySelectorAll('.rival-filter-btn');
  const rivalCards = document.querySelectorAll('.rival-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      filterBtns.forEach(b => {
        b.classList.remove('bg-orange-500', 'text-white');
        b.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-gray-800', 'dark:text-gray-300');
      });
      btn.classList.add('bg-orange-500', 'text-white');
      btn.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-gray-800', 'dark:text-gray-300');

      const filter = btn.getAttribute('data-filter');
      rivalCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Cannibalization vs Incremental Market Expansion Simulator
   ========================================================================== */
function initCannibalizationSim() {
  const newUserSlider = document.getElementById('cannibal-slider');
  const newUserPctLabel = document.getElementById('cannibal-new-val');
  const switcherPctLabel = document.getElementById('cannibal-switch-val');
  const netImpactBadge = document.getElementById('cannibal-net-impact');
  const cannibalSummary = document.getElementById('cannibal-summary-text');

  if (!newUserSlider) return;

  function updateCannibalization() {
    const newUsers = parseInt(newUserSlider.value, 10); // e.g. 66%
    const switchers = 100 - newUsers; // e.g. 34%

    if (newUserPctLabel) newUserPctLabel.textContent = `${newUsers}% First-Time Users`;
    if (switcherPctLabel) switcherPctLabel.textContent = `${switchers}% Existing Swiggy Switchers`;

    // Impact model:
    // Core Swiggy Order: AOV ₹380, net commission/take ₹55
    // Toing Order: AOV ₹110, net commission/take -₹5
    // If switchers are high (>50%), Swiggy loses massive contribution margin!
    if (switchers > 50) {
      if (netImpactBadge) {
        netImpactBadge.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 inline-flex items-center gap-1';
        netImpactBadge.innerHTML = `<i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> High Margin Erosion Risk (EBITDA Drag)`;
      }
      if (cannibalSummary) {
        cannibalSummary.textContent = `At ${switchers}% cannibalization, existing customers are trading down from ₹350+ full-fee orders to ₹99 subsidized meals, accelerating net margin erosion across Swiggy Food Delivery.`;
      }
    } else if (switchers >= 30) {
      if (netImpactBadge) {
        netImpactBadge.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 inline-flex items-center gap-1';
        netImpactBadge.innerHTML = `<i data-lucide="shield-alert" class="w-3.5 h-3.5"></i> Controlled Cannibalization (Defensive Moat)`;
      }
      if (cannibalSummary) {
        cannibalSummary.textContent = `At ${newUsers}% genuine new users (the reported Q1 FY27 status quo), Toing expands the market into Gen Z & budget tiers while sacrificing a manageable ~${switchers}% of core volume to block Rapido Ownly.`;
      }
    } else {
      if (netImpactBadge) {
        netImpactBadge.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 inline-flex items-center gap-1';
        netImpactBadge.innerHTML = `<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> High Incremental Market Expansion`;
      }
      if (cannibalSummary) {
        cannibalSummary.textContent = `With ${newUsers}% first-time food delivery customers, Toing acts as a massive top-of-funnel customer acquisition machine that Swiggy can later cross-sell into Instamart and Swiggy One.`;
      }
    }
    lucide.createIcons();
  }

  newUserSlider.addEventListener('input', () => {
    playSound('click');
    updateCannibalization();
  });
  updateCannibalization();
}

/* ==========================================================================
   9. Interactive Case Discussion Polls & Instant Community Reveal
   ========================================================================== */
function initDiscussionPolls() {
  const pollCards = document.querySelectorAll('.poll-item');
  let answeredCount = 0;

  pollCards.forEach((card, index) => {
    const questionId = `poll_q_${index + 1}`;
    const options = card.querySelectorAll('.poll-option-btn');
    const resultBox = card.querySelector('.poll-results');
    const verdictBox = card.querySelector('.poll-verdict');
    const toggleVerdictBtn = card.querySelector('.toggle-verdict-btn');

    // Check if previously voted
    const savedVote = localStorage.getItem(`swiggy_case_vote_${questionId}`);
    if (savedVote !== null) {
      revealResults(card, parseInt(savedVote, 10));
      answeredCount++;
    }

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const optionIndex = parseInt(btn.getAttribute('data-option'), 10);
        localStorage.setItem(`swiggy_case_vote_${questionId}`, optionIndex);
        playSound('pop');
        revealResults(card, optionIndex);
        answeredCount++;
        checkAllPollsDone(pollCards.length);
      });
    });

    if (toggleVerdictBtn && verdictBox) {
      toggleVerdictBtn.addEventListener('click', () => {
        playSound('click');
        const isHidden = verdictBox.classList.contains('hidden');
        verdictBox.classList.toggle('hidden');
        toggleVerdictBtn.innerHTML = isHidden ? 
          `<i data-lucide="chevron-up" class="w-4 h-4"></i> Hide Strategic Analysis` :
          `<i data-lucide="chevron-down" class="w-4 h-4"></i> View Analyst Verdict & Case Takeaway`;
        lucide.createIcons();
      });
    }
  });

  function revealResults(card, selectedIdx) {
    const options = card.querySelectorAll('.poll-option-btn');
    const resultBars = card.querySelectorAll('.poll-bar-fill');
    const resultBox = card.querySelector('.poll-results');
    const optionContainer = card.querySelector('.poll-options-container');

    options.forEach(btn => {
      const idx = parseInt(btn.getAttribute('data-option'), 10);
      if (idx === selectedIdx) {
        btn.classList.add('border-orange-500', 'bg-orange-50', 'dark:bg-orange-950/40', 'font-bold');
        const checkIcon = btn.querySelector('.vote-check');
        if (checkIcon) checkIcon.classList.remove('hidden');
      } else {
        btn.classList.add('opacity-70');
      }
      btn.disabled = true;
    });

    if (resultBox) {
      resultBox.classList.remove('hidden');
      // animate bar widths
      setTimeout(() => {
        resultBars.forEach(bar => {
          const target = bar.getAttribute('data-target-pct') || '50';
          bar.style.width = `${target}%`;
        });
      }, 50);
    }
    lucide.createIcons();
  }

  function checkAllPollsDone(total) {
    const answered = document.querySelectorAll('.poll-results:not(.hidden)').length;
    if (answered === total) {
      playSound('success');
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#FC8019', '#60B244', '#3B82F6', '#FFA500']
        });
      }
    }
  }
}

/* ==========================================================================
   10. Search Modal & Instant Quick Jump (Ctrl + K)
   ========================================================================== */
const searchIndex = [
  { title: "Toing Launch & History (Pune August 2025)", section: "what-is-toing", desc: "500 initial downloads, 1,000+ Pune restaurants, expanding to 50 cities within 12 months" },
  { title: "Real-World Bill Comparison (₹124 vs ₹193)", section: "bill-comparison", desc: "The Franchise India Pune test comparing Toing vs Swiggy Main App fee extras" },
  { title: "Swiggy Q1 FY27 Results (June 2026)", section: "the-numbers", desc: "Revenue ₹6,812 Cr (+37.3%), Net Loss ₹791 Cr, Instamart break-even" },
  { title: "Instamart Margin & 1,171 Dark Stores", section: "the-company", desc: "Quick commerce growth, GOV ₹7,907 Cr, contribution margin reaching -0.2%" },
  { title: "Rapido's Ownly Threat & Bike Taxi Synergy", section: "rivals", desc: "Zero commission model, ₹25 flat delivery fee, captains cross-utilized across rides and food" },
  { title: "The Rapido-Prosus Investor Paradox", section: "rapido-paradox", desc: "How Swiggy's portfolio investment in Rapido turned into its fiercest budget competitor" },
  { title: "The Strategic Trilemma (Growth, Rivals, Profit)", section: "the-problem", desc: "Balancing metro saturation, budget disruptors, and public market discipline" },
  { title: "Unit Economics of ₹99 Delivery", section: "analysis", desc: "Fixed rider logistics costs vs low basket sizes: why low-order food delivery math is brutal" },
  { title: "SWOT Analysis of Toing", section: "swot", desc: "Strengths, Weaknesses, Opportunities, and Threats breakdown" },
  { title: "Cannibalization Risk & 2/3 First-Time Metric", section: "cannibalization", desc: "Evaluating whether Toing grows the overall market or cannibalizes core Swiggy food orders" },
  { title: "6 Strategic Recommendations", section: "recommendations", desc: "Profit gates, delivery batching, restaurant economics clarity, cannibalization tracking" },
  { title: "What to Watch Indicator Checklist", section: "what-to-watch", desc: "6 leading KPIs for analysts and investors to monitor" },
  { title: "Interactive Case Discussion & Polls", section: "discussion", desc: "5 strategic questions on standalone apps, subsidies, and multi-brand consolidation" },
  { title: "Verified Primary Sources & Citations", section: "sources", desc: "17 sources including YourStory, Reuters Breakingviews, Angel One, IIFL, MediaNama" }
];

function initSearchModal() {
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('hidden');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
      renderSearchResults('');
    }
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.add('hidden');
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

  // Keyboard shortcut Ctrl+K / Cmd+K and Esc
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchModal && !searchModal.classList.contains('hidden')) {
      closeSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim().toLowerCase());
    });
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    const matches = query ? 
      searchIndex.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
      ) : searchIndex.slice(0, 6);

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="py-8 text-center text-gray-500 dark:text-gray-400">
          <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
          <p class="text-sm font-medium">No case topics found for "${query}"</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    searchResults.innerHTML = matches.map(item => `
      <a href="#${item.section}" class="search-result-item flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-orange-200 dark:hover:border-gray-700">
        <div class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center shrink-0">
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </div>
        <div>
          <div class="font-semibold text-sm text-gray-900 dark:text-white">${item.title}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">${item.desc}</div>
        </div>
      </a>
    `).join('');

    lucide.createIcons();

    // Attach click listener to close modal on selection
    searchResults.querySelectorAll('.search-result-item').forEach(link => {
      link.addEventListener('click', () => {
        closeSearch();
        playSound('click');
      });
    });
  }
}

/* ==========================================================================
   11. Tooltips and Interactive Badges
   ========================================================================== */
function initTooltips() {
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      playSound('pop');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        const orig = shareBtn.innerHTML;
        shareBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-500"></i> Copied URL!`;
        lucide.createIcons();
        setTimeout(() => {
          shareBtn.innerHTML = orig;
          lucide.createIcons();
        }, 2000);
      }
    });
  }
}
