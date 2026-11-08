import { u as delegateEvents, s as createSignal, m as createMemo, l as createEffect, y as getNextElement, z as getNextMarker, C as insert, k as createComponent, n as createRenderEffect, $ as setProperty, F as For, Z as setAttribute, X as runHydrationEvents, a8 as template, ae as useParams, V as onMount, T as Title, M as Meta, b as Link, S as Show } from "./i18n-DJbnCyo8.js";
import { b as comparisonHref, m as modelRefFromCatalog, d as createAsync, e as createServerReference, q as query, j as getModelCatalog, i as getGitHubStars, c as catalogSlug, t as themeStorageKey, a as applyThemePreference, l as isThemePreference, H as Header, C as ComparisonCardsSection, F as Footer, f as findModelCatalogEntry, h as formatCatalogLabName, u as uniqueComparisonPairs } from "./stats-shell-D85bQNDr.js";
var _tmpl$$1 = /* @__PURE__ */ template(`<form data-component=comparison-selector><label><span>First model</span><select required><option value disabled>Select model</option><!$><!/></select></label><label><span>Second model</span><select required><option value disabled>Select model</option><!$><!/></select></label><button type=submit>Compare models`), _tmpl$2$1 = /* @__PURE__ */ template(`<option><!$><!/> (<!$><!/>)`);
function ComparisonSelector(props) {
  const [firstId, setFirstId] = createSignal(props.firstId ?? props.models[0]?.id ?? "");
  const [secondId, setSecondId] = createSignal(differentModelId(props.models, firstId(), props.secondId));
  const modelById = createMemo(() => new Map(props.models.map((model) => [model.id, model])));
  const href = createMemo(() => {
    const first = modelById().get(firstId());
    const second = modelById().get(secondId());
    if (!first || !second || first.id === second.id) return void 0;
    return comparisonHref(modelRefFromCatalog(first), modelRefFromCatalog(second));
  });
  createEffect(() => {
    if (firstId() && modelById().has(firstId())) return;
    const next = props.firstId && modelById().has(props.firstId) ? props.firstId : props.models[0]?.id;
    if (next) setFirstId(next);
  });
  createEffect(() => {
    if (secondId() && secondId() !== firstId() && modelById().has(secondId())) return;
    setSecondId(differentModelId(props.models, firstId(), props.secondId));
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, [_el$7, _co$] = getNextMarker(_el$6.nextSibling), _el$8 = _el$2.nextSibling, _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.firstChild, _el$10 = _el$1.nextSibling, [_el$11, _co$2] = getNextMarker(_el$10.nextSibling), _el$12 = _el$8.nextSibling;
    _el$.addEventListener("submit", (event) => {
      event.preventDefault();
      const url = href();
      if (!url || typeof window === "undefined") return;
      window.location.href = url;
    });
    _el$4.$$input = (event) => setFirstId(event.currentTarget.value);
    insert(_el$4, createComponent(For, {
      get each() {
        return props.models;
      },
      children: (model) => (() => {
        var _el$13 = getNextElement(_tmpl$2$1), _el$16 = _el$13.firstChild, [_el$17, _co$3] = getNextMarker(_el$16.nextSibling), _el$14 = _el$17.nextSibling, _el$18 = _el$14.nextSibling, [_el$19, _co$4] = getNextMarker(_el$18.nextSibling);
        _el$19.nextSibling;
        insert(_el$13, () => model.name, _el$17, _co$3);
        insert(_el$13, () => model.lab, _el$19, _co$4);
        createRenderEffect(() => setProperty(_el$13, "value", model.id));
        return _el$13;
      })()
    }), _el$7, _co$);
    _el$0.$$input = (event) => setSecondId(event.currentTarget.value);
    insert(_el$0, createComponent(For, {
      get each() {
        return props.models;
      },
      children: (model) => (() => {
        var _el$20 = getNextElement(_tmpl$2$1), _el$23 = _el$20.firstChild, [_el$24, _co$5] = getNextMarker(_el$23.nextSibling), _el$21 = _el$24.nextSibling, _el$25 = _el$21.nextSibling, [_el$26, _co$6] = getNextMarker(_el$25.nextSibling);
        _el$26.nextSibling;
        insert(_el$20, () => model.name, _el$24, _co$5);
        insert(_el$20, () => model.lab, _el$26, _co$6);
        createRenderEffect(() => setProperty(_el$20, "disabled", model.id === firstId()));
        createRenderEffect(() => setProperty(_el$20, "value", model.id));
        return _el$20;
      })()
    }), _el$11, _co$2);
    createRenderEffect((_p$) => {
      var _v$ = props.label ?? "Model comparison selector", _v$2 = !href();
      _v$ !== _p$.e && setAttribute(_el$, "aria-label", _p$.e = _v$);
      _v$2 !== _p$.t && setProperty(_el$12, "disabled", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    createRenderEffect(() => setProperty(_el$4, "value", firstId()));
    createRenderEffect(() => setProperty(_el$0, "value", secondId()));
    runHydrationEvents();
    return _el$;
  })();
}
function differentModelId(models, firstId, preferredId) {
  if (preferredId && preferredId !== firstId && models.some((model) => model.id === preferredId)) return preferredId;
  return models.find((model) => model.id !== firstId)?.id ?? "";
}
delegateEvents(["input"]);
var _tmpl$ = /* @__PURE__ */ template(`<main data-page=stats><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><!$><!/><script type=application/ld+json><\/script><!$><!/><div data-component=container><div data-component=content><!$><!/><section id=comparison data-section=model-panel><p data-slot=section-title><strong>Comparison Table.</strong> <span>Compare usage, cost, limits, and features.</span></p><!$><!/></section><section id=compare-tool data-section=model-panel data-variant=compact><p data-slot=section-title><strong>Compare Another Pair.</strong> <span>Choose two models to compare.</span></p><!$><!/></section><!$><!/></div><!$><!/>`), _tmpl$2 = /* @__PURE__ */ template(`<div data-component=empty-state data-compact=true><strong>Loading comparison</strong><p>Loading stats for both models.`), _tmpl$3 = /* @__PURE__ */ template(`<div data-component=empty-state data-compact=true><strong>No models found</strong><p>The model list could not be loaded.`), _tmpl$4 = /* @__PURE__ */ template(`<section id=overview data-section=model-hero><a data-slot=model-back-link>Compare</a><div data-slot=model-hero-copy><h1><!$><!/> vs <!$><!/></h1><p>Compare usage, cost, limits, and features for these two models.</p></div><div data-slot=model-hero-pattern aria-hidden=true>`), _tmpl$5 = /* @__PURE__ */ template(`<div data-component=comparison-table-wrap><table data-component=comparison-table><caption><!$><!/> compared with <!$><!/></caption><thead><tr><th scope=col>Metric</th><!$><!/></tr></thead><tbody>`), _tmpl$6 = /* @__PURE__ */ template(`<th scope=col>`), _tmpl$7 = /* @__PURE__ */ template(`<tr><th scope=row><strong></strong><span></span></th><!$><!/>`), _tmpl$8 = /* @__PURE__ */ template(`<td><strong></strong><!$><!/>`), _tmpl$9 = /* @__PURE__ */ template(`<span>`);
const compareFallbackUrl = "https://stats.opencode.ai";
const compareHeaderLinks = [{
  href: "#overview",
  label: "Overview"
}, {
  href: "#comparison",
  label: "Comparison"
}, {
  href: "#compare-tool",
  label: "Compare"
}, {
  href: "#model-comparison",
  label: "Related"
}];
const compareFooterLinks = [{
  href: "/data/",
  label: "Data Home"
}, {
  href: `${"/data/"}compare`,
  label: "Model Compare"
}, {
  href: `${"/data/"}#top-models`,
  label: "Top Models"
}, {
  href: `${"/data/"}#token-cost`,
  label: "Token Cost"
}];
const getComparisonData_query = createServerReference("4a6f12d84bd1d1319ce4178d594dc69c52a10db1e98f58e0bcabc0f89b91d129");
const getComparisonData = query(getComparisonData_query, "getStatsModelComparisonData");
function ModelComparePair() {
  const params = useParams();
  const firstLabParam = createMemo(() => params.firstLab ?? "");
  const firstModelParam = createMemo(() => params.firstModel ?? "");
  const secondLabParam = createMemo(() => params.secondLab ?? "");
  const secondModelParam = createMemo(() => params.secondModel ?? "");
  const catalog = createAsync(() => getModelCatalog());
  const firstCatalog = createMemo(() => resolvedCatalogEntry(catalog(), firstLabParam(), firstModelParam()));
  const secondCatalog = createMemo(() => resolvedCatalogEntry(catalog(), secondLabParam(), secondModelParam()));
  const stats = createAsync(() => {
    if (catalog() === void 0 || firstCatalog() === void 0 || secondCatalog() === void 0) return Promise.resolve(void 0);
    return getComparisonData(firstCatalog()?.lab ?? firstLabParam(), firstCatalog()?.slug ?? firstModelParam(), secondCatalog()?.lab ?? secondLabParam(), secondCatalog()?.slug ?? secondModelParam());
  });
  const githubStars = createAsync(() => getGitHubStars());
  const [themePreference, setThemePreference] = createSignal("system");
  const models = createMemo(() => [buildComparisonModel(firstLabParam(), firstModelParam(), firstCatalog() ?? null, stats()?.models[0] ?? null), buildComparisonModel(secondLabParam(), secondModelParam(), secondCatalog() ?? null, stats()?.models[1] ?? null)]);
  const title = createMemo(() => `${models()[0].name} vs ${models()[1].name} - Model Comparison`);
  const description = createMemo(() => `Compare ${models()[0].name} and ${models()[1].name} by usage, rank, context window, output limit, cache ratio, and cost across OpenCode data.`);
  const canonicalPath = createMemo(() => `${"/data/"}compare/${catalogSlug(models()[0].lab)}/${catalogSlug(models()[0].slug)}/${catalogSlug(models()[1].lab)}/${catalogSlug(models()[1].slug)}`);
  const canonicalUrl = createMemo(() => new URL(canonicalPath(), typeof window === "undefined" ? compareFallbackUrl : window.location.href).toString());
  const rows = createMemo(() => buildComparisonRows(models()[0], models()[1]));
  const relatedPairs = createMemo(() => buildRelatedPairs(catalog(), models()[0], models()[1]));
  const selectorModels = createMemo(() => uniqueCatalogModels([comparisonCatalogEntry(models()[0]), comparisonCatalogEntry(models()[1]), ...catalog()?.models ?? []]));
  const structuredData = createMemo(() => JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title(),
    description: description(),
    url: canonicalUrl(),
    about: models().map((model) => ({
      "@type": "SoftwareApplication",
      name: model.name,
      applicationCategory: "AI model",
      provider: model.labName
    }))
  }));
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
    var _el$ = getNextElement(_tmpl$), _el$17 = _el$.firstChild, [_el$18, _co$6] = getNextMarker(_el$17.nextSibling), _el$19 = _el$18.nextSibling, [_el$20, _co$7] = getNextMarker(_el$19.nextSibling), _el$21 = _el$20.nextSibling, [_el$22, _co$8] = getNextMarker(_el$21.nextSibling), _el$23 = _el$22.nextSibling, [_el$24, _co$9] = getNextMarker(_el$23.nextSibling), _el$25 = _el$24.nextSibling, [_el$26, _co$0] = getNextMarker(_el$25.nextSibling), _el$27 = _el$26.nextSibling, [_el$28, _co$1] = getNextMarker(_el$27.nextSibling), _el$29 = _el$28.nextSibling, [_el$30, _co$10] = getNextMarker(_el$29.nextSibling), _el$31 = _el$30.nextSibling, [_el$32, _co$11] = getNextMarker(_el$31.nextSibling), _el$33 = _el$32.nextSibling, [_el$34, _co$12] = getNextMarker(_el$33.nextSibling), _el$35 = _el$34.nextSibling, [_el$36, _co$13] = getNextMarker(_el$35.nextSibling), _el$37 = _el$36.nextSibling, [_el$38, _co$14] = getNextMarker(_el$37.nextSibling), _el$2 = _el$38.nextSibling, _el$39 = _el$2.nextSibling, [_el$40, _co$15] = getNextMarker(_el$39.nextSibling), _el$3 = _el$40.nextSibling, _el$4 = _el$3.firstChild, _el$11 = _el$4.firstChild, [_el$12, _co$3] = getNextMarker(_el$11.nextSibling), _el$5 = _el$12.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, [_el$8, _co$] = getNextMarker(_el$7.nextSibling), _el$9 = _el$5.nextSibling, _el$0 = _el$9.firstChild, _el$1 = _el$0.nextSibling, [_el$10, _co$2] = getNextMarker(_el$1.nextSibling), _el$13 = _el$9.nextSibling, [_el$14, _co$4] = getNextMarker(_el$13.nextSibling), _el$15 = _el$4.nextSibling, [_el$16, _co$5] = getNextMarker(_el$15.nextSibling);
    insert(_el$, createComponent(Title, {
      get children() {
        return title();
      }
    }), _el$18, _co$6);
    insert(_el$, createComponent(Meta, {
      name: "description",
      get content() {
        return description();
      }
    }), _el$20, _co$7);
    insert(_el$, createComponent(Link, {
      rel: "canonical",
      get href() {
        return canonicalUrl();
      }
    }), _el$22, _co$8);
    insert(_el$, createComponent(Meta, {
      property: "og:type",
      content: "website"
    }), _el$24, _co$9);
    insert(_el$, createComponent(Meta, {
      property: "og:site_name",
      content: "OpenCode"
    }), _el$26, _co$0);
    insert(_el$, createComponent(Meta, {
      property: "og:title",
      get content() {
        return title();
      }
    }), _el$28, _co$1);
    insert(_el$, createComponent(Meta, {
      property: "og:description",
      get content() {
        return description();
      }
    }), _el$30, _co$10);
    insert(_el$, createComponent(Meta, {
      property: "og:url",
      get content() {
        return canonicalUrl();
      }
    }), _el$32, _co$11);
    insert(_el$, createComponent(Meta, {
      name: "twitter:card",
      content: "summary"
    }), _el$34, _co$12);
    insert(_el$, createComponent(Meta, {
      name: "twitter:title",
      get content() {
        return title();
      }
    }), _el$36, _co$13);
    insert(_el$, createComponent(Meta, {
      name: "twitter:description",
      get content() {
        return description();
      }
    }), _el$38, _co$14);
    insert(_el$2, structuredData);
    insert(_el$, createComponent(Header, {
      get githubStars() {
        return githubStars() ?? "150K";
      },
      links: compareHeaderLinks,
      get brandHref() {
        return "/data/";
      }
    }), _el$40, _co$15);
    insert(_el$4, createComponent(ComparisonHero, {
      get models() {
        return models();
      }
    }), _el$12, _co$3);
    insert(_el$5, createComponent(Show, {
      get when() {
        return stats() !== void 0;
      },
      get fallback() {
        return getNextElement(_tmpl$2);
      },
      get children() {
        return createComponent(ComparisonTable, {
          get models() {
            return models();
          },
          get rows() {
            return rows();
          }
        });
      }
    }), _el$8, _co$);
    insert(_el$9, createComponent(Show, {
      get when() {
        return selectorModels().length > 1;
      },
      get fallback() {
        return getNextElement(_tmpl$3);
      },
      get children() {
        return createComponent(ComparisonSelector, {
          get models() {
            return selectorModels();
          },
          get firstId() {
            return comparisonCatalogEntry(models()[0]).id;
          },
          get secondId() {
            return comparisonCatalogEntry(models()[1]).id;
          }
        });
      }
    }), _el$10, _co$2);
    insert(_el$4, createComponent(ComparisonCardsSection, {
      get pairs() {
        return relatedPairs();
      },
      title: "Related Model Comparisons",
      description: "Other model pairs to check."
    }), _el$14, _co$4);
    insert(_el$3, createComponent(Footer, {
      get themePreference() {
        return themePreference();
      },
      onThemePreferenceChange: updateThemePreference,
      links: compareFooterLinks,
      bridge: {
        href: "#comparison",
        label: "COMPARE TABLE"
      }
    }), _el$16, _co$5);
    createRenderEffect(() => setAttribute(_el$, "data-theme", themePreference()));
    return _el$;
  })();
}
function ComparisonHero(props) {
  return (() => {
    var _el$43 = getNextElement(_tmpl$4), _el$44 = _el$43.firstChild, _el$45 = _el$44.nextSibling, _el$46 = _el$45.firstChild, _el$48 = _el$46.firstChild, [_el$49, _co$16] = getNextMarker(_el$48.nextSibling), _el$47 = _el$49.nextSibling, _el$50 = _el$47.nextSibling, [_el$51, _co$17] = getNextMarker(_el$50.nextSibling);
    insert(_el$46, () => props.models[0].name, _el$49, _co$16);
    insert(_el$46, () => props.models[1].name, _el$51, _co$17);
    createRenderEffect(() => setAttribute(_el$44, "href", `${"/data/"}compare`));
    return _el$43;
  })();
}
function ComparisonTable(props) {
  return (() => {
    var _el$52 = getNextElement(_tmpl$5), _el$53 = _el$52.firstChild, _el$54 = _el$53.firstChild, _el$56 = _el$54.firstChild, [_el$57, _co$18] = getNextMarker(_el$56.nextSibling), _el$55 = _el$57.nextSibling, _el$58 = _el$55.nextSibling, [_el$59, _co$19] = getNextMarker(_el$58.nextSibling), _el$60 = _el$54.nextSibling, _el$61 = _el$60.firstChild, _el$62 = _el$61.firstChild, _el$63 = _el$62.nextSibling, [_el$64, _co$20] = getNextMarker(_el$63.nextSibling), _el$65 = _el$60.nextSibling;
    insert(_el$54, () => props.models[0].name, _el$57, _co$18);
    insert(_el$54, () => props.models[1].name, _el$59, _co$19);
    insert(_el$61, createComponent(For, {
      get each() {
        return props.models;
      },
      children: (model) => (() => {
        var _el$66 = getNextElement(_tmpl$6);
        insert(_el$66, () => model.name);
        return _el$66;
      })()
    }), _el$64, _co$20);
    insert(_el$65, createComponent(For, {
      get each() {
        return props.rows;
      },
      children: (row) => {
        const best = () => bestCellIndex(row);
        return (() => {
          var _el$67 = getNextElement(_tmpl$7), _el$68 = _el$67.firstChild, _el$69 = _el$68.firstChild, _el$70 = _el$69.nextSibling, _el$71 = _el$68.nextSibling, [_el$72, _co$21] = getNextMarker(_el$71.nextSibling);
          insert(_el$69, () => row.label);
          insert(_el$70, () => row.description);
          insert(_el$67, createComponent(For, {
            get each() {
              return row.cells;
            },
            children: (cell, index) => (() => {
              var _el$73 = getNextElement(_tmpl$8), _el$74 = _el$73.firstChild, _el$75 = _el$74.nextSibling, [_el$76, _co$22] = getNextMarker(_el$75.nextSibling);
              insert(_el$74, () => cell.value);
              insert(_el$73, createComponent(Show, {
                get when() {
                  return cell.detail;
                },
                children: (detail) => (() => {
                  var _el$77 = getNextElement(_tmpl$9);
                  insert(_el$77, detail);
                  return _el$77;
                })()
              }), _el$76, _co$22);
              createRenderEffect(() => setAttribute(_el$73, "data-best", best() === index() ? "true" : void 0));
              return _el$73;
            })()
          }), _el$72, _co$21);
          return _el$67;
        })();
      }
    }));
    return _el$52;
  })();
}
function resolvedCatalogEntry(catalog, lab, model) {
  if (!catalog) return void 0;
  return findModelCatalogEntry(catalog, model, lab) ?? null;
}
function buildComparisonModel(labParam, modelParam, catalog, stats) {
  return {
    name: catalog?.name ?? stats?.model ?? formatParamName(modelParam),
    lab: catalog?.lab ?? stats?.provider ?? catalogSlug(labParam),
    labName: formatCatalogLabName(catalog?.lab ?? stats?.provider ?? labParam),
    slug: catalog?.slug ?? stats?.slug ?? catalogSlug(modelParam),
    catalog,
    stats
  };
}
function comparisonCatalogEntry(model) {
  if (model.catalog) return model.catalog;
  return {
    id: `${catalogSlug(model.lab)}/${catalogSlug(model.slug)}`,
    lab: catalogSlug(model.lab),
    slug: catalogSlug(model.slug),
    name: model.name,
    modalities: {
      input: [],
      output: []
    },
    openWeights: false,
    reasoning: false,
    toolCall: false,
    attachment: false,
    temperature: false,
    weights: [],
    benchmarks: []
  };
}
function uniqueCatalogModels(models) {
  return Object.values(models.reduce((result, model) => {
    result[model.id] = result[model.id] ?? model;
    return result;
  }, {}));
}
function buildComparisonRows(first, second) {
  return [comparisonRow("Recent Rank", "Lower is better.", {
    value: first.stats?.rank == null ? "No usage" : `#${first.stats.rank}`,
    score: first.stats?.rank ?? void 0
  }, {
    value: second.stats?.rank == null ? "No usage" : `#${second.stats.rank}`,
    score: second.stats?.rank ?? void 0
  }, "lower"), comparisonRow("Token Share", "Share of recent OpenCode usage.", {
    value: first.stats ? formatPercent(first.stats.tokenShare) : "No usage",
    score: first.stats?.tokenShare
  }, {
    value: second.stats ? formatPercent(second.stats.tokenShare) : "No usage",
    score: second.stats?.tokenShare
  }, "higher"), comparisonRow("Tokens", "Recent token volume.", {
    value: first.stats ? formatTokens(first.stats.totals.tokens) : "No usage",
    score: first.stats?.totals.tokens
  }, {
    value: second.stats ? formatTokens(second.stats.totals.tokens) : "No usage",
    score: second.stats?.totals.tokens
  }, "higher"), comparisonRow("Sessions", "Recent session count.", {
    value: first.stats ? formatInteger(first.stats.totals.sessions) : "No usage",
    score: first.stats?.totals.sessions
  }, {
    value: second.stats ? formatInteger(second.stats.totals.sessions) : "No usage",
    score: second.stats?.totals.sessions
  }, "higher"), comparisonRow("Cost / 1M Tokens", "Lower is better.", {
    value: first.stats ? formatMoney(first.stats.totals.costPerMillion) : "No usage",
    score: positiveScore(first.stats?.totals.costPerMillion)
  }, {
    value: second.stats ? formatMoney(second.stats.totals.costPerMillion) : "No usage",
    score: positiveScore(second.stats?.totals.costPerMillion)
  }, "lower"), comparisonRow("Cost / Session", "Lower is better.", {
    value: first.stats ? formatSessionCost(first.stats.totals.costPerSession) : "No usage",
    score: positiveScore(first.stats?.totals.costPerSession)
  }, {
    value: second.stats ? formatSessionCost(second.stats.totals.costPerSession) : "No usage",
    score: positiveScore(second.stats?.totals.costPerSession)
  }, "lower"), comparisonRow("Cache Ratio", "Higher is better.", {
    value: first.stats ? formatPercent(first.stats.totals.cacheRatio) : "No usage",
    score: first.stats?.totals.cacheRatio
  }, {
    value: second.stats ? formatPercent(second.stats.totals.cacheRatio) : "No usage",
    score: second.stats?.totals.cacheRatio
  }, "higher"), comparisonRow("Context Window", "Higher limit is better.", {
    value: formatCatalogLimit(first.catalog?.limit?.context),
    score: first.catalog?.limit?.context
  }, {
    value: formatCatalogLimit(second.catalog?.limit?.context),
    score: second.catalog?.limit?.context
  }, "higher"), comparisonRow("Output Limit", "Higher limit is better.", {
    value: formatCatalogLimit(first.catalog?.limit?.output),
    score: first.catalog?.limit?.output
  }, {
    value: formatCatalogLimit(second.catalog?.limit?.output),
    score: second.catalog?.limit?.output
  }, "higher"), comparisonRow("Release Date", "Newer release is highlighted.", {
    value: formatCatalogDate(first.catalog?.releaseDate),
    score: catalogDateScore(first.catalog?.releaseDate)
  }, {
    value: formatCatalogDate(second.catalog?.releaseDate),
    score: catalogDateScore(second.catalog?.releaseDate)
  }, "higher"), comparisonRow("Reasoning", "Supports reasoning.", booleanCell(first.catalog?.reasoning), booleanCell(second.catalog?.reasoning), "higher"), comparisonRow("Tool Calling", "Supports tool calls.", booleanCell(first.catalog?.toolCall), booleanCell(second.catalog?.toolCall), "higher"), comparisonRow("Attachments", "Supports attachments.", booleanCell(first.catalog?.attachment), booleanCell(second.catalog?.attachment), "higher"), comparisonRow("Open Weights", "Open weights available.", booleanCell(first.catalog?.openWeights), booleanCell(second.catalog?.openWeights), "higher")];
}
function comparisonRow(label, description, first, second, direction) {
  return {
    label,
    description,
    direction,
    cells: [first, second]
  };
}
function bestCellIndex(row) {
  const [first, second] = row.cells.map((cell) => cell.score);
  if (first === void 0 || second === void 0 || first === second) return void 0;
  if (row.direction === "higher") return first > second ? 0 : 1;
  return first < second ? 0 : 1;
}
function buildRelatedPairs(catalog, first, second) {
  const current = [comparisonRef(first), comparisonRef(second)];
  const alternatives = (catalog?.models ?? []).filter((model) => model.id !== first.catalog?.id && model.id !== second.catalog?.id).slice(0, 4).map(modelRefFromCatalog);
  return uniqueComparisonPairs([...alternatives.slice(0, 3).flatMap((model, index) => [{
    first: current[0],
    second: model,
    detail: index === 0 ? "Nearby alternative" : "Related comparison"
  }, {
    first: current[1],
    second: model,
    detail: index === 0 ? "Nearby alternative" : "Related comparison"
  }])]).slice(0, 6);
}
function comparisonRef(model) {
  return {
    name: model.name,
    lab: model.lab,
    slug: model.slug,
    labName: model.labName,
    metric: model.stats ? `#${model.stats.rank}` : "Catalog"
  };
}
function positiveScore(value) {
  return value && value > 0 ? value : void 0;
}
function booleanCell(value) {
  if (value === void 0) return {
    value: "Unknown"
  };
  return {
    value: value ? "Yes" : "No",
    score: value ? 1 : 0
  };
}
function catalogDateScore(value) {
  if (!value) return void 0;
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);
  if (!match) return void 0;
  return Date.UTC(Number(match[1]), match[2] ? Number(match[2]) - 1 : 0, match[3] ? Number(match[3]) : 1);
}
function formatParamName(value) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()).trim();
}
function formatCatalogLimit(value) {
  return value === void 0 ? "Unknown" : formatTokens(value);
}
function formatCatalogDate(value) {
  if (!value) return "Unknown";
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) - 1 : 0;
  const day = match[3] ? Number(match[3]) : 1;
  return new Intl.DateTimeFormat("en", {
    month: match[2] ? "short" : void 0,
    day: match[3] ? "numeric" : void 0,
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month, day)));
}
function formatTokens(value) {
  if (value >= 1e12) return `${trimNumber(value / 1e12, value >= 1e13 ? 0 : 1)}T`;
  if (value >= 1e9) return `${trimNumber(value / 1e9, value >= 1e10 ? 0 : 1)}B`;
  if (value >= 1e6) return `${trimNumber(value / 1e6, value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `${trimNumber(value / 1e3, value >= 1e4 ? 0 : 1)}K`;
  return String(Math.round(value));
}
function formatInteger(value) {
  return new Intl.NumberFormat("en").format(value);
}
function formatPercent(value) {
  return `${trimNumber(value, value >= 10 ? 1 : 2)}%`;
}
function formatMoney(value) {
  if (value >= 1) return `$${trimNumber(value, 2)}`;
  if (value > 0) return `$${value.toFixed(4)}`;
  return "$0";
}
function formatSessionCost(value) {
  if (value >= 1) return `$${trimNumber(value, 2)}`;
  if (value >= 0.01) return `$${value.toFixed(2)}`;
  if (value > 0) return `$${value.toFixed(4)}`;
  return "$0";
}
function trimNumber(value, digits) {
  return Number(value.toFixed(digits)).toLocaleString("en");
}
export {
  ModelComparePair as default
};
