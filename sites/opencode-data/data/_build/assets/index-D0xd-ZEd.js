import { ab as useI18n, ac as useLanguage, s as createSignal, m as createMemo, J as localizedUrl, V as onMount, y as getNextElement, z as getNextMarker, C as insert, k as createComponent, n as createRenderEffect, a8 as template, u as delegateEvents, T as Title, M as Meta, S as Show, F as For, Z as setAttribute, l as createEffect, f as addEventListener, X as runHydrationEvents, aa as use, $ as setProperty } from "./i18n-DJbnCyo8.js";
import { d as createAsync, j as getModelCatalog, i as getGitHubStars, t as themeStorageKey, a as applyThemePreference, l as isThemePreference, H as Header, F as Footer, b as comparisonHref, m as modelRefFromCatalog, h as formatCatalogLabName } from "./stats-shell-D85bQNDr.js";
import { L as LocaleLinks, P as ProviderIcon } from "./locale-links-hcqm6Rft.js";
var _tmpl$ = /* @__PURE__ */ template(`<section id=model-comparison data-section=compare-home-related><p data-slot=section-title><strong>Related comparisons.</strong> <span>Other model pairs to check.</span></p><div data-component=compare-home-card-grid>`), _tmpl$2 = /* @__PURE__ */ template(`<main data-page=stats><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><div data-component=container><div data-component=content><section id=compare-tool data-section=compare-home-hero><nav data-component=compare-home-breadcrumb aria-label=Breadcrumb><a data-slot=compare-home-crumb>Data</a><span data-slot=compare-home-separator>/</span><span data-slot=compare-home-crumb data-current=true>Compare</span></nav><div data-slot=compare-home-hero-grid><h1 aria-label="Compare AI models"><span>Compare</span><!$><!/><span>AI models</span></h1><p>Compare AI models on key metrics including benchmarks, price, context length, and other model features.</p></div><div data-slot=compare-home-pattern aria-hidden=true></div></section><section data-section=compare-home-selector aria-label="Choose models to compare"></section><!$><!/></div><!$><!/>`), _tmpl$3 = /* @__PURE__ */ template(`<div data-component=empty-state data-compact=true><strong>No models found</strong><p>The model list could not be loaded.`), _tmpl$4 = /* @__PURE__ */ template(`<form data-component=compare-home-selector aria-label="Model comparison selector"><!$><!/><!$><!/><!$><!/>`), _tmpl$5 = /* @__PURE__ */ template(`<button type=button data-slot=compare-home-select-panel aria-haspopup=dialog><span data-slot=compare-home-select-copy><span data-slot=compare-home-plus aria-hidden=true>+</span><!$><!/><span data-slot=compare-home-select-name>`), _tmpl$6 = /* @__PURE__ */ template(`<div data-component=compare-model-modal-scrim role=presentation><div data-component=compare-model-modal role=dialog aria-modal=true><div data-slot=compare-model-modal-list><label data-slot=compare-model-modal-search><span data-slot=compare-model-modal-search-icon aria-hidden=true></span><input placeholder="Search models"aria-label="Search models"></label><div data-slot=compare-model-modal-results></div></div><div data-slot=compare-model-modal-divider aria-hidden=true></div><!$><!/>`), _tmpl$7 = /* @__PURE__ */ template(`<div data-slot=compare-model-modal-empty><strong>No models found</strong><span>Try another search.`), _tmpl$8 = /* @__PURE__ */ template(`<span data-slot=compare-model-modal-badge>Free`), _tmpl$9 = /* @__PURE__ */ template(`<button type=button data-slot=compare-model-modal-row><span data-slot=compare-model-modal-row-main><!$><!/><span></span></span><!$><!/>`), _tmpl$0 = /* @__PURE__ */ template(`<aside data-slot=compare-model-modal-detail><header data-slot=compare-model-modal-detail-header><!$><!/><strong></strong></header><div data-slot=compare-model-modal-description><p></p><span aria-hidden=true></span></div><dl data-slot=compare-model-modal-facts><!$><!/><!$><!/><!$><!/><!$><!/><div data-slot=compare-model-modal-fact><dt>Uptime</dt><dd data-slot=compare-model-modal-uptime></dd></div><div data-slot=compare-model-modal-fact><dt>URL</dt><dd><a>`), _tmpl$1 = /* @__PURE__ */ template(`<span>`), _tmpl$10 = /* @__PURE__ */ template(`<div data-slot=compare-model-modal-fact><dt></dt><dd>`), _tmpl$11 = /* @__PURE__ */ template(`<span data-slot=compare-home-avatar-stack aria-hidden=true>`), _tmpl$12 = /* @__PURE__ */ template(`<span data-slot=compare-home-avatar-frame>`), _tmpl$13 = /* @__PURE__ */ template(`<a data-component=compare-home-card><span data-slot=compare-home-card-head><span><strong></strong><em></em></span><b aria-hidden=true></b></span><span data-slot=compare-home-card-divider aria-hidden=true></span><span data-slot=compare-home-card-models><span></span><i aria-hidden=true>·</i><span></span></span><span data-slot=compare-home-card-avatars aria-hidden=true>`), _tmpl$14 = /* @__PURE__ */ template(`<span data-slot=compare-home-avatar>`);
const comparePath = "/data/compare";
const compareTitle = "AI Model Comparison";
const compareDescription = "Compare AI models on key metrics including benchmarks, price, context length, and other model features.";
const statsUnfurlPath = "banner.png";
const uptimeBars = Array.from({
  length: 10
}, (_, index) => index);
const heroLabs = [{
  lab: "deepseek",
  label: "DeepSeek"
}, {
  lab: "openai",
  label: "OpenAI"
}, {
  lab: "anthropic",
  label: "Anthropic"
}];
const categoryTemplates = [{
  title: "Flagship models",
  description: "The latest top-tier model from major labs.",
  kind: "flagship"
}, {
  title: "Most affordable",
  description: "Compact, lower-cost picks for high-throughput use.",
  kind: "affordable"
}, {
  title: "Best for code",
  description: "Frequently chosen for programming tasks.",
  kind: "code"
}, {
  title: "Image generation",
  description: "Compare top image models on cost and quality.",
  kind: "image"
}];
function ModelCompareIndex() {
  const i18n = useI18n();
  const language = useLanguage();
  const catalog = createAsync(() => getModelCatalog());
  const githubStars = createAsync(() => getGitHubStars());
  const [themePreference, setThemePreference] = createSignal("system");
  const compareUrl = createMemo(() => localizedUrl(language.locale(), comparePath));
  const statsUnfurlUrl = new URL(statsUnfurlPath, localizedUrl("en", "/data/")).toString();
  const featuredModels = createMemo(() => (catalog()?.models ?? []).slice(0, 120));
  const categories = createMemo(() => buildComparisonCategories(featuredModels()));
  const compareHeaderLinks = createMemo(() => [{
    href: `${"/data/"}#top-models`,
    label: i18n.t("nav.topModels")
  }, {
    href: `${"/data/"}#leaderboard`,
    label: i18n.t("nav.leaderboard")
  }, {
    href: `${"/data/"}#market-share`,
    label: i18n.t("nav.marketShare")
  }, {
    href: `${"/data/"}#token-cost`,
    label: i18n.t("nav.tokenCost")
  }, {
    href: `${"/data/"}#session-cost`,
    label: i18n.t("nav.sessionCost")
  }]);
  const compareFooterLinks = createMemo(() => [{
    href: `${"/data/"}#top-models`,
    label: i18n.t("nav.topModels")
  }, {
    href: `${"/data/"}#leaderboard`,
    label: i18n.t("nav.leaderboard")
  }, {
    href: `${"/data/"}#market-share`,
    label: i18n.t("nav.marketShare")
  }, {
    href: `${"/data/"}#token-cost`,
    label: i18n.t("nav.tokenCost")
  }, {
    href: `${"/data/"}#session-cost`,
    label: i18n.t("nav.sessionCost")
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
    var _el$ = getNextElement(_tmpl$2), _el$19 = _el$.firstChild, [_el$20, _co$4] = getNextMarker(_el$19.nextSibling), _el$21 = _el$20.nextSibling, [_el$22, _co$5] = getNextMarker(_el$21.nextSibling), _el$23 = _el$22.nextSibling, [_el$24, _co$6] = getNextMarker(_el$23.nextSibling), _el$25 = _el$24.nextSibling, [_el$26, _co$7] = getNextMarker(_el$25.nextSibling), _el$27 = _el$26.nextSibling, [_el$28, _co$8] = getNextMarker(_el$27.nextSibling), _el$29 = _el$28.nextSibling, [_el$30, _co$9] = getNextMarker(_el$29.nextSibling), _el$31 = _el$30.nextSibling, [_el$32, _co$0] = getNextMarker(_el$31.nextSibling), _el$33 = _el$32.nextSibling, [_el$34, _co$1] = getNextMarker(_el$33.nextSibling), _el$35 = _el$34.nextSibling, [_el$36, _co$10] = getNextMarker(_el$35.nextSibling), _el$37 = _el$36.nextSibling, [_el$38, _co$11] = getNextMarker(_el$37.nextSibling), _el$39 = _el$38.nextSibling, [_el$40, _co$12] = getNextMarker(_el$39.nextSibling), _el$41 = _el$40.nextSibling, [_el$42, _co$13] = getNextMarker(_el$41.nextSibling), _el$43 = _el$42.nextSibling, [_el$44, _co$14] = getNextMarker(_el$43.nextSibling), _el$45 = _el$44.nextSibling, [_el$46, _co$15] = getNextMarker(_el$45.nextSibling), _el$47 = _el$46.nextSibling, [_el$48, _co$16] = getNextMarker(_el$47.nextSibling), _el$49 = _el$48.nextSibling, [_el$50, _co$17] = getNextMarker(_el$49.nextSibling), _el$51 = _el$50.nextSibling, [_el$52, _co$18] = getNextMarker(_el$51.nextSibling), _el$53 = _el$52.nextSibling, [_el$54, _co$19] = getNextMarker(_el$53.nextSibling), _el$55 = _el$54.nextSibling, [_el$56, _co$20] = getNextMarker(_el$55.nextSibling), _el$2 = _el$56.nextSibling, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild, _el$7 = _el$5.nextSibling, _el$8 = _el$7.firstChild, _el$9 = _el$8.firstChild, _el$1 = _el$9.nextSibling, [_el$10, _co$] = getNextMarker(_el$1.nextSibling);
    _el$10.nextSibling;
    var _el$11 = _el$4.nextSibling, _el$15 = _el$11.nextSibling, [_el$16, _co$2] = getNextMarker(_el$15.nextSibling), _el$17 = _el$3.nextSibling, [_el$18, _co$3] = getNextMarker(_el$17.nextSibling);
    insert(_el$, createComponent(Title, {
      children: compareTitle
    }), _el$20, _co$4);
    insert(_el$, createComponent(Meta, {
      name: "description",
      content: compareDescription
    }), _el$22, _co$5);
    insert(_el$, createComponent(LocaleLinks, {
      path: comparePath
    }), _el$24, _co$6);
    insert(_el$, createComponent(Meta, {
      property: "og:type",
      content: "website"
    }), _el$26, _co$7);
    insert(_el$, createComponent(Meta, {
      property: "og:site_name",
      content: "OpenCode"
    }), _el$28, _co$8);
    insert(_el$, createComponent(Meta, {
      property: "og:title",
      content: compareTitle
    }), _el$30, _co$9);
    insert(_el$, createComponent(Meta, {
      property: "og:description",
      content: compareDescription
    }), _el$32, _co$0);
    insert(_el$, createComponent(Meta, {
      property: "og:url",
      get content() {
        return compareUrl();
      }
    }), _el$34, _co$1);
    insert(_el$, createComponent(Meta, {
      property: "og:image",
      content: statsUnfurlUrl
    }), _el$36, _co$10);
    insert(_el$, createComponent(Meta, {
      property: "og:image:type",
      content: "image/png"
    }), _el$38, _co$11);
    insert(_el$, createComponent(Meta, {
      property: "og:image:width",
      content: "1200"
    }), _el$40, _co$12);
    insert(_el$, createComponent(Meta, {
      property: "og:image:height",
      content: "630"
    }), _el$42, _co$13);
    insert(_el$, createComponent(Meta, {
      property: "og:image:alt",
      get content() {
        return i18n.t("app.unfurlAlt");
      }
    }), _el$44, _co$14);
    insert(_el$, createComponent(Meta, {
      name: "twitter:card",
      content: "summary_large_image"
    }), _el$46, _co$15);
    insert(_el$, createComponent(Meta, {
      name: "twitter:title",
      content: compareTitle
    }), _el$48, _co$16);
    insert(_el$, createComponent(Meta, {
      name: "twitter:description",
      content: compareDescription
    }), _el$50, _co$17);
    insert(_el$, createComponent(Meta, {
      name: "twitter:image",
      content: statsUnfurlUrl
    }), _el$52, _co$18);
    insert(_el$, createComponent(Meta, {
      name: "twitter:image:alt",
      get content() {
        return i18n.t("app.unfurlAlt");
      }
    }), _el$54, _co$19);
    insert(_el$, createComponent(Header, {
      get githubStars() {
        return githubStars() ?? "150K";
      },
      get links() {
        return compareHeaderLinks();
      },
      get brandHref() {
        return "/data/";
      }
    }), _el$56, _co$20);
    insert(_el$8, createComponent(HeroModelStack, {}), _el$10, _co$);
    insert(_el$11, createComponent(Show, {
      get when() {
        return featuredModels().length > 1;
      },
      get fallback() {
        return getNextElement(_tmpl$3);
      },
      get children() {
        return createComponent(CompareHomeSelector, {
          get models() {
            return featuredModels();
          }
        });
      }
    }));
    insert(_el$3, createComponent(Show, {
      get when() {
        return categories().length > 0;
      },
      get children() {
        var _el$12 = getNextElement(_tmpl$), _el$13 = _el$12.firstChild, _el$14 = _el$13.nextSibling;
        insert(_el$14, createComponent(For, {
          get each() {
            return categories();
          },
          children: (category) => createComponent(CompareHomeCard, {
            category
          })
        }));
        return _el$12;
      }
    }), _el$16, _co$2);
    insert(_el$2, createComponent(Footer, {
      get themePreference() {
        return themePreference();
      },
      onThemePreferenceChange: updateThemePreference,
      get links() {
        return compareFooterLinks();
      },
      bridge: null
    }), _el$18, _co$3);
    createRenderEffect((_p$) => {
      var _v$ = themePreference(), _v$2 = language.route("/data/");
      _v$ !== _p$.e && setAttribute(_el$, "data-theme", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$6, "href", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
}
function CompareHomeSelector(props) {
  const [firstId, setFirstId] = createSignal("");
  const [secondId, setSecondId] = createSignal("");
  const [activeSlot, setActiveSlot] = createSignal();
  const modelById = createMemo(() => new Map(props.models.map((model) => [model.id, model])));
  const first = createMemo(() => modelById().get(firstId()));
  const second = createMemo(() => modelById().get(secondId()));
  const activeSelected = createMemo(() => activeSlot() === "first" ? first() : second());
  const activeBlockedId = createMemo(() => activeSlot() === "first" ? secondId() : firstId());
  const href = createMemo(() => {
    const firstModel = first();
    const secondModel = second();
    if (!firstModel || !secondModel || firstModel.id === secondModel.id) return void 0;
    return comparisonHref(modelRefFromCatalog(firstModel), modelRefFromCatalog(secondModel));
  });
  createEffect(() => {
    if (!secondId() || secondId() !== firstId()) return;
    setSecondId("");
  });
  createEffect(() => {
    const url = href();
    if (!url || typeof window === "undefined") return;
    window.location.href = url;
  });
  return (() => {
    var _el$58 = getNextElement(_tmpl$4), _el$59 = _el$58.firstChild, [_el$60, _co$21] = getNextMarker(_el$59.nextSibling), _el$61 = _el$60.nextSibling, [_el$62, _co$22] = getNextMarker(_el$61.nextSibling), _el$63 = _el$62.nextSibling, [_el$64, _co$23] = getNextMarker(_el$63.nextSibling);
    _el$58.addEventListener("submit", (event) => event.preventDefault());
    insert(_el$58, createComponent(CompareHomeSelect, {
      get selected() {
        return first();
      },
      label: "First model",
      get expanded() {
        return activeSlot() === "first";
      },
      onOpen: () => setActiveSlot("first")
    }), _el$60, _co$21);
    insert(_el$58, createComponent(CompareHomeSelect, {
      get selected() {
        return second();
      },
      label: "Second model",
      get expanded() {
        return activeSlot() === "second";
      },
      onOpen: () => setActiveSlot("second")
    }), _el$62, _co$22);
    insert(_el$58, createComponent(Show, {
      get when() {
        return activeSlot();
      },
      children: (slot) => createComponent(CompareModelSelectModal, {
        get models() {
          return props.models;
        },
        get selected() {
          return activeSelected();
        },
        get blockedId() {
          return activeBlockedId();
        },
        get label() {
          return slot() === "first" ? "Choose first model" : "Choose second model";
        },
        onClose: () => setActiveSlot(void 0),
        onSelect: (model) => {
          if (slot() === "first") setFirstId(model.id);
          if (slot() === "second") setSecondId(model.id);
          setActiveSlot(void 0);
        }
      })
    }), _el$64, _co$23);
    return _el$58;
  })();
}
function CompareHomeSelect(props) {
  return (() => {
    var _el$65 = getNextElement(_tmpl$5), _el$66 = _el$65.firstChild, _el$67 = _el$66.firstChild, _el$69 = _el$67.nextSibling, [_el$70, _co$24] = getNextMarker(_el$69.nextSibling), _el$68 = _el$70.nextSibling;
    addEventListener(_el$65, "click", props.onOpen, true);
    insert(_el$66, createComponent(Show, {
      get when() {
        return props.selected;
      },
      children: (model) => createComponent(ModelAvatar, {
        get model() {
          return model();
        },
        size: "tiny"
      })
    }), _el$70, _co$24);
    insert(_el$68, () => props.selected?.name ?? "Select a model");
    createRenderEffect((_p$) => {
      var _v$3 = props.selected ? "true" : void 0, _v$4 = props.label, _v$5 = props.expanded;
      _v$3 !== _p$.e && setAttribute(_el$65, "data-selected", _p$.e = _v$3);
      _v$4 !== _p$.t && setAttribute(_el$65, "aria-label", _p$.t = _v$4);
      _v$5 !== _p$.a && setAttribute(_el$65, "aria-expanded", _p$.a = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    runHydrationEvents();
    return _el$65;
  })();
}
function CompareModelSelectModal(props) {
  let searchInput;
  const [search, setSearch] = createSignal("");
  const [previewId, setPreviewId] = createSignal(props.selected?.id ?? "");
  const availableModels = createMemo(() => props.models.filter((model) => model.id !== props.blockedId));
  const filteredModels = createMemo(() => {
    const terms = search().trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return availableModels();
    return availableModels().filter((model) => terms.every((term) => modelSearchText(model).includes(term)));
  });
  const preview = createMemo(() => filteredModels().find((model) => model.id === previewId()) ?? filteredModels()[0] ?? availableModels()[0]);
  createEffect(() => {
    const selected = props.selected;
    const fallback = selected && selected.id !== props.blockedId ? selected.id : filteredModels()[0]?.id;
    if (!fallback) return;
    if (availableModels().some((model) => model.id === previewId())) return;
    setPreviewId(fallback);
  });
  createEffect(() => {
    const models = filteredModels();
    if (models.some((model) => model.id === previewId())) return;
    setPreviewId(models[0]?.id ?? "");
  });
  createEffect(() => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => searchInput?.focus());
  });
  return (() => {
    var _el$71 = getNextElement(_tmpl$6), _el$72 = _el$71.firstChild, _el$73 = _el$72.firstChild, _el$74 = _el$73.firstChild, _el$75 = _el$74.firstChild, _el$76 = _el$75.nextSibling, _el$77 = _el$74.nextSibling, _el$78 = _el$73.nextSibling, _el$79 = _el$78.nextSibling, [_el$80, _co$25] = getNextMarker(_el$79.nextSibling);
    _el$71.$$keydown = (event) => {
      if (event.key !== "Escape") return;
      props.onClose();
    };
    addEventListener(_el$71, "click", props.onClose, true);
    _el$72.$$click = (event) => event.stopPropagation();
    _el$76.$$input = (event) => setSearch(event.currentTarget.value);
    var _ref$ = searchInput;
    typeof _ref$ === "function" ? use(_ref$, _el$76) : searchInput = _el$76;
    insert(_el$77, createComponent(Show, {
      get when() {
        return filteredModels().length > 0;
      },
      get fallback() {
        return getNextElement(_tmpl$7);
      },
      get children() {
        return createComponent(For, {
          get each() {
            return filteredModels();
          },
          children: (model) => (() => {
            var _el$82 = getNextElement(_tmpl$9), _el$83 = _el$82.firstChild, _el$85 = _el$83.firstChild, [_el$86, _co$26] = getNextMarker(_el$85.nextSibling), _el$84 = _el$86.nextSibling, _el$88 = _el$83.nextSibling, [_el$89, _co$27] = getNextMarker(_el$88.nextSibling);
            _el$82.$$click = () => props.onSelect(model);
            _el$82.addEventListener("focus", () => setPreviewId(model.id));
            _el$82.addEventListener("pointerenter", () => setPreviewId(model.id));
            insert(_el$83, createComponent(ModelAvatar, {
              model,
              size: "tiny"
            }), _el$86, _co$26);
            insert(_el$84, () => model.name);
            insert(_el$82, createComponent(Show, {
              get when() {
                return isFreeModel(model);
              },
              get children() {
                return getNextElement(_tmpl$8);
              }
            }), _el$89, _co$27);
            createRenderEffect(() => setAttribute(_el$82, "data-active", preview()?.id === model.id ? "true" : void 0));
            runHydrationEvents();
            return _el$82;
          })()
        });
      }
    }));
    insert(_el$72, createComponent(Show, {
      get when() {
        return preview();
      },
      children: (model) => createComponent(CompareModelDetail, {
        get model() {
          return model();
        }
      })
    }), _el$80, _co$25);
    createRenderEffect(() => setAttribute(_el$72, "aria-label", props.label));
    createRenderEffect(() => setProperty(_el$76, "value", search()));
    runHydrationEvents();
    return _el$71;
  })();
}
function CompareModelDetail(props) {
  return (() => {
    var _el$90 = getNextElement(_tmpl$0), _el$91 = _el$90.firstChild, _el$93 = _el$91.firstChild, [_el$94, _co$28] = getNextMarker(_el$93.nextSibling), _el$92 = _el$94.nextSibling, _el$95 = _el$91.nextSibling, _el$96 = _el$95.firstChild, _el$97 = _el$95.nextSibling, _el$105 = _el$97.firstChild, [_el$106, _co$29] = getNextMarker(_el$105.nextSibling), _el$107 = _el$106.nextSibling, [_el$108, _co$30] = getNextMarker(_el$107.nextSibling), _el$109 = _el$108.nextSibling, [_el$110, _co$31] = getNextMarker(_el$109.nextSibling), _el$111 = _el$110.nextSibling, [_el$112, _co$32] = getNextMarker(_el$111.nextSibling), _el$98 = _el$112.nextSibling, _el$99 = _el$98.firstChild, _el$100 = _el$99.nextSibling, _el$101 = _el$98.nextSibling, _el$102 = _el$101.firstChild, _el$103 = _el$102.nextSibling, _el$104 = _el$103.firstChild;
    insert(_el$91, createComponent(ModelAvatar, {
      get model() {
        return props.model;
      },
      size: "small"
    }), _el$94, _co$28);
    insert(_el$92, () => props.model.name);
    insert(_el$96, () => props.model.description ?? `${props.model.name} is an AI model from ${formatCatalogLabName(props.model.lab)}.`);
    insert(_el$97, createComponent(CompareModelFact, {
      label: "Release",
      get value() {
        return formatCatalogDate(props.model.releaseDate);
      }
    }), _el$106, _co$29);
    insert(_el$97, createComponent(CompareModelFact, {
      label: "Context",
      get value() {
        return formatCatalogLimit(props.model.limit?.context);
      }
    }), _el$108, _co$30);
    insert(_el$97, createComponent(CompareModelFact, {
      label: "Input",
      get value() {
        return formatCatalogUnitPrice(props.model.cost?.input);
      }
    }), _el$110, _co$31);
    insert(_el$97, createComponent(CompareModelFact, {
      label: "Output",
      get value() {
        return formatCatalogUnitPrice(props.model.cost?.output);
      }
    }), _el$112, _co$32);
    insert(_el$100, createComponent(For, {
      each: uptimeBars,
      children: (bar) => (() => {
        var _el$113 = getNextElement(_tmpl$1);
        setAttribute(_el$113, "data-active", bar < 7 ? "true" : void 0);
        return _el$113;
      })()
    }));
    insert(_el$104, () => formatModelUrl(props.model));
    createRenderEffect(() => setAttribute(_el$104, "href", modelHref(props.model)));
    return _el$90;
  })();
}
function CompareModelFact(props) {
  return (() => {
    var _el$114 = getNextElement(_tmpl$10), _el$115 = _el$114.firstChild, _el$116 = _el$115.nextSibling;
    insert(_el$115, () => props.label);
    insert(_el$116, () => props.value);
    return _el$114;
  })();
}
function HeroModelStack() {
  return (() => {
    var _el$117 = getNextElement(_tmpl$11);
    insert(_el$117, createComponent(For, {
      each: heroLabs,
      children: (lab) => (() => {
        var _el$118 = getNextElement(_tmpl$12);
        insert(_el$118, createComponent(LabLogo, {
          get lab() {
            return lab.lab;
          },
          get label() {
            return lab.label;
          },
          size: "large"
        }));
        return _el$118;
      })()
    }));
    return _el$117;
  })();
}
function CompareHomeCard(props) {
  return (() => {
    var _el$119 = getNextElement(_tmpl$13), _el$120 = _el$119.firstChild, _el$121 = _el$120.firstChild, _el$122 = _el$121.firstChild, _el$123 = _el$122.nextSibling, _el$124 = _el$120.nextSibling, _el$125 = _el$124.nextSibling, _el$126 = _el$125.firstChild, _el$127 = _el$126.nextSibling, _el$128 = _el$127.nextSibling, _el$129 = _el$125.nextSibling;
    insert(_el$122, () => props.category.title);
    insert(_el$123, () => props.category.description);
    insert(_el$126, () => props.category.first.name);
    insert(_el$128, () => props.category.second.name);
    insert(_el$129, createComponent(For, {
      get each() {
        return props.category.avatars;
      },
      children: (model) => createComponent(LabLogo, {
        get lab() {
          return model.lab;
        },
        get label() {
          return model.name;
        },
        size: "small"
      })
    }));
    createRenderEffect((_p$) => {
      var _v$6 = comparisonHref(props.category.first, props.category.second), _v$7 = `${props.category.title}: ${props.category.first.name} vs ${props.category.second.name}`;
      _v$6 !== _p$.e && setAttribute(_el$119, "href", _p$.e = _v$6);
      _v$7 !== _p$.t && setAttribute(_el$119, "aria-label", _p$.t = _v$7);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$119;
  })();
}
function ModelAvatar(props) {
  return createComponent(LabLogo, {
    get lab() {
      return props.model.lab;
    },
    get label() {
      return props.model.name;
    },
    get size() {
      return props.size;
    }
  });
}
function LabLogo(props) {
  const iconId = () => getProviderIconId(props.lab);
  return (() => {
    var _el$130 = getNextElement(_tmpl$14);
    insert(_el$130, createComponent(ProviderIcon, {
      "aria-hidden": "true",
      get id() {
        return iconId();
      }
    }));
    createRenderEffect((_p$) => {
      var _v$8 = iconId(), _v$9 = props.size, _v$0 = props.label;
      _v$8 !== _p$.e && setAttribute(_el$130, "data-lab", _p$.e = _v$8);
      _v$9 !== _p$.t && setAttribute(_el$130, "data-size", _p$.t = _v$9);
      _v$0 !== _p$.a && setAttribute(_el$130, "aria-label", _p$.a = _v$0);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$130;
  })();
}
function buildComparisonCategories(models) {
  return categoryTemplates.reduce((result, template2, index) => {
    const candidates = categoryCandidates(template2.kind, models);
    const pair = categoryPair(candidates, models, index, result.keys);
    if (!pair) return result;
    result.keys.add(comparisonKey(pair.first, pair.second));
    const first = modelRefFromCatalog(pair.first);
    const second = modelRefFromCatalog(pair.second);
    result.categories.push({
      title: template2.title,
      description: template2.description,
      first,
      second,
      avatars: [first, second]
    });
    return result;
  }, {
    keys: /* @__PURE__ */ new Set(),
    categories: []
  }).categories;
}
function categoryPair(candidates, fallback, offset, usedKeys) {
  const pool = uniqueModels([...candidates, ...fallback.slice(offset), ...fallback]);
  return pool.flatMap((first, firstIndex) => pool.slice(firstIndex + 1).map((second) => ({
    first,
    second,
    key: comparisonKey(first, second)
  }))).find((pair) => !usedKeys.has(pair.key));
}
function categoryCandidates(kind, models) {
  if (kind === "affordable") return models.filter((model) => model.cost).toSorted((a, b) => modelCost(a) - modelCost(b) || displayDateTime(b.releaseDate) - displayDateTime(a.releaseDate));
  if (kind === "code") return models.filter((model) => model.toolCall || model.reasoning).toSorted(recentModelSort);
  if (kind === "image") return models.filter((model) => model.modalities.output.some((modality) => modality.toLowerCase().includes("image"))).toSorted(recentModelSort);
  return models.toSorted(recentModelSort);
}
function uniqueModels(models) {
  return models.reduce((result, model) => {
    if (!model || result.keys.has(model.id)) return result;
    result.keys.add(model.id);
    result.models.push(model);
    return result;
  }, {
    keys: /* @__PURE__ */ new Set(),
    models: []
  }).models;
}
function recentModelSort(a, b) {
  return displayDateTime(b.releaseDate) - displayDateTime(a.releaseDate) || a.name.localeCompare(b.name);
}
function comparisonKey(first, second) {
  return [first.id, second.id].toSorted().join("|");
}
function modelCost(model) {
  return (model.cost?.input ?? Number.POSITIVE_INFINITY) + (model.cost?.output ?? Number.POSITIVE_INFINITY);
}
function modelSearchText(model) {
  return `${model.name} ${formatCatalogLabName(model.lab)} ${model.id}`.toLowerCase();
}
function isFreeModel(model) {
  return model.cost?.input === 0 && model.cost.output === 0;
}
function modelHref(model) {
  return `${"/data/"}${model.lab}/${model.slug}`;
}
function formatModelUrl(model) {
  return `.../${model.slug}`;
}
function formatCatalogLimit(value) {
  return value === void 0 ? "Unknown" : formatTokens(value);
}
function formatCatalogUnitPrice(value) {
  if (value === void 0) return "Unknown";
  return `${formatModelPrice(value)} / 1M`;
}
function formatModelPrice(value) {
  if (value > 0 && value < 0.01) return `$${value.toFixed(4)}`;
  return formatMoney(value);
}
function formatMoney(value) {
  if (value >= 1e6) return `$${trimNumber(value / 1e6, value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `$${trimNumber(value / 1e3, value >= 1e4 ? 0 : 1)}K`;
  return `$${value.toFixed(value >= 10 ? 0 : 2)}`;
}
function formatCatalogDate(value) {
  if (!value) return "Unknown";
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);
  if (!match) return value;
  return new Intl.DateTimeFormat("en", {
    month: match[2] ? "short" : void 0,
    day: match[3] ? "numeric" : void 0,
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(Number(match[1]), match[2] ? Number(match[2]) - 1 : 0, match[3] ? Number(match[3]) : 1)));
}
function formatTokens(value) {
  if (value >= 1e12) return `${trimNumber(value / 1e12, value >= 1e13 ? 0 : 1)}T`;
  if (value >= 1e9) return `${trimNumber(value / 1e9, value >= 1e10 ? 0 : 1)}B`;
  if (value >= 1e6) return `${trimNumber(value / 1e6, value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `${trimNumber(value / 1e3, value >= 1e4 ? 0 : 1)}K`;
  return String(Math.round(value));
}
function trimNumber(value, digits) {
  return Number(value.toFixed(digits)).toLocaleString("en");
}
function displayDateTime(value) {
  if (!value) return 0;
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.getTime();
  const year = Number(value.match(/\d{4}/)?.[0] ?? 0);
  return Number.isFinite(year) ? year : 0;
}
function getProviderIconId(provider) {
  const id = provider.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (id === "moonshot") return "moonshotai";
  if (id === "zhipu") return "zhipuai";
  return id;
}
delegateEvents(["click", "keydown", "input"]);
export {
  ModelCompareIndex as default
};
