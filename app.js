(function () {
  var THEME_KEY = "callcott-theme";
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var chips = document.querySelector(".day-chips");
  var summary = document.querySelector("#book-summary");
  var timePills = document.querySelectorAll(".time-pills .pill");
  var jobChips = document.querySelectorAll(".job-chips .job-chip");

  function sydneyParts(date) {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Australia/Sydney",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }).formatToParts(date);
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    return map;
  }

  function addDays(base, n) {
    return new Date(base.getTime() + n * 86400000);
  }

  function isoFromSydney(date) {
    var f = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Australia/Sydney",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return f.format(date);
  }

  function weekdayFromIso(iso) {
    var d = new Date(iso + "T12:00:00+11:00");
    return new Date(d.toLocaleString("en-US", { timeZone: "Australia/Sydney" })).getDay();
  }

  function selectedChip() {
    return document.querySelector(".day-chips .chip.is-on:not(:disabled)");
  }
  function selectedPill() {
    return document.querySelector(".time-pills .pill.is-on");
  }
  function selectedJob() {
    return document.querySelector(".job-chips .job-chip.is-on");
  }

  function updateSummary() {
    if (!summary) return;
    var chip = selectedChip();
    var pill = selectedPill();
    var job = selectedJob();
    var day = chip ? chip.getAttribute("data-label") : "a weekday";
    var win = pill ? pill.textContent.trim() : "a time window";
    var work = job ? job.textContent.trim() : "a job type";
    summary.textContent = day + " · " + win + " · " + work;
  }

  if (chips) {
    chips.innerHTML = "";
    var start = new Date();
    for (var i = 0; i < 14; i++) {
      var d = addDays(start, i);
      var iso = isoFromSydney(d);
      var parts = sydneyParts(d);
      var dowNum = days.indexOf(parts.weekday);
      if (dowNum < 0) dowNum = 0;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.setAttribute("data-date", iso);
      b.setAttribute("data-dow", String(dowNum));
      var weekend = dowNum === 0 || dowNum === 6;
      if (weekend) b.disabled = true;
      b.setAttribute("data-label", parts.weekday + " " + parts.day + " " + parts.month);
      b.innerHTML = '<span class="dow">' + days[dowNum] + '</span><span class="dom">' + parts.day + '</span><span class="mon">' + parts.month + "</span>";
      chips.appendChild(b);
    }
    var first = chips.querySelector(".chip:not(:disabled)");
    if (first) first.classList.add("is-on");
    chips.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn || btn.disabled) return;
      chips.querySelectorAll(".chip").forEach(function (n) { n.classList.remove("is-on"); });
      btn.classList.add("is-on");
      updateSummary();
    });
  }

  function groupToggle(nodes) {
    nodes.forEach(function (el) {
      el.addEventListener("click", function () {
        nodes.forEach(function (n) { n.classList.remove("is-on"); });
        el.classList.add("is-on");
        updateSummary();
      });
    });
  }
  groupToggle(timePills);
  groupToggle(jobChips);
  updateSummary();

  var quoteForm = document.querySelector("#quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var box = document.querySelector("#quote-success");
      if (box) {
        box.classList.add("is-on");
        box.style.display = "block";
      }
    });
  }

  var bookForm = document.querySelector("#book-form");
  if (bookForm) {
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var box = document.querySelector("#book-success");
      var line = summary ? summary.textContent : "";
      if (box) {
        box.innerHTML = "<p>Visit request saved.</p><p>" + line + "</p>";
        box.classList.add("is-on");
        box.style.display = "block";
        bookForm.setAttribute("hidden", "");
      }
    });
  }
})();
