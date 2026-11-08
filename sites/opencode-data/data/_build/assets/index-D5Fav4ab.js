import { ab as useI18n, ac as useLanguage, J as localizedUrl, s as createSignal, V as onMount, y as getNextElement, z as getNextMarker, C as insert, k as createComponent, n as createRenderEffect, a8 as template, u as delegateEvents, T as Title, M as Meta, b as Link, S as Show, Z as setAttribute, m as createMemo, U as onCleanup, K as memo, l as createEffect, f as addEventListener, X as runHydrationEvents, F as For, aa as use, a0 as setStyleProperty, a6 as style } from "./i18n-DJbnCyo8.js";
import { d as createAsync, e as createServerReference, q as query, j as getModelCatalog, i as getGitHubStars, t as themeStorageKey, a as applyThemePreference, l as isThemePreference, k as githubLink, H as Header, C as ComparisonCardsSection, F as Footer, f as findModelCatalogEntry, u as uniqueComparisonPairs } from "./stats-shell-D85bQNDr.js";
import { L as LocaleLinks, P as ProviderIcon } from "./locale-links-hcqm6Rft.js";
import { a as countryCodesSource, c as countriesTopologySource, f as feature, g as geoEquirectangular, b as geoPath, m as mesh, s as sqrt } from "./countries-50m-00FeqXYe.js";
import { S as SectionHeading } from "./section-heading-C1DHUbGf.js";
const ibmPlexMonoRegularLatin1 = "/data/_build/assets/IBMPlexMono-Regular-Latin1-BsnL3gsb.woff2";
const ibmPlexMonoMediumLatin1 = "/data/_build/assets/IBMPlexMono-Medium-Latin1-DBHUbp12.woff2";
const ibmPlexMonoSemiBoldLatin1 = "/data/_build/assets/IBMPlexMono-SemiBold-Latin1-iYs1QkgK.woff2";
const ibmPlexMonoBoldLatin1 = "/data/_build/assets/IBMPlexMono-Bold-Latin1-K_Zucu9w.woff2";
var _tmpl$ = /* @__PURE__ */ template(`<main data-page=stats><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><div data-component=container><div data-component=content></div><!$><!/>`), _tmpl$2 = /* @__PURE__ */ template(`<section data-section=hero><p data-slot=hero-meta aria-live=polite aria-atomic=true><svg aria-hidden=true width=16 height=16 viewBox="0 0 16 16"><path fill-rule=evenodd clip-rule=evenodd d="M13 13H3V3H13V13ZM6.46777 6.81641V7.81641H7.5791V11.3721H8.5791V6.81641H6.46777ZM7.30078 4.62891V5.62891H8.85645V4.62891H7.30078Z"fill=currentColor></path></svg><!$><!/></p><div data-slot=hero-canvas><div data-slot=hero-pattern aria-hidden=true></div><h1><a data-slot=heading-link href=#overview></a></h1><p data-slot=hero-copy>`), _tmpl$3 = /* @__PURE__ */ template(`<span data-slot=hero-meta-label aria-hidden=true>`), _tmpl$4 = /* @__PURE__ */ template(`<span data-slot=hero-meta-time aria-hidden=true><!$><!/><span data-slot=hero-meta-separator>,</span><!$><!/>`), _tmpl$5 = /* @__PURE__ */ template(`<span data-slot=hero-meta-empty>`), _tmpl$6 = /* @__PURE__ */ template(`<span data-slot=hero-meta-ticker><span data-slot=hero-meta-ticker-track><span data-slot=hero-meta-ticker-item></span><span data-slot=hero-meta-ticker-item>`), _tmpl$7 = /* @__PURE__ */ template(`<section data-section=chart><div data-slot=section-header><div><h2></h2><!$><!/></div><!$><!/></div><!$><!/>`), _tmpl$8 = /* @__PURE__ */ template(`<a data-slot=heading-link>`), _tmpl$9 = /* @__PURE__ */ template(`<p>`), _tmpl$0 = /* @__PURE__ */ template(`<a data-component=section-bridge><span></span><i></i><strong></strong><b>▸`), _tmpl$1 = /* @__PURE__ */ template(`<div data-component=empty-state><strong></strong><p>`), _tmpl$10 = /* @__PURE__ */ template(`<section id=top-models data-section=top-models><!$><!/><!$><!/><!$><!/><div data-slot=chart-footer hidden><!$><!/><div data-slot=top-models-mobile-controls><!$><!/><!$><!/></div></div><!$><!/>`), _tmpl$11 = /* @__PURE__ */ template(`<button data-slot=mobile-filter-button type=button><span></span><!$><!/>`), _tmpl$12 = /* @__PURE__ */ template(`<div data-component=mobile-filter-sheet role=presentation><div data-slot=filter-sheet-panel role=radiogroup>`), _tmpl$13 = /* @__PURE__ */ template(`<button type=button role=radio>`), _tmpl$14 = /* @__PURE__ */ template(`<svg width=16 height=16 viewBox="0 0 16 16"aria-hidden=true fill=none><path d="M5 7L8 10L11 7"stroke=currentColor>`), _tmpl$15 = /* @__PURE__ */ template(`<div data-component=usage-filter role=radiogroup>`), _tmpl$16 = /* @__PURE__ */ template(`<div data-component=top-models-chart role=img><div data-slot=top-models-axis aria-hidden=true></div><div data-slot=top-models-bars>`), _tmpl$17 = /* @__PURE__ */ template(`<div><span data-slot=axis-label><span data-slot=axis-total></span><span data-slot=axis-date><span data-slot=axis-date-full></span><span data-slot=axis-date-mobile>`), _tmpl$18 = /* @__PURE__ */ template(`<div data-slot=top-models-bar role=button tabindex=0><div data-slot=top-models-stack></div><!$><!/>`), _tmpl$19 = /* @__PURE__ */ template(`<i>`), _tmpl$20 = /* @__PURE__ */ template(`<span><!$><!/> <!$><!/>`), _tmpl$21 = /* @__PURE__ */ template(`<div data-slot=tooltip-divider>`), _tmpl$22 = /* @__PURE__ */ template(`<div data-component=chart-tooltip><strong></strong><!$><!/><!$><!/><!$><!/>`), _tmpl$23 = /* @__PURE__ */ template(`<p><span data-slot=tooltip-label><i></i> <!$><!/></span><b>`), _tmpl$24 = /* @__PURE__ */ template(`<section id=unique-users data-section=unique-users><!$><!/><!$><!/><!$><!/>`), _tmpl$25 = /* @__PURE__ */ template(`<div id=leaderboard data-component=leaderboard role=list><div data-slot=leaderboard-featured></div><div data-slot=leaderboard-pattern aria-hidden=true></div><div data-slot=leaderboard-compact></div><div data-slot=leaderboard-mobile>`), _tmpl$26 = /* @__PURE__ */ template(`<a data-component=leader-card role=listitem tabindex=0><span data-slot=rank></span><!$><!/><div data-slot=leader-body><!$><!/><div data-slot=leader-copy><div><strong></strong><span></span></div><div><span></span><span data-slot=delta>`), _tmpl$27 = /* @__PURE__ */ template(`<section id=market-share data-section=market-share><!$><!/><!$><!/><!$><!/><div data-slot=market-footer><p><span>[*]</span><strong></strong></p><div hidden>`), _tmpl$28 = /* @__PURE__ */ template(`<div data-component=market-share role=img><div data-slot=market-labels></div><div data-slot=market-bars>`), _tmpl$29 = /* @__PURE__ */ template(`<button type=button><span data-slot=market-axis-label><span data-slot=market-total></span><span data-slot=market-date><span data-slot=market-date-full></span><span data-slot=market-date-mobile>`), _tmpl$30 = /* @__PURE__ */ template(`<button type=button>`), _tmpl$31 = /* @__PURE__ */ template(`<span>`), _tmpl$32 = /* @__PURE__ */ template(`<ol data-component=market-share-list>`), _tmpl$33 = /* @__PURE__ */ template(`<strong>`), _tmpl$34 = /* @__PURE__ */ template(`<em>`), _tmpl$35 = /* @__PURE__ */ template(`<b><!$><!/>%`), _tmpl$36 = /* @__PURE__ */ template(`<li>`), _tmpl$37 = /* @__PURE__ */ template(`<a>`), _tmpl$38 = /* @__PURE__ */ template(`<div data-component=geo-breakdown><div data-slot=geo-map-panel><!$><!/><!$><!/></div><!$><!/>`), _tmpl$39 = /* @__PURE__ */ template(`<section id=geo-breakdown data-section=geo-breakdown><!$><!/><!$><!/><!$><!/>`), _tmpl$40 = /* @__PURE__ */ template(`<div data-slot=geo-active-country><span>#<!$><!/></span><strong></strong><p><b></b><em>`), _tmpl$41 = /* @__PURE__ */ template(`<svg data-component=geo-world-map viewBox="0 0 960 430"role=img><title></title><g data-slot=geo-countries></g><g data-slot=geo-country-markers></g><path data-slot=geo-borders aria-hidden=true>`), _tmpl$42 = /* @__PURE__ */ template(`<svg><path aria-hidden=true></svg>`, false, true, false), _tmpl$43 = /* @__PURE__ */ template(`<svg><circle aria-hidden=true></svg>`, false, true, false), _tmpl$44 = /* @__PURE__ */ template(`<ol data-component=geo-country-list>`), _tmpl$45 = /* @__PURE__ */ template(`<li><button type=button><span></span><i></i><strong></strong><em></em><b>`), _tmpl$46 = /* @__PURE__ */ template(`<section id=token-cost data-section=token-cost><!$><!/><!$><!/><!$><!/><div data-slot=token-footer hidden><!$><!/><!$><!/>`), _tmpl$47 = /* @__PURE__ */ template(`<div data-component=token-cost><!$><!/><!$><!/>`), _tmpl$48 = /* @__PURE__ */ template(`<button type=button data-component=token-row><strong></strong><span></span><!$><!/>`), _tmpl$49 = /* @__PURE__ */ template(`<div data-component=token-tooltip><p><span></span><strong></strong></p><p><span></span><strong></strong></p><p><span></span><strong>`), _tmpl$50 = /* @__PURE__ */ template(`<section id=cache-ratio data-section=cache-ratio><!$><!/><!$><!/><!$><!/><div data-slot=token-footer hidden><!$><!/><!$><!/>`), _tmpl$51 = /* @__PURE__ */ template(`<div data-component=cache-ratio data-variant=marker><div data-slot=cache-ratio-heading aria-hidden=true><strong></strong><span></span><b>0-100%</b></div><div data-slot=cache-ratio-rows></div><!$><!/>`), _tmpl$52 = /* @__PURE__ */ template(`<button type=button data-component=cache-ratio-row><strong></strong><span></span><!$><!/>`), _tmpl$53 = /* @__PURE__ */ template(`<div data-component=token-tooltip data-variant=cache-ratio><p><span></span><strong></strong></p><p><span></span><strong></strong></p><p><span></span><strong>`), _tmpl$54 = /* @__PURE__ */ template(`<i data-component=cache-ratio-marker><em>`), _tmpl$55 = /* @__PURE__ */ template(`<i data-component=metric-bar><b></b><em>`), _tmpl$56 = /* @__PURE__ */ template(`<section id=session-cost data-section=session-cost><!$><!/><!$><!/><!$><!/><div data-slot=token-footer hidden><!$><!/><!$><!/>`), _tmpl$57 = /* @__PURE__ */ template(`<div data-component=session-cost><div data-slot=session-heading><strong aria-hidden=true></strong><span aria-hidden=true></span><p></p><p></p></div><!$><!/><!$><!/>`), _tmpl$58 = /* @__PURE__ */ template(`<button type=button data-component=token-row data-variant=session><strong></strong><span></span><!$><!/><!$><!/>`), _tmpl$59 = /* @__PURE__ */ template(`<div data-component=token-tooltip data-variant=session><p><span></span><strong></strong></p><p><span></span><strong>`), _tmpl$60 = /* @__PURE__ */ template(`<span data-component=live-filter>`);
const products = ["All Users", "Zen", "Go"];
const tokenProducts = ["Zen", "Go"];
const ranges = ["1D", "1W", "2W", "1M", "2M"];
const comparisonPairIndexes = [[0, 1, "Top two by recent usage"], [0, 2, "Leader vs challenger"], [1, 2, "Adjacent leaderboard pair"], [2, 3, "Top model alternative"]];
const statsUnfurlPath = "banner.jpg";
const usageColors = ["#ed6aff", "#a684ff", "#7c86ff", "#51a2ff", "#00d3f2", "#00d5be", "#00bc7d", "#9ae600", "#ffb900", "#ff8904", "#ff6467"];
const marketColors = ["#ed6aff", "#a684ff", "#7c86ff", "#51a2ff", "#00d3f2", "#00d5be", "#00bc7d", "#9ae600", "#ffb900"];
const geoMapWidth = 960;
const geoMapHeight = 430;
function productLabel(product, i18n) {
  if (product === "All Users") return i18n.t("product.allUsers");
  if (product === "Zen") return i18n.t("product.zen");
  return i18n.t("product.go");
}
function rangeLabel(range, i18n) {
  if (range === "1D") return i18n.t("range.1D");
  if (range === "1W") return i18n.t("range.1W");
  if (range === "2W") return i18n.t("range.2W");
  if (range === "1M") return i18n.t("range.1M");
  return i18n.t("range.2M");
}
const countryNumericIds = new Map(JSON.parse(countryCodesSource).map((country) => [country[0], country[2]]));
const worldTopology = JSON.parse(countriesTopologySource);
const worldCountryGeometries = {
  ...worldTopology.objects.countries,
  geometries: worldTopology.objects.countries.geometries.filter((country) => String(country.id ?? "") !== "010")
};
const worldCountries = feature(worldTopology, worldCountryGeometries);
const worldProjection = geoEquirectangular().fitExtent([[10, 12], [geoMapWidth - 10, geoMapHeight - 12]], worldCountries);
const worldPath = geoPath(worldProjection);
const worldCountryPaths = worldCountries.features.map((country) => ({
  id: String(country.id ?? "").padStart(3, "0"),
  path: worldPath(country) ?? "",
  marker: geoCountryMarker(country)
}));
const worldBorderPath = worldPath(mesh(worldTopology, worldCountryGeometries, (a, b) => a !== b)) ?? "";
const getData_query = createServerReference("af22240409e3c36f74894bfdbbd26e6e1163aaa06eba7bec0be1f00a4352fa25");
const getData = query(getData_query, "getStatsHomeData");
function StatsHome() {
  const i18n = useI18n();
  const language = useLanguage();
  const statsHomeUrl = localizedUrl(language.locale(), "/data/");
  const statsUnfurlUrl = new URL(statsUnfurlPath, localizedUrl("en", "/data/")).toString();
  const data = createAsync(() => getData());
  const catalog = createAsync(() => getModelCatalog());
  const githubStars = createAsync(() => getGitHubStars());
  const [themePreference, setThemePreference] = createSignal("system");
  const updateThemePreference = (preference) => {
    applyThemePreference(preference);
    setThemePreference(preference);
    if (typeof window === "undefined") return;
    window.localStorage.setItem(themeStorageKey, preference);
  };
  onMount(() => {
    if (typeof window === "undefined") return;
    const preference = window.localStorage.getItem(themeStorageKey);
    const nextPreference = isThemePreference(preference) ? preference : "system";
    applyThemePreference(nextPreference);
    setThemePreference(nextPreference);
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$6 = _el$.firstChild, [_el$7, _co$2] = getNextMarker(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$3] = getNextMarker(_el$8.nextSibling), _el$0 = _el$9.nextSibling, [_el$1, _co$4] = getNextMarker(_el$0.nextSibling), _el$10 = _el$1.nextSibling, [_el$11, _co$5] = getNextMarker(_el$10.nextSibling), _el$12 = _el$11.nextSibling, [_el$13, _co$6] = getNextMarker(_el$12.nextSibling), _el$14 = _el$13.nextSibling, [_el$15, _co$7] = getNextMarker(_el$14.nextSibling), _el$16 = _el$15.nextSibling, [_el$17, _co$8] = getNextMarker(_el$16.nextSibling), _el$18 = _el$17.nextSibling, [_el$19, _co$9] = getNextMarker(_el$18.nextSibling), _el$20 = _el$19.nextSibling, [_el$21, _co$0] = getNextMarker(_el$20.nextSibling), _el$22 = _el$21.nextSibling, [_el$23, _co$1] = getNextMarker(_el$22.nextSibling), _el$24 = _el$23.nextSibling, [_el$25, _co$10] = getNextMarker(_el$24.nextSibling), _el$26 = _el$25.nextSibling, [_el$27, _co$11] = getNextMarker(_el$26.nextSibling), _el$28 = _el$27.nextSibling, [_el$29, _co$12] = getNextMarker(_el$28.nextSibling), _el$30 = _el$29.nextSibling, [_el$31, _co$13] = getNextMarker(_el$30.nextSibling), _el$32 = _el$31.nextSibling, [_el$33, _co$14] = getNextMarker(_el$32.nextSibling), _el$34 = _el$33.nextSibling, [_el$35, _co$15] = getNextMarker(_el$34.nextSibling), _el$36 = _el$35.nextSibling, [_el$37, _co$16] = getNextMarker(_el$36.nextSibling), _el$38 = _el$37.nextSibling, [_el$39, _co$17] = getNextMarker(_el$38.nextSibling), _el$40 = _el$39.nextSibling, [_el$41, _co$18] = getNextMarker(_el$40.nextSibling), _el$42 = _el$41.nextSibling, [_el$43, _co$19] = getNextMarker(_el$42.nextSibling), _el$44 = _el$43.nextSibling, [_el$45, _co$20] = getNextMarker(_el$44.nextSibling), _el$46 = _el$45.nextSibling, [_el$47, _co$21] = getNextMarker(_el$46.nextSibling), _el$48 = _el$47.nextSibling, [_el$49, _co$22] = getNextMarker(_el$48.nextSibling), _el$2 = _el$49.nextSibling, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, [_el$5, _co$] = getNextMarker(_el$4.nextSibling);
    insert(_el$, createComponent(Title, {
      get children() {
        return i18n.t("app.title");
      }
    }), _el$7, _co$2);
    insert(_el$, createComponent(Meta, {
      name: "description",
      get content() {
        return i18n.t("app.description");
      }
    }), _el$9, _co$3);
    insert(_el$, createComponent(LocaleLinks, {
      path: "/data/"
    }), _el$1, _co$4);
    insert(_el$, createComponent(Meta, {
      property: "og:type",
      content: "website"
    }), _el$11, _co$5);
    insert(_el$, createComponent(Meta, {
      property: "og:site_name",
      content: "OpenCode"
    }), _el$13, _co$6);
    insert(_el$, createComponent(Meta, {
      property: "og:title",
      get content() {
        return i18n.t("app.title");
      }
    }), _el$15, _co$7);
    insert(_el$, createComponent(Meta, {
      property: "og:description",
      get content() {
        return i18n.t("app.description");
      }
    }), _el$17, _co$8);
    insert(_el$, createComponent(Meta, {
      property: "og:url",
      content: statsHomeUrl
    }), _el$19, _co$9);
    insert(_el$, createComponent(Meta, {
      property: "og:image",
      content: statsUnfurlUrl
    }), _el$21, _co$0);
    insert(_el$, createComponent(Meta, {
      property: "og:image:type",
      content: "image/jpeg"
    }), _el$23, _co$1);
    insert(_el$, createComponent(Meta, {
      property: "og:image:width",
      content: "1200"
    }), _el$25, _co$10);
    insert(_el$, createComponent(Meta, {
      property: "og:image:height",
      content: "630"
    }), _el$27, _co$11);
    insert(_el$, createComponent(Meta, {
      property: "og:image:alt",
      get content() {
        return i18n.t("app.unfurlAlt");
      }
    }), _el$29, _co$12);
    insert(_el$, createComponent(Meta, {
      name: "twitter:card",
      content: "summary_large_image"
    }), _el$31, _co$13);
    insert(_el$, createComponent(Meta, {
      name: "twitter:title",
      get content() {
        return i18n.t("app.title");
      }
    }), _el$33, _co$14);
    insert(_el$, createComponent(Meta, {
      name: "twitter:description",
      get content() {
        return i18n.t("app.description");
      }
    }), _el$35, _co$15);
    insert(_el$, createComponent(Meta, {
      name: "twitter:image",
      content: statsUnfurlUrl
    }), _el$37, _co$16);
    insert(_el$, createComponent(Meta, {
      name: "twitter:image:alt",
      get content() {
        return i18n.t("app.unfurlAlt");
      }
    }), _el$39, _co$17);
    insert(_el$, createComponent(Link, {
      rel: "preload",
      href: ibmPlexMonoRegularLatin1,
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous"
    }), _el$41, _co$18);
    insert(_el$, createComponent(Link, {
      rel: "preload",
      href: ibmPlexMonoMediumLatin1,
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous"
    }), _el$43, _co$19);
    insert(_el$, createComponent(Link, {
      rel: "preload",
      href: ibmPlexMonoSemiBoldLatin1,
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous"
    }), _el$45, _co$20);
    insert(_el$, createComponent(Link, {
      rel: "preload",
      href: ibmPlexMonoBoldLatin1,
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous"
    }), _el$47, _co$21);
    insert(_el$, createComponent(Header, {
      get githubStars() {
        return githubStars() ?? githubLink.fallbackStars;
      }
    }), _el$49, _co$22);
    insert(_el$3, createComponent(Show, {
      get when() {
        return data();
      },
      get fallback() {
        return createComponent(StatsLoading, {});
      },
      children: (stats) => [createComponent(Hero, {
        get updatedAt() {
          return stats().updatedAt;
        }
      }), createComponent(TopModelsSection, {
        get data() {
          return stats().usage;
        },
        get leaderboard() {
          return stats().leaderboard;
        }
      }), createComponent(UniqueUsersSection, {
        get data() {
          return stats().users;
        }
      }), createComponent(SessionCostSection, {
        get data() {
          return stats().sessionCost;
        }
      }), createComponent(TokenCostSection, {
        get data() {
          return stats().tokenCost;
        },
        get catalog() {
          return catalog() ?? null;
        }
      }), createComponent(CacheRatioSection, {
        get data() {
          return stats().cacheRatio;
        }
      }), createComponent(MarketShareSection, {
        get data() {
          return stats().market;
        }
      }), createComponent(GeoBreakdownSection, {
        get data() {
          return stats().country;
        }
      }), createComponent(ComparisonCardsSection, {
        get pairs() {
          return homeComparisonPairs(stats().leaderboard["All Users"]["2M"]);
        },
        title: "Model Comparisons",
        description: "Popular model pairs from the leaderboard."
      })]
    }));
    insert(_el$2, createComponent(Footer, {
      get themePreference() {
        return themePreference();
      },
      onThemePreferenceChange: updateThemePreference,
      bridge: {
        href: "#model-comparison",
        label: "MODEL COMPARISONS"
      }
    }), _el$5, _co$);
    createRenderEffect(() => setAttribute(_el$, "data-theme", themePreference()));
    return _el$;
  })();
}
function Hero(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const [timeZone, setTimeZone] = createSignal("UTC");
  const [previousTimeZone, setPreviousTimeZone] = createSignal("UTC");
  const [isTicking, setIsTicking] = createSignal(false);
  const updatedAtParts = (timeZone2) => props.updatedAt ? formatUpdatedAtParts(props.updatedAt, timeZone2, language.tag(language.locale()), i18n.t("home.justNow")) : {
    date: i18n.t("home.noRows"),
    time: ""
  };
  const previousUpdatedAt = createMemo(() => updatedAtParts(previousTimeZone()));
  const currentUpdatedAt = createMemo(() => updatedAtParts(timeZone()));
  const currentUpdatedLabel = createMemo(() => props.updatedAt ? `${i18n.t("home.updated")} ${formatUpdatedAtLabel(currentUpdatedAt())}` : i18n.t("home.noRows"));
  const isDateTicking = createMemo(() => isTicking() && previousUpdatedAt().date !== currentUpdatedAt().date);
  const isTimeTicking = createMemo(() => isTicking() && previousUpdatedAt().time !== currentUpdatedAt().time);
  onMount(() => {
    if (!props.updatedAt) return;
    const nextTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    if (nextTimeZone === "UTC") return;
    if (formatUpdatedAtLabel(formatUpdatedAtParts(props.updatedAt, nextTimeZone, language.tag(language.locale()), i18n.t("home.justNow"))) === formatUpdatedAtLabel(updatedAtParts("UTC"))) return;
    const timeouts = [];
    timeouts.push(window.setTimeout(() => {
      setPreviousTimeZone(timeZone());
      setTimeZone(nextTimeZone);
      setIsTicking(true);
      timeouts.push(window.setTimeout(() => {
        setPreviousTimeZone(nextTimeZone);
        setIsTicking(false);
      }, 720));
    }, 480));
    onCleanup(() => timeouts.forEach((timeout) => window.clearTimeout(timeout)));
  });
  return (() => {
    var _el$50 = getNextElement(_tmpl$2), _el$51 = _el$50.firstChild, _el$52 = _el$51.firstChild, _el$53 = _el$52.nextSibling, [_el$54, _co$23] = getNextMarker(_el$53.nextSibling), _el$55 = _el$51.nextSibling, _el$56 = _el$55.firstChild, _el$57 = _el$56.nextSibling, _el$58 = _el$57.firstChild, _el$59 = _el$57.nextSibling;
    insert(_el$51, (() => {
      var _c$ = memo(() => !!props.updatedAt);
      return () => _c$() ? [(() => {
        var _el$60 = getNextElement(_tmpl$3);
        insert(_el$60, () => i18n.t("home.updated"));
        return _el$60;
      })(), (() => {
        var _el$61 = getNextElement(_tmpl$4), _el$63 = _el$61.firstChild, [_el$64, _co$24] = getNextMarker(_el$63.nextSibling), _el$62 = _el$64.nextSibling, _el$65 = _el$62.nextSibling, [_el$66, _co$25] = getNextMarker(_el$65.nextSibling);
        insert(_el$61, createComponent(HeroMetaTickerPart, {
          get previous() {
            return previousUpdatedAt().date;
          },
          get current() {
            return currentUpdatedAt().date;
          },
          get ticking() {
            return isDateTicking();
          }
        }), _el$64, _co$24);
        insert(_el$61, createComponent(HeroMetaTickerPart, {
          get previous() {
            return previousUpdatedAt().time;
          },
          get current() {
            return currentUpdatedAt().time;
          },
          get ticking() {
            return isTimeTicking();
          }
        }), _el$66, _co$25);
        return _el$61;
      })()] : (() => {
        var _el$67 = getNextElement(_tmpl$5);
        insert(_el$67, () => i18n.t("home.noRows"));
        return _el$67;
      })();
    })(), _el$54, _co$23);
    insert(_el$58, () => i18n.t("footer.modelData"));
    insert(_el$59, () => i18n.t("home.heroCopy"));
    createRenderEffect(() => setAttribute(_el$51, "aria-label", currentUpdatedLabel()));
    return _el$50;
  })();
}
function HeroMetaTickerPart(props) {
  return (() => {
    var _el$68 = getNextElement(_tmpl$6), _el$69 = _el$68.firstChild, _el$70 = _el$69.firstChild, _el$71 = _el$70.nextSibling;
    insert(_el$70, () => props.previous);
    insert(_el$71, () => props.current);
    createRenderEffect(() => setAttribute(_el$68, "data-ticking", props.ticking));
    return _el$68;
  })();
}
function StatsLoading() {
  const i18n = useI18n();
  return [createComponent(Hero, {
    updatedAt: null
  }), createComponent(ChartSection, {
    id: "top-models",
    get title() {
      return i18n.t("home.usageTitle");
    },
    get children() {
      return createComponent(EmptyState, {
        get title() {
          return i18n.t("home.loadingTitle");
        },
        get description() {
          return i18n.t("home.loadingDescription");
        }
      });
    }
  })];
}
function ChartSection(props) {
  return (() => {
    var _el$72 = getNextElement(_tmpl$7), _el$73 = _el$72.firstChild, _el$74 = _el$73.firstChild, _el$75 = _el$74.firstChild, _el$76 = _el$75.nextSibling, [_el$77, _co$26] = getNextMarker(_el$76.nextSibling), _el$78 = _el$74.nextSibling, [_el$79, _co$27] = getNextMarker(_el$78.nextSibling), _el$80 = _el$73.nextSibling, [_el$81, _co$28] = getNextMarker(_el$80.nextSibling);
    insert(_el$75, createComponent(Show, {
      get when() {
        return props.id;
      },
      get fallback() {
        return props.title;
      },
      children: (id) => (() => {
        var _el$82 = getNextElement(_tmpl$8);
        insert(_el$82, () => props.title);
        createRenderEffect(() => setAttribute(_el$82, "href", `#${id()}`));
        return _el$82;
      })()
    }));
    insert(_el$74, (() => {
      var _c$2 = memo(() => !!props.description);
      return () => _c$2() && (() => {
        var _el$83 = getNextElement(_tmpl$9);
        insert(_el$83, () => props.description);
        return _el$83;
      })();
    })(), _el$77, _co$26);
    insert(_el$73, () => props.controls, _el$79, _co$27);
    insert(_el$72, () => props.children, _el$81, _co$28);
    createRenderEffect(() => setAttribute(_el$72, "id", props.id));
    return _el$72;
  })();
}
function SectionTitle(props) {
  return createComponent(SectionHeading, {
    get href() {
      return `#${props.id}`;
    },
    get title() {
      return props.title;
    },
    get description() {
      return props.description;
    }
  });
}
function SectionBridge(props) {
  const i18n = useI18n();
  return (() => {
    var _el$84 = getNextElement(_tmpl$0), _el$85 = _el$84.firstChild, _el$86 = _el$85.nextSibling, _el$87 = _el$86.nextSibling;
    insert(_el$85, () => i18n.t("bridge.learnMore"));
    insert(_el$87, () => props.label);
    createRenderEffect(() => setAttribute(_el$84, "href", props.href));
    return _el$84;
  })();
}
function EmptyState(props) {
  return (() => {
    var _el$88 = getNextElement(_tmpl$1), _el$89 = _el$88.firstChild, _el$90 = _el$89.nextSibling;
    insert(_el$89, () => props.title);
    insert(_el$90, () => props.description);
    return _el$88;
  })();
}
function formatUpdatedAtParts(value, timeZone, locale, fallback) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return {
    date: fallback,
    time: ""
  };
  return {
    date: new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      timeZone
    }).format(date),
    time: new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
      timeZoneName: "short"
    }).format(date)
  };
}
function formatUpdatedAtLabel(value) {
  if (!value.time) return value.date;
  return `${value.date}, ${value.time}`;
}
function TopModelsSection(props) {
  const i18n = useI18n();
  const [product, setProduct] = createSignal("Go");
  const [range, setRange] = createSignal("2M");
  const [sheet, setSheet] = createSignal();
  const [activeModel, setActiveModel] = createSignal();
  const data = createMemo(() => props.data[product()][range()]);
  const leaderboard = createMemo(() => props.leaderboard[product()][range()]);
  createEffect(() => {
    if (!sheet()) return;
    if (typeof document === "undefined") return;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSheet(void 0);
    };
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", onKeyDown);
    });
  });
  return (() => {
    var _el$91 = getNextElement(_tmpl$10), _el$100 = _el$91.firstChild, [_el$101, _co$32] = getNextMarker(_el$100.nextSibling), _el$102 = _el$101.nextSibling, [_el$103, _co$33] = getNextMarker(_el$102.nextSibling), _el$104 = _el$103.nextSibling, [_el$105, _co$34] = getNextMarker(_el$104.nextSibling), _el$92 = _el$105.nextSibling, _el$98 = _el$92.firstChild, [_el$99, _co$31] = getNextMarker(_el$98.nextSibling), _el$93 = _el$99.nextSibling, _el$94 = _el$93.firstChild, [_el$95, _co$29] = getNextMarker(_el$94.nextSibling), _el$96 = _el$95.nextSibling, [_el$97, _co$30] = getNextMarker(_el$96.nextSibling), _el$106 = _el$92.nextSibling, [_el$107, _co$35] = getNextMarker(_el$106.nextSibling);
    insert(_el$91, createComponent(SectionHeading, {
      as: "h2",
      slot: "top-models-title",
      href: "#top-models",
      get title() {
        return i18n.t("nav.topModels");
      },
      get description() {
        return i18n.t("home.topModelsDescription");
      }
    }), _el$101, _co$32);
    insert(_el$91, createComponent(Show, {
      get when() {
        return data().some((item) => usageTotal(item) > 0);
      },
      get fallback() {
        return createComponent(EmptyState, {
          get title() {
            return i18n.t("home.noUsageTitle");
          },
          get description() {
            return i18n.t("home.noUsageDescription");
          }
        });
      },
      get children() {
        return createComponent(TopModelsChart, {
          get data() {
            return data();
          },
          get range() {
            return range();
          },
          get activeModel() {
            return activeModel();
          },
          onActiveModelChange: setActiveModel
        });
      }
    }), _el$103, _co$33);
    insert(_el$91, createComponent(Show, {
      get when() {
        return leaderboard().length > 0;
      },
      get fallback() {
        return createComponent(EmptyState, {
          get title() {
            return i18n.t("home.noLeaderboardTitle");
          },
          get description() {
            return i18n.t("home.noLeaderboardDescription");
          }
        });
      },
      get children() {
        return createComponent(Leaderboard, {
          get data() {
            return leaderboard();
          },
          get activeModel() {
            return activeModel();
          },
          onActiveModelChange: setActiveModel
        });
      }
    }), _el$105, _co$34);
    insert(_el$92, createComponent(StatsFilters, {
      get product() {
        return product();
      },
      get range() {
        return range();
      },
      onProductSelect: setProduct,
      onRangeSelect: setRange
    }), _el$99, _co$31);
    insert(_el$93, createComponent(MobileFilterButton, {
      get label() {
        return i18n.t("home.productFilter");
      },
      get value() {
        return productLabel(product(), i18n);
      },
      get expanded() {
        return sheet() === "product";
      },
      onClick: () => setSheet(sheet() === "product" ? void 0 : "product")
    }), _el$95, _co$29);
    insert(_el$93, createComponent(MobileFilterButton, {
      get label() {
        return i18n.t("home.dateRange");
      },
      get value() {
        return rangeLabel(range(), i18n);
      },
      get expanded() {
        return sheet() === "range";
      },
      onClick: () => setSheet(sheet() === "range" ? void 0 : "range")
    }), _el$97, _co$30);
    insert(_el$91, createComponent(Show, {
      get when() {
        return sheet();
      },
      children: (kind) => createComponent(MobileFilterSheet, {
        get kind() {
          return kind();
        },
        get product() {
          return product();
        },
        get range() {
          return range();
        },
        onProductSelect: (value) => {
          setProduct(value);
          setSheet(void 0);
        },
        onRangeSelect: (value) => {
          setRange(value);
          setSheet(void 0);
        },
        onClose: () => setSheet(void 0)
      })
    }), _el$107, _co$35);
    return _el$91;
  })();
}
function MobileFilterButton(props) {
  return (() => {
    var _el$108 = getNextElement(_tmpl$11), _el$109 = _el$108.firstChild, _el$110 = _el$109.nextSibling, [_el$111, _co$36] = getNextMarker(_el$110.nextSibling);
    addEventListener(_el$108, "click", props.onClick, true);
    insert(_el$109, () => props.value);
    insert(_el$108, createComponent(ChevronDown, {}), _el$111, _co$36);
    createRenderEffect((_p$) => {
      var _v$ = props.label, _v$2 = props.expanded ? "true" : "false";
      _v$ !== _p$.e && setAttribute(_el$108, "aria-label", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$108, "aria-expanded", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    runHydrationEvents();
    return _el$108;
  })();
}
function MobileFilterSheet(props) {
  const i18n = useI18n();
  return (() => {
    var _el$112 = getNextElement(_tmpl$12), _el$113 = _el$112.firstChild;
    addEventListener(_el$112, "click", props.onClose, true);
    insert(_el$113, createComponent(Show, {
      get when() {
        return props.kind === "product";
      },
      get fallback() {
        return createComponent(For, {
          each: ranges,
          children: (item) => (() => {
            var _el$114 = getNextElement(_tmpl$13);
            _el$114.$$click = (event) => {
              event.stopPropagation();
              props.onRangeSelect(item);
            };
            insert(_el$114, () => rangeLabel(item, i18n));
            createRenderEffect((_p$) => {
              var _v$3 = props.range === item, _v$4 = props.range === item ? "true" : void 0;
              _v$3 !== _p$.e && setAttribute(_el$114, "aria-checked", _p$.e = _v$3);
              _v$4 !== _p$.t && setAttribute(_el$114, "data-active", _p$.t = _v$4);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            runHydrationEvents();
            return _el$114;
          })()
        });
      },
      get children() {
        return createComponent(For, {
          each: products,
          children: (item) => (() => {
            var _el$115 = getNextElement(_tmpl$13);
            _el$115.$$click = (event) => {
              event.stopPropagation();
              props.onProductSelect(item);
            };
            insert(_el$115, () => productLabel(item, i18n));
            createRenderEffect((_p$) => {
              var _v$5 = props.product === item, _v$6 = props.product === item ? "true" : void 0;
              _v$5 !== _p$.e && setAttribute(_el$115, "aria-checked", _p$.e = _v$5);
              _v$6 !== _p$.t && setAttribute(_el$115, "data-active", _p$.t = _v$6);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            runHydrationEvents();
            return _el$115;
          })()
        });
      }
    }));
    createRenderEffect(() => setAttribute(_el$113, "aria-label", props.kind === "product" ? i18n.t("home.productFilter") : i18n.t("home.dateRange")));
    runHydrationEvents();
    return _el$112;
  })();
}
function ChevronDown() {
  return getNextElement(_tmpl$14);
}
function StatsFilters(props) {
  const i18n = useI18n();
  return [createComponent(FilterPills, {
    items: products,
    get selected() {
      return props.product;
    },
    get label() {
      return i18n.t("home.productFilter");
    },
    variant: "product",
    formatLabel: (item) => productLabel(item, i18n),
    get onSelect() {
      return props.onProductSelect;
    }
  }), createComponent(FilterPills, {
    items: ranges,
    get selected() {
      return props.range;
    },
    get label() {
      return i18n.t("home.dateRange");
    },
    variant: "range",
    formatLabel: (item) => rangeLabel(item, i18n),
    get onSelect() {
      return props.onRangeSelect;
    }
  })];
}
function FilterPills(props) {
  return (() => {
    var _el$117 = getNextElement(_tmpl$15);
    insert(_el$117, createComponent(For, {
      get each() {
        return props.items;
      },
      children: (item) => (() => {
        var _el$118 = getNextElement(_tmpl$13);
        _el$118.$$click = () => props.onSelect(item);
        insert(_el$118, (() => {
          var _c$3 = memo(() => !!props.formatLabel);
          return () => _c$3() ? props.formatLabel(item) : item;
        })());
        createRenderEffect((_p$) => {
          var _v$9 = props.selected === item, _v$0 = props.selected === item ? "true" : void 0;
          _v$9 !== _p$.e && setAttribute(_el$118, "aria-checked", _p$.e = _v$9);
          _v$0 !== _p$.t && setAttribute(_el$118, "data-active", _p$.t = _v$0);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        runHydrationEvents();
        return _el$118;
      })()
    }));
    createRenderEffect((_p$) => {
      var _v$7 = props.variant, _v$8 = props.label;
      _v$7 !== _p$.e && setAttribute(_el$117, "data-variant", _p$.e = _v$7);
      _v$8 !== _p$.t && setAttribute(_el$117, "aria-label", _p$.t = _v$8);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$117;
  })();
}
function TopModelsChart(props) {
  const i18n = useI18n();
  let chartRef;
  const [activeIndex, setActiveIndex] = createSignal();
  const maxTotal = createMemo(() => getTopModelsMaxTotal(props.data));
  const segmentOrder = createMemo(() => getTopModelsSegmentOrder(props.data));
  const activePoint = createMemo(() => props.data[activeIndex() ?? -1]);
  const metric = createMemo(() => props.metric ?? "tokens");
  createEffect(() => scrollDenseChartToEnd(chartRef, props.range, props.data.length));
  return (() => {
    var _el$119 = getNextElement(_tmpl$16), _el$120 = _el$119.firstChild, _el$121 = _el$120.nextSibling;
    _el$119.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      setActiveIndex(void 0);
      props.onActiveModelChange(void 0);
    });
    var _ref$ = chartRef;
    typeof _ref$ === "function" ? use(_ref$, _el$119) : chartRef = _el$119;
    insert(_el$120, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (day, index) => (() => {
        var _el$122 = getNextElement(_tmpl$17), _el$123 = _el$122.firstChild, _el$124 = _el$123.firstChild, _el$125 = _el$124.nextSibling, _el$126 = _el$125.firstChild, _el$127 = _el$126.nextSibling;
        insert(_el$124, () => formatUsageChartValue(usageTotal(day), metric()));
        insert(_el$126, () => day.date);
        insert(_el$127, () => formatTopModelsMobileDate(day.date, props.range));
        createRenderEffect((_p$) => {
          var _v$14 = activeIndex() === index() ? "true" : void 0, _v$15 = isColumnLabelHidden(index(), props.data.length) ? "true" : void 0, _v$16 = isTopModelsMobileAxisHidden(index(), props.data.length) ? "true" : void 0;
          _v$14 !== _p$.e && setAttribute(_el$122, "data-active", _p$.e = _v$14);
          _v$15 !== _p$.t && setAttribute(_el$122, "data-label-hidden", _p$.t = _v$15);
          _v$16 !== _p$.a && setAttribute(_el$122, "data-mobile-hidden", _p$.a = _v$16);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$122;
      })()
    }));
    _el$121.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      setActiveIndex(void 0);
      props.onActiveModelChange(void 0);
    });
    insert(_el$121, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (day, dayIndex) => (() => {
        var _el$128 = getNextElement(_tmpl$18), _el$129 = _el$128.firstChild, _el$130 = _el$129.nextSibling, [_el$131, _co$37] = getNextMarker(_el$130.nextSibling);
        _el$128.$$keydown = (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          setActiveIndex(dayIndex());
          props.onActiveModelChange(void 0);
        };
        _el$128.addEventListener("blur", () => {
          setActiveIndex(void 0);
          props.onActiveModelChange(void 0);
        });
        _el$128.addEventListener("focus", () => {
          setActiveIndex(dayIndex());
          props.onActiveModelChange(void 0);
        });
        _el$128.$$click = () => {
          setActiveIndex(dayIndex());
          props.onActiveModelChange(void 0);
        };
        _el$128.$$pointermove = (event) => {
          if (event.pointerType === "touch") return;
          setActiveIndex(dayIndex());
          if (isTopModelsBlankHover(event.currentTarget, event.clientY)) props.onActiveModelChange(void 0);
        };
        _el$128.addEventListener("pointerenter", (event) => {
          setActiveIndex(dayIndex());
          if (isTopModelsBlankHover(event.currentTarget, event.clientY)) props.onActiveModelChange(void 0);
        });
        _el$128.$$pointerdown = (event) => {
          if (event.pointerType !== "touch") return;
          setActiveIndex(dayIndex());
          props.onActiveModelChange(void 0);
        };
        insert(_el$129, createComponent(For, {
          get each() {
            return stackedTopModelsSegments(day, segmentOrder());
          },
          children: (item) => (() => {
            var _el$132 = getNextElement(_tmpl$19);
            _el$132.$$click = (event) => {
              event.stopPropagation();
              setActiveIndex(dayIndex());
              props.onActiveModelChange(item.segment.model);
            };
            _el$132.$$pointerdown = (event) => {
              event.stopPropagation();
              setActiveIndex(dayIndex());
              props.onActiveModelChange(item.segment.model);
            };
            _el$132.addEventListener("pointerenter", (event) => {
              event.stopPropagation();
              setActiveIndex(dayIndex());
              props.onActiveModelChange(item.segment.model);
            });
            createRenderEffect((_p$) => {
              var _v$22 = item.index, _v$23 = item.segment.model, _v$24 = props.activeModel === item.segment.model ? "true" : void 0, _v$25 = getTopModelsSegmentColor(item.segment.model, item.index, segmentOrder(), activeIndex() !== void 0 && activeIndex() !== dayIndex(), props.activeModel);
              _v$22 !== _p$.e && setAttribute(_el$132, "data-series", _p$.e = _v$22);
              _v$23 !== _p$.t && setAttribute(_el$132, "data-model", _p$.t = _v$23);
              _v$24 !== _p$.a && setAttribute(_el$132, "data-active", _p$.a = _v$24);
              _v$25 !== _p$.o && setStyleProperty(_el$132, "background", _p$.o = _v$25);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            });
            runHydrationEvents();
            return _el$132;
          })()
        }));
        insert(_el$128, createComponent(Show, {
          get when() {
            return memo(() => activeIndex() === dayIndex())() && activePoint();
          },
          children: (point) => (() => {
            var _el$133 = getNextElement(_tmpl$22), _el$134 = _el$133.firstChild, _el$142 = _el$134.nextSibling, [_el$143, _co$40] = getNextMarker(_el$142.nextSibling), _el$144 = _el$143.nextSibling, [_el$145, _co$41] = getNextMarker(_el$144.nextSibling), _el$146 = _el$145.nextSibling, [_el$147, _co$42] = getNextMarker(_el$146.nextSibling);
            insert(_el$134, () => point().date);
            insert(_el$133, createComponent(Show, {
              get when() {
                return metric() === "tokens";
              },
              get children() {
                var _el$135 = getNextElement(_tmpl$20), _el$137 = _el$135.firstChild, [_el$138, _co$38] = getNextMarker(_el$137.nextSibling), _el$136 = _el$138.nextSibling, _el$139 = _el$136.nextSibling, [_el$140, _co$39] = getNextMarker(_el$139.nextSibling);
                insert(_el$135, () => formatUsageChartValue(usageTotal(point()), metric()), _el$138, _co$38);
                insert(_el$135, () => usageChartTotalLabel(metric(), i18n), _el$140, _co$39);
                return _el$135;
              }
            }), _el$143, _co$40);
            insert(_el$133, createComponent(Show, {
              get when() {
                return metric() === "tokens";
              },
              get children() {
                return getNextElement(_tmpl$21);
              }
            }), _el$145, _co$41);
            insert(_el$133, createComponent(For, {
              get each() {
                return visibleTopModelsSegments(point());
              },
              children: (item) => (() => {
                var _el$148 = getNextElement(_tmpl$23), _el$149 = _el$148.firstChild, _el$150 = _el$149.firstChild, _el$151 = _el$150.nextSibling, _el$152 = _el$151.nextSibling, [_el$153, _co$43] = getNextMarker(_el$152.nextSibling), _el$154 = _el$149.nextSibling;
                insert(_el$149, () => item.segment.model, _el$153, _co$43);
                insert(_el$154, () => formatUsageChartValue(item.segment.value, metric()));
                createRenderEffect((_p$) => {
                  var _v$26 = props.activeModel === item.segment.model ? "true" : void 0, _v$27 = props.activeModel !== void 0 && props.activeModel !== item.segment.model ? "true" : void 0, _v$28 = getRankColor(item.segment.model, item.index, segmentOrder(), usageColors);
                  _v$26 !== _p$.e && setAttribute(_el$148, "data-active", _p$.e = _v$26);
                  _v$27 !== _p$.t && setAttribute(_el$148, "data-muted", _p$.t = _v$27);
                  _v$28 !== _p$.a && setStyleProperty(_el$150, "background", _p$.a = _v$28);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                });
                return _el$148;
              })()
            }), _el$147, _co$42);
            createRenderEffect(() => setAttribute(_el$133, "data-placement", dayIndex() > props.data.length * 0.62 ? "left" : "right"));
            return _el$133;
          })()
        }), _el$131, _co$37);
        createRenderEffect((_p$) => {
          var _v$17 = `${day.date} ${formatUsageChartValue(usageTotal(day), metric())} ${usageChartTotalLabel(metric(), i18n)}`, _v$18 = activeIndex() === dayIndex() ? "true" : void 0, _v$19 = activeIndex() !== void 0 && activeIndex() !== dayIndex() ? "true" : void 0, _v$20 = `${getTopModelsBarHeight(usageTotal(day), maxTotal())}%`, _v$21 = getTopModelsSegmentRows(day, segmentOrder());
          _v$17 !== _p$.e && setAttribute(_el$128, "aria-label", _p$.e = _v$17);
          _v$18 !== _p$.t && setAttribute(_el$128, "data-active", _p$.t = _v$18);
          _v$19 !== _p$.a && setAttribute(_el$128, "data-muted", _p$.a = _v$19);
          _v$20 !== _p$.o && setStyleProperty(_el$128, "--top-models-bar-height", _p$.o = _v$20);
          _v$21 !== _p$.i && setStyleProperty(_el$129, "grid-template-rows", _p$.i = _v$21);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        });
        runHydrationEvents();
        return _el$128;
      })()
    }));
    createRenderEffect((_p$) => {
      var _v$1 = props.range, _v$10 = metric(), _v$11 = isDenseColumnRange(props.range) ? "true" : void 0, _v$12 = props.ariaLabel ?? i18n.t("home.stackedUsageChart"), _v$13 = {
        "--top-models-count": props.data.length
      };
      _v$1 !== _p$.e && setAttribute(_el$119, "data-range", _p$.e = _v$1);
      _v$10 !== _p$.t && setAttribute(_el$119, "data-metric", _p$.t = _v$10);
      _v$11 !== _p$.a && setAttribute(_el$119, "data-dense-labels", _p$.a = _v$11);
      _v$12 !== _p$.o && setAttribute(_el$119, "aria-label", _p$.o = _v$12);
      _p$.i = style(_el$119, _v$13, _p$.i);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$119;
  })();
}
function UniqueUsersSection(props) {
  const i18n = useI18n();
  const [activeModel, setActiveModel] = createSignal();
  const data = createMemo(() => props.data.Go["2M"]);
  return (() => {
    var _el$155 = getNextElement(_tmpl$24), _el$156 = _el$155.firstChild, [_el$157, _co$44] = getNextMarker(_el$156.nextSibling), _el$158 = _el$157.nextSibling, [_el$159, _co$45] = getNextMarker(_el$158.nextSibling), _el$160 = _el$159.nextSibling, [_el$161, _co$46] = getNextMarker(_el$160.nextSibling);
    insert(_el$155, createComponent(SectionBridge, {
      get label() {
        return i18n.t("nav.topModels").toUpperCase();
      },
      href: "#top-models"
    }), _el$157, _co$44);
    insert(_el$155, createComponent(SectionTitle, {
      id: "unique-users",
      get title() {
        return i18n.t("home.uniqueUsersTitle");
      },
      get description() {
        return i18n.t("home.uniqueUsersDescription");
      }
    }), _el$159, _co$45);
    insert(_el$155, createComponent(Show, {
      get when() {
        return data().some((item) => usageTotal(item) > 0);
      },
      get fallback() {
        return createComponent(EmptyState, {
          get title() {
            return i18n.t("home.noUserDataTitle");
          },
          get description() {
            return i18n.t("home.noUserDataDescription");
          }
        });
      },
      get children() {
        return createComponent(TopModelsChart, {
          get data() {
            return data();
          },
          range: "2M",
          metric: "users",
          get ariaLabel() {
            return i18n.t("home.uniqueUsersChart");
          },
          get activeModel() {
            return activeModel();
          },
          onActiveModelChange: setActiveModel
        });
      }
    }), _el$161, _co$46);
    return _el$155;
  })();
}
function isTopModelsBlankHover(bar, clientY) {
  const stack = bar.querySelector('[data-slot="top-models-stack"]');
  if (!stack) return true;
  return clientY < stack.getBoundingClientRect().top - 6;
}
function getTopModelsBarHeight(total, max) {
  if (total <= 0) return 0;
  return Math.max(2, Math.min(100, total / max * 100));
}
function getTopModelsMaxTotal(data) {
  const max = Math.max(0, ...data.map((item) => usageTotal(item)));
  if (max === 0) return 1;
  if (data.length === 1) return max * 1.75;
  return max;
}
function getTopModelsSegmentRows(point, order) {
  const total = usageTotal(point);
  if (total <= 0) return "";
  return stackedTopModelsSegments(point, order).map((item) => `${item.segment.value / total * 100}%`).join(" ");
}
function visibleTopModelsSegments(point) {
  return point.segments.map((segment, index) => ({
    segment,
    index
  })).filter((item) => item.segment.value > 0);
}
function stackedTopModelsSegments(point, order) {
  return visibleTopModelsSegments(point).slice().sort((a, b) => (order.get(b.segment.model) ?? b.index) - (order.get(a.segment.model) ?? a.index));
}
function getTopModelsSegmentOrder(data) {
  return new Map(data.find((point) => point.segments.length > 0)?.segments.map((segment, index) => [segment.model, index]) ?? []);
}
function getTopModelsSegmentColor(model, index, order, muted, activeModel) {
  if (activeModel !== void 0) return activeModel === model ? getRankColor(model, index, order, usageColors) : "var(--stats-layer-2)";
  if (muted) return "var(--stats-layer-2)";
  return getRankColor(model, index, order, usageColors);
}
function isTopModelsMobileAxisHidden(index, count) {
  return count > 7 && index % 2 === 1;
}
function isColumnLabelHidden(index, count) {
  if (count <= 20) return false;
  const interval = Math.ceil(count / 8);
  return index !== count - 1 && index % interval !== 0;
}
function isDenseColumnRange(range) {
  return range === "1M" || range === "2M";
}
function scrollDenseChartToEnd(element, range, count) {
  if (!element || count <= 0 || !isDenseColumnRange(range) || typeof window === "undefined") return;
  window.requestAnimationFrame(() => {
    element.scrollLeft = element.scrollWidth - element.clientWidth;
  });
}
function formatTopModelsMobileDate(label, range) {
  if (range === "1M" || range === "2M") return label.split(" - ")[0] ?? label;
  return label;
}
function usageTotal(point) {
  return point.segments.reduce((sum, item) => sum + item.value, 0);
}
function formatTokens(value) {
  if (value >= 1) return `${value.toFixed(value >= 10 ? 0 : 1)}T`;
  return `${Math.round(value * 1e3)}B`;
}
function formatUsageChartValue(value, metric) {
  if (metric === "users") return formatUsers(value);
  return formatTokens(value);
}
function usageChartTotalLabel(metric, i18n) {
  if (metric === "users") return i18n.t("home.modelUsers");
  return i18n.t("home.total");
}
function formatUsers(value) {
  if (value >= 1e6) return `${(value / 1e6).toFixed(value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(value >= 1e4 ? 0 : 1)}K`;
  return new Intl.NumberFormat("en").format(Math.round(value));
}
function Leaderboard(props) {
  const i18n = useI18n();
  const featured = createMemo(() => props.data.slice(0, 3));
  const compact = createMemo(() => props.data.slice(3));
  return (() => {
    var _el$162 = getNextElement(_tmpl$25), _el$163 = _el$162.firstChild, _el$164 = _el$163.nextSibling, _el$165 = _el$164.nextSibling, _el$166 = _el$165.nextSibling;
    insert(_el$163, createComponent(For, {
      get each() {
        return featured();
      },
      children: (entry) => createComponent(LeaderboardCard, {
        entry,
        size: "featured",
        get active() {
          return props.activeModel === entry.model;
        },
        get onActiveModelChange() {
          return props.onActiveModelChange;
        }
      })
    }));
    insert(_el$165, createComponent(For, {
      get each() {
        return compact();
      },
      children: (entry) => createComponent(LeaderboardCard, {
        entry,
        size: "compact",
        get active() {
          return props.activeModel === entry.model;
        },
        get onActiveModelChange() {
          return props.onActiveModelChange;
        }
      })
    }));
    insert(_el$166, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (entry) => createComponent(LeaderboardCard, {
        entry,
        size: "featured",
        get active() {
          return props.activeModel === entry.model;
        },
        get onActiveModelChange() {
          return props.onActiveModelChange;
        }
      })
    }));
    createRenderEffect((_p$) => {
      var _v$29 = i18n.t("chart.leaderboardAria"), _v$30 = i18n.t("chart.scrollableLeaderboardAria");
      _v$29 !== _p$.e && setAttribute(_el$162, "aria-label", _p$.e = _v$29);
      _v$30 !== _p$.t && setAttribute(_el$166, "aria-label", _p$.t = _v$30);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$162;
  })();
}
function LeaderboardCard(props) {
  const i18n = useI18n();
  const language = useLanguage();
  return (() => {
    var _el$167 = getNextElement(_tmpl$26), _el$168 = _el$167.firstChild, _el$179 = _el$168.nextSibling, [_el$180, _co$48] = getNextMarker(_el$179.nextSibling), _el$169 = _el$180.nextSibling, _el$177 = _el$169.firstChild, [_el$178, _co$47] = getNextMarker(_el$177.nextSibling), _el$170 = _el$178.nextSibling, _el$171 = _el$170.firstChild, _el$172 = _el$171.firstChild, _el$173 = _el$172.nextSibling, _el$174 = _el$171.nextSibling, _el$175 = _el$174.firstChild, _el$176 = _el$175.nextSibling;
    _el$167.$$click = () => props.onActiveModelChange(props.entry.model);
    _el$167.addEventListener("blur", () => props.onActiveModelChange(void 0));
    _el$167.addEventListener("focus", () => props.onActiveModelChange(props.entry.model));
    _el$167.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      props.onActiveModelChange(void 0);
    });
    _el$167.addEventListener("pointerenter", () => props.onActiveModelChange(props.entry.model));
    insert(_el$168, () => String(props.entry.rank).padStart(2, "0"));
    insert(_el$167, createComponent(ProviderIcon, {
      "data-slot": "leader-watermark",
      "aria-hidden": "true",
      get id() {
        return getProviderIconId(props.entry.author);
      }
    }), _el$180, _co$48);
    insert(_el$169, createComponent(ProviderIcon, {
      "data-slot": "leader-avatar",
      "aria-hidden": "true",
      get id() {
        return getProviderIconId(props.entry.author);
      }
    }), _el$178, _co$47);
    insert(_el$172, () => props.entry.model);
    insert(_el$173, () => formatBillions(props.entry.tokens));
    insert(_el$175, () => props.entry.author);
    insert(_el$176, () => formatChange(props.entry.change, i18n));
    createRenderEffect((_p$) => {
      var _v$31 = props.size, _v$32 = props.active ? "true" : void 0, _v$33 = language.route(`${"/data/"}${modelSlug(props.entry.provider)}/${modelSlug(props.entry.model)}`), _v$34 = `${String(props.entry.rank).padStart(2, "0")} ${props.entry.model} ${i18n.t("chart.byAuthor", {
        author: props.entry.author
      })}`, _v$35 = props.entry.change === null ? "true" : void 0, _v$36 = props.entry.change !== null && props.entry.change < 0 ? "true" : void 0;
      _v$31 !== _p$.e && setAttribute(_el$167, "data-size", _p$.e = _v$31);
      _v$32 !== _p$.t && setAttribute(_el$167, "data-active", _p$.t = _v$32);
      _v$33 !== _p$.a && setAttribute(_el$167, "href", _p$.a = _v$33);
      _v$34 !== _p$.o && setAttribute(_el$167, "aria-label", _p$.o = _v$34);
      _v$35 !== _p$.i && setAttribute(_el$176, "data-new", _p$.i = _v$35);
      _v$36 !== _p$.n && setAttribute(_el$176, "data-negative", _p$.n = _v$36);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    });
    runHydrationEvents();
    return _el$167;
  })();
}
function getProviderIconId(author) {
  if (author === "MiniMax") return "minimax";
  if (author === "Moonshot") return "moonshotai";
  if (author === "Zhipu") return "zhipuai";
  return author.toLowerCase();
}
function formatBillions(value) {
  if (value >= 1e3) return `${(value / 1e3).toFixed(value >= 1e4 ? 0 : 1)}T`;
  return `${value}B`;
}
function formatChange(value, i18n) {
  if (value === null) return i18n.t("home.new");
  if (value > 0) return `+${value}%`;
  return `${value}%`;
}
function MarketShareSection(props) {
  const i18n = useI18n();
  const [range, setRange] = createSignal("2M");
  const [activeIndex, setActiveIndex] = createSignal(2);
  const [activeAuthor, setActiveAuthor] = createSignal();
  const [inspecting, setInspecting] = createSignal(false);
  const data = createMemo(() => props.data[range()]);
  const authorOrder = createMemo(() => getMarketAuthorOrder(data()));
  const selectedIndex = createMemo(() => Math.min(activeIndex(), Math.max(data().length - 1, 0)));
  const activeDay = createMemo(() => data()[selectedIndex()]);
  return (() => {
    var _el$181 = getNextElement(_tmpl$27), _el$187 = _el$181.firstChild, [_el$188, _co$49] = getNextMarker(_el$187.nextSibling), _el$189 = _el$188.nextSibling, [_el$190, _co$50] = getNextMarker(_el$189.nextSibling), _el$191 = _el$190.nextSibling, [_el$192, _co$51] = getNextMarker(_el$191.nextSibling), _el$182 = _el$192.nextSibling, _el$183 = _el$182.firstChild, _el$184 = _el$183.firstChild, _el$185 = _el$184.nextSibling, _el$186 = _el$183.nextSibling;
    _el$181.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      setActiveAuthor(void 0);
      setInspecting(false);
    });
    insert(_el$181, createComponent(SectionBridge, {
      get label() {
        return i18n.t("nav.cacheRatio").toUpperCase();
      },
      href: "#cache-ratio"
    }), _el$188, _co$49);
    insert(_el$181, createComponent(SectionTitle, {
      id: "market-share",
      get title() {
        return i18n.t("home.marketShareTitle");
      },
      get description() {
        return i18n.t("home.marketShareDescription");
      }
    }), _el$190, _co$50);
    insert(_el$181, createComponent(Show, {
      get when() {
        return activeDay();
      },
      get fallback() {
        return createComponent(EmptyState, {
          get title() {
            return i18n.t("home.noMarketTitle");
          },
          get description() {
            return i18n.t("home.noMarketDescription");
          }
        });
      },
      children: (day) => [createComponent(MarketShare, {
        get data() {
          return data();
        },
        get range() {
          return range();
        },
        get authorOrder() {
          return authorOrder();
        },
        get activeIndex() {
          return selectedIndex();
        },
        get activeAuthor() {
          return activeAuthor();
        },
        get inspecting() {
          return inspecting();
        },
        onActiveIndexChange: (index) => {
          setActiveIndex(index);
          setInspecting(true);
        },
        onActiveAuthorChange: (author) => {
          setActiveAuthor(author);
          setInspecting(true);
        }
      }), createComponent(MarketShareList, {
        get data() {
          return day().authors;
        },
        get authorOrder() {
          return authorOrder();
        },
        get activeAuthor() {
          return activeAuthor();
        },
        onActiveAuthorChange: (author) => {
          setActiveAuthor(author);
          setInspecting(true);
        }
      })]
    }), _el$192, _co$51);
    insert(_el$185, (() => {
      var _c$4 = memo(() => !!inspecting());
      return () => _c$4() ? formatMarketDate(activeDay(), i18n.t("home.noData")) : formatMarketRange(data(), i18n.t("home.noData"));
    })());
    insert(_el$186, createComponent(FilterPills, {
      items: ranges,
      get selected() {
        return range();
      },
      get label() {
        return i18n.t("home.dateRange");
      },
      variant: "range",
      onSelect: (item) => {
        setRange(item);
        setActiveAuthor(void 0);
        setInspecting(false);
      }
    }));
    return _el$181;
  })();
}
function MarketShare(props) {
  const i18n = useI18n();
  let chartRef;
  createEffect(() => scrollDenseChartToEnd(chartRef, props.range, props.data.length));
  return (() => {
    var _el$193 = getNextElement(_tmpl$28), _el$194 = _el$193.firstChild, _el$195 = _el$194.nextSibling;
    var _ref$2 = chartRef;
    typeof _ref$2 === "function" ? use(_ref$2, _el$193) : chartRef = _el$193;
    insert(_el$194, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (day, index) => (() => {
        var _el$196 = getNextElement(_tmpl$29), _el$197 = _el$196.firstChild, _el$198 = _el$197.firstChild, _el$199 = _el$198.nextSibling, _el$200 = _el$199.firstChild, _el$201 = _el$200.nextSibling;
        _el$196.addEventListener("pointerenter", () => props.onActiveIndexChange(index()));
        _el$196.$$click = () => props.onActiveIndexChange(index());
        insert(_el$198, () => formatTrillions(day.total));
        insert(_el$200, () => day.date);
        insert(_el$201, () => formatMarketMobileDate(day.date));
        createRenderEffect((_p$) => {
          var _v$41 = props.inspecting && props.activeIndex === index() ? "true" : void 0, _v$42 = isColumnLabelHidden(index(), props.data.length) ? "true" : void 0, _v$43 = isMarketMobileLabelHidden(index(), props.data.length) ? "true" : void 0;
          _v$41 !== _p$.e && setAttribute(_el$196, "data-active", _p$.e = _v$41);
          _v$42 !== _p$.t && setAttribute(_el$196, "data-label-hidden", _p$.t = _v$42);
          _v$43 !== _p$.a && setAttribute(_el$196, "data-mobile-hidden", _p$.a = _v$43);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        runHydrationEvents();
        return _el$196;
      })()
    }));
    insert(_el$195, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (day, index) => (() => {
        var _el$202 = getNextElement(_tmpl$30);
        _el$202.addEventListener("pointerenter", () => props.onActiveIndexChange(index()));
        _el$202.$$click = () => props.onActiveIndexChange(index());
        insert(_el$202, createComponent(For, {
          get each() {
            return stackedMarketAuthors(day, props.authorOrder);
          },
          children: (item) => (() => {
            var _el$203 = getNextElement(_tmpl$31);
            _el$203.$$click = (event) => {
              event.stopPropagation();
              props.onActiveIndexChange(index());
              props.onActiveAuthorChange(item.author.author);
            };
            _el$203.$$pointerdown = (event) => {
              event.stopPropagation();
              props.onActiveIndexChange(index());
              props.onActiveAuthorChange(item.author.author);
            };
            _el$203.addEventListener("pointerenter", (event) => {
              event.stopPropagation();
              props.onActiveIndexChange(index());
              props.onActiveAuthorChange(item.author.author);
            });
            createRenderEffect((_p$) => {
              var _v$46 = item.author.author, _v$47 = props.activeAuthor === item.author.author ? "true" : void 0, _v$48 = props.activeAuthor !== void 0 && props.activeAuthor !== item.author.author ? "true" : void 0, _v$49 = getMarketSegmentColor(item.author.author, getRankColor(item.author.author, item.index, props.authorOrder, marketColors), props.activeAuthor), _v$50 = item.author.share;
              _v$46 !== _p$.e && setAttribute(_el$203, "data-author", _p$.e = _v$46);
              _v$47 !== _p$.t && setAttribute(_el$203, "data-active", _p$.t = _v$47);
              _v$48 !== _p$.a && setAttribute(_el$203, "data-muted", _p$.a = _v$48);
              _v$49 !== _p$.o && setStyleProperty(_el$203, "background-color", _p$.o = _v$49);
              _v$50 !== _p$.i && setStyleProperty(_el$203, "flex-grow", _p$.i = _v$50);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0,
              i: void 0
            });
            runHydrationEvents();
            return _el$203;
          })()
        }));
        createRenderEffect((_p$) => {
          var _v$44 = `${day.date} ${formatTrillions(day.total)}`, _v$45 = props.inspecting && props.activeIndex === index() ? "true" : void 0;
          _v$44 !== _p$.e && setAttribute(_el$202, "aria-label", _p$.e = _v$44);
          _v$45 !== _p$.t && setAttribute(_el$202, "data-active", _p$.t = _v$45);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        runHydrationEvents();
        return _el$202;
      })()
    }));
    createRenderEffect((_p$) => {
      var _v$37 = props.range, _v$38 = isDenseColumnRange(props.range) ? "true" : void 0, _v$39 = i18n.t("home.marketChart"), _v$40 = {
        "--market-count": props.data.length
      };
      _v$37 !== _p$.e && setAttribute(_el$193, "data-range", _p$.e = _v$37);
      _v$38 !== _p$.t && setAttribute(_el$193, "data-dense-labels", _p$.t = _v$38);
      _v$39 !== _p$.a && setAttribute(_el$193, "aria-label", _p$.a = _v$39);
      _p$.o = style(_el$193, _v$40, _p$.o);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$193;
  })();
}
function MarketShareList(props) {
  const i18n = useI18n();
  const language = useLanguage();
  return (() => {
    var _el$204 = getNextElement(_tmpl$32);
    insert(_el$204, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (item, index) => {
        const label = () => `${item.author} ${formatTrillions(item.tokens)} ${item.share.toFixed(1)} ${i18n.t("chart.percent")}`;
        const content = () => [(() => {
          var _el$205 = getNextElement(_tmpl$31);
          insert(_el$205, () => String(index() + 1).padStart(2, "0"));
          return _el$205;
        })(), (() => {
          var _el$206 = getNextElement(_tmpl$19);
          createRenderEffect((_$p) => setStyleProperty(_el$206, "background", getRankColor(item.author, index(), props.authorOrder, marketColors)));
          return _el$206;
        })(), (() => {
          var _el$207 = getNextElement(_tmpl$33);
          insert(_el$207, () => item.author);
          return _el$207;
        })(), (() => {
          var _el$208 = getNextElement(_tmpl$34);
          insert(_el$208, () => formatTrillions(item.tokens));
          return _el$208;
        })(), (() => {
          var _el$209 = getNextElement(_tmpl$35), _el$211 = _el$209.firstChild, [_el$212, _co$52] = getNextMarker(_el$211.nextSibling);
          _el$212.nextSibling;
          insert(_el$209, () => item.share.toFixed(1), _el$212, _co$52);
          return _el$209;
        })()];
        const href = () => item.author === "Other" ? void 0 : language.route(`${"/data/"}${modelSlug(item.author)}`);
        return (() => {
          var _el$213 = getNextElement(_tmpl$36);
          _el$213.addEventListener("pointerenter", () => props.onActiveAuthorChange(item.author));
          insert(_el$213, createComponent(Show, {
            get when() {
              return href();
            },
            get fallback() {
              return (() => {
                var _el$214 = getNextElement(_tmpl$30);
                _el$214.addEventListener("focus", () => props.onActiveAuthorChange(item.author));
                _el$214.$$click = () => props.onActiveAuthorChange(item.author);
                insert(_el$214, content);
                createRenderEffect(() => setAttribute(_el$214, "aria-label", label()));
                runHydrationEvents();
                return _el$214;
              })();
            },
            children: (href2) => (() => {
              var _el$215 = getNextElement(_tmpl$37);
              _el$215.addEventListener("focus", () => props.onActiveAuthorChange(item.author));
              _el$215.$$click = () => props.onActiveAuthorChange(item.author);
              insert(_el$215, content);
              createRenderEffect((_p$) => {
                var _v$51 = href2(), _v$52 = label();
                _v$51 !== _p$.e && setAttribute(_el$215, "href", _p$.e = _v$51);
                _v$52 !== _p$.t && setAttribute(_el$215, "aria-label", _p$.t = _v$52);
                return _p$;
              }, {
                e: void 0,
                t: void 0
              });
              runHydrationEvents();
              return _el$215;
            })()
          }));
          createRenderEffect(() => setAttribute(_el$213, "data-active", props.activeAuthor === item.author ? "true" : void 0));
          return _el$213;
        })();
      }
    }));
    return _el$204;
  })();
}
function GeoBreakdownSection(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const [activeCountry, setActiveCountry] = createSignal();
  const data = createMemo(() => props.data["2M"]);
  const countryById = createMemo(() => new Map(data().flatMap((country) => {
    const id = countryNumericId(country.country);
    return id ? [[id, country]] : [];
  })));
  const maxTokens = createMemo(() => Math.max(0, ...data().map((country) => country.tokens)) || 1);
  const topCountries = createMemo(() => data().slice(0, 15));
  const active = createMemo(() => data().find((country) => country.country === activeCountry()) ?? data()[0]);
  return (() => {
    var _el$216 = getNextElement(_tmpl$39), _el$225 = _el$216.firstChild, [_el$226, _co$56] = getNextMarker(_el$225.nextSibling), _el$227 = _el$226.nextSibling, [_el$228, _co$57] = getNextMarker(_el$227.nextSibling), _el$229 = _el$228.nextSibling, [_el$230, _co$58] = getNextMarker(_el$229.nextSibling);
    _el$216.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      setActiveCountry(void 0);
    });
    insert(_el$216, createComponent(SectionBridge, {
      get label() {
        return i18n.t("nav.marketShare").toUpperCase();
      },
      href: "#market-share"
    }), _el$226, _co$56);
    insert(_el$216, createComponent(SectionTitle, {
      id: "geo-breakdown",
      get title() {
        return i18n.t("home.geoTitle");
      },
      get description() {
        return i18n.t("home.geoDescription");
      }
    }), _el$228, _co$57);
    insert(_el$216, createComponent(Show, {
      get when() {
        return data().length > 0;
      },
      get fallback() {
        return createComponent(EmptyState, {
          get title() {
            return i18n.t("home.noGeoTitle");
          },
          get description() {
            return i18n.t("home.noGeoDescription");
          }
        });
      },
      get children() {
        var _el$217 = getNextElement(_tmpl$38), _el$218 = _el$217.firstChild, _el$219 = _el$218.firstChild, [_el$220, _co$53] = getNextMarker(_el$219.nextSibling), _el$221 = _el$220.nextSibling, [_el$222, _co$54] = getNextMarker(_el$221.nextSibling), _el$223 = _el$218.nextSibling, [_el$224, _co$55] = getNextMarker(_el$223.nextSibling);
        insert(_el$218, createComponent(GeoWorldMap, {
          get countryById() {
            return countryById();
          },
          get activeCountry() {
            return activeCountry();
          },
          get maxTokens() {
            return maxTokens();
          },
          onActiveCountryChange: setActiveCountry
        }), _el$220, _co$53);
        insert(_el$218, createComponent(Show, {
          get when() {
            return active();
          },
          children: (country) => (() => {
            var _el$231 = getNextElement(_tmpl$40), _el$232 = _el$231.firstChild, _el$233 = _el$232.firstChild, _el$234 = _el$233.nextSibling, [_el$235, _co$59] = getNextMarker(_el$234.nextSibling), _el$236 = _el$232.nextSibling, _el$237 = _el$236.nextSibling, _el$238 = _el$237.firstChild, _el$239 = _el$238.nextSibling;
            insert(_el$232, () => String(country().rank).padStart(2, "0"), _el$235, _co$59);
            insert(_el$236, () => formatCountryName(country().country, language.tag(language.locale()), i18n.t("home.unknown")));
            insert(_el$238, () => formatGeoTokens(country().tokens));
            insert(_el$239, () => formatGeoShare(country().share));
            return _el$231;
          })()
        }), _el$222, _co$54);
        insert(_el$217, createComponent(GeoCountryList, {
          get data() {
            return topCountries();
          },
          get activeCountry() {
            return activeCountry();
          },
          get maxTokens() {
            return maxTokens();
          },
          onActiveCountryChange: setActiveCountry
        }), _el$224, _co$55);
        return _el$217;
      }
    }), _el$230, _co$58);
    return _el$216;
  })();
}
function GeoWorldMap(props) {
  const i18n = useI18n();
  const opacityScale = createMemo(() => sqrt().domain([0, props.maxTokens]).range([0.26, 0.96]).clamp(true));
  const countryOpacity = (country) => {
    if (!country) return 0;
    const opacity = opacityScale()(country.tokens);
    if (!props.activeCountry || props.activeCountry === country.country) return opacity;
    return Math.max(0.18, opacity * 0.36);
  };
  return (() => {
    var _el$240 = getNextElement(_tmpl$41), _el$241 = _el$240.firstChild, _el$242 = _el$241.nextSibling, _el$243 = _el$242.nextSibling, _el$244 = _el$243.nextSibling;
    insert(_el$241, () => i18n.t("home.geoMapTitle"));
    insert(_el$242, createComponent(For, {
      each: worldCountryPaths,
      children: (country) => {
        const entry = () => props.countryById.get(country.id);
        return (() => {
          var _el$245 = getNextElement(_tmpl$42);
          _el$245.$$click = () => {
            const item = entry();
            if (!item) return;
            props.onActiveCountryChange(item.country);
          };
          _el$245.addEventListener("pointerenter", () => {
            const item = entry();
            if (!item) return;
            props.onActiveCountryChange(item.country);
          });
          createRenderEffect((_p$) => {
            var _v$53 = country.path, _v$54 = country.id, _v$55 = entry() ? "true" : void 0, _v$56 = entry()?.country === props.activeCountry ? "true" : void 0, _v$57 = {
              "--geo-country-opacity": String(countryOpacity(entry()))
            };
            _v$53 !== _p$.e && setAttribute(_el$245, "d", _p$.e = _v$53);
            _v$54 !== _p$.t && setAttribute(_el$245, "data-country-id", _p$.t = _v$54);
            _v$55 !== _p$.a && setAttribute(_el$245, "data-has-data", _p$.a = _v$55);
            _v$56 !== _p$.o && setAttribute(_el$245, "data-active", _p$.o = _v$56);
            _p$.i = style(_el$245, _v$57, _p$.i);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          });
          runHydrationEvents();
          return _el$245;
        })();
      }
    }));
    insert(_el$243, createComponent(For, {
      each: worldCountryPaths,
      children: (country) => {
        const entry = () => props.countryById.get(country.id);
        return createComponent(Show, {
          get when() {
            return memo(() => !!(country.marker && entry()))() ? country.marker : void 0;
          },
          children: (marker) => (() => {
            var _el$246 = getNextElement(_tmpl$43);
            _el$246.$$click = () => {
              const item = entry();
              if (!item) return;
              props.onActiveCountryChange(item.country);
            };
            _el$246.addEventListener("pointerenter", () => {
              const item = entry();
              if (!item) return;
              props.onActiveCountryChange(item.country);
            });
            createRenderEffect((_p$) => {
              var _v$58 = marker().x, _v$59 = marker().y, _v$60 = entry()?.country === props.activeCountry ? 3.4 : 2.4, _v$61 = entry()?.country === props.activeCountry ? "true" : void 0, _v$62 = {
                "--geo-country-opacity": String(countryOpacity(entry()))
              };
              _v$58 !== _p$.e && setAttribute(_el$246, "cx", _p$.e = _v$58);
              _v$59 !== _p$.t && setAttribute(_el$246, "cy", _p$.t = _v$59);
              _v$60 !== _p$.a && setAttribute(_el$246, "r", _p$.a = _v$60);
              _v$61 !== _p$.o && setAttribute(_el$246, "data-active", _p$.o = _v$61);
              _p$.i = style(_el$246, _v$62, _p$.i);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0,
              i: void 0
            });
            runHydrationEvents();
            return _el$246;
          })()
        });
      }
    }));
    setAttribute(_el$244, "d", worldBorderPath);
    createRenderEffect(() => setAttribute(_el$240, "aria-label", i18n.t("home.worldMap")));
    return _el$240;
  })();
}
function GeoCountryList(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const opacityScale = createMemo(() => sqrt().domain([0, props.maxTokens]).range([0.26, 0.96]).clamp(true));
  return (() => {
    var _el$247 = getNextElement(_tmpl$44);
    insert(_el$247, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (country) => (() => {
        var _el$248 = getNextElement(_tmpl$45), _el$249 = _el$248.firstChild, _el$250 = _el$249.firstChild, _el$251 = _el$250.nextSibling, _el$252 = _el$251.nextSibling, _el$253 = _el$252.nextSibling, _el$254 = _el$253.nextSibling;
        _el$249.addEventListener("focus", () => props.onActiveCountryChange(country.country));
        _el$249.addEventListener("pointerenter", () => props.onActiveCountryChange(country.country));
        _el$249.$$click = () => props.onActiveCountryChange(country.country);
        insert(_el$250, () => String(country.rank).padStart(2, "0"));
        insert(_el$252, () => formatCountryName(country.country, language.tag(language.locale()), i18n.t("home.unknown")));
        insert(_el$253, () => formatGeoTokens(country.tokens));
        insert(_el$254, () => formatGeoShare(country.share));
        createRenderEffect((_p$) => {
          var _v$63 = props.activeCountry === country.country ? "true" : void 0, _v$64 = {
            "--geo-row-opacity": String(opacityScale()(country.tokens))
          }, _v$65 = `${formatCountryName(country.country, language.tag(language.locale()), i18n.t("home.unknown"))} ${formatGeoTokens(country.tokens)} ${formatGeoShare(country.share)}`;
          _v$63 !== _p$.e && setAttribute(_el$249, "data-active", _p$.e = _v$63);
          _p$.t = style(_el$249, _v$64, _p$.t);
          _v$65 !== _p$.a && setAttribute(_el$249, "aria-label", _p$.a = _v$65);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        runHydrationEvents();
        return _el$248;
      })()
    }));
    return _el$247;
  })();
}
function countryNumericId(country) {
  return countryNumericIds.get(country.toUpperCase())?.padStart(3, "0");
}
function geoCountryMarker(country) {
  const bounds = worldPath.bounds(country);
  const [x, y] = worldPath.centroid(country);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return void 0;
  if (bounds[1][0] - bounds[0][0] >= 3 && bounds[1][1] - bounds[0][1] >= 3) return void 0;
  return {
    x,
    y
  };
}
function formatCountryName(country, locale, unknown) {
  const code = country.toUpperCase();
  if (code === "ZZ") return unknown;
  if (!countryNumericId(code)) return code;
  return new Intl.DisplayNames([locale], {
    type: "region"
  }).of(code) ?? code;
}
function formatGeoTokens(value) {
  return formatTrillions(value);
}
function formatGeoShare(value) {
  return `${value.toFixed(value > 0 && value < 1 ? 1 : 0)}%`;
}
function getMarketSegmentColor(author, color, activeAuthor) {
  if (!activeAuthor) return color;
  if (activeAuthor === author) return color;
  return "var(--stats-bar-idle)";
}
function stackedMarketAuthors(day, order) {
  return day.authors.map((author, index) => ({
    author,
    index
  })).slice().sort((a, b) => (order.get(b.author.author) ?? b.index) - (order.get(a.author.author) ?? a.index));
}
function getMarketAuthorOrder(data) {
  return getRankOrder(data.flatMap((day) => day.authors.map((author, index) => ({
    key: author.author,
    value: author.tokens,
    index
  }))));
}
function getRankOrder(items) {
  return new Map(Object.values(items.reduce((result, item) => {
    result[item.key] = {
      key: item.key,
      value: (result[item.key]?.value ?? 0) + item.value,
      index: Math.min(result[item.key]?.index ?? item.index, item.index)
    };
    return result;
  }, {})).toSorted((a, b) => b.value - a.value || a.index - b.index || a.key.localeCompare(b.key)).map((item, index) => [item.key, index]));
}
function getRankColor(key, fallbackIndex, order, colors) {
  return colors[order.get(key) ?? fallbackIndex] ?? "var(--stats-text)";
}
function isMarketMobileLabelHidden(index, count) {
  return count > 7 && index % 2 === 1;
}
function formatMarketMobileDate(label) {
  return marketDateParts(label).start;
}
function formatTrillions(value) {
  if (value === 0) return "0";
  if (value < 1e-3) return `${Number((value * 1e6).toFixed(value >= 1e-5 ? 0 : 1))}M`;
  if (value < 1) return `${Number((value * 1e3).toFixed(value >= 0.01 ? 0 : 1))}B`;
  return `${value.toFixed(value >= 10 ? 0 : 1)}T`;
}
function formatMarketDate(day, fallback) {
  if (!day) return fallback;
  return formatMarketDateLabel(day.date);
}
function formatMarketRange(data, fallback) {
  const first = data[0]?.date;
  const last = data[data.length - 1]?.date;
  if (!first || !last) return fallback;
  const start = marketDateParts(first).start;
  const end = marketDateParts(last).end;
  if (start === end) return formatMarketDateLabel(start);
  return `${start} ${(/* @__PURE__ */ new Date()).getFullYear()} → ${end} ${(/* @__PURE__ */ new Date()).getFullYear()}`;
}
function formatMarketDateLabel(label) {
  const parts = marketDateParts(label);
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  if (parts.start === parts.end) return `${parts.start} ${year}`;
  return `${parts.start} ${year} → ${parts.end} ${year}`;
}
function marketDateParts(label) {
  const [start, end] = label.split(" - ");
  return {
    start: start ?? label,
    end: end ?? start ?? label
  };
}
function TokenCostSection(props) {
  const i18n = useI18n();
  const [product, setProduct] = createSignal("Go");
  const [activeIndex, setActiveIndex] = createSignal(2);
  const data = createMemo(() => priceTokenCostFromCatalog(props.data[product()], props.catalog));
  const visible = createMemo(() => data().slice(0, 13));
  const selectedIndex = createMemo(() => Math.min(activeIndex(), Math.max(visible().length - 1, 0)));
  return (() => {
    var _el$255 = getNextElement(_tmpl$46), _el$261 = _el$255.firstChild, [_el$262, _co$62] = getNextMarker(_el$261.nextSibling), _el$263 = _el$262.nextSibling, [_el$264, _co$63] = getNextMarker(_el$263.nextSibling), _el$265 = _el$264.nextSibling, [_el$266, _co$64] = getNextMarker(_el$265.nextSibling), _el$256 = _el$266.nextSibling, _el$257 = _el$256.firstChild, [_el$258, _co$60] = getNextMarker(_el$257.nextSibling), _el$259 = _el$258.nextSibling, [_el$260, _co$61] = getNextMarker(_el$259.nextSibling);
    insert(_el$255, createComponent(SectionBridge, {
      get label() {
        return i18n.t("nav.sessionCost").toUpperCase();
      },
      href: "#session-cost"
    }), _el$262, _co$62);
    insert(_el$255, createComponent(SectionTitle, {
      id: "token-cost",
      get title() {
        return i18n.t("home.tokenCostTitle");
      },
      get description() {
        return i18n.t("home.tokenCostDescription");
      }
    }), _el$264, _co$63);
    insert(_el$255, createComponent(Show, {
      get when() {
        return visible().length > 0;
      },
      get fallback() {
        return createComponent(EmptyState, {
          get title() {
            return i18n.t("home.noTokenCostTitle");
          },
          get description() {
            return i18n.t("home.noTokenCostDescription");
          }
        });
      },
      get children() {
        return createComponent(TokenCostChart, {
          get data() {
            return visible();
          },
          get activeIndex() {
            return selectedIndex();
          },
          onActiveIndexChange: setActiveIndex
        });
      }
    }), _el$266, _co$64);
    insert(_el$256, createComponent(FilterPills, {
      items: tokenProducts,
      get selected() {
        return product();
      },
      get label() {
        return i18n.t("home.productFilter");
      },
      variant: "product",
      formatLabel: (item) => productLabel(item, i18n),
      onSelect: setProduct
    }), _el$258, _co$60);
    insert(_el$256, createComponent(LiveIndicator, {}), _el$260, _co$61);
    return _el$255;
  })();
}
function TokenCostChart(props) {
  const i18n = useI18n();
  const max = createMemo(() => Math.max(0, ...props.data.map((item) => item.total)) || 1);
  const active = createMemo(() => props.data[props.activeIndex] ?? props.data[0]);
  return (() => {
    var _el$267 = getNextElement(_tmpl$47), _el$268 = _el$267.firstChild, [_el$269, _co$65] = getNextMarker(_el$268.nextSibling), _el$270 = _el$269.nextSibling, [_el$271, _co$66] = getNextMarker(_el$270.nextSibling);
    insert(_el$267, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (item, index) => (() => {
        var _el$272 = getNextElement(_tmpl$48), _el$273 = _el$272.firstChild, _el$274 = _el$273.nextSibling, _el$275 = _el$274.nextSibling, [_el$276, _co$67] = getNextMarker(_el$275.nextSibling);
        _el$272.addEventListener("pointerenter", () => props.onActiveIndexChange(index()));
        _el$272.$$click = () => props.onActiveIndexChange(index());
        insert(_el$273, () => formatDollars(item.total));
        insert(_el$274, () => item.model);
        insert(_el$272, createComponent(MetricBar, {
          get value() {
            return item.total;
          },
          get max() {
            return max();
          },
          get active() {
            return props.activeIndex === index();
          }
        }), _el$276, _co$67);
        createRenderEffect(() => setAttribute(_el$272, "data-active", props.activeIndex === index() ? "true" : void 0));
        runHydrationEvents();
        return _el$272;
      })()
    }), _el$269, _co$65);
    insert(_el$267, createComponent(Show, {
      get when() {
        return active();
      },
      children: (item) => (() => {
        var _el$277 = getNextElement(_tmpl$49), _el$278 = _el$277.firstChild, _el$279 = _el$278.firstChild, _el$280 = _el$279.nextSibling, _el$281 = _el$278.nextSibling, _el$282 = _el$281.firstChild, _el$283 = _el$282.nextSibling, _el$284 = _el$281.nextSibling, _el$285 = _el$284.firstChild, _el$286 = _el$285.nextSibling;
        insert(_el$279, () => i18n.t("chart.input"));
        insert(_el$280, () => formatDollars(item().input));
        insert(_el$282, () => i18n.t("chart.output"));
        insert(_el$283, () => formatDollars(item().output));
        insert(_el$285, () => i18n.t("chart.cached"));
        insert(_el$286, () => formatDollars(item().cached));
        createRenderEffect((_$p) => setStyleProperty(_el$277, "top", `${props.activeIndex * 36 + 2}px`));
        return _el$277;
      })()
    }), _el$271, _co$66);
    return _el$267;
  })();
}
function CacheRatioSection(props) {
  const i18n = useI18n();
  const [product, setProduct] = createSignal("Go");
  const [activeIndex, setActiveIndex] = createSignal(2);
  const data = createMemo(() => props.data[product()]);
  const visible = createMemo(() => data().slice(0, 16));
  const selectedIndex = createMemo(() => Math.min(activeIndex(), Math.max(visible().length - 1, 0)));
  return (() => {
    var _el$287 = getNextElement(_tmpl$50), _el$293 = _el$287.firstChild, [_el$294, _co$70] = getNextMarker(_el$293.nextSibling), _el$295 = _el$294.nextSibling, [_el$296, _co$71] = getNextMarker(_el$295.nextSibling), _el$297 = _el$296.nextSibling, [_el$298, _co$72] = getNextMarker(_el$297.nextSibling), _el$288 = _el$298.nextSibling, _el$289 = _el$288.firstChild, [_el$290, _co$68] = getNextMarker(_el$289.nextSibling), _el$291 = _el$290.nextSibling, [_el$292, _co$69] = getNextMarker(_el$291.nextSibling);
    insert(_el$287, createComponent(SectionBridge, {
      get label() {
        return i18n.t("nav.tokenCost").toUpperCase();
      },
      href: "#token-cost"
    }), _el$294, _co$70);
    insert(_el$287, createComponent(SectionTitle, {
      id: "cache-ratio",
      get title() {
        return i18n.t("home.cacheRatioTitle");
      },
      get description() {
        return i18n.t("home.cacheRatioDescription");
      }
    }), _el$296, _co$71);
    insert(_el$287, createComponent(Show, {
      get when() {
        return visible().length > 0;
      },
      get fallback() {
        return createComponent(EmptyState, {
          get title() {
            return i18n.t("home.noCacheTitle");
          },
          get description() {
            return i18n.t("home.noCacheDescription");
          }
        });
      },
      get children() {
        return createComponent(CacheRatioChart, {
          get data() {
            return visible();
          },
          get activeIndex() {
            return selectedIndex();
          },
          onActiveIndexChange: setActiveIndex
        });
      }
    }), _el$298, _co$72);
    insert(_el$288, createComponent(FilterPills, {
      items: tokenProducts,
      get selected() {
        return product();
      },
      get label() {
        return i18n.t("home.productFilter");
      },
      variant: "product",
      formatLabel: (item) => productLabel(item, i18n),
      onSelect: setProduct
    }), _el$290, _co$68);
    insert(_el$288, createComponent(LiveIndicator, {}), _el$292, _co$69);
    return _el$287;
  })();
}
function CacheRatioChart(props) {
  const i18n = useI18n();
  const active = createMemo(() => props.data[props.activeIndex] ?? props.data[0]);
  return (() => {
    var _el$299 = getNextElement(_tmpl$51), _el$300 = _el$299.firstChild, _el$301 = _el$300.firstChild, _el$302 = _el$301.nextSibling, _el$303 = _el$300.nextSibling, _el$304 = _el$303.nextSibling, [_el$305, _co$73] = getNextMarker(_el$304.nextSibling);
    insert(_el$301, () => i18n.t("chart.ratio"));
    insert(_el$302, () => i18n.t("chart.model"));
    insert(_el$303, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (item, index) => (() => {
        var _el$306 = getNextElement(_tmpl$52), _el$307 = _el$306.firstChild, _el$308 = _el$307.nextSibling, _el$309 = _el$308.nextSibling, [_el$310, _co$74] = getNextMarker(_el$309.nextSibling);
        _el$306.addEventListener("pointerenter", () => props.onActiveIndexChange(index()));
        _el$306.$$click = () => props.onActiveIndexChange(index());
        insert(_el$307, () => formatRatio(item.ratio));
        insert(_el$308, () => item.model);
        insert(_el$306, createComponent(CacheRatioMarker, {
          get ratio() {
            return item.ratio;
          },
          get active() {
            return props.activeIndex === index();
          }
        }), _el$310, _co$74);
        createRenderEffect(() => setAttribute(_el$306, "data-active", props.activeIndex === index() ? "true" : void 0));
        runHydrationEvents();
        return _el$306;
      })()
    }));
    insert(_el$299, createComponent(Show, {
      get when() {
        return active();
      },
      children: (item) => (() => {
        var _el$311 = getNextElement(_tmpl$53), _el$312 = _el$311.firstChild, _el$313 = _el$312.firstChild, _el$314 = _el$313.nextSibling, _el$315 = _el$312.nextSibling, _el$316 = _el$315.firstChild, _el$317 = _el$316.nextSibling, _el$318 = _el$315.nextSibling, _el$319 = _el$318.firstChild, _el$320 = _el$319.nextSibling;
        insert(_el$313, () => i18n.t("chart.cacheRatio"));
        insert(_el$314, () => formatRatio(item().ratio));
        insert(_el$316, () => i18n.t("chart.cached"));
        insert(_el$317, () => formatBillions(item().cached));
        insert(_el$319, () => i18n.t("chart.uncached"));
        insert(_el$320, () => formatBillions(item().uncached));
        createRenderEffect((_$p) => setStyleProperty(_el$311, "top", `${props.activeIndex * 36 + 28}px`));
        return _el$311;
      })()
    }), _el$305, _co$73);
    return _el$299;
  })();
}
function CacheRatioMarker(props) {
  const fill = createMemo(() => Math.min(100, Math.max(0, props.ratio)));
  return (() => {
    var _el$321 = getNextElement(_tmpl$54);
    createRenderEffect((_p$) => {
      var _v$66 = props.active ? "true" : void 0, _v$67 = {
        "--cache-ratio-fill": `${fill()}%`
      };
      _v$66 !== _p$.e && setAttribute(_el$321, "data-active", _p$.e = _v$66);
      _p$.t = style(_el$321, _v$67, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$321;
  })();
}
function formatRatio(value) {
  return `${value.toFixed(value > 0 && value < 10 ? 1 : 0)}%`;
}
function formatDollars(value) {
  return `$${value.toFixed(value > 0 && value < 0.01 ? 4 : 2)}`;
}
function MetricBar(props) {
  const fill = createMemo(() => Math.min(1, Math.max(props.value / props.max, props.value > 0 ? 0.03 : 0)));
  return (() => {
    var _el$322 = getNextElement(_tmpl$55);
    createRenderEffect((_p$) => {
      var _v$68 = props.active ? "true" : void 0, _v$69 = {
        "--metric-bar-fill": `${fill() * 100}%`
      };
      _v$68 !== _p$.e && setAttribute(_el$322, "data-active", _p$.e = _v$68);
      _p$.t = style(_el$322, _v$69, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$322;
  })();
}
function SessionCostSection(props) {
  const i18n = useI18n();
  const [product, setProduct] = createSignal("Go");
  const [activeIndex, setActiveIndex] = createSignal(2);
  const data = createMemo(() => props.data[product()]);
  const visible = createMemo(() => data().slice(0, 16));
  const selectedIndex = createMemo(() => Math.min(activeIndex(), Math.max(visible().length - 1, 0)));
  return (() => {
    var _el$323 = getNextElement(_tmpl$56), _el$329 = _el$323.firstChild, [_el$330, _co$77] = getNextMarker(_el$329.nextSibling), _el$331 = _el$330.nextSibling, [_el$332, _co$78] = getNextMarker(_el$331.nextSibling), _el$333 = _el$332.nextSibling, [_el$334, _co$79] = getNextMarker(_el$333.nextSibling), _el$324 = _el$334.nextSibling, _el$325 = _el$324.firstChild, [_el$326, _co$75] = getNextMarker(_el$325.nextSibling), _el$327 = _el$326.nextSibling, [_el$328, _co$76] = getNextMarker(_el$327.nextSibling);
    insert(_el$323, createComponent(SectionBridge, {
      get label() {
        return i18n.t("nav.topModels").toUpperCase();
      },
      href: "#top-models"
    }), _el$330, _co$77);
    insert(_el$323, createComponent(SectionTitle, {
      id: "session-cost",
      get title() {
        return i18n.t("home.sessionCostTitle");
      },
      get description() {
        return i18n.t("home.sessionCostDescription");
      }
    }), _el$332, _co$78);
    insert(_el$323, createComponent(Show, {
      get when() {
        return visible().length > 0;
      },
      get fallback() {
        return createComponent(EmptyState, {
          get title() {
            return i18n.t("home.noSessionCostTitle");
          },
          get description() {
            return i18n.t("home.noSessionCostDescription");
          }
        });
      },
      get children() {
        return createComponent(SessionCostChart, {
          get data() {
            return visible();
          },
          get activeIndex() {
            return selectedIndex();
          },
          onActiveIndexChange: setActiveIndex
        });
      }
    }), _el$334, _co$79);
    insert(_el$324, createComponent(FilterPills, {
      items: tokenProducts,
      get selected() {
        return product();
      },
      get label() {
        return i18n.t("home.productFilter");
      },
      variant: "product",
      formatLabel: (item) => productLabel(item, i18n),
      onSelect: setProduct
    }), _el$326, _co$75);
    insert(_el$324, createComponent(LiveIndicator, {}), _el$328, _co$76);
    return _el$323;
  })();
}
function SessionCostChart(props) {
  const i18n = useI18n();
  const maxCost = createMemo(() => Math.max(0, ...props.data.map((item) => item.cost)) || 1);
  const maxTokens = createMemo(() => Math.max(0, ...props.data.map((item) => item.tokens)) || 1);
  const active = createMemo(() => props.data[props.activeIndex] ?? props.data[0]);
  return (() => {
    var _el$335 = getNextElement(_tmpl$57), _el$336 = _el$335.firstChild, _el$337 = _el$336.firstChild, _el$338 = _el$337.nextSibling, _el$339 = _el$338.nextSibling, _el$340 = _el$339.nextSibling, _el$341 = _el$336.nextSibling, [_el$342, _co$80] = getNextMarker(_el$341.nextSibling), _el$343 = _el$342.nextSibling, [_el$344, _co$81] = getNextMarker(_el$343.nextSibling);
    insert(_el$339, () => i18n.t("chart.costPerSession"));
    insert(_el$340, () => i18n.t("chart.tokensPerSession"));
    insert(_el$335, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (item, index) => (() => {
        var _el$345 = getNextElement(_tmpl$58), _el$346 = _el$345.firstChild, _el$347 = _el$346.nextSibling, _el$348 = _el$347.nextSibling, [_el$349, _co$82] = getNextMarker(_el$348.nextSibling), _el$350 = _el$349.nextSibling, [_el$351, _co$83] = getNextMarker(_el$350.nextSibling);
        _el$345.addEventListener("pointerenter", () => props.onActiveIndexChange(index()));
        _el$345.$$click = () => props.onActiveIndexChange(index());
        insert(_el$346, () => formatSessionCost(item.cost));
        insert(_el$347, () => item.model);
        insert(_el$345, createComponent(MetricBar, {
          get value() {
            return item.cost;
          },
          get max() {
            return maxCost();
          },
          get active() {
            return props.activeIndex === index();
          }
        }), _el$349, _co$82);
        insert(_el$345, createComponent(MetricBar, {
          get value() {
            return item.tokens;
          },
          get max() {
            return maxTokens();
          },
          get active() {
            return props.activeIndex === index();
          }
        }), _el$351, _co$83);
        createRenderEffect(() => setAttribute(_el$345, "data-active", props.activeIndex === index() ? "true" : void 0));
        runHydrationEvents();
        return _el$345;
      })()
    }), _el$342, _co$80);
    insert(_el$335, createComponent(Show, {
      get when() {
        return active();
      },
      children: (item) => (() => {
        var _el$352 = getNextElement(_tmpl$59), _el$353 = _el$352.firstChild, _el$354 = _el$353.firstChild, _el$355 = _el$354.nextSibling, _el$356 = _el$353.nextSibling, _el$357 = _el$356.firstChild, _el$358 = _el$357.nextSibling;
        insert(_el$354, () => i18n.t("chart.costSession"));
        insert(_el$355, () => formatSessionCost(item().cost));
        insert(_el$357, () => i18n.t("chart.tokensSession"));
        insert(_el$358, () => formatTokenCount(item().tokens));
        createRenderEffect((_$p) => setStyleProperty(_el$352, "top", `${props.activeIndex * 36 + 28}px`));
        return _el$352;
      })()
    }), _el$344, _co$81);
    return _el$335;
  })();
}
function LiveIndicator() {
  const i18n = useI18n();
  return (() => {
    var _el$359 = getNextElement(_tmpl$60);
    insert(_el$359, () => i18n.t("chart.live"));
    return _el$359;
  })();
}
function formatTokenCount(value) {
  if (value >= 1e6) return `${Number((value / 1e6).toFixed(1))}M`;
  return `${Math.round(value / 1e3)}K`;
}
function priceTokenCostFromCatalog(data, catalog) {
  if (!catalog) return data;
  return data.flatMap((item) => {
    const cost = catalogModelCost(catalog, item.model);
    if (!cost) return [];
    return [{
      ...item,
      total: cost.output,
      input: cost.input,
      output: cost.output,
      cached: cost.cacheRead ?? cost.input
    }];
  }).toSorted((a, b) => a.total - b.total || a.model.localeCompare(b.model));
}
function catalogModelCost(catalog, model) {
  return findModelCatalogEntry(catalog, model)?.cost;
}
function formatSessionCost(value) {
  return `$${value.toFixed(4)}`;
}
function homeComparisonPairs(leaderboard) {
  return uniqueComparisonPairs(comparisonPairIndexes.flatMap(([firstIndex, secondIndex, detail]) => {
    const first = leaderboard[firstIndex];
    const second = leaderboard[secondIndex];
    return first && second ? [{
      first: leaderboardRef(first),
      second: leaderboardRef(second),
      detail
    }] : [];
  }));
}
function leaderboardRef(entry) {
  return {
    name: entry.model,
    lab: entry.provider,
    slug: modelSlug(entry.model),
    labName: entry.author,
    metric: `#${entry.rank} / ${formatBillions(entry.tokens)}`
  };
}
function modelSlug(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}
delegateEvents(["click", "pointerdown", "pointermove", "keydown"]);
export {
  StatsHome as default
};
