import { y as getNextElement, z as getNextMarker, C as insert, n as createRenderEffect, Z as setAttribute, a8 as template } from "./i18n-DJbnCyo8.js";
var _tmpl$ = /* @__PURE__ */ template(`<strong><a data-slot=heading-link><span data-slot=heading-anchor aria-hidden=true>#</span><!$><!/>.`), _tmpl$2 = /* @__PURE__ */ template(`<span>`), _tmpl$3 = /* @__PURE__ */ template(`<h2>`), _tmpl$4 = /* @__PURE__ */ template(`<p>`);
function SectionHeading(props) {
  const content = [(() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$5 = _el$3.nextSibling, [_el$6, _co$] = getNextMarker(_el$5.nextSibling);
    _el$6.nextSibling;
    insert(_el$2, () => props.title, _el$6, _co$);
    createRenderEffect(() => setAttribute(_el$2, "href", props.href));
    return _el$;
  })(), " ", (() => {
    var _el$7 = getNextElement(_tmpl$2);
    insert(_el$7, () => props.description);
    return _el$7;
  })()];
  if (props.as === "h2") return (() => {
    var _el$8 = getNextElement(_tmpl$3);
    insert(_el$8, content);
    createRenderEffect(() => setAttribute(_el$8, "data-slot", props.slot ?? "section-title"));
    return _el$8;
  })();
  return (() => {
    var _el$9 = getNextElement(_tmpl$4);
    insert(_el$9, content);
    createRenderEffect(() => setAttribute(_el$9, "data-slot", props.slot ?? "section-title"));
    return _el$9;
  })();
}
export {
  SectionHeading as S
};
