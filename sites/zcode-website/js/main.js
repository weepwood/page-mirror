/* ZCode 官网复刻 — 交互脚本 */
(function () {
  "use strict";

  /* ---------- 顶部导航滚动态 ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 桌面端「社区」下拉 ---------- */
  var navCommunity = document.getElementById("navCommunity");
  var communityMenu = document.getElementById("communityMenu");
  if (navCommunity && communityMenu) {
    var trigger = navCommunity.querySelector(".community-trigger");
    var hideTimer = null;
    function openMenu() {
      clearTimeout(hideTimer);
      communityMenu.hidden = false;
      navCommunity.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      communityMenu.hidden = true;
      navCommunity.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }
    navCommunity.addEventListener("mouseenter", openMenu);
    navCommunity.addEventListener("mouseleave", function () {
      hideTimer = setTimeout(closeMenu, 120);
    });
    trigger.addEventListener("click", function () {
      if (communityMenu.hidden) openMenu();
      else closeMenu();
    });
    document.addEventListener("click", function (e) {
      if (!navCommunity.contains(e.target)) closeMenu();
    });
  }

  /* ---------- 移动端菜单 ---------- */
  var mobileMenuBtn = document.getElementById("mobileMenuBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      var expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.hidden = expanded;
    });
  }
  var mobileCommunity = document.querySelector(".mobile-community");
  var mobileCommunityLinks = document.getElementById("mobileCommunityLinks");
  if (mobileCommunity && mobileCommunityLinks) {
    mobileCommunity.addEventListener("click", function () {
      var expanded = mobileCommunity.getAttribute("aria-expanded") === "true";
      mobileCommunity.setAttribute("aria-expanded", String(!expanded));
      mobileCommunityLinks.hidden = expanded;
    });
  }

  /* ---------- Hero 下载按钮平台检测 ---------- */
  var heroDownload = document.getElementById("heroDownload");
  var heroDownloadSub = document.getElementById("heroDownloadSub");
  if (heroDownload && heroDownloadSub) {
    var ua = navigator.userAgent;
    var ver = "3.16.3";
    var base = "https://cdn-zcode.z.ai/zcode/electron/releases/" + ver + "/";
    if (/Windows/.test(ua)) {
      heroDownload.href = base + "windows-x64/ZCode-" + ver + "-win-x64.exe";
      heroDownloadSub.textContent = "适用于 Windows（64 位）";
    } else if (/Linux/.test(ua)) {
      heroDownload.href = base + "linux-x64/ZCode-" + ver + "-linux-x64.AppImage";
      heroDownloadSub.textContent = "适用于 Linux x64";
    } else if (/Mac/.test(ua)) {
      if (/ARM|Apple Silicon/.test(ua) || (navigator.platform && /arm/i.test(navigator.platform))) {
        heroDownload.href = base + "macos-arm64/ZCode-" + ver + "-mac-arm64.dmg";
        heroDownloadSub.textContent = "适用于 macOS (Apple Silicon)";
      } else {
        heroDownload.href = base + "macos-x64/ZCode-" + ver + "-mac-x64.dmg";
        heroDownloadSub.textContent = "适用于 macOS (Intel)";
      }
    }
  }

  /* ---------- 工具块折叠交互（mockup 内） ---------- */
  document.querySelectorAll(".tool-row").forEach(function (row) {
    row.addEventListener("click", function () {
      var block = row.closest(".tool-block");
      if (!block) return;
      var chevron = row.querySelector(".tool-chevron");
      var output = block.querySelector(".term-output");
      var willOpen = !block.classList.contains("open");
      block.classList.toggle("open", willOpen);
      row.setAttribute("aria-expanded", String(willOpen));
      if (chevron) chevron.classList.toggle("open", willOpen);
      if (output) output.style.display = willOpen ? "" : "none";
    });
  });
})();
