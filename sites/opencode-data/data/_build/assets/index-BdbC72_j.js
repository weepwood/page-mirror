import { ab as useI18n, ac as useLanguage, ae as useParams, m as createMemo, s as createSignal, J as localizedUrl, V as onMount, y as getNextElement, z as getNextMarker, C as insert, k as createComponent, n as createRenderEffect, a8 as template, u as delegateEvents, T as Title, M as Meta, S as Show, Z as setAttribute, F as For, K as memo, t as createUniqueId, a6 as style, X as runHydrationEvents } from "./i18n-DJbnCyo8.js";
import { d as createAsync, e as createServerReference, q as query, j as getModelCatalog, g as findModelCatalogLab, i as getGitHubStars, h as formatCatalogLabName, t as themeStorageKey, a as applyThemePreference, l as isThemePreference, H as Header, C as ComparisonCardsSection, F as Footer, m as modelRefFromCatalog, u as uniqueComparisonPairs, c as catalogSlug } from "./stats-shell-D85bQNDr.js";
import { L as LocaleLinks, P as ProviderIcon } from "./locale-links-hcqm6Rft.js";
import { S as SectionHeading } from "./section-heading-C1DHUbGf.js";
var _tmpl$ = /* @__PURE__ */ template(`<main data-page=stats><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><div data-component=container><div data-component=content></div><!$><!/>`), _tmpl$2 = /* @__PURE__ */ template(`<section id=overview data-section=lab-hero><!$><!/><!$><!/>`), _tmpl$3 = /* @__PURE__ */ template(`<section id=overview data-section=lab-hero><!$><!/><!$><!/><p data-slot=lab-hero-state>`), _tmpl$4 = /* @__PURE__ */ template(`<details data-component=lab-hero-menu><summary data-slot=lab-hero-crumb data-current=true aria-current=page><span></span><svg width=16 height=16 viewBox="0 0 16 16"aria-hidden=true><path d="M4.75 6.25L8 9.5L11.25 6.25"fill=none stroke=currentColor stroke-width=1.5></path></svg></summary><div data-slot=lab-hero-options>`), _tmpl$5 = /* @__PURE__ */ template(`<nav data-component=lab-hero-breadcrumb aria-label="Data breadcrumb"><a data-slot=lab-hero-crumb>Data</a><span data-slot=lab-hero-separator>/</span><!$><!/>`), _tmpl$6 = /* @__PURE__ */ template(`<span data-slot=lab-hero-crumb data-current=true aria-current=page><span></span><svg width=16 height=16 viewBox="0 0 16 16"aria-hidden=true><path d="M4.75 6.25L8 9.5L11.25 6.25"fill=none stroke=currentColor stroke-width=1.5>`), _tmpl$7 = /* @__PURE__ */ template(`<a data-slot=lab-hero-option>`), _tmpl$8 = /* @__PURE__ */ template(`<div data-slot=lab-hero-title-row><span data-slot=lab-hero-avatar></span><h1></h1><div data-slot=lab-hero-pattern aria-hidden=true>`), _tmpl$9 = /* @__PURE__ */ template(`<section data-section=lab-overview><div data-slot=lab-overview-copy><!$><!/><p><!$><!/><!$><!/>. <!$><!/></p></div><!$><!/><!$><!/>`), _tmpl$0 = /* @__PURE__ */ template(`<article data-component=lab-overview-metric><span></span><strong>`), _tmpl$1 = /* @__PURE__ */ template(`<div data-component=model-usage-chart data-variant=lab-usage role=img><div data-slot=lab-usage-plot><!$><!/><div data-slot=lab-usage-bars></div><!$><!/></div><div data-slot=lab-usage-months aria-hidden=true>`), _tmpl$10 = /* @__PURE__ */ template(`<section id=usage data-section=model-panel><!$><!/><!$><!/>`), _tmpl$11 = /* @__PURE__ */ template(`<svg data-slot=lab-usage-line data-layer=base viewBox="0 0 100 100"preserveAspectRatio=none aria-hidden=true>`), _tmpl$12 = /* @__PURE__ */ template(`<svg><path data-slot=lab-usage-line-base></svg>`, false, true, false), _tmpl$13 = /* @__PURE__ */ template(`<svg><defs><mask maskUnits=userSpaceOnUse><rect x=0 y=-2 width=100 height=104 fill=white></rect><rect y=-2 height=104 fill=black></svg>`, false, true, false), _tmpl$14 = /* @__PURE__ */ template(`<svg data-slot=lab-usage-line data-layer=active viewBox="0 0 100 100"preserveAspectRatio=none aria-hidden=true><defs><clipPath clipPathUnits=userSpaceOnUse><rect y=-2 height=104></rect></clipPath></defs><path data-slot=lab-usage-line-active>`), _tmpl$15 = /* @__PURE__ */ template(`<div data-slot=lab-usage-column role=button tabindex=0><div data-slot=lab-usage-token-bar>`), _tmpl$16 = /* @__PURE__ */ template(`<div data-component=chart-tooltip><strong></strong><span><!$><!/> <!$><!/></span><div data-slot=tooltip-divider></div><p><span data-slot=tooltip-label><i data-kind=tokens></i> <!$><!/></span><b></b></p><p><span data-slot=tooltip-label><i data-kind=users></i> <!$><!/></span><b>`), _tmpl$17 = /* @__PURE__ */ template(`<span>`), _tmpl$18 = /* @__PURE__ */ template(`<section id=models data-section=model-panel data-variant=lab-models><div data-slot=lab-model-heading><!$><!/><button data-slot=lab-model-compare type=button aria-label="Compare models"hidden><span data-slot=lab-model-compare-icon aria-hidden=true></span><span>Compare</span></button></div><div data-slot=lab-model-pattern aria-hidden=true></div><div data-component=lab-model-table role=table><div data-slot=lab-model-table-track><div data-slot=lab-model-table-head role=row><span data-column=model role=columnheader></span><span data-column=usage role=columnheader></span><span data-column=share role=columnheader></span><span data-column=context role=columnheader></span><span data-column=output role=columnheader></span><span data-column=release role=columnheader></span></div><!$><!/></div></div><!$><!/>`), _tmpl$19 = /* @__PURE__ */ template(`<a data-component=lab-model-row role=row><span data-slot=lab-model-cell data-column=model role=cell><span data-slot=lab-model-avatar aria-hidden=true></span><strong></strong></span><span data-slot=lab-model-cell data-column=usage role=cell></span><span data-slot=lab-model-cell data-column=share role=cell></span><span data-slot=lab-model-cell data-column=context role=cell></span><span data-slot=lab-model-cell data-column=output role=cell></span><span data-slot=lab-model-cell data-column=release role=cell>`), _tmpl$20 = /* @__PURE__ */ template(`<div data-component=lab-model-tooltip><div data-slot=lab-model-tooltip-summary><div data-slot=lab-model-tooltip-head><span data-slot=lab-model-tooltip-avatar aria-hidden=true></span><strong></strong></div><p></p></div><div data-slot=tooltip-divider></div><div data-slot=lab-model-tooltip-metrics><p><span></span><b></b></p><p><span></span><b></b></p><p><span></span><b></b></p><p><span></span><b>`), _tmpl$21 = /* @__PURE__ */ template(`<section id=related-labs data-section=model-panel data-variant=lab-related><!$><!/><div data-component=lab-related-list>`), _tmpl$22 = /* @__PURE__ */ template(`<a data-component=lab-related-card><!$><!/><div data-slot=lab-related-heading><span data-slot=lab-related-avatar aria-hidden=true></span><strong></strong></div><p data-slot=lab-related-copy></p><p data-slot=lab-related-models></p><div data-slot=lab-related-divider></div><div data-slot=lab-related-usage><span>Used by <!$><!/></span><i aria-hidden=true>`), _tmpl$23 = /* @__PURE__ */ template(`<b>`), _tmpl$24 = /* @__PURE__ */ template(`<div data-component=empty-state data-compact=true><strong></strong><p>`);
const statsUnfurlPath = "banner.png";
const getLabData_query = createServerReference("31b993f55cb3d1f4539ab6efe4d32d6b67b069e91c483fe9b4c58a7d472e3c7e");
const getLabData = query(getLabData_query, "getStatsLabData");
const getHomeData_query = createServerReference("72f3839249c4ff80724cc04835d1a0163c1dbd877d9b7b9368e86db61051cd87");
const getHomeData = query(getHomeData_query, "getStatsHomeData");
function StatsLab() {
  const i18n = useI18n();
  const language = useLanguage();
  const params = useParams();
  const labParam = createMemo(() => params.lab ?? "");
  const catalog = createAsync(() => getModelCatalog());
  const lab = createMemo(() => {
    const data = catalog();
    if (!data) return void 0;
    return findModelCatalogLab(data, labParam()) ?? null;
  });
  const stats = createAsync(() => {
    const entry = lab();
    if (catalog() === void 0 || entry === void 0) return Promise.resolve(void 0);
    if (!entry) return Promise.resolve(null);
    return getLabData(entry.id);
  });
  const homeStats = createAsync(() => getHomeData());
  const githubStars = createAsync(() => getGitHubStars());
  const [themePreference, setThemePreference] = createSignal("system");
  const labName = createMemo(() => lab()?.name ?? formatCatalogLabName(labParam()));
  const labTitle = createMemo(() => i18n.t("lab.title", {
    lab: labName()
  }));
  const labDescription = createMemo(() => i18n.t("lab.description", {
    lab: labName()
  }));
  const labPath = createMemo(() => `/data/${lab()?.id ?? labParam()}`);
  const labUrl = createMemo(() => localizedUrl(language.locale(), labPath()));
  const statsUnfurlUrl = new URL(statsUnfurlPath, localizedUrl("en", "/data/")).toString();
  const labHeaderLinks = createMemo(() => [{
    href: "#overview",
    label: i18n.t("nav.overview")
  }, {
    href: "#usage",
    label: i18n.t("nav.usage")
  }, {
    href: "#models",
    label: i18n.t("nav.models")
  }]);
  const labFooterLinks = createMemo(() => [{
    href: "/data/",
    label: i18n.t("nav.dataHome")
  }, {
    href: `${"/data/"}#top-models`,
    label: i18n.t("nav.topModels")
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
        return labTitle();
      }
    }), _el$7, _co$2);
    insert(_el$, createComponent(Meta, {
      name: "description",
      get content() {
        return labDescription();
      }
    }), _el$9, _co$3);
    insert(_el$, createComponent(LocaleLinks, {
      get path() {
        return labPath();
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
        return labTitle();
      }
    }), _el$15, _co$7);
    insert(_el$, createComponent(Meta, {
      property: "og:description",
      get content() {
        return labDescription();
      }
    }), _el$17, _co$8);
    insert(_el$, createComponent(Meta, {
      property: "og:url",
      get content() {
        return labUrl();
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
        return labTitle();
      }
    }), _el$33, _co$14);
    insert(_el$, createComponent(Meta, {
      name: "twitter:description",
      get content() {
        return labDescription();
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
        return labHeaderLinks();
      },
      get brandHref() {
        return "/data/";
      }
    }), _el$41, _co$18);
    insert(_el$3, createComponent(Show, {
      get when() {
        return catalog() !== void 0;
      },
      get fallback() {
        return createComponent(LabLoading, {});
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return lab();
          },
          get fallback() {
            return createComponent(LabNotFound, {
              get lab() {
                return labParam();
              },
              get labs() {
                return catalog()?.labs ?? [];
              }
            });
          },
          children: (data) => [createComponent(LabHero, {
            get lab() {
              return data();
            },
            get labs() {
              return catalog()?.labs ?? [];
            }
          }), createComponent(LabOverview, {
            get lab() {
              return data();
            },
            get data() {
              return stats() ?? null;
            }
          }), createComponent(LabUsageSection, {
            get lab() {
              return data();
            },
            get data() {
              return stats() ?? null;
            }
          }), createComponent(LabModelsSection, {
            get lab() {
              return data();
            },
            get usage() {
              return stats()?.models ?? [];
            }
          }), createComponent(LabRelatedSection, {
            get lab() {
              return data();
            },
            get labs() {
              return catalog()?.labs ?? [];
            },
            get market() {
              return homeStats()?.market["2M"] ?? [];
            }
          }), createComponent(ComparisonCardsSection, {
            get pairs() {
              return labComparisonPairs(data(), stats()?.models ?? []);
            },
            get title() {
              return `${data().name} Model Comparisons`;
            },
            description: "Model pairs from this lab."
          })]
        });
      }
    }));
    insert(_el$2, createComponent(Footer, {
      get themePreference() {
        return themePreference();
      },
      onThemePreferenceChange: updateThemePreference,
      get links() {
        return labFooterLinks();
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
function LabLoading() {
  const i18n = useI18n();
  return (() => {
    var _el$42 = getNextElement(_tmpl$2), _el$43 = _el$42.firstChild, [_el$44, _co$19] = getNextMarker(_el$43.nextSibling), _el$45 = _el$44.nextSibling, [_el$46, _co$20] = getNextMarker(_el$45.nextSibling);
    insert(_el$42, createComponent(LabHeroBreadcrumb, {
      get label() {
        return i18n.t("lab.loadingTitle");
      }
    }), _el$44, _co$19);
    insert(_el$42, createComponent(LabHeroTitleRow, {
      get label() {
        return i18n.t("lab.loadingTitle");
      }
    }), _el$46, _co$20);
    return _el$42;
  })();
}
function LabNotFound(props) {
  const i18n = useI18n();
  const labName = () => formatCatalogLabName(props.lab);
  return (() => {
    var _el$47 = getNextElement(_tmpl$3), _el$49 = _el$47.firstChild, [_el$50, _co$21] = getNextMarker(_el$49.nextSibling), _el$51 = _el$50.nextSibling, [_el$52, _co$22] = getNextMarker(_el$51.nextSibling), _el$48 = _el$52.nextSibling;
    insert(_el$47, createComponent(LabHeroBreadcrumb, {
      get label() {
        return labName();
      },
      get labs() {
        return props.labs;
      }
    }), _el$50, _co$21);
    insert(_el$47, createComponent(LabHeroTitleRow, {
      get label() {
        return labName();
      }
    }), _el$52, _co$22);
    insert(_el$48, () => i18n.t("lab.notFound"));
    return _el$47;
  })();
}
function LabHero(props) {
  return (() => {
    var _el$53 = getNextElement(_tmpl$2), _el$54 = _el$53.firstChild, [_el$55, _co$23] = getNextMarker(_el$54.nextSibling), _el$56 = _el$55.nextSibling, [_el$57, _co$24] = getNextMarker(_el$56.nextSibling);
    insert(_el$53, createComponent(LabHeroBreadcrumb, {
      get label() {
        return props.lab.name;
      },
      get labs() {
        return props.labs;
      }
    }), _el$55, _co$23);
    insert(_el$53, createComponent(LabHeroTitleRow, {
      get icon() {
        return props.lab.id;
      },
      get label() {
        return props.lab.name;
      }
    }), _el$57, _co$24);
    return _el$53;
  })();
}
function LabHeroBreadcrumb(props) {
  const language = useLanguage();
  const labs = () => props.labs ?? [];
  return (() => {
    var _el$58 = getNextElement(_tmpl$5), _el$59 = _el$58.firstChild, _el$60 = _el$59.nextSibling, _el$65 = _el$60.nextSibling, [_el$66, _co$25] = getNextMarker(_el$65.nextSibling);
    insert(_el$58, createComponent(Show, {
      get when() {
        return labs().length > 0;
      },
      get fallback() {
        return (() => {
          var _el$67 = getNextElement(_tmpl$6), _el$68 = _el$67.firstChild;
          insert(_el$68, () => props.label);
          return _el$67;
        })();
      },
      get children() {
        var _el$61 = getNextElement(_tmpl$4), _el$62 = _el$61.firstChild, _el$63 = _el$62.firstChild, _el$64 = _el$62.nextSibling;
        insert(_el$63, () => props.label);
        insert(_el$64, createComponent(For, {
          get each() {
            return labs();
          },
          children: (lab) => (() => {
            var _el$69 = getNextElement(_tmpl$7);
            insert(_el$69, () => lab.name);
            createRenderEffect((_p$) => {
              var _v$ = lab.name === props.label ? "true" : void 0, _v$2 = language.route(`${"/data/"}${lab.id}`);
              _v$ !== _p$.e && setAttribute(_el$69, "data-current", _p$.e = _v$);
              _v$2 !== _p$.t && setAttribute(_el$69, "href", _p$.t = _v$2);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$69;
          })()
        }));
        return _el$61;
      }
    }), _el$66, _co$25);
    createRenderEffect(() => setAttribute(_el$59, "href", language.route("/data/")));
    return _el$58;
  })();
}
function LabHeroTitleRow(props) {
  return (() => {
    var _el$70 = getNextElement(_tmpl$8), _el$71 = _el$70.firstChild, _el$72 = _el$71.nextSibling;
    insert(_el$71, createComponent(Show, {
      get when() {
        return props.icon;
      },
      children: (icon) => createComponent(ProviderIcon, {
        "aria-hidden": "true",
        get id() {
          return getProviderIconId(icon());
        }
      })
    }));
    insert(_el$72, () => props.label);
    createRenderEffect(() => setAttribute(_el$71, "data-empty", props.icon ? void 0 : "true"));
    return _el$70;
  })();
}
function LabOverview(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const featuredModels = createMemo(() => props.lab.models.slice(0, 3).map((model) => model.name));
  return (() => {
    var _el$73 = getNextElement(_tmpl$9), _el$74 = _el$73.firstChild, _el$83 = _el$74.firstChild, [_el$84, _co$29] = getNextMarker(_el$83.nextSibling), _el$75 = _el$84.nextSibling, _el$77 = _el$75.firstChild, [_el$78, _co$26] = getNextMarker(_el$77.nextSibling), _el$79 = _el$78.nextSibling, [_el$80, _co$27] = getNextMarker(_el$79.nextSibling), _el$76 = _el$80.nextSibling, _el$81 = _el$76.nextSibling, [_el$82, _co$28] = getNextMarker(_el$81.nextSibling), _el$85 = _el$74.nextSibling, [_el$86, _co$30] = getNextMarker(_el$85.nextSibling), _el$87 = _el$86.nextSibling, [_el$88, _co$31] = getNextMarker(_el$87.nextSibling);
    insert(_el$74, createComponent(ProviderIcon, {
      "data-slot": "lab-overview-watermark",
      "aria-hidden": "true",
      get id() {
        return getProviderIconId(props.lab.id);
      }
    }), _el$84, _co$29);
    insert(_el$75, () => i18n.t("lab.heroPrefix", {
      count: props.lab.models.length,
      lab: props.lab.name
    }), _el$78, _co$26);
    insert(_el$75, createComponent(Show, {
      get when() {
        return featuredModels().length > 0;
      },
      get children() {
        return [" ", memo(() => i18n.t("lab.heroIncluding", {
          models: formatList(featuredModels(), language.tag(language.locale()))
        }))];
      }
    }), _el$80, _co$27);
    insert(_el$75, () => i18n.t("lab.heroSuffix"), _el$82, _co$28);
    insert(_el$73, createComponent(LabOverviewMetric, {
      label: "Tokens processed",
      get value() {
        return memo(() => !!props.data)() ? formatTokens(props.data.totals.tokens) : i18n.t("lab.pending");
      }
    }), _el$86, _co$30);
    insert(_el$73, createComponent(LabOverviewMetric, {
      label: "Recent usage",
      get value() {
        return memo(() => !!props.data)() ? formatWholePercent(props.data.tokenShare) : i18n.t("lab.pending");
      }
    }), _el$88, _co$31);
    return _el$73;
  })();
}
function LabOverviewMetric(props) {
  return (() => {
    var _el$89 = getNextElement(_tmpl$0), _el$90 = _el$89.firstChild, _el$91 = _el$90.nextSibling;
    insert(_el$90, () => props.label);
    insert(_el$91, () => props.value);
    return _el$89;
  })();
}
function LabUsageSection(props) {
  const i18n = useI18n();
  const activeLineClipId = createUniqueId();
  const activeLineMaskId = createUniqueId();
  const [activeIndex, setActiveIndex] = createSignal();
  const usage = createMemo(() => props.data?.usage ?? []);
  const tokenMax = createMemo(() => Math.max(0, ...usage().map((item) => item.tokens)) || 1);
  const userMax = createMemo(() => Math.max(0, ...usage().map((item) => item.users)) || 1);
  const linePoints = createMemo(() => usage().map((point, index) => ({
    point,
    x: usagePointX(index, usage().length),
    y: usageLineY(point.users, userMax())
  })));
  const userLinePath = createMemo(() => usageLinePath(linePoints()));
  const activeLineBreak = createMemo(() => {
    const index = activeIndex();
    if (index === void 0) return void 0;
    const points = linePoints();
    if (points.length < 2) return void 0;
    return usageColumnBounds(index, points.length);
  });
  const activeLineClip = createMemo(() => {
    const index = activeIndex();
    if (index === void 0) return void 0;
    const points = linePoints();
    if (points.length < 2) return void 0;
    return usageColumnInnerBounds(index, points.length);
  });
  const monthTicks = createMemo(() => labUsageMonthTicks(usage()));
  const activePoint = createMemo(() => {
    const index = activeIndex();
    if (index === void 0) return void 0;
    return usage()[index];
  });
  const activeTooltip = createMemo(() => {
    const index = activeIndex();
    const point = activePoint();
    if (index === void 0 || !point) return void 0;
    const bounds = usageColumnBounds(index, usage().length);
    return {
      bounds,
      index,
      point,
      userY: linePoints()[index]?.y ?? 100
    };
  });
  return (() => {
    var _el$92 = getNextElement(_tmpl$10), _el$101 = _el$92.firstChild, [_el$102, _co$34] = getNextMarker(_el$101.nextSibling), _el$103 = _el$102.nextSibling, [_el$104, _co$35] = getNextMarker(_el$103.nextSibling);
    insert(_el$92, createComponent(SectionHeading, {
      href: "#usage",
      get title() {
        return i18n.t("nav.usage");
      },
      get description() {
        return i18n.t("lab.usageDescription");
      }
    }), _el$102, _co$34);
    insert(_el$92, createComponent(Show, {
      get when() {
        return usage().some((item) => item.tokens > 0);
      },
      get fallback() {
        return createComponent(LabEmptyState, {
          get title() {
            return i18n.t("lab.noUsageTitle");
          },
          get description() {
            return i18n.t("lab.noUsageDescription");
          }
        });
      },
      get children() {
        var _el$93 = getNextElement(_tmpl$1), _el$94 = _el$93.firstChild, _el$96 = _el$94.firstChild, [_el$97, _co$32] = getNextMarker(_el$96.nextSibling), _el$95 = _el$97.nextSibling, _el$98 = _el$95.nextSibling, [_el$99, _co$33] = getNextMarker(_el$98.nextSibling), _el$100 = _el$94.nextSibling;
        _el$93.addEventListener("pointerleave", (event) => {
          if (event.pointerType === "touch") return;
          setActiveIndex(void 0);
        });
        insert(_el$94, createComponent(Show, {
          get when() {
            return userLinePath();
          },
          children: (path) => [(() => {
            var _el$105 = getNextElement(_tmpl$11);
            insert(_el$105, createComponent(Show, {
              get when() {
                return activeLineBreak();
              },
              get fallback() {
                return (() => {
                  var _el$106 = getNextElement(_tmpl$12);
                  createRenderEffect(() => setAttribute(_el$106, "d", path()));
                  return _el$106;
                })();
              },
              children: (lineBreak) => [(() => {
                var _el$107 = getNextElement(_tmpl$13), _el$108 = _el$107.firstChild, _el$109 = _el$108.firstChild, _el$110 = _el$109.nextSibling;
                setAttribute(_el$108, "id", activeLineMaskId);
                createRenderEffect((_p$) => {
                  var _v$6 = lineBreak().x, _v$7 = lineBreak().width;
                  _v$6 !== _p$.e && setAttribute(_el$110, "x", _p$.e = _v$6);
                  _v$7 !== _p$.t && setAttribute(_el$110, "width", _p$.t = _v$7);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0
                });
                return _el$107;
              })(), (() => {
                var _el$111 = getNextElement(_tmpl$12);
                setAttribute(_el$111, "mask", `url(#${activeLineMaskId})`);
                createRenderEffect(() => setAttribute(_el$111, "d", path()));
                return _el$111;
              })()]
            }));
            return _el$105;
          })(), createComponent(Show, {
            get when() {
              return activeLineClip();
            },
            children: (clip) => (() => {
              var _el$112 = getNextElement(_tmpl$14), _el$113 = _el$112.firstChild, _el$114 = _el$113.firstChild, _el$115 = _el$114.firstChild, _el$116 = _el$113.nextSibling;
              setAttribute(_el$114, "id", activeLineClipId);
              setAttribute(_el$116, "clip-path", `url(#${activeLineClipId})`);
              createRenderEffect((_p$) => {
                var _v$8 = clip().x, _v$9 = clip().width, _v$0 = path();
                _v$8 !== _p$.e && setAttribute(_el$115, "x", _p$.e = _v$8);
                _v$9 !== _p$.t && setAttribute(_el$115, "width", _p$.t = _v$9);
                _v$0 !== _p$.a && setAttribute(_el$116, "d", _p$.a = _v$0);
                return _p$;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              });
              return _el$112;
            })()
          })]
        }), _el$97, _co$32);
        insert(_el$95, createComponent(For, {
          get each() {
            return usage();
          },
          children: (point, index) => (() => {
            var _el$117 = getNextElement(_tmpl$15);
            _el$117.$$keydown = (event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              setActiveIndex(index());
            };
            _el$117.addEventListener("blur", () => setActiveIndex(void 0));
            _el$117.addEventListener("focus", () => setActiveIndex(index()));
            _el$117.$$click = () => setActiveIndex(index());
            _el$117.$$pointermove = (event) => {
              if (event.pointerType === "touch") return;
              setActiveIndex(index());
            };
            _el$117.addEventListener("pointerenter", () => setActiveIndex(index()));
            _el$117.$$pointerdown = (event) => {
              if (event.pointerType !== "touch") return;
              setActiveIndex(index());
            };
            createRenderEffect((_p$) => {
              var _v$1 = `${point.date} ${formatTokens(point.tokens)} ${i18n.t("lab.tokens")}, ${formatUsers(point.users)} ${i18n.t("format.users")}`, _v$10 = activeIndex() === index() ? "true" : void 0, _v$11 = activeIndex() !== void 0 && activeIndex() !== index() ? "true" : void 0, _v$12 = {
                "--lab-usage-token-height": `${usageStripHeight(point.tokens, tokenMax())}px`,
                "--lab-usage-user-y": `${linePoints()[index()]?.y ?? 100}`
              };
              _v$1 !== _p$.e && setAttribute(_el$117, "aria-label", _p$.e = _v$1);
              _v$10 !== _p$.t && setAttribute(_el$117, "data-active", _p$.t = _v$10);
              _v$11 !== _p$.a && setAttribute(_el$117, "data-muted", _p$.a = _v$11);
              _p$.o = style(_el$117, _v$12, _p$.o);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            });
            runHydrationEvents();
            return _el$117;
          })()
        }));
        insert(_el$94, createComponent(Show, {
          get when() {
            return activeTooltip();
          },
          keyed: true,
          children: (active) => {
            return (() => {
              var _el$118 = getNextElement(_tmpl$16), _el$119 = _el$118.firstChild, _el$120 = _el$119.nextSibling, _el$122 = _el$120.firstChild, [_el$123, _co$36] = getNextMarker(_el$122.nextSibling), _el$121 = _el$123.nextSibling, _el$124 = _el$121.nextSibling, [_el$125, _co$37] = getNextMarker(_el$124.nextSibling), _el$126 = _el$120.nextSibling, _el$127 = _el$126.nextSibling, _el$128 = _el$127.firstChild, _el$129 = _el$128.firstChild, _el$130 = _el$129.nextSibling, _el$131 = _el$130.nextSibling, [_el$132, _co$38] = getNextMarker(_el$131.nextSibling), _el$133 = _el$128.nextSibling, _el$134 = _el$127.nextSibling, _el$135 = _el$134.firstChild, _el$136 = _el$135.firstChild, _el$137 = _el$136.nextSibling, _el$138 = _el$137.nextSibling, [_el$139, _co$39] = getNextMarker(_el$138.nextSibling), _el$140 = _el$135.nextSibling;
              insert(_el$119, () => formatUsageTooltipDate(active.point.date));
              insert(_el$120, () => formatTokens(active.point.tokens), _el$123, _co$36);
              insert(_el$120, () => i18n.t("lab.tokens"), _el$125, _co$37);
              insert(_el$128, () => i18n.t("lab.dailyTokens"), _el$132, _co$38);
              insert(_el$133, () => formatTokens(active.point.tokens));
              insert(_el$135, () => i18n.t("model.uniqueUsers"), _el$139, _co$39);
              insert(_el$140, () => formatUsers(active.point.users));
              createRenderEffect((_p$) => {
                var _v$13 = active.index > usage().length * 0.62 ? "left" : "right", _v$14 = {
                  "--lab-usage-tooltip-left": `${active.bounds.x}%`,
                  "--lab-usage-tooltip-right": `${active.bounds.x + active.bounds.width}%`,
                  "--lab-usage-user-y": `${active.userY}`
                };
                _v$13 !== _p$.e && setAttribute(_el$118, "data-placement", _p$.e = _v$13);
                _p$.t = style(_el$118, _v$14, _p$.t);
                return _p$;
              }, {
                e: void 0,
                t: void 0
              });
              return _el$118;
            })();
          }
        }), _el$99, _co$33);
        insert(_el$100, createComponent(For, {
          get each() {
            return monthTicks();
          },
          children: (tick) => (() => {
            var _el$141 = getNextElement(_tmpl$17);
            insert(_el$141, () => tick.label);
            createRenderEffect((_p$) => {
              var _v$15 = tick.align, _v$16 = {
                "--lab-usage-month-left": `${tick.left}%`
              };
              _v$15 !== _p$.e && setAttribute(_el$141, "data-align", _p$.e = _v$15);
              _p$.t = style(_el$141, _v$16, _p$.t);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$141;
          })()
        }));
        createRenderEffect((_p$) => {
          var _v$3 = isLabUsageDense(usage().length) ? "true" : void 0, _v$4 = `${props.lab.name} daily token volume and unique active user chart`, _v$5 = {
            "--model-usage-count": usage().length
          };
          _v$3 !== _p$.e && setAttribute(_el$93, "data-dense-labels", _p$.e = _v$3);
          _v$4 !== _p$.t && setAttribute(_el$93, "aria-label", _p$.t = _v$4);
          _p$.a = style(_el$93, _v$5, _p$.a);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$93;
      }
    }), _el$104, _co$35);
    return _el$92;
  })();
}
function LabModelsSection(props) {
  const i18n = useI18n();
  const [activeTooltip, setActiveTooltip] = createSignal();
  const usageBySlug = createMemo(() => new Map(props.usage.map((item) => [item.slug, item])));
  return (() => {
    var _el$142 = getNextElement(_tmpl$18), _el$143 = _el$142.firstChild, _el$145 = _el$143.firstChild, [_el$146, _co$40] = getNextMarker(_el$145.nextSibling);
    _el$146.nextSibling;
    var _el$147 = _el$143.nextSibling, _el$148 = _el$147.nextSibling, _el$149 = _el$148.firstChild, _el$150 = _el$149.firstChild, _el$151 = _el$150.firstChild, _el$152 = _el$151.nextSibling, _el$153 = _el$152.nextSibling, _el$154 = _el$153.nextSibling, _el$155 = _el$154.nextSibling, _el$156 = _el$155.nextSibling, _el$157 = _el$150.nextSibling, [_el$158, _co$41] = getNextMarker(_el$157.nextSibling), _el$159 = _el$148.nextSibling, [_el$160, _co$42] = getNextMarker(_el$159.nextSibling);
    insert(_el$143, createComponent(SectionHeading, {
      href: "#models",
      get title() {
        return i18n.t("nav.models");
      },
      get description() {
        return i18n.t("lab.recentUsageAndLimits");
      }
    }), _el$146, _co$40);
    insert(_el$151, () => i18n.t("nav.models"));
    insert(_el$152, () => i18n.t("lab.usage"));
    insert(_el$153, () => i18n.t("lab.share"));
    insert(_el$154, () => i18n.t("model.context"));
    insert(_el$155, () => i18n.t("model.output"));
    insert(_el$156, () => i18n.t("model.release"));
    insert(_el$149, createComponent(For, {
      get each() {
        return props.lab.models;
      },
      children: (model) => createComponent(LabModelRow, {
        model,
        get usage() {
          return usageBySlug().get(model.slug);
        },
        onTooltipChange: setActiveTooltip
      })
    }), _el$158, _co$41);
    insert(_el$142, createComponent(Show, {
      get when() {
        return activeTooltip();
      },
      keyed: true,
      children: (state) => createComponent(LabModelTooltip, {
        state
      })
    }), _el$160, _co$42);
    createRenderEffect(() => setAttribute(_el$148, "aria-label", i18n.t("lab.modelsTitle", {
      lab: props.lab.name
    })));
    return _el$142;
  })();
}
function LabModelRow(props) {
  const i18n = useI18n();
  const language = useLanguage();
  const showTooltip = (target) => {
    const rect = target.getBoundingClientRect();
    const viewportWidth = typeof window === "undefined" ? 0 : window.innerWidth;
    const viewportHeight = typeof window === "undefined" ? 0 : window.innerHeight;
    const anchorX = viewportWidth > 0 ? Math.min(Math.max(rect.left + 320, 24), viewportWidth - 24) : rect.left + 320;
    props.onTooltipChange({
      model: props.model,
      placement: viewportWidth > 0 && anchorX > viewportWidth - 280 ? "left" : "right",
      usage: props.usage,
      x: anchorX,
      y: viewportHeight > 0 ? Math.min(Math.max(rect.top + rect.height / 2, 96), viewportHeight - 128) : rect.top + rect.height / 2
    });
  };
  const showPointerTooltip = (event) => {
    if (event.pointerType === "touch") return;
    showTooltip(event.currentTarget);
  };
  const showFocusTooltip = (event) => {
    showTooltip(event.currentTarget);
  };
  return (() => {
    var _el$161 = getNextElement(_tmpl$19), _el$162 = _el$161.firstChild, _el$163 = _el$162.firstChild, _el$164 = _el$163.nextSibling, _el$165 = _el$162.nextSibling, _el$166 = _el$165.nextSibling, _el$167 = _el$166.nextSibling, _el$168 = _el$167.nextSibling, _el$169 = _el$168.nextSibling;
    _el$161.$$click = () => props.onTooltipChange(void 0);
    _el$161.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      props.onTooltipChange(void 0);
    });
    _el$161.$$pointerdown = () => props.onTooltipChange(void 0);
    _el$161.addEventListener("pointerenter", showPointerTooltip);
    _el$161.addEventListener("focus", showFocusTooltip);
    _el$161.addEventListener("blur", () => props.onTooltipChange(void 0));
    insert(_el$163, createComponent(ProviderIcon, {
      get id() {
        return getProviderIconId(props.model.lab);
      }
    }));
    insert(_el$164, () => props.model.name);
    insert(_el$165, (() => {
      var _c$ = memo(() => !!props.usage);
      return () => _c$() ? formatTokens(props.usage.tokens) : "-";
    })());
    insert(_el$166, (() => {
      var _c$2 = memo(() => !!props.usage);
      return () => _c$2() ? formatPercent(props.usage.share) : "-";
    })());
    insert(_el$167, () => formatCatalogLimit(props.model.limit?.context, i18n.t("home.unknown")));
    insert(_el$168, () => formatCatalogLimit(props.model.limit?.output, i18n.t("home.unknown")));
    insert(_el$169, () => formatCatalogDate(props.model.releaseDate, language.tag(language.locale()), i18n.t("home.unknown")));
    createRenderEffect((_p$) => {
      var _v$17 = language.route(`${"/data/"}${props.model.id}`), _v$18 = props.model.name;
      _v$17 !== _p$.e && setAttribute(_el$161, "href", _p$.e = _v$17);
      _v$18 !== _p$.t && setAttribute(_el$161, "aria-label", _p$.t = _v$18);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    runHydrationEvents();
    return _el$161;
  })();
}
function LabModelTooltip(props) {
  const i18n = useI18n();
  return (() => {
    var _el$170 = getNextElement(_tmpl$20), _el$171 = _el$170.firstChild, _el$172 = _el$171.firstChild, _el$173 = _el$172.firstChild, _el$174 = _el$173.nextSibling, _el$175 = _el$172.nextSibling, _el$176 = _el$171.nextSibling, _el$177 = _el$176.nextSibling, _el$178 = _el$177.firstChild, _el$179 = _el$178.firstChild, _el$180 = _el$179.nextSibling, _el$181 = _el$178.nextSibling, _el$182 = _el$181.firstChild, _el$183 = _el$182.nextSibling, _el$184 = _el$181.nextSibling, _el$185 = _el$184.firstChild, _el$186 = _el$185.nextSibling, _el$187 = _el$184.nextSibling, _el$188 = _el$187.firstChild, _el$189 = _el$188.nextSibling;
    insert(_el$173, createComponent(ProviderIcon, {
      get id() {
        return getProviderIconId(props.state.model.lab);
      }
    }));
    insert(_el$174, () => props.state.model.name);
    insert(_el$175, () => props.state.model.description ?? "Recent OpenCode Go usage, share, context, and output limits.");
    insert(_el$179, () => i18n.t("lab.usage"));
    insert(_el$180, (() => {
      var _c$3 = memo(() => !!props.state.usage);
      return () => _c$3() ? formatTokens(props.state.usage.tokens) : "-";
    })());
    insert(_el$182, () => i18n.t("lab.share"));
    insert(_el$183, (() => {
      var _c$4 = memo(() => !!props.state.usage);
      return () => _c$4() ? formatPercent(props.state.usage.share) : "-";
    })());
    insert(_el$185, () => i18n.t("model.context"));
    insert(_el$186, () => formatCatalogLimit(props.state.model.limit?.context, i18n.t("home.unknown")));
    insert(_el$188, () => i18n.t("model.output"));
    insert(_el$189, () => formatCatalogLimit(props.state.model.limit?.output, i18n.t("home.unknown")));
    createRenderEffect((_p$) => {
      var _v$19 = props.state.placement, _v$20 = {
        "--lab-model-tooltip-x": `${props.state.x}px`,
        "--lab-model-tooltip-y": `${props.state.y}px`
      };
      _v$19 !== _p$.e && setAttribute(_el$170, "data-placement", _p$.e = _v$19);
      _p$.t = style(_el$170, _v$20, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$170;
  })();
}
function LabRelatedSection(props) {
  const related = createMemo(() => relatedLabs(props.lab, props.labs, props.market));
  return (() => {
    var _el$190 = getNextElement(_tmpl$21), _el$192 = _el$190.firstChild, [_el$193, _co$43] = getNextMarker(_el$192.nextSibling), _el$191 = _el$193.nextSibling;
    insert(_el$190, createComponent(SectionHeading, {
      href: "#related-labs",
      title: "Related labs",
      description: "Explore more."
    }), _el$193, _co$43);
    insert(_el$191, createComponent(For, {
      get each() {
        return related();
      },
      children: (entry) => createComponent(LabRelatedCard, {
        entry
      })
    }));
    return _el$190;
  })();
}
function LabRelatedCard(props) {
  const language = useLanguage();
  const featured = () => props.entry.lab.models[0];
  const otherCount = () => Math.max(props.entry.lab.models.length - 1, 0);
  const modelSummary = () => {
    const model = featured();
    if (!model) return props.entry.lab.name;
    const count = otherCount();
    if (count === 0) return model.name;
    return `${model.name} + ${count} other ${count === 1 ? "model" : "models"}`;
  };
  const activeBars = () => {
    if (props.entry.share <= 0) return 0;
    return Math.max(1, Math.min(20, Math.round(props.entry.share / 5)));
  };
  return (() => {
    var _el$194 = getNextElement(_tmpl$22), _el$207 = _el$194.firstChild, [_el$208, _co$45] = getNextMarker(_el$207.nextSibling), _el$195 = _el$208.nextSibling, _el$196 = _el$195.firstChild, _el$197 = _el$196.nextSibling, _el$198 = _el$195.nextSibling, _el$199 = _el$198.nextSibling, _el$200 = _el$199.nextSibling, _el$201 = _el$200.nextSibling, _el$202 = _el$201.firstChild, _el$203 = _el$202.firstChild, _el$204 = _el$203.nextSibling, [_el$205, _co$44] = getNextMarker(_el$204.nextSibling), _el$206 = _el$202.nextSibling;
    insert(_el$194, createComponent(ProviderIcon, {
      "data-slot": "lab-related-watermark",
      "aria-hidden": "true",
      get id() {
        return getProviderIconId(props.entry.lab.id);
      }
    }), _el$208, _co$45);
    insert(_el$196, createComponent(ProviderIcon, {
      get id() {
        return getProviderIconId(props.entry.lab.id);
      }
    }));
    insert(_el$197, () => props.entry.lab.name);
    insert(_el$198, () => labRelatedDescription(props.entry.lab));
    insert(_el$199, modelSummary);
    insert(_el$202, () => formatWholePercent(props.entry.share), _el$205, _co$44);
    insert(_el$206, createComponent(For, {
      get each() {
        return Array.from({
          length: 20
        });
      },
      children: (_, index) => (() => {
        var _el$209 = getNextElement(_tmpl$23);
        createRenderEffect(() => setAttribute(_el$209, "data-active", index() < activeBars() ? "true" : void 0));
        return _el$209;
      })()
    }));
    createRenderEffect((_p$) => {
      var _v$21 = relatedTone(props.entry.share), _v$22 = language.route(`${"/data/"}${props.entry.lab.id}`);
      _v$21 !== _p$.e && setAttribute(_el$194, "data-tone", _p$.e = _v$21);
      _v$22 !== _p$.t && setAttribute(_el$194, "href", _p$.t = _v$22);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$194;
  })();
}
function LabEmptyState(props) {
  return (() => {
    var _el$210 = getNextElement(_tmpl$24), _el$211 = _el$210.firstChild, _el$212 = _el$211.nextSibling;
    insert(_el$211, () => props.title);
    insert(_el$212, () => props.description);
    return _el$210;
  })();
}
function labComparisonPairs(lab, usage) {
  const usageRefs = usage.slice(0, 4).map((model) => ({
    name: model.model,
    lab: model.provider,
    slug: model.slug,
    labName: model.author,
    metric: formatTokens(model.tokens)
  }));
  const refs = usageRefs.length > 1 ? usageRefs : lab.models.slice(0, 4).map(modelRefFromCatalog);
  return uniqueComparisonPairs([[0, 1, "Most-used lab pair"], [0, 2, "Lab alternative"], [1, 2, "Adjacent lab pair"], [2, 3, "Same lab pair"]].flatMap(([firstIndex, secondIndex, detail]) => {
    const first = refs[firstIndex];
    const second = refs[secondIndex];
    return first && second ? [{
      first,
      second,
      detail
    }] : [];
  }));
}
function relatedLabs(current, labs, market) {
  const stats = relatedLabStats(labs, market);
  return labs.filter((lab) => lab.id !== current.id).map((lab) => stats.get(lab.id) ?? {
    lab,
    share: 0,
    tokens: 0
  }).toSorted((a, b) => b.tokens - a.tokens || a.lab.name.localeCompare(b.lab.name)).slice(0, 3);
}
function relatedLabStats(labs, market) {
  const labByKey = /* @__PURE__ */ new Map();
  labs.forEach((lab) => {
    labByKey.set(lab.id, lab);
    labByKey.set(catalogSlug(lab.name), lab);
    labByKey.set(catalogSlug(formatCatalogLabName(lab.id)), lab);
  });
  const tokensByLab = /* @__PURE__ */ new Map();
  const total = market.reduce((sum, day) => {
    day.authors.forEach((author) => {
      const lab = labByKey.get(catalogSlug(author.author));
      if (!lab) return;
      tokensByLab.set(lab.id, (tokensByLab.get(lab.id) ?? 0) + author.tokens);
    });
    return sum + day.total;
  }, 0);
  return new Map(labs.map((lab) => {
    const tokens = tokensByLab.get(lab.id) ?? 0;
    return [lab.id, {
      lab,
      tokens,
      share: total > 0 ? tokens / total * 100 : 0
    }];
  }));
}
function labRelatedDescription(lab) {
  return lab.description ?? "";
}
function relatedTone(share) {
  if (share >= 50) return "high";
  if (share > 0 && share < 10) return "low";
  return "mid";
}
function formatCatalogLimit(value, unknown) {
  return value === void 0 ? unknown : formatTokens(value);
}
function formatCatalogDate(value, locale, unknown) {
  if (!value) return unknown;
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) - 1 : 0;
  const day = match[3] ? Number(match[3]) : 1;
  return new Intl.DateTimeFormat(locale, {
    month: match[2] ? "short" : void 0,
    day: match[3] ? "numeric" : void 0,
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month, day)));
}
function formatList(values, locale = "en") {
  if (values.length <= 1) return values[0] ?? "";
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction"
  }).format(values);
}
function formatPercent(value) {
  return `${trimNumber(value, value >= 10 ? 1 : 2)}%`;
}
function formatWholePercent(value) {
  return `${Math.round(value).toLocaleString("en")}%`;
}
function formatTokens(value) {
  if (value >= 1e12) return `${trimNumber(value / 1e12, value >= 1e13 ? 0 : 1)}T`;
  if (value >= 1e9) return `${trimNumber(value / 1e9, value >= 1e10 ? 0 : 1)}B`;
  if (value >= 1e6) return `${trimNumber(value / 1e6, value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `${trimNumber(value / 1e3, value >= 1e4 ? 0 : 1)}K`;
  return String(Math.round(value));
}
function formatUsers(value) {
  if (value >= 1e6) return `${trimNumber(value / 1e6, value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `${trimNumber(value / 1e3, value >= 1e4 ? 0 : 1)}K`;
  return new Intl.NumberFormat("en").format(Math.round(value));
}
function formatUsageTooltipDate(value) {
  const match = /^([A-Z]{3})\s+(\d{1,2})$/.exec(value);
  if (!match) return value;
  return `${monthName(match[1])} ${Number(match[2])} ${(/* @__PURE__ */ new Date()).getFullYear()}`;
}
function monthName(value) {
  const names = {
    JAN: "Jan",
    FEB: "Feb",
    MAR: "Mar",
    APR: "Apr",
    MAY: "May",
    JUN: "Jun",
    JUL: "Jul",
    AUG: "Aug",
    SEP: "Sep",
    OCT: "Oct",
    NOV: "Nov",
    DEC: "Dec"
  };
  return names[value] ?? value;
}
function trimNumber(value, digits) {
  return Number(value.toFixed(digits)).toLocaleString("en");
}
function usageStripHeight(value, max) {
  if (value <= 0 || max <= 0) return 0;
  return Math.max(2, value / max * 76);
}
function usageLineY(value, max) {
  if (value <= 0 || max <= 0) return 100;
  return Math.max(0, 100 - value / max * 100);
}
function usagePointX(index, count) {
  if (count <= 1) return 50;
  return (index + 0.5) / count * 100;
}
function usageColumnBounds(index, count) {
  if (count <= 0) return {
    x: 0,
    width: 100
  };
  return {
    x: index / count * 100,
    width: 100 / count
  };
}
function usageColumnInnerBounds(index, count) {
  const bounds = usageColumnBounds(index, count);
  const inset = Math.min(bounds.width * 0.1, 0.24);
  return {
    x: bounds.x + inset,
    width: Math.max(1e-3, bounds.width - inset * 2)
  };
}
function usageLinePath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${pathNumber(points[0].x)} ${pathNumber(points[0].y)}`;
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
    return `${path} C ${pathNumber(controlA.x)} ${pathNumber(controlA.y)}, ${pathNumber(controlB.x)} ${pathNumber(controlB.y)}, ${pathNumber(next.x)} ${pathNumber(next.y)}`;
  }, `M ${pathNumber(points[0].x)} ${pathNumber(points[0].y)}`);
}
function pathNumber(value) {
  return Number(value.toFixed(3));
}
function clampUsagePercent(value) {
  return Math.max(0, Math.min(100, value));
}
function labUsageMonthTicks(points) {
  const seen = /* @__PURE__ */ new Set();
  return points.flatMap((point, index) => {
    const label = point.date.split(" ")[0];
    if (!label || seen.has(label)) return [];
    seen.add(label);
    return [{
      label,
      left: usagePointX(index, points.length),
      align: index === 0 ? "start" : index >= points.length - 2 ? "end" : "center"
    }];
  });
}
function isLabUsageDense(count) {
  return count > 20;
}
function getProviderIconId(provider) {
  const id = provider.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (id === "moonshot") return "moonshotai";
  if (id === "zhipu") return "zhipuai";
  return id;
}
delegateEvents(["pointerdown", "pointermove", "click", "keydown"]);
export {
  StatsLab as default
};
