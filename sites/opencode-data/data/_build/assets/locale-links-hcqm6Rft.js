import { a2 as splitProps, m as createMemo, y as getNextElement, a3 as spread, N as mergeProps, n as createRenderEffect, Z as setAttribute, X as runHydrationEvents, a8 as template, ac as useLanguage, k as createComponent, J as localizedUrl, b as Link, L as LOCALES, a7 as tag, F as For } from "./i18n-DJbnCyo8.js";
const sprite = "/data/_build/assets/sprite-Chb7ocDN.svg";
const iconNames = ["zhipuai", "zhipuai-coding-plan", "zenmux", "zai", "zai-coding-plan", "xiaomi", "xai", "wandb", "vultr", "vivgrid", "vercel", "venice", "v0", "upstage", "togetherai", "synthetic", "submodel", "stepfun", "stackit", "siliconflow", "siliconflow-cn", "scaleway", "sap-ai-core", "requesty", "qiniu-ai", "qihang-ai", "privatemode-ai", "poe", "perplexity", "ovhcloud", "openrouter", "llmgateway", "opencode", "opencode-go", "openai", "ollama-cloud", "nvidia", "novita-ai", "nova", "nebius", "nano-gpt", "morph", "moonshotai", "moonshotai-cn", "modelscope", "moark", "mistral", "minimax", "minimax-coding-plan", "minimax-cn", "minimax-cn-coding-plan", "meganova", "lucidquery", "lmstudio", "llama", "kuae-cloud-coding-plan", "kimi-for-coding", "kilo", "jiekou", "io-net", "inference", "inception", "iflowcn", "huggingface", "helicone", "groq", "google", "google-vertex", "google-vertex-anthropic", "gitlab", "github-models", "github-copilot", "friendli", "firmware", "fireworks-ai", "fastrouter", "evroc", "digitalocean", "deepseek", "deepinfra", "cortecs", "cohere", "cloudflare-workers-ai", "cloudflare-ai-gateway", "cloudferro-sherlock", "chutes", "cerebras", "berget", "baseten", "bailing", "azure", "azure-cognitive-services", "anthropic", "amazon-bedrock", "alibaba", "alibaba-cn", "aihubmix", "abacus", "302ai"];
var _tmpl$ = /* @__PURE__ */ template(`<svg data-component=provider-icon><use>`);
const ProviderIcon = (props) => {
  const [local, rest] = splitProps(props, ["id", "class", "classList"]);
  const resolved = createMemo(() => iconNames.includes(local.id) ? local.id : "synthetic");
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild;
    spread(_el$, mergeProps(rest, {
      get classList() {
        return {
          ...local.classList,
          [local.class ?? ""]: !!local.class
        };
      }
    }), true, true);
    createRenderEffect(() => setAttribute(_el$2, "href", `${sprite}#${resolved()}`));
    runHydrationEvents();
    return _el$;
  })();
};
function LocaleLinks(props) {
  const language = useLanguage();
  return [createComponent(Link, {
    rel: "canonical",
    get href() {
      return localizedUrl(language.locale(), props.path);
    }
  }), createComponent(For, {
    each: LOCALES,
    children: (locale) => createComponent(Link, {
      rel: "alternate",
      get hreflang() {
        return tag(locale);
      },
      get href() {
        return localizedUrl(locale, props.path);
      }
    })
  }), createComponent(Link, {
    rel: "alternate",
    hreflang: "x-default",
    get href() {
      return localizedUrl("en", props.path);
    }
  })];
}
export {
  LocaleLinks as L,
  ProviderIcon as P
};
