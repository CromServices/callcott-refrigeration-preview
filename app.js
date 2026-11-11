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
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Australia/Sydney",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function fillChips(chips) {
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
      if (dowNum === 0 || dowNum === 6) b.disabled = true;
      b.setAttribute("data-label", parts.weekday + " " + parts.day + " " + parts.month);
      b.innerHTML = '<span class="dow">' + days[dowNum] + '</span><span class="dom">' + parts.day + '</span><span class="mon">' + parts.month + "</span>";
      chips.appendChild(b);
    }
    var first = chips.querySelector(".chip:not(:disabled)");
    if (first) first.classList.add("is-on");
  }

  function groupToggle(nodes, onChange) {
    nodes.forEach(function (el) {
      el.addEventListener("click", function () {
        nodes.forEach(function (n) { n.classList.remove("is-on"); });
        el.classList.add("is-on");
        if (onChange) onChange();
      });
    });
  }

  document.querySelectorAll(".day-chips").forEach(function (chips) {
    fillChips(chips);
    var widget = chips.closest(".book-widget") || chips.closest("form") || document;
    var summary = widget.querySelector(".summary") || document.querySelector("#book-summary");
    function updateSummary() {
      if (!summary) return;
      var chip = chips.querySelector(".chip.is-on:not(:disabled)");
      var pill = widget.querySelector(".time-pills .pill.is-on");
      var job = widget.querySelector(".job-chips .job-chip.is-on");
      var day = chip ? chip.getAttribute("data-label") : "a weekday";
      var win = pill ? pill.textContent.trim() : "a time window";
      var work = job ? job.textContent.trim() : "a job type";
      summary.textContent = day + " · " + win + " · " + work;
    }
    chips.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn || btn.disabled) return;
      chips.querySelectorAll(".chip").forEach(function (n) { n.classList.remove("is-on"); });
      btn.classList.add("is-on");
      updateSummary();
    });
    groupToggle(widget.querySelectorAll(".time-pills .pill"), updateSummary);
    groupToggle(widget.querySelectorAll(".job-chips .job-chip"), updateSummary);
    updateSummary();
  });

  document.querySelectorAll(".quote-form, #quote-form").forEach(function (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var box = quoteForm.querySelector(".thanks") || document.querySelector("#quote-success");
      if (box) {
        box.classList.add("is-on");
        box.style.display = "block";
      }
    });
  });

  document.querySelectorAll(".book-form, #book-form").forEach(function (bookForm) {
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var widget = bookForm.querySelector(".book-widget") || bookForm;
      var summary = widget.querySelector(".summary");
      var box = bookForm.parentElement.querySelector(".success") || document.querySelector("#book-success");
      var line = summary ? summary.textContent : "";
      if (box) {
        box.innerHTML = "<p>Visit request saved.</p><p>" + line + "</p>";
        box.classList.add("is-on");
        box.style.display = "block";
        bookForm.setAttribute("hidden", "");
      }
    });
  });
})();
