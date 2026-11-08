import { ab as useI18n, ac as useLanguage, ae as useParams, m as createMemo, s as createSignal, J as localizedUrl, V as onMount, y as getNextElement, z as getNextMarker, C as insert, k as createComponent, n as createRenderEffect, a8 as template, u as delegateEvents, T as Title, M as Meta, S as Show, Z as setAttribute, F as For, K as memo, a0 as setStyleProperty, a6 as style, t as createUniqueId, X as runHydrationEvents } from "./i18n-DJbnCyo8.js";
import { d as createAsync, e as createServerReference, q as query, j as getModelCatalog, f as findModelCatalogEntry, i as getGitHubStars, h as formatCatalogLabName, t as themeStorageKey, a as applyThemePreference, l as isThemePreference, H as Header, C as ComparisonCardsSection, F as Footer, m as modelRefFromCatalog, u as uniqueComparisonPairs } from "./stats-shell-D85bQNDr.js";
import { L as LocaleLinks, P as ProviderIcon } from "./locale-links-hcqm6Rft.js";
import { a as countryCodesSource, c as countriesTopologySource, f as feature, g as geoEquirectangular, b as geoPath, m as mesh, s as sqrt } from "./countries-50m-00FeqXYe.js";
import { S as SectionHeading } from "./section-heading-C1DHUbGf.js";
var _tmpl$ = /* @__PURE__ */ template(`<main data-page=stats><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><div data-component=container><div data-component=content></div><!$><!/>`), _tmpl$2 = /* @__PURE__ */ template(`<section id=overview data-section=model-hero><div data-slot=model-hero-grid><div data-slot=model-hero-copy><a data-slot=model-back-link></a><h1><a data-slot=heading-link href=#overview></a></h1><p>`), _tmpl$3 = /* @__PURE__ */ template(`<section data-section=model-panel>`), _tmpl$4 = /* @__PURE__ */ template(`<details data-component=model-hero-menu><summary data-slot=model-hero-crumb data-current=true><span></span><!$><!/></summary><div data-slot=model-hero-options>`), _tmpl$5 = /* @__PURE__ */ template(`<details data-component=model-hero-menu><summary data-slot=model-hero-crumb data-current=true aria-current=page><span></span><!$><!/></summary><div data-slot=model-hero-options>`), _tmpl$6 = /* @__PURE__ */ template(`<section id=overview data-section=model-hero><nav data-component=model-hero-breadcrumb aria-label="Data breadcrumb"><a data-slot=model-hero-crumb>Data</a><span data-slot=model-hero-separator>/</span><!$><!/><span data-slot=model-hero-separator>/</span><!$><!/></nav><div data-slot=model-hero-title-row><span data-slot=model-hero-avatar></span><h1></h1><div data-slot=model-hero-actions></div></div><div data-slot=model-hero-pattern aria-hidden=true></div><!$><!/>`), _tmpl$7 = /* @__PURE__ */ template(`<span data-slot=model-hero-crumb data-current=true><span></span><!$><!/>`), _tmpl$8 = /* @__PURE__ */ template(`<a data-slot=model-hero-option>`), _tmpl$9 = /* @__PURE__ */ template(`<span data-slot=model-hero-crumb data-current=true aria-current=page><span></span><!$><!/>`), _tmpl$0 = /* @__PURE__ */ template(`<a data-slot=model-hero-action target=_blank rel="noopener noreferrer"><!$><!/><span>Model weights`), _tmpl$1 = /* @__PURE__ */ template(`<p data-slot=model-hero-state><span>Listed</span><span>across the shared model catalog.`), _tmpl$10 = /* @__PURE__ */ template(`<p data-slot=model-hero-rankline><span>Ranked</span><span data-slot=model-hero-rank-group><span data-slot=model-hero-pill></span><!$><!/></span><span>across last week's</span><span data-slot=model-hero-pill>OpenCode Go</span><span>usage with</span><span data-slot=model-hero-pill></span><span>of observed</span><span data-slot=model-hero-pill>2M</span><span>volume.`), _tmpl$11 = /* @__PURE__ */ template(`<svg data-slot=model-hero-action-icon viewBox="0 0 16 16"aria-hidden=true fill=none><path d="M5.5 4.5H4.5V11.5H11.5V10.5"stroke=currentColor stroke-linecap=square></path><path d="M8.5 4.5H11.5V7.5"stroke=currentColor stroke-linecap=square></path><path d="M11.25 4.75L7.25 8.75"stroke=currentColor stroke-linecap=square>`), _tmpl$12 = /* @__PURE__ */ template(`<svg data-slot=model-hero-action-icon viewBox="0 0 16 16"aria-hidden=true fill=none><rect x=3.5 y=3.5 width=3 height=3 stroke=currentColor></rect><rect x=9.5 y=3.5 width=3 height=3 stroke=currentColor></rect><rect x=3.5 y=9.5 width=3 height=3 stroke=currentColor></rect><rect x=9.5 y=9.5 width=3 height=3 stroke=currentColor>`), _tmpl$13 = /* @__PURE__ */ template(`<span data-slot=model-hero-sparkline aria-hidden=true><svg viewBox="0 0 36 24"fill=none><path fill=currentColor opacity=0.14></path><path stroke=currentColor stroke-width=1.5 stroke-linejoin=round>`), _tmpl$14 = /* @__PURE__ */ template(`<svg width=16 height=16 viewBox="0 0 16 16"aria-hidden=true fill=none><path d="M4.75 6.25L8 9.5L11.25 6.25"stroke=currentColor stroke-width=1.5>`), _tmpl$15 = /* @__PURE__ */ template(`<section id=model-overview data-section=model-specs>`), _tmpl$16 = /* @__PURE__ */ template(`<div data-component=model-spec><span></span><strong>`), _tmpl$17 = /* @__PURE__ */ template(`<section id=momentum data-section=model-momentum><h2 data-slot=model-momentum-title><a href=#momentum><!$><!/>.</a><span></span></h2><div data-slot=model-momentum-pattern aria-hidden=true></div><!$><!/>`), _tmpl$18 = /* @__PURE__ */ template(`<div data-slot=model-momentum-metrics><!$><!/><!$><!/><!$><!/><!$><!/>`), _tmpl$19 = /* @__PURE__ */ template(`<div data-component=model-momentum-chart role=img aria-label="Recent model token momentum"><div data-slot=model-momentum-summary><div data-slot=model-momentum-total><strong><!$><!/> tokens</strong><span></span></div><p><span></span><span aria-hidden=true>→</span><span></span></p></div><div data-slot=model-momentum-plot><svg viewBox="0 0 1200 370"preserveAspectRatio=none aria-hidden=true><path data-slot=model-momentum-line-muted></path><path data-slot=model-momentum-line-active></path><!$><!/></svg><span data-slot=model-momentum-end><i></i><!$><!/></span></div><div data-slot=model-momentum-months aria-hidden=true>`), _tmpl$20 = /* @__PURE__ */ template(`<svg><rect data-slot=model-momentum-marker width=6 height=6></svg>`, false, true, false), _tmpl$21 = /* @__PURE__ */ template(`<span>`), _tmpl$22 = /* @__PURE__ */ template(`<div data-component=model-momentum-metric><!$><!/><span></span><strong>`), _tmpl$23 = /* @__PURE__ */ template(`<em aria-hidden=true>`), _tmpl$24 = /* @__PURE__ */ template(`<div data-component=model-usage-chart data-variant=model-trend role=img><div data-slot=model-trend-plot><!$><!/><!$><!/><div data-slot=model-trend-bars></div><!$><!/></div><div data-slot=model-trend-months aria-hidden=true>`), _tmpl$25 = /* @__PURE__ */ template(`<section data-section=model-panel><!$><!/><!$><!/>`), _tmpl$26 = /* @__PURE__ */ template(`<svg data-slot=model-trend-line data-layer=base viewBox="0 0 100 100"preserveAspectRatio=none aria-hidden=true>`), _tmpl$27 = /* @__PURE__ */ template(`<svg data-slot=model-trend-area-layer preserveAspectRatio=none aria-hidden=true><defs><linearGradient x1=0% y1=0% x2=0% y2=100%><stop offset=0% stop-color=var(--model-trend-active) stop-opacity=0.1></stop><stop offset=66% stop-color=var(--model-trend-active) stop-opacity=0.045></stop><stop offset=100% stop-color=var(--model-trend-active) stop-opacity=0></stop></linearGradient></defs><path data-slot=model-trend-area>`), _tmpl$28 = /* @__PURE__ */ template(`<svg><path data-slot=model-trend-line-base></svg>`, false, true, false), _tmpl$29 = /* @__PURE__ */ template(`<svg><defs><mask maskUnits=userSpaceOnUse><rect x=0 y=-2 width=100 height=104 fill=white></rect><rect y=-2 height=104 fill=black></svg>`, false, true, false), _tmpl$30 = /* @__PURE__ */ template(`<svg data-slot=model-trend-line data-layer=active viewBox="0 0 100 100"preserveAspectRatio=none aria-hidden=true><defs><clipPath clipPathUnits=userSpaceOnUse><rect y=-2 height=104></rect></clipPath></defs><path data-slot=model-trend-line-active>`), _tmpl$31 = /* @__PURE__ */ template(`<span data-slot=model-trend-end-marker aria-hidden=true>`), _tmpl$32 = /* @__PURE__ */ template(`<div data-slot=model-trend-column role=button tabindex=0><div data-slot=model-trend-token-band><div data-slot=model-trend-token-bar>`), _tmpl$33 = /* @__PURE__ */ template(`<div data-component=chart-tooltip><strong></strong><span><!$><!/> <!$><!/></span><div data-slot=tooltip-divider></div><p><span data-slot=tooltip-label><i></i> <!$><!/></span><b>`), _tmpl$34 = /* @__PURE__ */ template(`<section id=efficiency data-section=model-panel><!$><!/><!$><!/>`), _tmpl$35 = /* @__PURE__ */ template(`<div data-slot=model-efficiency-pattern aria-hidden=true>`), _tmpl$36 = /* @__PURE__ */ template(`<div data-component=model-efficiency-grid><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/>`), _tmpl$37 = /* @__PURE__ */ template(`<div data-component=geo-breakdown><div data-slot=geo-map-panel><!$><!/><!$><!/></div><!$><!/>`), _tmpl$38 = /* @__PURE__ */ template(`<section id=geo-breakdown data-section=geo-breakdown><!$><!/><!$><!/>`), _tmpl$39 = /* @__PURE__ */ template(`<div data-slot=geo-active-country><span>#<!$><!/></span><strong></strong><p><b></b><em>`), _tmpl$40 = /* @__PURE__ */ template(`<svg data-component=geo-world-map viewBox="0 0 960 430"role=img><title></title><g data-slot=geo-countries></g><g data-slot=geo-country-markers></g><path data-slot=geo-borders aria-hidden=true>`), _tmpl$41 = /* @__PURE__ */ template(`<svg><path aria-hidden=true></svg>`, false, true, false), _tmpl$42 = /* @__PURE__ */ template(`<svg><circle aria-hidden=true></svg>`, false, true, false), _tmpl$43 = /* @__PURE__ */ template(`<ol data-component=geo-country-list>`), _tmpl$44 = /* @__PURE__ */ template(`<li><button type=button><span></span><i></i><strong></strong><em></em><b>`), _tmpl$45 = /* @__PURE__ */ template(`<ol data-component=model-peer-list>`), _tmpl$46 = /* @__PURE__ */ template(`<section id=peers data-section=model-panel><!$><!/><!$><!/>`), _tmpl$47 = /* @__PURE__ */ template(`<article data-component=model-metric><span></span><strong></strong><!$><!/>`), _tmpl$48 = /* @__PURE__ */ template(`<p>`), _tmpl$49 = /* @__PURE__ */ template(`<li><a><span data-slot=model-peer-rank></span><span data-slot=model-peer-avatar></span><span data-slot=model-peer-copy><strong></strong><em></em></span><b>`), _tmpl$50 = /* @__PURE__ */ template(`<div data-component=empty-state><strong></strong><p>`);
const statsUnfurlPath = "banner.png";
const geoMapWidth = 960;
const geoMapHeight = 430;
const shortMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
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
const getModelData_query = createServerReference("860922e9029e84bcdbdc5deeca55736744445ef460cfd780ceafcdb8b417cb55");
const getModelData = query(getModelData_query, "getStatsModelData");
function StatsModel() {
  const i18n = useI18n();
  const language = useLanguage();
  const params = useParams();
  const labParam = createMemo(() => params.lab ?? "");
  const modelParam = createMemo(() => params.model ?? "");
  const catalog = createAsync(() => getModelCatalog());
  const catalogEntry = createMemo(() => {
    const data = catalog();
    if (!data) return void 0;
    return findModelCatalogEntry(data, modelParam(), labParam()) ?? null;
  });
  const stats = createAsync(() => {
    const entry = catalogEntry();
    if (catalog() === void 0 || entry === void 0) return Promise.resolve(void 0);
    if (!entry && (!labParam() || !modelParam())) return Promise.resolve(null);
    return getModelData(labParam(), entry?.slug ?? modelParam());
  });
  const githubStars = createAsync(() => getGitHubStars());
  const [themePreference, setThemePreference] = createSignal("system");
  const modelName = createMemo(() => catalogEntry()?.name ?? stats()?.model ?? modelParam() ?? i18n.t("model.fallback"));
  const labName = createMemo(() => formatCatalogLabName(catalogEntry()?.lab ?? stats()?.provider ?? labParam()));
  const modelTitle = createMemo(() => i18n.t("model.title", {
    model: modelName()
  }));
  const modelDescription = createMemo(() => i18n.t("model.description", {
    model: modelName()
  }));
  const modelPath = createMemo(() => `/data/${catalogEntry()?.id ?? [labParam(), stats()?.slug ?? modelParam()].filter((part) => part.length > 0).join("/")}`);
  const modelUrl = createMemo(() => localizedUrl(language.locale(), modelPath()));
  const statsUnfurlUrl = new URL(statsUnfurlPath, localizedUrl("en", "/data/")).toString();
  const modelHeaderLinks = createMemo(() => [{
    href: "#overview",
    label: i18n.t("nav.overview")
  }, {
    href: "#momentum",
    label: i18n.t("model.momentum")
  }, {
    href: "#usage",
    label: i18n.t("nav.usage")
  }, {
    href: "#unique-users",
    label: i18n.t("model.uniqueUsers")
  }, {
    href: "#efficiency",
    label: i18n.t("nav.efficiency")
  }, {
    href: "#geo-breakdown",
    label: i18n.t("nav.geoBreakdown")
  }, {
    href: "#peers",
    label: i18n.t("nav.peers")
  }]);
  const modelFooterLinks = createMemo(() => [{
    href: "/data/",
    label: i18n.t("nav.dataHome")
  }, {
    href: `${"/data/"}#top-models`,
    label: i18n.t("nav.topModels")
  }, {
    href: `${"/data/"}#session-cost`,
    label: i18n.t("nav.sessionCost")
  }, {
    href: `${"/data/"}#token-cost`,
    label: i18n.t("nav.tokenCost")
  }, {
    href: `${"/data/"}#cache-ratio`,
    label: i18n.t("nav.cacheRatio")
  }, {
    href: `${"/data/"}#market-share`,
    label: i18n.t("nav.marketShare")
  }, {
    href: `${"/data/"}#geo-breakdown`,
    label: i18n.t("nav.geoBreakdown")
  }]);
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
    var _el$ = getNextElement(_tmpl$), _el$6 = _el$.firstChild, [_el$7, _co$2] = getNextMarker(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$3] = getNextMarker(_el$8.nextSibling), _el$0 = _el$9.nextSibling, [_el$1, _co$4] = getNextMarker(_el$0.nextSibling), _el$10 = _el$1.nextSibling, [_el$11, _co$5] = getNextMarker(_el$10.nextSibling), _el$12 = _el$11.nextSibling, [_el$13, _co$6] = getNextMarker(_el$12.nextSibling), _el$14 = _el$13.nextSibling, [_el$15, _co$7] = getNextMarker(_el$14.nextSibling), _el$16 = _el$15.nextSibling, [_el$17, _co$8] = getNextMarker(_el$16.nextSibling), _el$18 = _el$17.nextSibling, [_el$19, _co$9] = getNextMarker(_el$18.nextSibling), _el$20 = _el$19.nextSibling, [_el$21, _co$0] = getNextMarker(_el$20.nextSibling), _el$22 = _el$21.nextSibling, [_el$23, _co$1] = getNextMarker(_el$22.nextSibling), _el$24 = _el$23.nextSibling, [_el$25, _co$10] = getNextMarker(_el$24.nextSibling), _el$26 = _el$25.nextSibling, [_el$27, _co$11] = getNextMarker(_el$26.nextSibling), _el$28 = _el$27.nextSibling, [_el$29, _co$12] = getNextMarker(_el$28.nextSibling), _el$30 = _el$29.nextSibling, [_el$31, _co$13] = getNextMarker(_el$30.nextSibling), _el$32 = _el$31.nextSibling, [_el$33, _co$14] = getNextMarker(_el$32.nextSibling), _el$34 = _el$33.nextSibling, [_el$35, _co$15] = getNextMarker(_el$34.nextSibling), _el$36 = _el$35.nextSibling, [_el$37, _co$16] = getNextMarker(_el$36.nextSibling), _el$38 = _el$37.nextSibling, [_el$39, _co$17] = getNextMarker(_el$38.nextSibling), _el$40 = _el$39.nextSibling, [_el$41, _co$18] = getNextMarker(_el$40.nextSibling), _el$2 = _el$41.nextSibling, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, [_el$5, _co$] = getNextMarker(_el$4.nextSibling);
    insert(_el$, createComponent(Title, {
      get children() {
        return modelTitle();
      }
    }), _el$7, _co$2);
    insert(_el$, createComponent(Meta, {
      name: "description",
      get content() {
        return modelDescription();
      }
    }), _el$9, _co$3);
    insert(_el$, createComponent(LocaleLinks, {
      get path() {
        return modelPath();
      }
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
        return modelTitle();
      }
    }), _el$15, _co$7);
    insert(_el$, createComponent(Meta, {
      property: "og:description",
      get content() {
        return modelDescription();
      }
    }), _el$17, _co$8);
    insert(_el$, createComponent(Meta, {
      property: "og:url",
      get content() {
        return modelUrl();
      }
    }), _el$19, _co$9);
    insert(_el$, createComponent(Meta, {
      property: "og:image",
      content: statsUnfurlUrl
    }), _el$21, _co$0);
    insert(_el$, createComponent(Meta, {
      property: "og:image:type",
      content: "image/png"
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
        return modelTitle();
      }
    }), _el$33, _co$14);
    insert(_el$, createComponent(Meta, {
      name: "twitter:description",
      get content() {
        return modelDescription();
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
    insert(_el$, createComponent(Header, {
      get githubStars() {
        return githubStars() ?? "150K";
      },
      get links() {
        return modelHeaderLinks();
      },
      get brandHref() {
        return "/data/";
      }
    }), _el$41, _co$18);
    insert(_el$3, createComponent(Show, {
      get when() {
        return catalogEntry() || stats() !== void 0;
      },
      get fallback() {
        return createComponent(ModelLoading, {});
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return catalogEntry() || stats();
          },
          get fallback() {
            return createComponent(ModelNotFound, {
              get lab() {
                return labParam();
              },
              get model() {
                return modelParam();
              }
            });
          },
          get children() {
            return [createComponent(ModelHero, {
              get data() {
                return stats() ?? null;
              },
              get catalog() {
                return catalogEntry() ?? null;
              },
              get catalogData() {
                return catalog() ?? null;
              },
              get labName() {
                return labName();
              }
            }), createComponent(ModelOverview, {
              get catalog() {
                return catalogEntry() ?? null;
              }
            }), createComponent(ModelMomentumSection, {
              get data() {
                return stats() ?? null;
              }
            }), createComponent(ModelUsageSection, {
              get data() {
                return stats() ?? null;
              }
            }), createComponent(ModelUniqueUsersSection, {
              get data() {
                return stats() ?? null;
              }
            }), createComponent(ModelEfficiencySection, {
              get data() {
                return stats() ?? null;
              },
              get catalog() {
                return catalogEntry() ?? null;
              }
            }), createComponent(ModelGeoBreakdownSection, {
              get data() {
                return stats()?.country ?? emptyCountryRecord();
              }
            }), createComponent(ModelPeersSection, {
              get data() {
                return stats() ?? null;
              }
            }), createComponent(ComparisonCardsSection, {
              get pairs() {
                return modelComparisonPairs(catalog(), catalogEntry() ?? null, stats() ?? null);
              },
              title: "Compare This Model",
              description: "Other models to compare with this one."
            })];
          }
        });
      }
    }));
    insert(_el$2, createComponent(Footer, {
      get themePreference() {
        return themePreference();
      },
      onThemePreferenceChange: updateThemePreference,
      get links() {
        return modelFooterLinks();
      },
      bridge: {
        href: "#model-comparison",
        label: "MODEL COMPARISONS"
      }
    }), _el$5, _co$);
    createRenderEffect(() => setAttribute(_el$, "data-theme", themePreference()));
    return _el$;
  })();
}
function ModelLoading() {
  const i18n = useI18n();
  const language = useLanguage();
  return [(() => {
    var _el$42 = getNextElement(_tmpl$2), _el$43 = _el$42.firstChild, _el$44 = _el$43.firstChild, _el$45 = _el$44.firstChild, _el$46 = _el$45.nextSibling, _el$47 = _el$46.firstChild, _el$48 = _el$46.nextSibling;
    insert(_el$45, () => i18n.t("footer.modelData"));
    insert(_el$47, () => i18n.t("model.loadingTitle"));
    insert(_el$48, () => i18n.t("model.loadingDescription"));
    createRenderEffect(() => setAttribute(_el$45, "href", language.route("/data/")));
    return _el$42;
  })(), (() => {
    var _el$49 = getNextElement(_tmpl$3);
    insert(_el$49, createComponent(ModelEmptyState, {
      get title() {
        return i18n.t("model.loadingTitle");
      },
      get description() {
        return i18n.t("model.loadingProfile");
      }
    }));
    return _el$49;
  })()];
}
function ModelNotFound(props) {
  const i18n = useI18n();
  const language = useLanguage();
  return [(() => {
    var _el$50 = getNextElement(_tmpl$2), _el$51 = _el$50.firstChild, _el$52 = _el$51.firstChild, _el$53 = _el$52.firstChild, _el$54 = _el$53.nextSibling, _el$55 = _el$54.firstChild, _el$56 = _el$54.nextSibling;
    insert(_el$53, () => i18n.t("footer.modelData"));
    insert(_el$55, () => props.model || i18n.t("model.fallback"));
    insert(_el$56, () => i18n.t("model.noMatched", {
      id: props.lab ? `${props.lab}/${props.model}` : props.model
    }));
    createRenderEffect(() => setAttribute(_el$53, "href", language.route("/data/")));
    return _el$50;
  })(), (() => {
    var _el$57 = getNextElement(_tmpl$3);
    insert(_el$57, createComponent(ModelEmptyState, {
      get title() {
        return i18n.t("model.noDataTitle");
      },
      get description() {
        return i18n.t("model.noDataDescription");
      }
    }));
    return _el$57;
  })()];
}
function ModelHero(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const labId = () => props.catalog?.lab ?? props.data?.provider ?? props.labName;
  const modelName = () => props.catalog?.name ?? props.data?.model ?? i18n.t("model.fallback");
  const weights = () => props.catalog?.weights[0];
  const labs = () => props.catalogData?.labs ?? [];
  const labModels = () => props.catalogData?.labs.find((lab) => lab.id === providerSlug(labId()))?.models ?? (props.catalog ? [props.catalog] : []);
  return (() => {
    var _el$58 = getNextElement(_tmpl$6), _el$59 = _el$58.firstChild, _el$60 = _el$59.firstChild, _el$61 = _el$60.nextSibling, _el$75 = _el$61.nextSibling, [_el$76, _co$21] = getNextMarker(_el$75.nextSibling), _el$68 = _el$76.nextSibling, _el$77 = _el$68.nextSibling, [_el$78, _co$22] = getNextMarker(_el$77.nextSibling), _el$79 = _el$59.nextSibling, _el$80 = _el$79.firstChild, _el$81 = _el$80.nextSibling, _el$82 = _el$81.nextSibling, _el$83 = _el$79.nextSibling, _el$84 = _el$83.nextSibling, [_el$85, _co$23] = getNextMarker(_el$84.nextSibling);
    insert(_el$59, createComponent(Show, {
      get when() {
        return labs().length > 0;
      },
      get fallback() {
        return (() => {
          var _el$86 = getNextElement(_tmpl$7), _el$87 = _el$86.firstChild, _el$88 = _el$87.nextSibling, [_el$89, _co$24] = getNextMarker(_el$88.nextSibling);
          insert(_el$87, () => props.labName);
          insert(_el$86, createComponent(ChevronDownIcon, {}), _el$89, _co$24);
          return _el$86;
        })();
      },
      get children() {
        var _el$62 = getNextElement(_tmpl$4), _el$63 = _el$62.firstChild, _el$64 = _el$63.firstChild, _el$65 = _el$64.nextSibling, [_el$66, _co$19] = getNextMarker(_el$65.nextSibling), _el$67 = _el$63.nextSibling;
        insert(_el$64, () => props.labName);
        insert(_el$63, createComponent(ChevronDownIcon, {}), _el$66, _co$19);
        insert(_el$67, createComponent(For, {
          get each() {
            return labs();
          },
          children: (lab) => (() => {
            var _el$90 = getNextElement(_tmpl$8);
            insert(_el$90, () => lab.name);
            createRenderEffect((_p$) => {
              var _v$ = lab.id === providerSlug(labId()) ? "true" : void 0, _v$2 = language.route(`${"/data/"}${lab.id}`);
              _v$ !== _p$.e && setAttribute(_el$90, "data-current", _p$.e = _v$);
              _v$2 !== _p$.t && setAttribute(_el$90, "href", _p$.t = _v$2);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$90;
          })()
        }));
        return _el$62;
      }
    }), _el$76, _co$21);
    insert(_el$59, createComponent(Show, {
      get when() {
        return labModels().length > 0;
      },
      get fallback() {
        return (() => {
          var _el$91 = getNextElement(_tmpl$9), _el$92 = _el$91.firstChild, _el$93 = _el$92.nextSibling, [_el$94, _co$25] = getNextMarker(_el$93.nextSibling);
          insert(_el$92, modelName);
          insert(_el$91, createComponent(ChevronDownIcon, {}), _el$94, _co$25);
          return _el$91;
        })();
      },
      get children() {
        var _el$69 = getNextElement(_tmpl$5), _el$70 = _el$69.firstChild, _el$71 = _el$70.firstChild, _el$72 = _el$71.nextSibling, [_el$73, _co$20] = getNextMarker(_el$72.nextSibling), _el$74 = _el$70.nextSibling;
        insert(_el$71, modelName);
        insert(_el$70, createComponent(ChevronDownIcon, {}), _el$73, _co$20);
        insert(_el$74, createComponent(For, {
          get each() {
            return labModels();
          },
          children: (model) => (() => {
            var _el$95 = getNextElement(_tmpl$8);
            insert(_el$95, () => model.name);
            createRenderEffect((_p$) => {
              var _v$3 = model.id === props.catalog?.id ? "true" : void 0, _v$4 = language.route(`${"/data/"}${model.id}`);
              _v$3 !== _p$.e && setAttribute(_el$95, "data-current", _p$.e = _v$3);
              _v$4 !== _p$.t && setAttribute(_el$95, "href", _p$.t = _v$4);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$95;
          })()
        }));
        return _el$69;
      }
    }), _el$78, _co$22);
    insert(_el$80, createComponent(ProviderIcon, {
      "aria-hidden": "true",
      get id() {
        return getProviderIconId(labId());
      }
    }));
    insert(_el$81, modelName);
    insert(_el$82, createComponent(Show, {
      get when() {
        return memo(() => !!props.catalog?.openWeights)() && weights();
      },
      children: (weight) => (() => {
        var _el$96 = getNextElement(_tmpl$0), _el$98 = _el$96.firstChild, [_el$99, _co$26] = getNextMarker(_el$98.nextSibling);
        _el$99.nextSibling;
        insert(_el$96, createComponent(ModelHeroActionIcon, {
          kind: "weights"
        }), _el$99, _co$26);
        createRenderEffect(() => setAttribute(_el$96, "href", weight().url));
        return _el$96;
      })()
    }));
    insert(_el$58, createComponent(Show, {
      get when() {
        return props.data;
      },
      get fallback() {
        return getNextElement(_tmpl$1);
      },
      children: (data) => (() => {
        var _el$101 = getNextElement(_tmpl$10), _el$102 = _el$101.firstChild, _el$103 = _el$102.nextSibling, _el$104 = _el$103.firstChild, _el$105 = _el$104.nextSibling, [_el$106, _co$27] = getNextMarker(_el$105.nextSibling), _el$107 = _el$103.nextSibling, _el$108 = _el$107.nextSibling, _el$109 = _el$108.nextSibling, _el$110 = _el$109.nextSibling;
        insert(_el$104, () => formatHeroRank(data().rank));
        insert(_el$103, createComponent(ModelHeroSparkline, {
          get data() {
            return data();
          }
        }), _el$106, _co$27);
        insert(_el$110, () => formatPercent(data().tokenShare));
        return _el$101;
      })()
    }), _el$85, _co$23);
    createRenderEffect(() => setAttribute(_el$60, "href", language.route("/data/")));
    return _el$58;
  })();
}
function ModelHeroActionIcon(props) {
  if (props.kind === "weights") return getNextElement(_tmpl$11);
  return getNextElement(_tmpl$12);
}
function ModelHeroSparkline(props) {
  const values = () => props.data.usage.slice(-14).map((point) => point.tokens);
  return (() => {
    var _el$113 = getNextElement(_tmpl$13), _el$114 = _el$113.firstChild, _el$115 = _el$114.firstChild, _el$116 = _el$115.nextSibling;
    createRenderEffect((_p$) => {
      var _v$5 = sparklineAreaPath(values()), _v$6 = sparklineLinePath(values());
      _v$5 !== _p$.e && setAttribute(_el$115, "d", _p$.e = _v$5);
      _v$6 !== _p$.t && setAttribute(_el$116, "d", _p$.t = _v$6);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$113;
  })();
}
function ChevronDownIcon() {
  return getNextElement(_tmpl$14);
}
function ModelOverview(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const specs = createMemo(() => [{
    label: i18n.t("model.context"),
    value: formatCatalogLimit(props.catalog?.limit?.context, i18n.t("home.unknown"))
  }, {
    label: i18n.t("model.output"),
    value: formatCatalogLimit(props.catalog?.limit?.output, i18n.t("home.unknown"))
  }, {
    label: i18n.t("model.knowledge"),
    value: formatCatalogMonth(props.catalog?.knowledge, language.tag(language.locale()), i18n.t("home.unknown"))
  }, {
    label: i18n.t("model.release"),
    value: formatCatalogMonth(props.catalog?.releaseDate, language.tag(language.locale()), i18n.t("home.unknown"))
  }, {
    label: i18n.t("model.inputs"),
    value: formatCatalogModalities(props.catalog?.modalities.input ?? [], language.tag(language.locale()), i18n.t("home.unknown"))
  }]);
  return (() => {
    var _el$118 = getNextElement(_tmpl$15);
    insert(_el$118, createComponent(For, {
      get each() {
        return specs();
      },
      children: (spec) => (() => {
        var _el$119 = getNextElement(_tmpl$16), _el$120 = _el$119.firstChild, _el$121 = _el$120.nextSibling;
        insert(_el$120, () => spec.label);
        insert(_el$121, () => spec.value);
        return _el$119;
      })()
    }));
    createRenderEffect(() => setAttribute(_el$118, "aria-label", i18n.t("nav.overview")));
    return _el$118;
  })();
}
function ModelMomentumSection(props) {
  const i18n = useI18n();
  const language = useLanguage();
  return (() => {
    var _el$122 = getNextElement(_tmpl$17), _el$123 = _el$122.firstChild, _el$124 = _el$123.firstChild, _el$126 = _el$124.firstChild, [_el$127, _co$28] = getNextMarker(_el$126.nextSibling);
    _el$127.nextSibling;
    var _el$128 = _el$124.nextSibling, _el$129 = _el$123.nextSibling, _el$130 = _el$129.nextSibling, [_el$131, _co$29] = getNextMarker(_el$130.nextSibling);
    insert(_el$124, () => i18n.t("model.momentum"), _el$127, _co$28);
    insert(_el$128, () => i18n.t("model.overviewDescription"));
    insert(_el$122, createComponent(Show, {
      get when() {
        return props.data;
      },
      get fallback() {
        return createComponent(ModelEmptyState, {
          get title() {
            return i18n.t("model.noSummaryTitle");
          },
          get description() {
            return i18n.t("model.noSummaryDescription");
          }
        });
      },
      children: (data) => [createComponent(MomentumChart, {
        get data() {
          return data();
        },
        get locale() {
          return language.tag(language.locale());
        }
      }), (() => {
        var _el$132 = getNextElement(_tmpl$18), _el$133 = _el$132.firstChild, [_el$134, _co$30] = getNextMarker(_el$133.nextSibling), _el$135 = _el$134.nextSibling, [_el$136, _co$31] = getNextMarker(_el$135.nextSibling), _el$137 = _el$136.nextSibling, [_el$138, _co$32] = getNextMarker(_el$137.nextSibling), _el$139 = _el$138.nextSibling, [_el$140, _co$33] = getNextMarker(_el$139.nextSibling);
        insert(_el$132, createComponent(MomentumMetric, {
          get label() {
            return i18n.t("model.uniqueUsers");
          },
          get value() {
            return formatUsers(data().totals.uniqueUsers);
          }
        }), _el$134, _co$30);
        insert(_el$132, createComponent(MomentumMetric, {
          get label() {
            return capitalizeLabel(i18n.t("model.completedSessions"));
          },
          get value() {
            return formatInteger(data().totals.sessions);
          }
        }), _el$136, _co$31);
        insert(_el$132, createComponent(MomentumMetric, {
          get label() {
            return i18n.t("model.tokenShare");
          },
          get value() {
            return formatPercent(data().tokenShare);
          }
        }), _el$138, _co$32);
        insert(_el$132, createComponent(MomentumMetric, {
          label: "Rank",
          get value() {
            return formatRankLabel(data().rank);
          },
          get watermark() {
            return formatRankLabel(data().rank);
          }
        }), _el$140, _co$33);
        return _el$132;
      })()]
    }), _el$131, _co$29);
    return _el$122;
  })();
}
function MomentumChart(props) {
  const chart = createMemo(() => momentumChart(props.data.usage, props.data.updatedAt));
  const changeState = createMemo(() => props.data.tokenChange < 0 ? "negative" : "positive");
  return (() => {
    var _el$141 = getNextElement(_tmpl$19), _el$142 = _el$141.firstChild, _el$143 = _el$142.firstChild, _el$144 = _el$143.firstChild, _el$146 = _el$144.firstChild, [_el$147, _co$34] = getNextMarker(_el$146.nextSibling);
    _el$147.nextSibling;
    var _el$148 = _el$144.nextSibling, _el$149 = _el$143.nextSibling, _el$150 = _el$149.firstChild, _el$151 = _el$150.nextSibling, _el$152 = _el$151.nextSibling, _el$153 = _el$142.nextSibling, _el$154 = _el$153.firstChild, _el$155 = _el$154.firstChild, _el$156 = _el$155.nextSibling, _el$157 = _el$156.nextSibling, [_el$158, _co$35] = getNextMarker(_el$157.nextSibling), _el$159 = _el$154.nextSibling, _el$160 = _el$159.firstChild, _el$161 = _el$160.nextSibling, [_el$162, _co$36] = getNextMarker(_el$161.nextSibling), _el$163 = _el$153.nextSibling;
    insert(_el$144, () => formatTokens(props.data.totals.tokens), _el$147, _co$34);
    insert(_el$148, () => formatChange(props.data.tokenChange));
    insert(_el$150, () => formatMomentumDate(chart().startDate, props.locale, props.data.updatedAt));
    insert(_el$152, () => formatMomentumDate(chart().endDate, props.locale, props.data.updatedAt));
    insert(_el$154, createComponent(For, {
      get each() {
        return chart().markers;
      },
      children: (marker) => (() => {
        var _el$164 = getNextElement(_tmpl$20);
        createRenderEffect((_p$) => {
          var _v$10 = marker.active ? "true" : void 0, _v$11 = marker.x - 3, _v$12 = marker.y - 3;
          _v$10 !== _p$.e && setAttribute(_el$164, "data-active", _p$.e = _v$10);
          _v$11 !== _p$.t && setAttribute(_el$164, "x", _p$.t = _v$11);
          _v$12 !== _p$.a && setAttribute(_el$164, "y", _p$.a = _v$12);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$164;
      })()
    }), _el$158, _co$35);
    insert(_el$159, () => formatChange(props.data.tokenChange), _el$162, _co$36);
    insert(_el$163, createComponent(For, {
      get each() {
        return momentumMonthLabels(chart().startDate, props.locale, props.data.updatedAt);
      },
      children: (month) => (() => {
        var _el$165 = getNextElement(_tmpl$21);
        insert(_el$165, () => month.label);
        createRenderEffect((_$p) => setStyleProperty(_el$165, "left", `${month.x}%`));
        return _el$165;
      })()
    }));
    createRenderEffect((_p$) => {
      var _v$7 = changeState(), _v$8 = chart().previousPath, _v$9 = chart().currentPath, _v$0 = changeState(), _v$1 = chart().endStyle;
      _v$7 !== _p$.e && setAttribute(_el$148, "data-state", _p$.e = _v$7);
      _v$8 !== _p$.t && setAttribute(_el$155, "d", _p$.t = _v$8);
      _v$9 !== _p$.a && setAttribute(_el$156, "d", _p$.a = _v$9);
      _v$0 !== _p$.o && setAttribute(_el$159, "data-state", _p$.o = _v$0);
      _p$.i = style(_el$159, _v$1, _p$.i);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$141;
  })();
}
function MomentumMetric(props) {
  return (() => {
    var _el$166 = getNextElement(_tmpl$22), _el$169 = _el$166.firstChild, [_el$170, _co$37] = getNextMarker(_el$169.nextSibling), _el$167 = _el$170.nextSibling, _el$168 = _el$167.nextSibling;
    insert(_el$166, createComponent(Show, {
      get when() {
        return props.watermark;
      },
      children: (watermark) => (() => {
        var _el$171 = getNextElement(_tmpl$23);
        insert(_el$171, watermark);
        return _el$171;
      })()
    }), _el$170, _co$37);
    insert(_el$167, () => props.label);
    insert(_el$168, () => props.value);
    return _el$166;
  })();
}
function ModelUsageSection(props) {
  const i18n = useI18n();
  return createComponent(ModelTrendSection, {
    get data() {
      return props.data;
    },
    id: "usage",
    get title() {
      return i18n.t("nav.usage");
    },
    get description() {
      return i18n.t("model.usageDescription");
    },
    get ariaLabel() {
      return i18n.t("model.dailyTokenChart");
    },
    get emptyTitle() {
      return i18n.t("model.noUsageTitle");
    },
    get emptyDescription() {
      return i18n.t("model.noUsageDescription");
    },
    value: (point) => point.tokens,
    formatValue: formatTokens,
    get valueUnit() {
      return i18n.t("lab.tokens");
    },
    get rowLabel() {
      return i18n.t("lab.dailyTokens");
    },
    lineTone: "muted"
  });
}
function ModelUniqueUsersSection(props) {
  const i18n = useI18n();
  return createComponent(ModelTrendSection, {
    get data() {
      return props.data;
    },
    id: "unique-users",
    get title() {
      return i18n.t("model.uniqueUsers");
    },
    get description() {
      return i18n.t("model.usersDescription");
    },
    get ariaLabel() {
      return i18n.t("model.dailyUserChart");
    },
    get emptyTitle() {
      return i18n.t("model.noUsersTitle");
    },
    get emptyDescription() {
      return i18n.t("model.noUsersDescription");
    },
    value: (point) => point.users,
    formatValue: formatUsers,
    get valueUnit() {
      return i18n.t("format.users");
    },
    get rowLabel() {
      return i18n.t("model.uniqueUsers");
    },
    lineTone: "active",
    activeLineBaseTone: "muted",
    highlightBars: false,
    area: true
  });
}
function ModelTrendSection(props) {
  const activeLineClipId = createUniqueId();
  const activeLineMaskId = createUniqueId();
  const areaGradientId = createUniqueId();
  const [activeIndex, setActiveIndex] = createSignal();
  const highlightBars = createMemo(() => props.highlightBars ?? true);
  const lineScale = 326 / 450;
  const areaBottom = 100 / lineScale;
  const usage = createMemo(() => props.data?.usage ?? []);
  const valueMax = createMemo(() => Math.max(0, ...usage().map((item) => props.value(item))) || 1);
  const linePoints = createMemo(() => usage().map((point, index) => ({
    point,
    x: modelUsagePointX(index, usage().length),
    y: modelUsageLineY(props.value(point), valueMax())
  })));
  const linePath = createMemo(() => modelUsageLinePath(linePoints()));
  const areaPath = createMemo(() => modelUsageAreaPath(linePoints(), areaBottom));
  const activeLineBreak = createMemo(() => {
    const index = activeIndex();
    if (index === void 0 || linePoints().length < 2) return void 0;
    return modelUsageColumnBounds(index, linePoints().length);
  });
  const activeLineClip = createMemo(() => {
    const index = activeIndex();
    if (index === void 0 || linePoints().length < 2) return void 0;
    return modelUsageColumnInnerBounds(index, linePoints().length);
  });
  const activeTooltip = createMemo(() => {
    const index = activeIndex();
    const point = index === void 0 ? void 0 : usage()[index];
    if (index === void 0 || !point) return void 0;
    const bounds = modelUsageColumnBounds(index, usage().length);
    return {
      bounds,
      index,
      point,
      tooltipY: (linePoints()[index]?.y ?? 100) * lineScale
    };
  });
  const monthTicks = createMemo(() => modelUsageMonthTicks(usage(), props.data?.updatedAt ?? null));
  return (() => {
    var _el$172 = getNextElement(_tmpl$25), _el$183 = _el$172.firstChild, [_el$184, _co$41] = getNextMarker(_el$183.nextSibling), _el$185 = _el$184.nextSibling, [_el$186, _co$42] = getNextMarker(_el$185.nextSibling);
    insert(_el$172, createComponent(SectionTitle, {
      get href() {
        return `#${props.id}`;
      },
      get title() {
        return props.title;
      },
      get description() {
        return props.description;
      }
    }), _el$184, _co$41);
    insert(_el$172, createComponent(Show, {
      get when() {
        return usage().some((item) => props.value(item) > 0);
      },
      get fallback() {
        return createComponent(ModelEmptyState, {
          get title() {
            return props.emptyTitle;
          },
          get description() {
            return props.emptyDescription;
          }
        });
      },
      get children() {
        var _el$173 = getNextElement(_tmpl$24), _el$174 = _el$173.firstChild, _el$176 = _el$174.firstChild, [_el$177, _co$38] = getNextMarker(_el$176.nextSibling), _el$178 = _el$177.nextSibling, [_el$179, _co$39] = getNextMarker(_el$178.nextSibling), _el$175 = _el$179.nextSibling, _el$180 = _el$175.nextSibling, [_el$181, _co$40] = getNextMarker(_el$180.nextSibling), _el$182 = _el$174.nextSibling;
        _el$173.addEventListener("pointerleave", (event) => {
          if (event.pointerType === "touch") return;
          setActiveIndex(void 0);
        });
        insert(_el$174, createComponent(Show, {
          get when() {
            return linePath();
          },
          children: (path) => [createComponent(Show, {
            get when() {
              return memo(() => !!props.area)() && areaPath();
            },
            children: (area) => (() => {
              var _el$188 = getNextElement(_tmpl$27), _el$189 = _el$188.firstChild, _el$190 = _el$189.firstChild, _el$191 = _el$189.nextSibling;
              setAttribute(_el$190, "id", areaGradientId);
              setAttribute(_el$191, "fill", `url(#${areaGradientId})`);
              createRenderEffect((_p$) => {
                var _v$16 = `0 0 100 ${formatUsagePathNumber(areaBottom)}`, _v$17 = area();
                _v$16 !== _p$.e && setAttribute(_el$188, "viewBox", _p$.e = _v$16);
                _v$17 !== _p$.t && setAttribute(_el$191, "d", _p$.t = _v$17);
                return _p$;
              }, {
                e: void 0,
                t: void 0
              });
              return _el$188;
            })()
          }), (() => {
            var _el$187 = getNextElement(_tmpl$26);
            insert(_el$187, createComponent(Show, {
              get when() {
                return activeLineBreak();
              },
              get fallback() {
                return (() => {
                  var _el$192 = getNextElement(_tmpl$28);
                  createRenderEffect((_p$) => {
                    var _v$18 = props.lineTone, _v$19 = path();
                    _v$18 !== _p$.e && setAttribute(_el$192, "data-tone", _p$.e = _v$18);
                    _v$19 !== _p$.t && setAttribute(_el$192, "d", _p$.t = _v$19);
                    return _p$;
                  }, {
                    e: void 0,
                    t: void 0
                  });
                  return _el$192;
                })();
              },
              children: (lineBreak) => [(() => {
                var _el$193 = getNextElement(_tmpl$29), _el$194 = _el$193.firstChild, _el$195 = _el$194.firstChild, _el$196 = _el$195.nextSibling;
                setAttribute(_el$194, "id", activeLineMaskId);
                createRenderEffect((_p$) => {
                  var _v$20 = lineBreak().x, _v$21 = lineBreak().width;
                  _v$20 !== _p$.e && setAttribute(_el$196, "x", _p$.e = _v$20);
                  _v$21 !== _p$.t && setAttribute(_el$196, "width", _p$.t = _v$21);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0
                });
                return _el$193;
              })(), (() => {
                var _el$197 = getNextElement(_tmpl$28);
                setAttribute(_el$197, "mask", `url(#${activeLineMaskId})`);
                createRenderEffect((_p$) => {
                  var _v$22 = props.activeLineBaseTone ?? props.lineTone, _v$23 = path();
                  _v$22 !== _p$.e && setAttribute(_el$197, "data-tone", _p$.e = _v$22);
                  _v$23 !== _p$.t && setAttribute(_el$197, "d", _p$.t = _v$23);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0
                });
                return _el$197;
              })()]
            }));
            return _el$187;
          })(), createComponent(Show, {
            get when() {
              return activeLineClip();
            },
            children: (clip) => (() => {
              var _el$198 = getNextElement(_tmpl$30), _el$199 = _el$198.firstChild, _el$200 = _el$199.firstChild, _el$201 = _el$200.firstChild, _el$202 = _el$199.nextSibling;
              setAttribute(_el$200, "id", activeLineClipId);
              setAttribute(_el$202, "clip-path", `url(#${activeLineClipId})`);
              createRenderEffect((_p$) => {
                var _v$24 = clip().x, _v$25 = clip().width, _v$26 = path();
                _v$24 !== _p$.e && setAttribute(_el$201, "x", _p$.e = _v$24);
                _v$25 !== _p$.t && setAttribute(_el$201, "width", _p$.t = _v$25);
                _v$26 !== _p$.a && setAttribute(_el$202, "d", _p$.a = _v$26);
                return _p$;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              });
              return _el$198;
            })()
          })]
        }), _el$177, _co$38);
        insert(_el$174, createComponent(Show, {
          get when() {
            return linePoints().at(-1);
          },
          children: (point) => (() => {
            var _el$203 = getNextElement(_tmpl$31);
            createRenderEffect((_p$) => {
              var _v$27 = props.lineTone, _v$28 = {
                "--model-trend-end-x": `${point().x}%`,
                "--model-trend-end-top": `${point().y * lineScale}%`
              };
              _v$27 !== _p$.e && setAttribute(_el$203, "data-tone", _p$.e = _v$27);
              _p$.t = style(_el$203, _v$28, _p$.t);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$203;
          })()
        }), _el$179, _co$39);
        insert(_el$175, createComponent(For, {
          get each() {
            return usage();
          },
          children: (point, index) => (() => {
            var _el$204 = getNextElement(_tmpl$32);
            _el$204.$$keydown = (event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              setActiveIndex(index());
            };
            _el$204.addEventListener("blur", () => setActiveIndex(void 0));
            _el$204.addEventListener("focus", () => setActiveIndex(index()));
            _el$204.$$click = () => setActiveIndex(index());
            _el$204.$$pointermove = (event) => {
              if (event.pointerType === "touch") return;
              setActiveIndex(index());
            };
            _el$204.addEventListener("pointerenter", () => setActiveIndex(index()));
            _el$204.$$pointerdown = (event) => {
              if (event.pointerType !== "touch") return;
              setActiveIndex(index());
            };
            createRenderEffect((_p$) => {
              var _v$29 = `${point.date} ${props.formatValue(props.value(point))} ${props.valueUnit}`, _v$30 = activeIndex() === index() ? "true" : void 0, _v$31 = highlightBars() && activeIndex() !== void 0 && activeIndex() !== index() ? "true" : void 0, _v$32 = {
                "--model-trend-token-height": modelUsageStripHeight(props.value(point), valueMax())
              };
              _v$29 !== _p$.e && setAttribute(_el$204, "aria-label", _p$.e = _v$29);
              _v$30 !== _p$.t && setAttribute(_el$204, "data-active", _p$.t = _v$30);
              _v$31 !== _p$.a && setAttribute(_el$204, "data-muted", _p$.a = _v$31);
              _p$.o = style(_el$204, _v$32, _p$.o);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            });
            runHydrationEvents();
            return _el$204;
          })()
        }));
        insert(_el$174, createComponent(Show, {
          get when() {
            return activeTooltip();
          },
          keyed: true,
          children: (active) => (() => {
            var _el$205 = getNextElement(_tmpl$33), _el$206 = _el$205.firstChild, _el$207 = _el$206.nextSibling, _el$209 = _el$207.firstChild, [_el$210, _co$43] = getNextMarker(_el$209.nextSibling), _el$208 = _el$210.nextSibling, _el$211 = _el$208.nextSibling, [_el$212, _co$44] = getNextMarker(_el$211.nextSibling), _el$213 = _el$207.nextSibling, _el$214 = _el$213.nextSibling, _el$215 = _el$214.firstChild, _el$216 = _el$215.firstChild, _el$217 = _el$216.nextSibling, _el$218 = _el$217.nextSibling, [_el$219, _co$45] = getNextMarker(_el$218.nextSibling), _el$220 = _el$215.nextSibling;
            insert(_el$206, () => formatModelUsageTooltipDate(active.point.date, props.data?.updatedAt ?? null));
            insert(_el$207, () => props.formatValue(props.value(active.point)), _el$210, _co$43);
            insert(_el$207, () => props.valueUnit, _el$212, _co$44);
            insert(_el$215, () => props.rowLabel, _el$219, _co$45);
            insert(_el$220, () => props.formatValue(props.value(active.point)));
            createRenderEffect((_p$) => {
              var _v$33 = active.index > usage().length * 0.62 ? "left" : "right", _v$34 = {
                "--model-trend-tooltip-left": `${active.bounds.x}%`,
                "--model-trend-tooltip-right": `${active.bounds.x + active.bounds.width}%`,
                "--model-trend-tooltip-y": `${active.tooltipY}`
              }, _v$35 = props.lineTone === "active" ? "users" : "tokens";
              _v$33 !== _p$.e && setAttribute(_el$205, "data-placement", _p$.e = _v$33);
              _p$.t = style(_el$205, _v$34, _p$.t);
              _v$35 !== _p$.a && setAttribute(_el$216, "data-kind", _p$.a = _v$35);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0
            });
            return _el$205;
          })()
        }), _el$181, _co$40);
        insert(_el$182, createComponent(For, {
          get each() {
            return monthTicks();
          },
          children: (tick) => (() => {
            var _el$221 = getNextElement(_tmpl$21);
            insert(_el$221, () => tick.label);
            createRenderEffect((_p$) => {
              var _v$36 = tick.align, _v$37 = {
                "--model-trend-month-left": `${tick.left}%`
              };
              _v$36 !== _p$.e && setAttribute(_el$221, "data-align", _p$.e = _v$36);
              _p$.t = style(_el$221, _v$37, _p$.t);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$221;
          })()
        }));
        createRenderEffect((_p$) => {
          var _v$13 = highlightBars() ? "true" : void 0, _v$14 = props.ariaLabel, _v$15 = {
            "--model-usage-count": usage().length
          };
          _v$13 !== _p$.e && setAttribute(_el$173, "data-highlight-bars", _p$.e = _v$13);
          _v$14 !== _p$.t && setAttribute(_el$173, "aria-label", _p$.t = _v$14);
          _p$.a = style(_el$173, _v$15, _p$.a);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$173;
      }
    }), _el$186, _co$42);
    createRenderEffect(() => setAttribute(_el$172, "id", props.id));
    return _el$172;
  })();
}
function ModelEfficiencySection(props) {
  const i18n = useI18n();
  return (() => {
    var _el$222 = getNextElement(_tmpl$34), _el$223 = _el$222.firstChild, [_el$224, _co$46] = getNextMarker(_el$223.nextSibling), _el$225 = _el$224.nextSibling, [_el$226, _co$47] = getNextMarker(_el$225.nextSibling);
    insert(_el$222, createComponent(SectionTitle, {
      href: "#efficiency",
      get title() {
        return i18n.t("nav.efficiency");
      },
      get description() {
        return i18n.t("model.efficiencyDescription");
      }
    }), _el$224, _co$46);
    insert(_el$222, createComponent(Show, {
      get when() {
        return props.data;
      },
      get fallback() {
        return createComponent(ModelEmptyState, {
          get title() {
            return i18n.t("model.noEfficiencyTitle");
          },
          get description() {
            return i18n.t("model.noEfficiencyDescription");
          }
        });
      },
      children: (data) => [getNextElement(_tmpl$35), (() => {
        var _el$228 = getNextElement(_tmpl$36), _el$229 = _el$228.firstChild, [_el$230, _co$48] = getNextMarker(_el$229.nextSibling), _el$231 = _el$230.nextSibling, [_el$232, _co$49] = getNextMarker(_el$231.nextSibling), _el$233 = _el$232.nextSibling, [_el$234, _co$50] = getNextMarker(_el$233.nextSibling), _el$235 = _el$234.nextSibling, [_el$236, _co$51] = getNextMarker(_el$235.nextSibling), _el$237 = _el$236.nextSibling, [_el$238, _co$52] = getNextMarker(_el$237.nextSibling), _el$239 = _el$238.nextSibling, [_el$240, _co$53] = getNextMarker(_el$239.nextSibling);
        insert(_el$228, createComponent(MetricCard, {
          get label() {
            return i18n.t("model.totalSpendLabel");
          },
          get value() {
            return formatMoney(data().totals.cost);
          }
        }), _el$230, _co$48);
        insert(_el$228, createComponent(MetricCard, {
          get label() {
            return i18n.t("model.costInput");
          },
          get value() {
            return formatCatalogUnitPrice(props.catalog?.cost?.input);
          }
        }), _el$232, _co$49);
        insert(_el$228, createComponent(MetricCard, {
          get label() {
            return i18n.t("model.costOutput");
          },
          get value() {
            return formatCatalogUnitPrice(props.catalog?.cost?.output);
          }
        }), _el$234, _co$50);
        insert(_el$228, createComponent(MetricCard, {
          get label() {
            return i18n.t("model.averageCostSession");
          },
          get value() {
            return formatSessionCost(data().totals.costPerSession);
          }
        }), _el$236, _co$51);
        insert(_el$228, createComponent(MetricCard, {
          get label() {
            return i18n.t("model.averageTokensSession");
          },
          get value() {
            return formatTokens(data().totals.tokensPerSession);
          }
        }), _el$238, _co$52);
        insert(_el$228, createComponent(MetricCard, {
          get label() {
            return i18n.t("model.cacheRatio");
          },
          get value() {
            return `${formatPercent(data().totals.cacheRatio)} ${i18n.t("model.inputTokens")}`;
          }
        }), _el$240, _co$53);
        return _el$228;
      })()]
    }), _el$226, _co$47);
    return _el$222;
  })();
}
function ModelGeoBreakdownSection(props) {
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
    var _el$241 = getNextElement(_tmpl$38), _el$250 = _el$241.firstChild, [_el$251, _co$57] = getNextMarker(_el$250.nextSibling), _el$252 = _el$251.nextSibling, [_el$253, _co$58] = getNextMarker(_el$252.nextSibling);
    _el$241.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      setActiveCountry(void 0);
    });
    insert(_el$241, createComponent(SectionTitle, {
      href: "#geo-breakdown",
      get title() {
        return i18n.t("nav.geoBreakdown");
      },
      get description() {
        return i18n.t("model.geoDescription");
      }
    }), _el$251, _co$57);
    insert(_el$241, createComponent(Show, {
      get when() {
        return data().length > 0;
      },
      get fallback() {
        return createComponent(ModelEmptyState, {
          get title() {
            return i18n.t("model.noGeoTitle");
          },
          get description() {
            return i18n.t("model.noGeoDescription");
          }
        });
      },
      get children() {
        var _el$242 = getNextElement(_tmpl$37), _el$243 = _el$242.firstChild, _el$244 = _el$243.firstChild, [_el$245, _co$54] = getNextMarker(_el$244.nextSibling), _el$246 = _el$245.nextSibling, [_el$247, _co$55] = getNextMarker(_el$246.nextSibling), _el$248 = _el$243.nextSibling, [_el$249, _co$56] = getNextMarker(_el$248.nextSibling);
        insert(_el$243, createComponent(GeoWorldMap, {
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
        }), _el$245, _co$54);
        insert(_el$243, createComponent(Show, {
          get when() {
            return active();
          },
          children: (country) => (() => {
            var _el$254 = getNextElement(_tmpl$39), _el$255 = _el$254.firstChild, _el$256 = _el$255.firstChild, _el$257 = _el$256.nextSibling, [_el$258, _co$59] = getNextMarker(_el$257.nextSibling), _el$259 = _el$255.nextSibling, _el$260 = _el$259.nextSibling, _el$261 = _el$260.firstChild, _el$262 = _el$261.nextSibling;
            insert(_el$255, () => String(country().rank).padStart(2, "0"), _el$258, _co$59);
            insert(_el$259, () => formatCountryName(country().country, language.tag(language.locale()), i18n));
            insert(_el$261, () => formatGeoTokens(country().tokens));
            insert(_el$262, () => formatGeoShare(country().share));
            return _el$254;
          })()
        }), _el$247, _co$55);
        insert(_el$242, createComponent(GeoCountryList, {
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
        }), _el$249, _co$56);
        return _el$242;
      }
    }), _el$253, _co$58);
    return _el$241;
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
    var _el$263 = getNextElement(_tmpl$40), _el$264 = _el$263.firstChild, _el$265 = _el$264.nextSibling, _el$266 = _el$265.nextSibling, _el$267 = _el$266.nextSibling;
    insert(_el$264, () => i18n.t("home.geoMapTitle"));
    insert(_el$265, createComponent(For, {
      each: worldCountryPaths,
      children: (country) => {
        const entry = () => props.countryById.get(country.id);
        return (() => {
          var _el$268 = getNextElement(_tmpl$41);
          _el$268.$$click = () => {
            const item = entry();
            if (!item) return;
            props.onActiveCountryChange(item.country);
          };
          _el$268.addEventListener("pointerenter", () => {
            const item = entry();
            if (!item) return;
            props.onActiveCountryChange(item.country);
          });
          createRenderEffect((_p$) => {
            var _v$38 = country.path, _v$39 = country.id, _v$40 = entry() ? "true" : void 0, _v$41 = entry()?.country === props.activeCountry ? "true" : void 0, _v$42 = {
              "--geo-country-opacity": String(countryOpacity(entry()))
            };
            _v$38 !== _p$.e && setAttribute(_el$268, "d", _p$.e = _v$38);
            _v$39 !== _p$.t && setAttribute(_el$268, "data-country-id", _p$.t = _v$39);
            _v$40 !== _p$.a && setAttribute(_el$268, "data-has-data", _p$.a = _v$40);
            _v$41 !== _p$.o && setAttribute(_el$268, "data-active", _p$.o = _v$41);
            _p$.i = style(_el$268, _v$42, _p$.i);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          });
          runHydrationEvents();
          return _el$268;
        })();
      }
    }));
    insert(_el$266, createComponent(For, {
      each: worldCountryPaths,
      children: (country) => {
        const entry = () => props.countryById.get(country.id);
        return createComponent(Show, {
          get when() {
            return memo(() => !!(country.marker && entry()))() ? country.marker : void 0;
          },
          children: (marker) => (() => {
            var _el$269 = getNextElement(_tmpl$42);
            _el$269.$$click = () => {
              const item = entry();
              if (!item) return;
              props.onActiveCountryChange(item.country);
            };
            _el$269.addEventListener("pointerenter", () => {
              const item = entry();
              if (!item) return;
              props.onActiveCountryChange(item.country);
            });
            createRenderEffect((_p$) => {
              var _v$43 = marker().x, _v$44 = marker().y, _v$45 = entry()?.country === props.activeCountry ? 3.4 : 2.4, _v$46 = entry()?.country === props.activeCountry ? "true" : void 0, _v$47 = {
                "--geo-country-opacity": String(countryOpacity(entry()))
              };
              _v$43 !== _p$.e && setAttribute(_el$269, "cx", _p$.e = _v$43);
              _v$44 !== _p$.t && setAttribute(_el$269, "cy", _p$.t = _v$44);
              _v$45 !== _p$.a && setAttribute(_el$269, "r", _p$.a = _v$45);
              _v$46 !== _p$.o && setAttribute(_el$269, "data-active", _p$.o = _v$46);
              _p$.i = style(_el$269, _v$47, _p$.i);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0,
              i: void 0
            });
            runHydrationEvents();
            return _el$269;
          })()
        });
      }
    }));
    setAttribute(_el$267, "d", worldBorderPath);
    createRenderEffect(() => setAttribute(_el$263, "aria-label", i18n.t("model.worldMap")));
    return _el$263;
  })();
}
function GeoCountryList(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const opacityScale = createMemo(() => sqrt().domain([0, props.maxTokens]).range([0.26, 0.96]).clamp(true));
  return (() => {
    var _el$270 = getNextElement(_tmpl$43);
    insert(_el$270, createComponent(For, {
      get each() {
        return props.data;
      },
      children: (country) => (() => {
        var _el$271 = getNextElement(_tmpl$44), _el$272 = _el$271.firstChild, _el$273 = _el$272.firstChild, _el$274 = _el$273.nextSibling, _el$275 = _el$274.nextSibling, _el$276 = _el$275.nextSibling, _el$277 = _el$276.nextSibling;
        _el$272.addEventListener("focus", () => props.onActiveCountryChange(country.country));
        _el$272.addEventListener("pointerenter", () => props.onActiveCountryChange(country.country));
        _el$272.$$click = () => props.onActiveCountryChange(country.country);
        insert(_el$273, () => String(country.rank).padStart(2, "0"));
        insert(_el$275, () => formatCountryName(country.country, language.tag(language.locale()), i18n));
        insert(_el$276, () => formatGeoTokens(country.tokens));
        insert(_el$277, () => formatGeoShare(country.share));
        createRenderEffect((_p$) => {
          var _v$48 = props.activeCountry === country.country ? "true" : void 0, _v$49 = {
            "--geo-row-opacity": String(opacityScale()(country.tokens))
          }, _v$50 = `${formatCountryName(country.country, language.tag(language.locale()), i18n)} ${formatGeoTokens(country.tokens)} ${formatGeoShare(country.share)}`;
          _v$48 !== _p$.e && setAttribute(_el$272, "data-active", _p$.e = _v$48);
          _p$.t = style(_el$272, _v$49, _p$.t);
          _v$50 !== _p$.a && setAttribute(_el$272, "aria-label", _p$.a = _v$50);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        runHydrationEvents();
        return _el$271;
      })()
    }));
    return _el$270;
  })();
}
function ModelPeersSection(props) {
  const i18n = useI18n();
  return (() => {
    var _el$278 = getNextElement(_tmpl$46), _el$280 = _el$278.firstChild, [_el$281, _co$60] = getNextMarker(_el$280.nextSibling), _el$282 = _el$281.nextSibling, [_el$283, _co$61] = getNextMarker(_el$282.nextSibling);
    insert(_el$278, createComponent(SectionTitle, {
      href: "#peers",
      get title() {
        return i18n.t("nav.peers");
      },
      get description() {
        return i18n.t("model.peersDescription");
      }
    }), _el$281, _co$60);
    insert(_el$278, createComponent(Show, {
      get when() {
        return props.data?.peers.length;
      },
      get fallback() {
        return createComponent(ModelEmptyState, {
          get title() {
            return i18n.t("model.noPeersTitle");
          },
          get description() {
            return i18n.t("model.noPeersDescription");
          }
        });
      },
      get children() {
        var _el$279 = getNextElement(_tmpl$45);
        insert(_el$279, createComponent(For, {
          get each() {
            return props.data?.peers ?? [];
          },
          children: (peer) => createComponent(PeerRow, {
            peer,
            get active() {
              return peer.model === props.data?.model;
            }
          })
        }));
        return _el$279;
      }
    }), _el$283, _co$61);
    return _el$278;
  })();
}
function MetricCard(props) {
  return (() => {
    var _el$284 = getNextElement(_tmpl$47), _el$285 = _el$284.firstChild, _el$286 = _el$285.nextSibling, _el$287 = _el$286.nextSibling, [_el$288, _co$62] = getNextMarker(_el$287.nextSibling);
    insert(_el$285, () => props.label);
    insert(_el$286, () => props.value);
    insert(_el$284, createComponent(Show, {
      get when() {
        return props.detail;
      },
      children: (detail) => (() => {
        var _el$289 = getNextElement(_tmpl$48);
        insert(_el$289, detail);
        return _el$289;
      })()
    }), _el$288, _co$62);
    createRenderEffect(() => setAttribute(_el$284, "data-state", props.state));
    return _el$284;
  })();
}
function PeerRow(props) {
  const language = useLanguage();
  return (() => {
    var _el$290 = getNextElement(_tmpl$49), _el$291 = _el$290.firstChild, _el$292 = _el$291.firstChild, _el$293 = _el$292.nextSibling, _el$294 = _el$293.nextSibling, _el$295 = _el$294.firstChild, _el$296 = _el$295.nextSibling, _el$297 = _el$294.nextSibling;
    insert(_el$292, createComponent(Show, {
      get when() {
        return !props.active;
      },
      get children() {
        return String(props.peer.rank).padStart(2, "0");
      }
    }));
    insert(_el$293, createComponent(ProviderIcon, {
      "aria-hidden": "true",
      get id() {
        return getProviderIconId(props.peer.author);
      }
    }));
    insert(_el$295, () => props.peer.model);
    insert(_el$296, () => props.peer.author);
    insert(_el$297, () => formatTokens(props.peer.tokens));
    createRenderEffect((_p$) => {
      var _v$51 = language.route(`${"/data/"}${providerSlug(props.peer.provider)}/${props.peer.slug}`), _v$52 = props.active ? "true" : void 0, _v$53 = props.active ? `Rank ${props.peer.rank}` : void 0;
      _v$51 !== _p$.e && setAttribute(_el$291, "href", _p$.e = _v$51);
      _v$52 !== _p$.t && setAttribute(_el$291, "data-active", _p$.t = _v$52);
      _v$53 !== _p$.a && setAttribute(_el$292, "aria-label", _p$.a = _v$53);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$290;
  })();
}
function SectionTitle(props) {
  return createComponent(SectionHeading, {
    get href() {
      return props.href;
    },
    get title() {
      return props.title;
    },
    get description() {
      return props.description;
    }
  });
}
function ModelEmptyState(props) {
  return (() => {
    var _el$298 = getNextElement(_tmpl$50), _el$299 = _el$298.firstChild, _el$300 = _el$299.nextSibling;
    insert(_el$299, () => props.title);
    insert(_el$300, () => props.description);
    createRenderEffect(() => setAttribute(_el$298, "data-compact", props.compact ? "true" : void 0));
    return _el$298;
  })();
}
function modelComparisonPairs(catalog, catalogEntry, data) {
  const current = modelComparisonRef(catalogEntry, data);
  if (!current) return [];
  const peerPairs = (data?.peers ?? []).filter((peer) => peer.model !== data?.model).slice(0, 3).map((peer) => ({
    first: current,
    second: {
      name: peer.model,
      lab: peer.provider,
      slug: peer.slug,
      labName: peer.author,
      metric: `#${peer.rank} / ${formatTokens(peer.tokens)}`
    },
    detail: "Usage peer"
  }));
  const catalogPairs = (catalogEntry && catalog ? catalog.labs.find((lab) => lab.id === catalogEntry.lab)?.models ?? [] : []).filter((model) => model.id !== catalogEntry?.id).slice(0, 3).map((model) => ({
    first: current,
    second: modelRefFromCatalog(model),
    detail: "Same lab pair"
  }));
  return uniqueComparisonPairs([...peerPairs, ...catalogPairs]);
}
function modelComparisonRef(catalogEntry, data) {
  if (catalogEntry) return modelRefFromCatalog(catalogEntry);
  if (!data) return void 0;
  return {
    name: data.model,
    lab: data.provider,
    slug: data.slug,
    labName: data.author,
    metric: `#${data.rank}`
  };
}
function getProviderIconId(author) {
  if (author === "MiniMax") return "minimax";
  if (author === "Moonshot") return "moonshotai";
  if (author === "Zhipu") return "zhipuai";
  return author.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function emptyCountryRecord() {
  return {
    "1D": [],
    "1W": [],
    "2W": [],
    "1M": [],
    "2M": [],
    "3M": [],
    YTD: [],
    ALL: []
  };
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
function formatCountryName(country, locale, i18n) {
  const code = country.toUpperCase();
  if (code === "ZZ") return i18n.t("home.unknown");
  if (!countryNumericId(code)) return code;
  return new Intl.DisplayNames([locale], {
    type: "region"
  }).of(code) ?? code;
}
function formatGeoTokens(value) {
  return formatTokens(value * 1e12);
}
function formatGeoShare(value) {
  return `${value.toFixed(value > 0 && value < 1 ? 1 : 0)}%`;
}
function momentumChart(data, updatedAt) {
  const fallbackDate = updatedAt ? formatMomentumDateLabel(updatedAt) : "JAN 1";
  const points = data.length > 1 ? data : [data[0] ?? emptyUsagePoint(fallbackDate), data[0] ?? emptyUsagePoint(fallbackDate)];
  const max = Math.max(1, ...points.map((point) => point.tokens));
  const split = Math.max(1, Math.floor((points.length - 1) / 2));
  const coordinates = points.map((point, index) => ({
    date: point.date,
    tokens: point.tokens,
    x: index / Math.max(1, points.length - 1) * 1200,
    y: 364 - point.tokens / max * 364
  }));
  const end = coordinates[coordinates.length - 1];
  return {
    startDate: coordinates[0].date,
    endDate: end.date,
    previousPath: smoothLinePath(coordinates.slice(0, split + 1)),
    currentPath: smoothLinePath(coordinates.slice(split)),
    markers: [{
      ...coordinates[0],
      active: false
    }, {
      ...coordinates[split],
      active: true
    }, {
      ...end,
      active: true
    }],
    endStyle: {
      "--momentum-end-x": `${Math.min(94, Math.max(0, (end.x + 8) / 1200 * 100))}%`,
      "--momentum-end-y": `${Math.min(96, Math.max(0, (end.y - 7) / 370 * 100))}%`
    }
  };
}
function emptyUsagePoint(date) {
  return {
    date,
    tokens: 0,
    users: 0,
    sessions: 0,
    cost: 0
  };
}
function smoothLinePath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${formatSparklinePoint(points[0].x)} ${formatSparklinePoint(points[0].y)}`;
  return points.map((point, index) => {
    if (index === 0) return `M${formatSparklinePoint(point.x)} ${formatSparklinePoint(point.y)}`;
    const previous = points[index - 1];
    const next = points[index + 1] ?? point;
    const beforePrevious = points[index - 2] ?? previous;
    const controlStart = {
      x: previous.x + (point.x - beforePrevious.x) / 6,
      y: previous.y + (point.y - beforePrevious.y) / 6
    };
    const controlEnd = {
      x: point.x - (next.x - previous.x) / 6,
      y: point.y - (next.y - previous.y) / 6
    };
    return `C${formatSparklinePoint(controlStart.x)} ${formatSparklinePoint(controlStart.y)} ${formatSparklinePoint(controlEnd.x)} ${formatSparklinePoint(controlEnd.y)} ${formatSparklinePoint(point.x)} ${formatSparklinePoint(point.y)}`;
  }).join(" ");
}
function momentumMonthLabels(startDate, locale, updatedAt) {
  const start = parseMomentumDate(startDate, updatedAt);
  const first = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 1, 1));
  return Array.from({
    length: 5
  }, (_, index) => {
    const date = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + index, 1));
    return {
      label: new Intl.DateTimeFormat(locale, {
        month: "short",
        timeZone: "UTC"
      }).format(date).toUpperCase(),
      x: index === 4 ? 98 : index * 24.5
    };
  });
}
function formatMomentumDate(date, locale, updatedAt) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(parseMomentumDate(date, updatedAt)).toUpperCase();
}
function parseMomentumDate(date, updatedAt) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (iso) return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
  const label = /^([A-Za-z]{3})\s+(\d{1,2})$/.exec(date.trim());
  const month = label ? shortMonths.findIndex((item) => item.toLowerCase() === label[1].toLowerCase()) : -1;
  if (!label || month < 0) return new Date(Date.UTC(1970, 0, 1));
  const anchor = updatedAt ? parseMomentumDate(updatedAt, null) : new Date(Date.UTC(1970, 0, 1));
  const year = month > anchor.getUTCMonth() + 1 ? anchor.getUTCFullYear() - 1 : anchor.getUTCFullYear();
  return new Date(Date.UTC(year, month, Number(label[2])));
}
function formatMomentumDateLabel(date) {
  const parsed = parseMomentumDate(date, null);
  if (parsed.getUTCFullYear() === 1970) return "JAN 1";
  return `${shortMonths[parsed.getUTCMonth()]} ${parsed.getUTCDate()}`;
}
function modelUsageStripHeight(value, max) {
  if (value <= 0 || max <= 0) return "0px";
  return `max(2px, ${value / max * 100}%)`;
}
function modelUsageLineY(value, max) {
  if (value <= 0 || max <= 0) return 100;
  return Math.max(0, 100 - value / max * 100);
}
function modelUsagePointX(index, count) {
  if (count <= 1) return 50;
  return (index + 0.5) / count * 100;
}
function modelUsageColumnBounds(index, count) {
  if (count <= 0) return {
    x: 0,
    width: 100
  };
  return {
    x: index / count * 100,
    width: 100 / count
  };
}
function modelUsageColumnInnerBounds(index, count) {
  const bounds = modelUsageColumnBounds(index, count);
  const inset = Math.min(bounds.width * 0.1, 0.24);
  return {
    x: bounds.x + inset,
    width: Math.max(1e-3, bounds.width - inset * 2)
  };
}
function modelUsageLinePath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${formatUsagePathNumber(points[0].x)} ${formatUsagePathNumber(points[0].y)}`;
  return points.slice(0, -1).reduce((path, point, index) => {
    const next = points[index + 1];
    const previous = points[index - 1] ?? point;
    const afterNext = points[index + 2] ?? next;
    const controlA = {
      x: point.x + (next.x - previous.x) / 6,
      y: clampUsagePercent(point.y + (next.y - previous.y) / 6)
    };
    const controlB = {
      x: next.x - (afterNext.x - point.x) / 6,
      y: clampUsagePercent(next.y - (afterNext.y - point.y) / 6)
    };
    return `${path} C ${formatUsagePathNumber(controlA.x)} ${formatUsagePathNumber(controlA.y)}, ${formatUsagePathNumber(controlB.x)} ${formatUsagePathNumber(controlB.y)}, ${formatUsagePathNumber(next.x)} ${formatUsagePathNumber(next.y)}`;
  }, `M ${formatUsagePathNumber(points[0].x)} ${formatUsagePathNumber(points[0].y)}`);
}
function modelUsageAreaPath(points, bottom) {
  const path = modelUsageLinePath(points);
  if (!path || points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${path} L ${formatUsagePathNumber(last.x)} ${formatUsagePathNumber(bottom)} L ${formatUsagePathNumber(first.x)} ${formatUsagePathNumber(bottom)} Z`;
}
function formatUsagePathNumber(value) {
  return Number(value.toFixed(3));
}
function clampUsagePercent(value) {
  return Math.max(0, Math.min(100, value));
}
function modelUsageMonthTicks(points, updatedAt) {
  const seen = /* @__PURE__ */ new Set();
  return points.flatMap((point, index) => {
    const parsed = parseMomentumDate(point.date, updatedAt);
    const label = shortMonths[parsed.getUTCMonth()];
    if (!label || seen.has(label)) return [];
    seen.add(label);
    return [{
      label,
      left: modelUsagePointX(index, points.length),
      align: index === 0 ? "start" : index >= points.length - 2 ? "end" : "center"
    }];
  });
}
function formatModelUsageTooltipDate(value, updatedAt) {
  const date = parseMomentumDate(value, updatedAt);
  if (date.getUTCFullYear() === 1970) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}
function formatRankLabel(rank) {
  if (rank === null) return "--";
  return `#${String(rank).padStart(2, "0")}`;
}
function capitalizeLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function formatHeroRank(rank) {
  if (rank === null) return "--";
  return String(rank).padStart(2, "0");
}
function sparklineLinePath(values) {
  return sparklinePoints(values).map((point, index) => `${index === 0 ? "M" : "L"}${formatSparklinePoint(point.x)} ${formatSparklinePoint(point.y)}`).join(" ");
}
function sparklineAreaPath(values) {
  const points = sparklinePoints(values);
  return `M${formatSparklinePoint(points[0].x)} 18 ${points.map((point) => `L${formatSparklinePoint(point.x)} ${formatSparklinePoint(point.y)}`).join(" ")} L${formatSparklinePoint(points[points.length - 1].x)} 18 Z`;
}
function sparklinePoints(values) {
  const normalized = values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0];
  const min = Math.min(...normalized);
  const max = Math.max(...normalized);
  return normalized.map((value, index) => ({
    x: 8 + index / Math.max(1, normalized.length - 1) * 20,
    y: min === max ? 12 : 18 - (value - min) / (max - min) * 12
  }));
}
function formatSparklinePoint(value) {
  return Number(value.toFixed(2)).toString();
}
function formatTokens(value) {
  if (value >= 1e12) return `${trimNumber(value / 1e12, value >= 1e13 ? 0 : 1)}T`;
  if (value >= 1e9) return `${trimNumber(value / 1e9, value >= 1e10 ? 0 : 1)}B`;
  if (value >= 1e6) return `${trimNumber(value / 1e6, value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `${trimNumber(value / 1e3, value >= 1e4 ? 0 : 1)}K`;
  return String(Math.round(value));
}
function formatCatalogLimit(value, unknown) {
  return value === void 0 ? unknown : formatTokens(value);
}
function formatCatalogMonth(value, locale, unknown) {
  if (!value) return unknown;
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);
  if (!match) return value;
  return new Intl.DateTimeFormat(locale, {
    month: match[2] ? "short" : void 0,
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(Number(match[1]), match[2] ? Number(match[2]) - 1 : 0, 1)));
}
function formatCatalogModalities(values, locale, unknown) {
  if (values.length === 0) return unknown;
  const labels = values.map((value) => value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()));
  if (labels.length === 1) return labels[0] ?? unknown;
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction"
  }).format(labels);
}
function formatInteger(value) {
  return new Intl.NumberFormat("en").format(value);
}
function formatUsers(value) {
  if (value >= 1e6) return `${trimNumber(value / 1e6, value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `${trimNumber(value / 1e3, value >= 1e4 ? 0 : 1)}K`;
  return formatInteger(Math.round(value));
}
function formatPercent(value) {
  return `${value.toFixed(value > 0 && value < 10 ? 1 : 0)}%`;
}
function formatMoney(value) {
  if (value >= 1e6) return `$${trimNumber(value / 1e6, value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `$${trimNumber(value / 1e3, value >= 1e4 ? 0 : 1)}K`;
  return `$${value.toFixed(value >= 10 ? 0 : 2)}`;
}
function formatCatalogUnitPrice(value) {
  if (value === void 0) return "-";
  return `${formatModelPrice(value)} / 1M`;
}
function formatModelPrice(value) {
  if (value > 0 && value < 0.01) return `$${value.toFixed(4)}`;
  return formatMoney(value);
}
function formatSessionCost(value) {
  return `$${value.toFixed(value > 0 && value < 0.01 ? 4 : 2)}`;
}
function formatChange(value) {
  if (value > 0) return `+${value}%`;
  return `${value}%`;
}
function trimNumber(value, digits) {
  return Number(value.toFixed(digits)).toLocaleString("en");
}
function providerSlug(provider) {
  return provider.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}
delegateEvents(["pointerdown", "pointermove", "click", "keydown"]);
export {
  StatsModel as default
};
