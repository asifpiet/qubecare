var tr = Object.defineProperty;
var nr = (t, e, n) => e in t ? tr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var xn = (t, e, n) => nr(t, typeof e != "symbol" ? e + "" : e, n);
import { reactive as xt, watch as De, ref as A, shallowRef as sr, onMounted as $e, onUnmounted as Kn, onUpdated as Is, nextTick as ct, computed as bt, inject as re, openBlock as v, createElementBlock as g, withKeys as St, unref as o, createElementVNode as l, withModifiers as et, renderSlot as At, normalizeClass as le, toDisplayString as b, createBlock as G, resolveDynamicComponent as Hs, withCtx as J, createVNode as z, Fragment as ge, renderList as ke, createCommentVNode as H, withDirectives as ue, vModelCheckbox as jt, createTextVNode as Z, vModelSelect as An, vModelText as $t, onBeforeUnmount as Rs, customRef as or, vShow as ze, isRef as rr, TransitionGroup as lr, normalizeStyle as an, mergeModels as ar, useModel as Bs, resolveComponent as ir, provide as cr, Transition as dr } from "vue";
import ur from "mitt";
import vr from "dragselect";
import fr from "@uppy/core";
import _r from "@uppy/xhr-upload";
import mr from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import pr from "cropperjs";
var Fs;
const Sn = (Fs = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : Fs.getAttribute("content");
class hr {
  /** @param {RequestConfig} config */
  constructor(e) {
    /** @type {RequestConfig} */
    xn(this, "config");
    xn(this, "customFetch", async (...e) => {
      let [n, r] = e;
      this.config.fetchRequestInterceptor && (r = this.config.fetchRequestInterceptor(r));
      let s = await fetch(n, r);
      return this.config.fetchResponseInterceptor && (s = await this.config.fetchResponseInterceptor(s)), s;
    });
    this.config = e;
  }
  /** @type {RequestConfig} */
  get config() {
    return this.config;
  }
  /**
   * Transform request params
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {Record<String,?String>|FormData=} input.body
   * @return {RequestTransformResultInternal}
   */
  transformRequestParams(e) {
    const n = this.config, r = {};
    Sn != null && Sn !== "" && (r[n.xsrfHeaderName] = Sn);
    const s = Object.assign(
      {},
      n.headers,
      r,
      e.headers
    ), a = Object.assign({}, n.params, e.params), c = e.body, u = n.baseUrl + e.url, i = e.method;
    let d;
    i !== "get" && (c instanceof FormData ? (d = c, n.body != null && Object.entries(this.config.body).forEach(([m, p]) => {
      d.append(m, p);
    })) : (d = { ...c }, n.body != null && Object.assign(d, this.config.body)));
    const f = {
      url: u,
      method: i,
      headers: s,
      params: a,
      body: d
    };
    if (n.transformRequest != null) {
      const m = n.transformRequest({
        url: u,
        method: i,
        headers: s,
        params: a,
        body: d
      });
      m.url != null && (f.url = m.url), m.method != null && (f.method = m.method), m.params != null && (f.params = m.params ?? {}), m.headers != null && (f.headers = m.headers ?? {}), m.body != null && (f.body = m.body);
    }
    return f;
  }
  /**
   * Get download url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getDownloadUrl(e, n) {
    if (n.url != null)
      return n.url;
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: n.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
  }
  /**
   * verify status
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  verifyStatus(e, n) {
    if (n.url != null)
      return n.url;
    console.log(n);
    const r = this.transformRequestParams({
      url: "",
      method: "post",
      params: { q: "status", adapter: e, path: n.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
  }
  /**
   * Get preview url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getPreviewUrl(e, n) {
    if (n.url != null)
      return n.url;
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: n.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
  }
  /**
   * Send request
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {(Record<String,?String>|FormData|null)=} input.body
   * @param {'arrayBuffer'|'blob'|'json'|'text'=} input.responseType
   * @param {AbortSignal=} input.abortSignal
   * @returns {Promise<(ArrayBuffer|Blob|Record<String,?String>|String|null)>}
   * @throws {Record<String,?String>|null} resp json error
   */
  async send(e) {
    const n = this.transformRequestParams(e), r = e.responseType || "json", s = {
      method: e.method,
      headers: n.headers,
      signal: e.abortSignal
    }, a = n.url + "?" + new URLSearchParams(n.params);
    if (n.method !== "get" && n.body != null) {
      let u;
      n.body instanceof FormData ? u = e.body : (u = JSON.stringify(n.body), s.headers["Content-Type"] = "application/json"), s.body = u;
    }
    this.config.fetchParams && Object.assign(s, this.config.fetchParams);
    const c = await this.customFetch(a, s);
    if (c.ok)
      return await c[r]();
    throw await c.json();
  }
}
function gr(t) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token",
    fetchParams: {}
  };
  return typeof t == "string" ? Object.assign(e, { baseUrl: t }) : Object.assign(e, t), new hr(e);
}
function br(t) {
  let e = localStorage.getItem(t + "_storage");
  const n = xt(JSON.parse(e ?? "{}"));
  De(n, r);
  function r() {
    Object.keys(n).length ? localStorage.setItem(t + "_storage", JSON.stringify(n)) : localStorage.removeItem(t + "_storage");
  }
  function s(i, d) {
    n[i] = d;
  }
  function a(i) {
    delete n[i];
  }
  function c() {
    Object.keys(n).map((i) => a(i));
  }
  return { getStore: (i, d = null) => n.hasOwnProperty(i) ? n[i] : d, setStore: s, removeStore: a, clearStore: c };
}
async function wr(t, e) {
  const n = e[t];
  return typeof n == "function" ? (await n()).default : n;
}
function yr(t, e, n, r) {
  const { getStore: s, setStore: a } = t, c = A({}), u = A(s("locale", e)), i = (m, p = e) => {
    wr(m, r).then((_) => {
      c.value = _, a("locale", m), u.value = m, a("translations", _), Object.values(r).length > 1 && (n.emit("vf-toast-push", { label: "The language is set to " + m }), n.emit("vf-language-saved"));
    }).catch((_) => {
      p ? (n.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), i(p, null)) : n.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  De(u, (m) => {
    i(m);
  }), !s("locale") && !r.length ? i(e) : c.value = s("translations");
  const d = (m, ...p) => p.length ? d(m = m.replace("%s", p.shift()), ...p) : m;
  function f(m, ...p) {
    return c.value && c.value.hasOwnProperty(m) ? d(c.value[m], ...p) : d(m, ...p);
  }
  return xt({ t: f, locale: u });
}
const de = {
  EDIT: "edit",
  NEW_FILE: "newfile",
  NEW_FOLDER: "newfolder",
  PREVIEW: "preview",
  ARCHIVE: "archive",
  UNARCHIVE: "unarchive",
  SEARCH: "search",
  RENAME: "rename",
  UPLOAD: "upload",
  DELETE: "delete",
  FULL_SCREEN: "fullscreen",
  DOWNLOAD: "download",
  LANGUAGE: "language"
}, kr = Object.values(de), xr = "2.7.0";
function Us(t, e, n, r, s) {
  return (e = Math, n = e.log, r = 1024, s = n(t) / n(r) | 0, t / e.pow(r, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "iB" : "B");
}
function Ns(t, e, n, r, s) {
  return (e = Math, n = e.log, r = 1e3, s = n(t) / n(r) | 0, t / e.pow(r, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "B" : "B");
}
function Sr(t) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, r = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(t);
  return r[1] * Math.pow(1024, e[r[2].toLowerCase()]);
}
const st = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function $r(t, e) {
  const n = A(st.SYSTEM), r = A(st.LIGHT);
  n.value = t.getStore("theme", e ?? st.SYSTEM);
  const s = window.matchMedia("(prefers-color-scheme: dark)"), a = (c) => {
    n.value === st.DARK || n.value === st.SYSTEM && c.matches ? r.value = st.DARK : r.value = st.LIGHT;
  };
  return a(s), s.addEventListener("change", a), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: n,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: r,
    /**
     * @param {Theme} value
     */
    set(c) {
      n.value = c, c !== st.SYSTEM ? t.setStore("theme", c) : t.removeStore("theme"), a(s);
    }
  };
}
function Cr() {
  const t = sr(null), e = A(!1), n = A();
  return { visible: e, type: t, data: n, open: (a, c = null) => {
    document.querySelector("body").style.overflow = "hidden", e.value = !0, t.value = a, n.value = c;
  }, close: () => {
    document.querySelector("body").style.overflow = "", e.value = !1, t.value = null;
  } };
}
/*!
 * OverlayScrollbars
 * Version: 2.10.1
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
const Le = (t, e) => {
  const { o: n, i: r, u: s } = t;
  let a = n, c;
  const u = (f, m) => {
    const p = a, _ = f, h = m || (r ? !r(p, _) : p !== _);
    return (h || s) && (a = _, c = p), [a, h, c];
  };
  return [e ? (f) => u(e(a, c), f) : u, (f) => [a, !!f, c]];
}, Er = typeof window < "u" && typeof HTMLElement < "u" && !!window.document, Ve = Er ? window : {}, Ps = Math.max, Tr = Math.min, Dn = Math.round, Qt = Math.abs, ms = Math.sign, zs = Ve.cancelAnimationFrame, Yn = Ve.requestAnimationFrame, en = Ve.setTimeout, Vn = Ve.clearTimeout, cn = (t) => typeof Ve[t] < "u" ? Ve[t] : void 0, Mr = cn("MutationObserver"), ps = cn("IntersectionObserver"), tn = cn("ResizeObserver"), Yt = cn("ScrollTimeline"), Xn = (t) => t === void 0, dn = (t) => t === null, je = (t) => typeof t == "number", Ot = (t) => typeof t == "string", Zn = (t) => typeof t == "boolean", Re = (t) => typeof t == "function", Ge = (t) => Array.isArray(t), nn = (t) => typeof t == "object" && !Ge(t) && !dn(t), Jn = (t) => {
  const e = !!t && t.length, n = je(e) && e > -1 && e % 1 == 0;
  return Ge(t) || !Re(t) && n ? e > 0 && nn(t) ? e - 1 in t : !0 : !1;
}, sn = (t) => !!t && t.constructor === Object, on = (t) => t instanceof HTMLElement, un = (t) => t instanceof Element;
function ae(t, e) {
  if (Jn(t))
    for (let n = 0; n < t.length && e(t[n], n, t) !== !1; n++)
      ;
  else t && ae(Object.keys(t), (n) => e(t[n], n, t));
  return t;
}
const qs = (t, e) => t.indexOf(e) >= 0, Dt = (t, e) => t.concat(e), me = (t, e, n) => (!Ot(e) && Jn(e) ? Array.prototype.push.apply(t, e) : t.push(e), t), lt = (t) => Array.from(t || []), Qn = (t) => Ge(t) ? t : !Ot(t) && Jn(t) ? lt(t) : [t], Ln = (t) => !!t && !t.length, On = (t) => lt(new Set(t)), Ie = (t, e, n) => {
  ae(t, (s) => s ? s.apply(void 0, e || []) : !0), !n && (t.length = 0);
}, js = "paddingTop", Gs = "paddingRight", Ws = "paddingLeft", Ks = "paddingBottom", Ys = "marginLeft", Xs = "marginRight", Zs = "marginBottom", Js = "overflowX", Qs = "overflowY", vn = "width", fn = "height", ot = "visible", it = "hidden", wt = "scroll", Ar = (t) => {
  const e = String(t || "");
  return e ? e[0].toUpperCase() + e.slice(1) : "";
}, _n = (t, e, n, r) => {
  if (t && e) {
    let s = !0;
    return ae(n, (a) => {
      const c = t[a], u = e[a];
      c !== u && (s = !1);
    }), s;
  }
  return !1;
}, eo = (t, e) => _n(t, e, ["w", "h"]), Xt = (t, e) => _n(t, e, ["x", "y"]), Dr = (t, e) => _n(t, e, ["t", "r", "b", "l"]), dt = () => {
}, X = (t, ...e) => t.bind(0, ...e), mt = (t) => {
  let e;
  const n = t ? en : Yn, r = t ? Vn : zs;
  return [(s) => {
    r(e), e = n(() => s(), Re(t) ? t() : t);
  }, () => r(e)];
}, Fn = (t, e) => {
  const { _: n, p: r, v: s, S: a } = e || {};
  let c, u, i, d, f = dt;
  const m = function($) {
    f(), Vn(c), d = c = u = void 0, f = dt, t.apply(this, $);
  }, p = (w) => a && u ? a(u, w) : w, _ = () => {
    f !== dt && m(p(i) || i);
  }, h = function() {
    const $ = lt(arguments), D = Re(n) ? n() : n;
    if (je(D) && D >= 0) {
      const E = Re(r) ? r() : r, C = je(E) && E >= 0, V = D > 0 ? en : Yn, F = D > 0 ? Vn : zs, O = p($) || $, y = m.bind(0, O);
      let k;
      f(), s && !d ? (y(), d = !0, k = V(() => d = void 0, D)) : (k = V(y, D), C && !c && (c = en(_, E))), f = () => F(k), u = i = O;
    } else
      m($);
  };
  return h.m = _, h;
}, to = (t, e) => Object.prototype.hasOwnProperty.call(t, e), Ue = (t) => t ? Object.keys(t) : [], oe = (t, e, n, r, s, a, c) => {
  const u = [e, n, r, s, a, c];
  return (typeof t != "object" || dn(t)) && !Re(t) && (t = {}), ae(u, (i) => {
    ae(i, (d, f) => {
      const m = i[f];
      if (t === m)
        return !0;
      const p = Ge(m);
      if (m && sn(m)) {
        const _ = t[f];
        let h = _;
        p && !Ge(_) ? h = [] : !p && !sn(_) && (h = {}), t[f] = oe(h, m);
      } else
        t[f] = p ? m.slice() : m;
    });
  }), t;
}, no = (t, e) => ae(oe({}, t), (n, r, s) => {
  n === void 0 ? delete s[r] : n && sn(n) && (s[r] = no(n));
}), es = (t) => !Ue(t).length, so = (t, e, n) => Ps(t, Tr(e, n)), ut = (t) => On((Ge(t) ? t : (t || "").split(" ")).filter((e) => e)), ts = (t, e) => t && t.getAttribute(e), hs = (t, e) => t && t.hasAttribute(e), Je = (t, e, n) => {
  ae(ut(e), (r) => {
    t && t.setAttribute(r, String(n || ""));
  });
}, Pe = (t, e) => {
  ae(ut(e), (n) => t && t.removeAttribute(n));
}, mn = (t, e) => {
  const n = ut(ts(t, e)), r = X(Je, t, e), s = (a, c) => {
    const u = new Set(n);
    return ae(ut(a), (i) => {
      u[c](i);
    }), lt(u).join(" ");
  };
  return {
    O: (a) => r(s(a, "delete")),
    $: (a) => r(s(a, "add")),
    C: (a) => {
      const c = ut(a);
      return c.reduce((u, i) => u && n.includes(i), c.length > 0);
    }
  };
}, oo = (t, e, n) => (mn(t, e).O(n), X(ns, t, e, n)), ns = (t, e, n) => (mn(t, e).$(n), X(oo, t, e, n)), rn = (t, e, n, r) => (r ? ns : oo)(t, e, n), ss = (t, e, n) => mn(t, e).C(n), ro = (t) => mn(t, "class"), lo = (t, e) => {
  ro(t).O(e);
}, os = (t, e) => (ro(t).$(e), X(lo, t, e)), ao = (t, e) => {
  const n = e ? un(e) && e : document;
  return n ? lt(n.querySelectorAll(t)) : [];
}, Vr = (t, e) => {
  const n = e ? un(e) && e : document;
  return n && n.querySelector(t);
}, In = (t, e) => un(t) && t.matches(e), io = (t) => In(t, "body"), Hn = (t) => t ? lt(t.childNodes) : [], Vt = (t) => t && t.parentElement, pt = (t, e) => un(t) && t.closest(e), Rn = (t) => document.activeElement, Lr = (t, e, n) => {
  const r = pt(t, e), s = t && Vr(n, r), a = pt(s, e) === r;
  return r && s ? r === t || s === t || a && pt(pt(t, n), e) !== r : !1;
}, yt = (t) => {
  ae(Qn(t), (e) => {
    const n = Vt(e);
    e && n && n.removeChild(e);
  });
}, Oe = (t, e) => X(yt, t && e && ae(Qn(e), (n) => {
  n && t.appendChild(n);
})), ht = (t) => {
  const e = document.createElement("div");
  return Je(e, "class", t), e;
}, co = (t) => {
  const e = ht();
  return e.innerHTML = t.trim(), ae(Hn(e), (n) => yt(n));
}, gs = (t, e) => t.getPropertyValue(e) || t[e] || "", uo = (t) => {
  const e = t || 0;
  return isFinite(e) ? e : 0;
}, Gt = (t) => uo(parseFloat(t || "")), Bn = (t) => Math.round(t * 1e4) / 1e4, vo = (t) => `${Bn(uo(t))}px`;
function Lt(t, e) {
  t && e && ae(e, (n, r) => {
    try {
      const s = t.style, a = dn(n) || Zn(n) ? "" : je(n) ? vo(n) : n;
      r.indexOf("--") === 0 ? s.setProperty(r, a) : s[r] = a;
    } catch {
    }
  });
}
function tt(t, e, n) {
  const r = Ot(e);
  let s = r ? "" : {};
  if (t) {
    const a = Ve.getComputedStyle(t, n) || t.style;
    s = r ? gs(a, e) : lt(e).reduce((c, u) => (c[u] = gs(a, u), c), s);
  }
  return s;
}
const bs = (t, e, n) => {
  const r = e ? `${e}-` : "", s = n ? `-${n}` : "", a = `${r}top${s}`, c = `${r}right${s}`, u = `${r}bottom${s}`, i = `${r}left${s}`, d = tt(t, [a, c, u, i]);
  return {
    t: Gt(d[a]),
    r: Gt(d[c]),
    b: Gt(d[u]),
    l: Gt(d[i])
  };
}, Or = (t, e) => `translate${nn(t) ? `(${t.x},${t.y})` : `Y(${t})`}`, Fr = (t) => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length), Ir = {
  w: 0,
  h: 0
}, pn = (t, e) => e ? {
  w: e[`${t}Width`],
  h: e[`${t}Height`]
} : Ir, Hr = (t) => pn("inner", t || Ve), gt = X(pn, "offset"), fo = X(pn, "client"), ln = X(pn, "scroll"), rs = (t) => {
  const e = parseFloat(tt(t, vn)) || 0, n = parseFloat(tt(t, fn)) || 0;
  return {
    w: e - Dn(e),
    h: n - Dn(n)
  };
}, $n = (t) => t.getBoundingClientRect(), Rr = (t) => !!t && Fr(t), Un = (t) => !!(t && (t[fn] || t[vn])), _o = (t, e) => {
  const n = Un(t);
  return !Un(e) && n;
}, ws = (t, e, n, r) => {
  ae(ut(e), (s) => {
    t && t.removeEventListener(s, n, r);
  });
}, ve = (t, e, n, r) => {
  var s;
  const a = (s = r && r.H) != null ? s : !0, c = r && r.I || !1, u = r && r.A || !1, i = {
    passive: a,
    capture: c
  };
  return X(Ie, ut(e).map((d) => {
    const f = u ? (m) => {
      ws(t, d, f, c), n && n(m);
    } : n;
    return t && t.addEventListener(d, f, i), X(ws, t, d, f, c);
  }));
}, mo = (t) => t.stopPropagation(), Nn = (t) => t.preventDefault(), po = (t) => mo(t) || Nn(t), qe = (t, e) => {
  const { x: n, y: r } = je(e) ? {
    x: e,
    y: e
  } : e || {};
  je(n) && (t.scrollLeft = n), je(r) && (t.scrollTop = r);
}, Fe = (t) => ({
  x: t.scrollLeft,
  y: t.scrollTop
}), ho = () => ({
  D: {
    x: 0,
    y: 0
  },
  M: {
    x: 0,
    y: 0
  }
}), Br = (t, e) => {
  const { D: n, M: r } = t, { w: s, h: a } = e, c = (m, p, _) => {
    let h = ms(m) * _, w = ms(p) * _;
    if (h === w) {
      const $ = Qt(m), D = Qt(p);
      w = $ > D ? 0 : w, h = $ < D ? 0 : h;
    }
    return h = h === w ? 0 : h, [h + 0, w + 0];
  }, [u, i] = c(n.x, r.x, s), [d, f] = c(n.y, r.y, a);
  return {
    D: {
      x: u,
      y: d
    },
    M: {
      x: i,
      y: f
    }
  };
}, ys = ({ D: t, M: e }) => {
  const n = (r, s) => r === 0 && r <= s;
  return {
    x: n(t.x, e.x),
    y: n(t.y, e.y)
  };
}, ks = ({ D: t, M: e }, n) => {
  const r = (s, a, c) => so(0, 1, (s - c) / (s - a) || 0);
  return {
    x: r(t.x, e.x, n.x),
    y: r(t.y, e.y, n.y)
  };
}, Pn = (t) => {
  t && t.focus && t.focus({
    preventScroll: !0
  });
}, xs = (t, e) => {
  ae(Qn(e), t);
}, zn = (t) => {
  const e = /* @__PURE__ */ new Map(), n = (a, c) => {
    if (a) {
      const u = e.get(a);
      xs((i) => {
        u && u[i ? "delete" : "clear"](i);
      }, c);
    } else
      e.forEach((u) => {
        u.clear();
      }), e.clear();
  }, r = (a, c) => {
    if (Ot(a)) {
      const d = e.get(a) || /* @__PURE__ */ new Set();
      return e.set(a, d), xs((f) => {
        Re(f) && d.add(f);
      }, c), X(n, a, c);
    }
    Zn(c) && c && n();
    const u = Ue(a), i = [];
    return ae(u, (d) => {
      const f = a[d];
      f && me(i, r(d, f));
    }), X(Ie, i);
  }, s = (a, c) => {
    ae(lt(e.get(a)), (u) => {
      c && !Ln(c) ? u.apply(0, c) : u();
    });
  };
  return r(t || {}), [r, n, s];
}, go = {}, bo = {}, Ur = (t) => {
  ae(t, (e) => ae(e, (n, r) => {
    go[r] = e[r];
  }));
}, wo = (t, e, n) => Ue(t).map((r) => {
  const { static: s, instance: a } = t[r], [c, u, i] = n || [], d = n ? a : s;
  if (d) {
    const f = n ? d(c, u, e) : d(e);
    return (i || bo)[r] = f;
  }
}), Ft = (t) => bo[t], Nr = "__osOptionsValidationPlugin", Ct = "data-overlayscrollbars", Zt = "os-environment", Wt = `${Zt}-scrollbar-hidden`, Cn = `${Ct}-initialize`, Jt = "noClipping", Ss = `${Ct}-body`, rt = Ct, Pr = "host", Qe = `${Ct}-viewport`, zr = Js, qr = Qs, jr = "arrange", yo = "measuring", Gr = "scrolling", ko = "scrollbarHidden", Wr = "noContent", qn = `${Ct}-padding`, $s = `${Ct}-content`, ls = "os-size-observer", Kr = `${ls}-appear`, Yr = `${ls}-listener`, Xr = "os-trinsic-observer", Zr = "os-theme-none", He = "os-scrollbar", Jr = `${He}-rtl`, Qr = `${He}-horizontal`, el = `${He}-vertical`, xo = `${He}-track`, as = `${He}-handle`, tl = `${He}-visible`, nl = `${He}-cornerless`, Cs = `${He}-interaction`, Es = `${He}-unusable`, jn = `${He}-auto-hide`, Ts = `${jn}-hidden`, Ms = `${He}-wheel`, sl = `${xo}-interactive`, ol = `${as}-interactive`, rl = "__osSizeObserverPlugin", ll = (t, e) => {
  const { T: n } = e, [r, s] = t("showNativeOverlaidScrollbars");
  return [r && n.x && n.y, s];
}, kt = (t) => t.indexOf(ot) === 0, al = (t, e) => {
  const n = (s, a, c, u) => {
    const i = s === ot ? it : s.replace(`${ot}-`, ""), d = kt(s), f = kt(c);
    return !a && !u ? it : d && f ? ot : d ? a && u ? i : a ? ot : it : a ? i : f && u ? ot : it;
  }, r = {
    x: n(e.x, t.x, e.y, t.y),
    y: n(e.y, t.y, e.x, t.x)
  };
  return {
    k: r,
    R: {
      x: r.x === wt,
      y: r.y === wt
    }
  };
}, So = "__osScrollbarsHidingPlugin", il = "__osClickScrollPlugin", As = (t) => JSON.stringify(t, (e, n) => {
  if (Re(n))
    throw 0;
  return n;
}), Ds = (t, e) => t ? `${e}`.split(".").reduce((n, r) => n && to(n, r) ? n[r] : void 0, t) : void 0, cl = {
  paddingAbsolute: !1,
  showNativeOverlaidScrollbars: !1,
  update: {
    elementEvents: [["img", "load"]],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null
  },
  overflow: {
    x: "scroll",
    y: "scroll"
  },
  scrollbars: {
    theme: "os-theme-dark",
    visibility: "auto",
    autoHide: "never",
    autoHideDelay: 1300,
    autoHideSuspend: !1,
    dragScroll: !0,
    clickScroll: !1,
    pointers: ["mouse", "touch", "pen"]
  }
}, $o = (t, e) => {
  const n = {}, r = Dt(Ue(e), Ue(t));
  return ae(r, (s) => {
    const a = t[s], c = e[s];
    if (nn(a) && nn(c))
      oe(n[s] = {}, $o(a, c)), es(n[s]) && delete n[s];
    else if (to(e, s) && c !== a) {
      let u = !0;
      if (Ge(a) || Ge(c))
        try {
          As(a) === As(c) && (u = !1);
        } catch {
        }
      u && (n[s] = c);
    }
  }), n;
}, Vs = (t, e, n) => (r) => [Ds(t, r), n || Ds(e, r) !== void 0];
let Co;
const dl = () => Co, ul = (t) => {
  Co = t;
};
let En;
const vl = () => {
  const t = (C, V, F) => {
    Oe(document.body, C), Oe(document.body, C);
    const q = fo(C), O = gt(C), y = rs(V);
    return F && yt(C), {
      x: O.h - q.h + y.h,
      y: O.w - q.w + y.w
    };
  }, e = (C) => {
    let V = !1;
    const F = os(C, Wt);
    try {
      V = tt(C, "scrollbar-width") === "none" || tt(C, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return F(), V;
  }, n = `.${Zt}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${Zt} div{width:200%;height:200%;margin:10px 0}.${Wt}{scrollbar-width:none!important}.${Wt}::-webkit-scrollbar,.${Wt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, s = co(`<div class="${Zt}"><div></div><style>${n}</style></div>`)[0], a = s.firstChild, c = s.lastChild, u = dl();
  u && (c.nonce = u);
  const [i, , d] = zn(), [f, m] = Le({
    o: t(s, a),
    i: Xt
  }, X(t, s, a, !0)), [p] = m(), _ = e(s), h = {
    x: p.x === 0,
    y: p.y === 0
  }, w = {
    elements: {
      host: null,
      padding: !_,
      viewport: (C) => _ && io(C) && C,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, $ = oe({}, cl), D = X(oe, {}, $), I = X(oe, {}, w), E = {
    N: p,
    T: h,
    P: _,
    G: !!Yt,
    K: X(i, "r"),
    Z: I,
    tt: (C) => oe(w, C) && I(),
    nt: D,
    ot: (C) => oe($, C) && D(),
    st: oe({}, w),
    et: oe({}, $)
  };
  if (Pe(s, "style"), yt(s), ve(Ve, "resize", () => {
    d("r", []);
  }), Re(Ve.matchMedia) && !_ && (!h.x || !h.y)) {
    const C = (V) => {
      const F = Ve.matchMedia(`(resolution: ${Ve.devicePixelRatio}dppx)`);
      ve(F, "change", () => {
        V(), C(V);
      }, {
        A: !0
      });
    };
    C(() => {
      const [V, F] = f();
      oe(E.N, V), d("r", [F]);
    });
  }
  return E;
}, Ke = () => (En || (En = vl()), En), fl = (t, e, n) => {
  let r = !1;
  const s = n ? /* @__PURE__ */ new WeakMap() : !1, a = () => {
    r = !0;
  }, c = (u) => {
    if (s && n) {
      const i = n.map((d) => {
        const [f, m] = d || [];
        return [m && f ? (u || ao)(f, t) : [], m];
      });
      ae(i, (d) => ae(d[0], (f) => {
        const m = d[1], p = s.get(f) || [];
        if (t.contains(f) && m) {
          const h = ve(f, m, (w) => {
            r ? (h(), s.delete(f)) : e(w);
          });
          s.set(f, me(p, h));
        } else
          Ie(p), s.delete(f);
      }));
    }
  };
  return c(), [a, c];
}, Ls = (t, e, n, r) => {
  let s = !1;
  const { ct: a, rt: c, lt: u, it: i, ut: d, _t: f } = r || {}, m = Fn(() => s && n(!0), {
    _: 33,
    p: 99
  }), [p, _] = fl(t, m, u), h = a || [], w = c || [], $ = Dt(h, w), D = (E, C) => {
    if (!Ln(C)) {
      const V = d || dt, F = f || dt, q = [], O = [];
      let y = !1, k = !1;
      if (ae(C, (L) => {
        const { attributeName: x, target: R, type: S, oldValue: U, addedNodes: N, removedNodes: Q } = L, se = S === "attributes", ne = S === "childList", fe = t === R, Y = se && x, T = Y && ts(R, x || ""), B = Ot(T) ? T : null, P = Y && U !== B, M = qs(w, x) && P;
        if (e && (ne || !fe)) {
          const W = se && P, j = W && i && In(R, i), te = (j ? !V(R, x, U, B) : !se || W) && !F(L, !!j, t, r);
          ae(N, (ie) => me(q, ie)), ae(Q, (ie) => me(q, ie)), k = k || te;
        }
        !e && fe && P && !V(R, x, U, B) && (me(O, x), y = y || M);
      }), _((L) => On(q).reduce((x, R) => (me(x, ao(L, R)), In(R, L) ? me(x, R) : x), [])), e)
        return !E && k && n(!1), [!1];
      if (!Ln(O) || y) {
        const L = [On(O), y];
        return !E && n.apply(0, L), L;
      }
    }
  }, I = new Mr(X(D, !1));
  return [() => (I.observe(t, {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: $,
    subtree: e,
    childList: e,
    characterData: e
  }), s = !0, () => {
    s && (p(), I.disconnect(), s = !1);
  }), () => {
    if (s)
      return m.m(), D(!0, I.takeRecords());
  }];
}, Eo = (t, e, n) => {
  const { dt: r } = n || {}, s = Ft(rl), [a] = Le({
    o: !1,
    u: !0
  });
  return () => {
    const c = [], i = co(`<div class="${ls}"><div class="${Yr}"></div></div>`)[0], d = i.firstChild, f = (m) => {
      const p = m instanceof ResizeObserverEntry;
      let _ = !1, h = !1;
      if (p) {
        const [w, , $] = a(m.contentRect), D = Un(w);
        h = _o(w, $), _ = !h && !D;
      } else
        h = m === !0;
      _ || e({
        ft: !0,
        dt: h
      });
    };
    if (tn) {
      const m = new tn((p) => f(p.pop()));
      m.observe(d), me(c, () => {
        m.disconnect();
      });
    } else if (s) {
      const [m, p] = s(d, f, r);
      me(c, Dt([os(i, Kr), ve(i, "animationstart", m)], p));
    } else
      return dt;
    return X(Ie, me(c, Oe(t, i)));
  };
}, _l = (t, e) => {
  let n;
  const r = (i) => i.h === 0 || i.isIntersecting || i.intersectionRatio > 0, s = ht(Xr), [a] = Le({
    o: !1
  }), c = (i, d) => {
    if (i) {
      const f = a(r(i)), [, m] = f;
      return m && !d && e(f) && [f];
    }
  }, u = (i, d) => c(d.pop(), i);
  return [() => {
    const i = [];
    if (ps)
      n = new ps(X(u, !1), {
        root: t
      }), n.observe(s), me(i, () => {
        n.disconnect();
      });
    else {
      const d = () => {
        const f = gt(s);
        c(f);
      };
      me(i, Eo(s, d)()), d();
    }
    return X(Ie, me(i, Oe(t, s)));
  }, () => n && u(!0, n.takeRecords())];
}, ml = (t, e, n, r) => {
  let s, a, c, u, i, d;
  const f = `[${rt}]`, m = `[${Qe}]`, p = ["id", "class", "style", "open", "wrap", "cols", "rows"], { vt: _, ht: h, U: w, gt: $, bt: D, L: I, wt: E, yt: C, St: V, Ot: F } = t, q = (M) => tt(M, "direction") === "rtl", O = {
    $t: !1,
    F: q(_)
  }, y = Ke(), k = Ft(So), [L] = Le({
    i: eo,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const M = k && k.V(t, e, O, y, n).X, j = !(E && I) && ss(h, rt, Jt), K = !I && C(jr), te = K && Fe($), ie = te && F(), ye = V(yo, j), pe = K && M && M()[0], Ce = ln(w), ee = rs(w);
    return pe && pe(), qe($, te), ie && ie(), j && ye(), {
      w: Ce.w + ee.w,
      h: Ce.h + ee.h
    };
  }), x = Fn(r, {
    _: () => s,
    p: () => a,
    S(M, W) {
      const [j] = M, [K] = W;
      return [Dt(Ue(j), Ue(K)).reduce((te, ie) => (te[ie] = j[ie] || K[ie], te), {})];
    }
  }), R = (M) => {
    const W = q(_);
    oe(M, {
      Ct: d !== W
    }), oe(O, {
      F: W
    }), d = W;
  }, S = (M, W) => {
    const [j, K] = M, te = {
      xt: K
    };
    return oe(O, {
      $t: j
    }), !W && r(te), te;
  }, U = ({ ft: M, dt: W }) => {
    const K = !(M && !W) && y.P ? x : r, te = {
      ft: M || W,
      dt: W
    };
    R(te), K(te);
  }, N = (M, W) => {
    const [, j] = L(), K = {
      Ht: j
    };
    return R(K), j && !W && (M ? r : x)(K), K;
  }, Q = (M, W, j) => {
    const K = {
      Et: W
    };
    return R(K), W && !j && x(K), K;
  }, [se, ne] = D ? _l(h, S) : [], fe = !I && Eo(h, U, {
    dt: !0
  }), [Y, T] = Ls(h, !1, Q, {
    rt: p,
    ct: p
  }), B = I && tn && new tn((M) => {
    const W = M[M.length - 1].contentRect;
    U({
      ft: !0,
      dt: _o(W, i)
    }), i = W;
  }), P = Fn(() => {
    const [, M] = L();
    r({
      Ht: M
    });
  }, {
    _: 222,
    v: !0
  });
  return [() => {
    B && B.observe(h);
    const M = fe && fe(), W = se && se(), j = Y(), K = y.K((te) => {
      te ? x({
        zt: te
      }) : P();
    });
    return () => {
      B && B.disconnect(), M && M(), W && W(), u && u(), j(), K();
    };
  }, ({ It: M, At: W, Dt: j }) => {
    const K = {}, [te] = M("update.ignoreMutation"), [ie, ye] = M("update.attributes"), [pe, Ce] = M("update.elementEvents"), [ee, be] = M("update.debounce"), Ae = Ce || ye, Ee = W || j, xe = (we) => Re(te) && te(we);
    if (Ae) {
      c && c(), u && u();
      const [we, he] = Ls(D || w, !0, N, {
        ct: Dt(p, ie || []),
        lt: pe,
        it: f,
        _t: (_e, ce) => {
          const { target: Se, attributeName: Me } = _e;
          return (!ce && Me && !I ? Lr(Se, f, m) : !1) || !!pt(Se, `.${He}`) || !!xe(_e);
        }
      });
      u = we(), c = he;
    }
    if (be)
      if (x.m(), Ge(ee)) {
        const we = ee[0], he = ee[1];
        s = je(we) && we, a = je(he) && he;
      } else je(ee) ? (s = ee, a = !1) : (s = !1, a = !1);
    if (Ee) {
      const we = T(), he = ne && ne(), _e = c && c();
      we && oe(K, Q(we[0], we[1], Ee)), he && oe(K, S(he[0], Ee)), _e && oe(K, N(_e[0], Ee));
    }
    return R(K), K;
  }, O];
}, To = (t, e) => Re(e) ? e.apply(0, t) : e, pl = (t, e, n, r) => {
  const s = Xn(r) ? n : r;
  return To(t, s) || e.apply(0, t);
}, Mo = (t, e, n, r) => {
  const s = Xn(r) ? n : r, a = To(t, s);
  return !!a && (on(a) ? a : e.apply(0, t));
}, hl = (t, e) => {
  const { nativeScrollbarsOverlaid: n, body: r } = e || {}, { T: s, P: a, Z: c } = Ke(), { nativeScrollbarsOverlaid: u, body: i } = c().cancel, d = n ?? u, f = Xn(r) ? i : r, m = (s.x || s.y) && d, p = t && (dn(f) ? !a : f);
  return !!m || !!p;
}, gl = (t, e, n, r) => {
  const s = "--os-viewport-percent", a = "--os-scroll-percent", c = "--os-scroll-direction", { Z: u } = Ke(), { scrollbars: i } = u(), { slot: d } = i, { vt: f, ht: m, U: p, Mt: _, gt: h, wt: w, L: $ } = e, { scrollbars: D } = _ ? {} : t, { slot: I } = D || {}, E = [], C = [], V = [], F = Mo([f, m, p], () => $ && w ? f : m, d, I), q = (Y) => {
    if (Yt) {
      const T = new Yt({
        source: h,
        axis: Y
      });
      return {
        kt: (P) => {
          const M = P.Tt.animate({
            clear: ["left"],
            [a]: [0, 1]
          }, {
            timeline: T
          });
          return () => M.cancel();
        }
      };
    }
  }, O = {
    x: q("x"),
    y: q("y")
  }, y = () => {
    const { Rt: Y, Vt: T } = n, B = (P, M) => so(0, 1, P / (P + M) || 0);
    return {
      x: B(T.x, Y.x),
      y: B(T.y, Y.y)
    };
  }, k = (Y, T, B) => {
    const P = B ? os : lo;
    ae(Y, (M) => {
      P(M.Tt, T);
    });
  }, L = (Y, T) => {
    ae(Y, (B) => {
      const [P, M] = T(B);
      Lt(P, M);
    });
  }, x = (Y, T, B) => {
    const P = Zn(B), M = P ? B : !0, W = P ? !B : !0;
    M && k(C, Y, T), W && k(V, Y, T);
  }, R = () => {
    const Y = y(), T = (B) => (P) => [P.Tt, {
      [s]: Bn(B) + ""
    }];
    L(C, T(Y.x)), L(V, T(Y.y));
  }, S = () => {
    if (!Yt) {
      const { Lt: Y } = n, T = ks(Y, Fe(h)), B = (P) => (M) => [M.Tt, {
        [a]: Bn(P) + ""
      }];
      L(C, B(T.x)), L(V, B(T.y));
    }
  }, U = () => {
    const { Lt: Y } = n, T = ys(Y), B = (P) => (M) => [M.Tt, {
      [c]: P ? "0" : "1"
    }];
    L(C, B(T.x)), L(V, B(T.y));
  }, N = () => {
    if ($ && !w) {
      const { Rt: Y, Lt: T } = n, B = ys(T), P = ks(T, Fe(h)), M = (W) => {
        const { Tt: j } = W, K = Vt(j) === p && j, te = (ie, ye, pe) => {
          const Ce = ye * ie;
          return vo(pe ? Ce : -Ce);
        };
        return [K, K && {
          transform: Or({
            x: te(P.x, Y.x, B.x),
            y: te(P.y, Y.y, B.y)
          })
        }];
      };
      L(C, M), L(V, M);
    }
  }, Q = (Y) => {
    const T = Y ? "x" : "y", P = ht(`${He} ${Y ? Qr : el}`), M = ht(xo), W = ht(as), j = {
      Tt: P,
      Ut: M,
      Pt: W
    }, K = O[T];
    return me(Y ? C : V, j), me(E, [Oe(P, M), Oe(M, W), X(yt, P), K && K.kt(j), r(j, x, Y)]), j;
  }, se = X(Q, !0), ne = X(Q, !1), fe = () => (Oe(F, C[0].Tt), Oe(F, V[0].Tt), X(Ie, E));
  return se(), ne(), [{
    Nt: R,
    qt: S,
    Bt: U,
    Ft: N,
    jt: x,
    Yt: {
      Wt: C,
      Xt: se,
      Jt: X(L, C)
    },
    Gt: {
      Wt: V,
      Xt: ne,
      Jt: X(L, V)
    }
  }, fe];
}, bl = (t, e, n, r) => (s, a, c) => {
  const { ht: u, U: i, L: d, gt: f, Kt: m, Ot: p } = e, { Tt: _, Ut: h, Pt: w } = s, [$, D] = mt(333), [I, E] = mt(444), C = (q) => {
    Re(f.scrollBy) && f.scrollBy({
      behavior: "smooth",
      left: q.x,
      top: q.y
    });
  }, V = () => {
    const q = "pointerup pointercancel lostpointercapture", O = `client${c ? "X" : "Y"}`, y = c ? vn : fn, k = c ? "left" : "top", L = c ? "w" : "h", x = c ? "x" : "y", R = (U, N) => (Q) => {
      const { Rt: se } = n, ne = gt(h)[L] - gt(w)[L], Y = N * Q / ne * se[x];
      qe(f, {
        [x]: U + Y
      });
    }, S = [];
    return ve(h, "pointerdown", (U) => {
      const N = pt(U.target, `.${as}`) === w, Q = N ? w : h, se = t.scrollbars, ne = se[N ? "dragScroll" : "clickScroll"], { button: fe, isPrimary: Y, pointerType: T } = U, { pointers: B } = se;
      if (fe === 0 && Y && ne && (B || []).includes(T)) {
        Ie(S), E();
        const M = !N && (U.shiftKey || ne === "instant"), W = X($n, w), j = X($n, h), K = (ce, Se) => (ce || W())[k] - (Se || j())[k], te = Dn($n(f)[y]) / gt(f)[L] || 1, ie = R(Fe(f)[x], 1 / te), ye = U[O], pe = W(), Ce = j(), ee = pe[y], be = K(pe, Ce) + ee / 2, Ae = ye - Ce[k], Ee = N ? 0 : Ae - be, xe = (ce) => {
          Ie(_e), Q.releasePointerCapture(ce.pointerId);
        }, we = N || M, he = p(), _e = [ve(m, q, xe), ve(m, "selectstart", (ce) => Nn(ce), {
          H: !1
        }), ve(h, q, xe), we && ve(h, "pointermove", (ce) => ie(Ee + (ce[O] - ye))), we && (() => {
          const ce = Fe(f);
          he();
          const Se = Fe(f), Me = {
            x: Se.x - ce.x,
            y: Se.y - ce.y
          };
          (Qt(Me.x) > 3 || Qt(Me.y) > 3) && (p(), qe(f, ce), C(Me), I(he));
        })];
        if (Q.setPointerCapture(U.pointerId), M)
          ie(Ee);
        else if (!N) {
          const ce = Ft(il);
          if (ce) {
            const Se = ce(ie, Ee, ee, (Me) => {
              Me ? he() : me(_e, he);
            });
            me(_e, Se), me(S, X(Se, !0));
          }
        }
      }
    });
  };
  let F = !0;
  return X(Ie, [ve(w, "pointermove pointerleave", r), ve(_, "pointerenter", () => {
    a(Cs, !0);
  }), ve(_, "pointerleave pointercancel", () => {
    a(Cs, !1);
  }), !d && ve(_, "mousedown", () => {
    const q = Rn();
    (hs(q, Qe) || hs(q, rt) || q === document.body) && en(X(Pn, i), 25);
  }), ve(_, "wheel", (q) => {
    const { deltaX: O, deltaY: y, deltaMode: k } = q;
    F && k === 0 && Vt(_) === u && C({
      x: O,
      y
    }), F = !1, a(Ms, !0), $(() => {
      F = !0, a(Ms);
    }), Nn(q);
  }, {
    H: !1,
    I: !0
  }), ve(_, "pointerdown", X(ve, m, "click", po, {
    A: !0,
    I: !0,
    H: !1
  }), {
    I: !0
  }), V(), D, E]);
}, wl = (t, e, n, r, s, a) => {
  let c, u, i, d, f, m = dt, p = 0;
  const _ = ["mouse", "pen"], h = (T) => _.includes(T.pointerType), [w, $] = mt(), [D, I] = mt(100), [E, C] = mt(100), [V, F] = mt(() => p), [q, O] = gl(t, s, r, bl(e, s, r, (T) => h(T) && se())), { ht: y, Qt: k, wt: L } = s, { jt: x, Nt: R, qt: S, Bt: U, Ft: N } = q, Q = (T, B) => {
    if (F(), T)
      x(Ts);
    else {
      const P = X(x, Ts, !0);
      p > 0 && !B ? V(P) : P();
    }
  }, se = () => {
    (i ? !c : !d) && (Q(!0), D(() => {
      Q(!1);
    }));
  }, ne = (T) => {
    x(jn, T, !0), x(jn, T, !1);
  }, fe = (T) => {
    h(T) && (c = i, i && Q(!0));
  }, Y = [F, I, C, $, () => m(), ve(y, "pointerover", fe, {
    A: !0
  }), ve(y, "pointerenter", fe), ve(y, "pointerleave", (T) => {
    h(T) && (c = !1, i && Q(!1));
  }), ve(y, "pointermove", (T) => {
    h(T) && u && se();
  }), ve(k, "scroll", (T) => {
    w(() => {
      S(), se();
    }), a(T), N();
  })];
  return [() => X(Ie, me(Y, O())), ({ It: T, Dt: B, Zt: P, tn: M }) => {
    const { nn: W, sn: j, en: K, cn: te } = M || {}, { Ct: ie, dt: ye } = P || {}, { F: pe } = n, { T: Ce } = Ke(), { k: ee, rn: be } = r, [Ae, Ee] = T("showNativeOverlaidScrollbars"), [xe, we] = T("scrollbars.theme"), [he, _e] = T("scrollbars.visibility"), [ce, Se] = T("scrollbars.autoHide"), [Me, Et] = T("scrollbars.autoHideSuspend"), [It] = T("scrollbars.autoHideDelay"), [gn, at] = T("scrollbars.dragScroll"), [Ht, bn] = T("scrollbars.clickScroll"), [wn, yn] = T("overflow"), vs = ye && !B, Ne = be.x || be.y, kn = W || j || te || ie || B, Rt = K || _e || yn, vt = Ae && Ce.x && Ce.y, Bt = (ft, Tt, Ut) => {
      const Mt = ft.includes(wt) && (he === ot || he === "auto" && Tt === wt);
      return x(tl, Mt, Ut), Mt;
    };
    if (p = It, vs && (Me && Ne ? (ne(!1), m(), E(() => {
      m = ve(k, "scroll", X(ne, !0), {
        A: !0
      });
    })) : ne(!0)), Ee && x(Zr, vt), we && (x(f), x(xe, !0), f = xe), Et && !Me && ne(!0), Se && (u = ce === "move", i = ce === "leave", d = ce === "never", Q(d, !0)), at && x(ol, gn), bn && x(sl, !!Ht), Rt) {
      const ft = Bt(wn.x, ee.x, !0), Tt = Bt(wn.y, ee.y, !1);
      x(nl, !(ft && Tt));
    }
    kn && (S(), R(), N(), te && U(), x(Es, !be.x, !0), x(Es, !be.y, !1), x(Jr, pe && !L));
  }, {}, q];
}, yl = (t) => {
  const e = Ke(), { Z: n, P: r } = e, { elements: s } = n(), { padding: a, viewport: c, content: u } = s, i = on(t), d = i ? {} : t, { elements: f } = d, { padding: m, viewport: p, content: _ } = f || {}, h = i ? t : d.target, w = io(h), $ = h.ownerDocument, D = $.documentElement, I = () => $.defaultView || Ve, E = X(pl, [h]), C = X(Mo, [h]), V = X(ht, ""), F = X(E, V, c), q = X(C, V, u), O = (ee) => {
    const be = gt(ee), Ae = ln(ee), Ee = tt(ee, Js), xe = tt(ee, Qs);
    return Ae.w - be.w > 0 && !kt(Ee) || Ae.h - be.h > 0 && !kt(xe);
  }, y = F(p), k = y === h, L = k && w, x = !k && q(_), R = !k && y === x, S = L ? D : y, U = L ? S : h, N = !k && C(V, a, m), Q = !R && x, se = [Q, S, N, U].map((ee) => on(ee) && !Vt(ee) && ee), ne = (ee) => ee && qs(se, ee), fe = !ne(S) && O(S) ? S : h, Y = L ? D : S, B = {
    vt: h,
    ht: U,
    U: S,
    ln: N,
    bt: Q,
    gt: Y,
    Qt: L ? $ : S,
    an: w ? D : fe,
    Kt: $,
    wt: w,
    Mt: i,
    L: k,
    un: I,
    yt: (ee) => ss(S, Qe, ee),
    St: (ee, be) => rn(S, Qe, ee, be),
    Ot: () => rn(Y, Qe, Gr, !0)
  }, { vt: P, ht: M, ln: W, U: j, bt: K } = B, te = [() => {
    Pe(M, [rt, Cn]), Pe(P, Cn), w && Pe(D, [Cn, rt]);
  }];
  let ie = Hn([K, j, W, M, P].find((ee) => ee && !ne(ee)));
  const ye = L ? P : K || j, pe = X(Ie, te);
  return [B, () => {
    const ee = I(), be = Rn(), Ae = (_e) => {
      Oe(Vt(_e), Hn(_e)), yt(_e);
    }, Ee = (_e) => ve(_e, "focusin focusout focus blur", po, {
      I: !0,
      H: !1
    }), xe = "tabindex", we = ts(j, xe), he = Ee(be);
    return Je(M, rt, k ? "" : Pr), Je(W, qn, ""), Je(j, Qe, ""), Je(K, $s, ""), k || (Je(j, xe, we || "-1"), w && Je(D, Ss, "")), Oe(ye, ie), Oe(M, W), Oe(W || M, !k && j), Oe(j, K), me(te, [he, () => {
      const _e = Rn(), ce = ne(j), Se = ce && _e === j ? P : _e, Me = Ee(Se);
      Pe(W, qn), Pe(K, $s), Pe(j, Qe), w && Pe(D, Ss), we ? Je(j, xe, we) : Pe(j, xe), ne(K) && Ae(K), ce && Ae(j), ne(W) && Ae(W), Pn(Se), Me();
    }]), r && !k && (ns(j, Qe, ko), me(te, X(Pe, j, Qe))), Pn(!k && w && be === P && ee.top === ee ? j : be), he(), ie = 0, pe;
  }, pe];
}, kl = ({ bt: t }) => ({ Zt: e, _n: n, Dt: r }) => {
  const { xt: s } = e || {}, { $t: a } = n;
  t && (s || r) && Lt(t, {
    [fn]: a && "100%"
  });
}, xl = ({ ht: t, ln: e, U: n, L: r }, s) => {
  const [a, c] = Le({
    i: Dr,
    o: bs()
  }, X(bs, t, "padding", ""));
  return ({ It: u, Zt: i, _n: d, Dt: f }) => {
    let [m, p] = c(f);
    const { P: _ } = Ke(), { ft: h, Ht: w, Ct: $ } = i || {}, { F: D } = d, [I, E] = u("paddingAbsolute");
    (h || p || (f || w)) && ([m, p] = a(f));
    const V = !r && (E || $ || p);
    if (V) {
      const F = !I || !e && !_, q = m.r + m.l, O = m.t + m.b, y = {
        [Xs]: F && !D ? -q : 0,
        [Zs]: F ? -O : 0,
        [Ys]: F && D ? -q : 0,
        top: F ? -m.t : 0,
        right: F ? D ? -m.r : "auto" : 0,
        left: F ? D ? "auto" : -m.l : 0,
        [vn]: F && `calc(100% + ${q}px)`
      }, k = {
        [js]: F ? m.t : 0,
        [Gs]: F ? m.r : 0,
        [Ks]: F ? m.b : 0,
        [Ws]: F ? m.l : 0
      };
      Lt(e || n, y), Lt(n, k), oe(s, {
        ln: m,
        dn: !F,
        j: e ? k : oe({}, y, k)
      });
    }
    return {
      fn: V
    };
  };
}, Sl = (t, e) => {
  const n = Ke(), { ht: r, ln: s, U: a, L: c, Qt: u, gt: i, wt: d, St: f, un: m } = t, { P: p } = n, _ = d && c, h = X(Ps, 0), w = {
    display: () => !1,
    direction: (T) => T !== "ltr",
    flexDirection: (T) => T.endsWith("-reverse"),
    writingMode: (T) => T !== "horizontal-tb"
  }, $ = Ue(w), D = {
    i: eo,
    o: {
      w: 0,
      h: 0
    }
  }, I = {
    i: Xt,
    o: {}
  }, E = (T) => {
    f(yo, !_ && T);
  }, C = (T) => {
    if (!$.some((ye) => {
      const pe = T[ye];
      return pe && w[ye](pe);
    }))
      return {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 1,
          y: 1
        }
      };
    E(!0);
    const P = Fe(i), M = f(Wr, !0), W = ve(u, wt, (ye) => {
      const pe = Fe(i);
      ye.isTrusted && pe.x === P.x && pe.y === P.y && mo(ye);
    }, {
      I: !0,
      A: !0
    });
    qe(i, {
      x: 0,
      y: 0
    }), M();
    const j = Fe(i), K = ln(i);
    qe(i, {
      x: K.w,
      y: K.h
    });
    const te = Fe(i);
    qe(i, {
      x: te.x - j.x < 1 && -K.w,
      y: te.y - j.y < 1 && -K.h
    });
    const ie = Fe(i);
    return qe(i, P), Yn(() => W()), {
      D: j,
      M: ie
    };
  }, V = (T, B) => {
    const P = Ve.devicePixelRatio % 1 !== 0 ? 1 : 0, M = {
      w: h(T.w - B.w),
      h: h(T.h - B.h)
    };
    return {
      w: M.w > P ? M.w : 0,
      h: M.h > P ? M.h : 0
    };
  }, [F, q] = Le(D, X(rs, a)), [O, y] = Le(D, X(ln, a)), [k, L] = Le(D), [x] = Le(I), [R, S] = Le(D), [U] = Le(I), [N] = Le({
    i: (T, B) => _n(T, B, $),
    o: {}
  }, () => Rr(a) ? tt(a, $) : {}), [Q, se] = Le({
    i: (T, B) => Xt(T.D, B.D) && Xt(T.M, B.M),
    o: ho()
  }), ne = Ft(So), fe = (T, B) => `${B ? zr : qr}${Ar(T)}`, Y = (T) => {
    const B = (M) => [ot, it, wt].map((W) => fe(W, M)), P = B(!0).concat(B()).join(" ");
    f(P), f(Ue(T).map((M) => fe(T[M], M === "x")).join(" "), !0);
  };
  return ({ It: T, Zt: B, _n: P, Dt: M }, { fn: W }) => {
    const { ft: j, Ht: K, Ct: te, dt: ie, zt: ye } = B || {}, pe = ne && ne.V(t, e, P, n, T), { W: Ce, X: ee, J: be } = pe || {}, [Ae, Ee] = ll(T, n), [xe, we] = T("overflow"), he = kt(xe.x), _e = kt(xe.y);
    let ce = q(M), Se = y(M), Me = L(M), Et = S(M);
    Ee && p && f(ko, !Ae);
    {
      ss(r, rt, Jt) && E(!0);
      const [fs] = ee ? ee() : [], [Nt] = ce = F(M), [Pt] = Se = O(M), zt = fo(a), qt = _ && Hr(m()), er = {
        w: h(Pt.w + Nt.w),
        h: h(Pt.h + Nt.h)
      }, _s = {
        w: h((qt ? qt.w : zt.w + h(zt.w - Pt.w)) + Nt.w),
        h: h((qt ? qt.h : zt.h + h(zt.h - Pt.h)) + Nt.h)
      };
      fs && fs(), Et = R(_s), Me = k(V(er, _s), M);
    }
    const [It, gn] = Et, [at, Ht] = Me, [bn, wn] = Se, [yn, vs] = ce, [Ne, kn] = x({
      x: at.w > 0,
      y: at.h > 0
    }), Rt = he && _e && (Ne.x || Ne.y) || he && Ne.x && !Ne.y || _e && Ne.y && !Ne.x, vt = al(Ne, xe), [Bt, ft] = U(vt.k), [Tt, Ut] = N(M), Mt = te || ie || Ut || kn || M, [Jo, Qo] = Mt ? Q(C(Tt), M) : se();
    return ft && Y(vt.k), be && Ce && Lt(a, be(vt, P, Ce(vt, bn, yn))), E(!1), rn(r, rt, Jt, Rt), rn(s, qn, Jt, Rt), oe(e, {
      k: Bt,
      Vt: {
        x: It.w,
        y: It.h
      },
      Rt: {
        x: at.w,
        y: at.h
      },
      rn: Ne,
      Lt: Br(Jo, at)
    }), {
      en: ft,
      nn: gn,
      sn: Ht,
      cn: Qo || Ht,
      pn: Mt
    };
  };
}, $l = (t) => {
  const [e, n, r] = yl(t), s = {
    ln: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    dn: !1,
    j: {
      [Xs]: 0,
      [Zs]: 0,
      [Ys]: 0,
      [js]: 0,
      [Gs]: 0,
      [Ks]: 0,
      [Ws]: 0
    },
    Vt: {
      x: 0,
      y: 0
    },
    Rt: {
      x: 0,
      y: 0
    },
    k: {
      x: it,
      y: it
    },
    rn: {
      x: !1,
      y: !1
    },
    Lt: ho()
  }, { vt: a, gt: c, L: u, Ot: i } = e, { P: d, T: f } = Ke(), m = !d && (f.x || f.y), p = [kl(e), xl(e, s), Sl(e, s)];
  return [n, (_) => {
    const h = {}, $ = m && Fe(c), D = $ && i();
    return ae(p, (I) => {
      oe(h, I(_, h) || {});
    }), qe(c, $), D && D(), !u && qe(a, 0), h;
  }, s, e, r];
}, Cl = (t, e, n, r, s) => {
  let a = !1;
  const c = Vs(e, {}), [u, i, d, f, m] = $l(t), [p, _, h] = ml(f, d, c, (C) => {
    E({}, C);
  }), [w, $, , D] = wl(t, e, h, d, f, s), I = (C) => Ue(C).some((V) => !!C[V]), E = (C, V) => {
    if (n())
      return !1;
    const { vn: F, Dt: q, At: O, hn: y } = C, k = F || {}, L = !!q || !a, x = {
      It: Vs(e, k, L),
      vn: k,
      Dt: L
    };
    if (y)
      return $(x), !1;
    const R = V || _(oe({}, x, {
      At: O
    })), S = i(oe({}, x, {
      _n: h,
      Zt: R
    }));
    $(oe({}, x, {
      Zt: R,
      tn: S
    }));
    const U = I(R), N = I(S), Q = U || N || !es(k) || L;
    return a = !0, Q && r(C, {
      Zt: R,
      tn: S
    }), Q;
  };
  return [() => {
    const { an: C, gt: V, Ot: F } = f, q = Fe(C), O = [p(), u(), w()], y = F();
    return qe(V, q), y(), X(Ie, O);
  }, E, () => ({
    gn: h,
    bn: d
  }), {
    wn: f,
    yn: D
  }, m];
}, is = /* @__PURE__ */ new WeakMap(), El = (t, e) => {
  is.set(t, e);
}, Tl = (t) => {
  is.delete(t);
}, Ao = (t) => is.get(t), We = (t, e, n) => {
  const { nt: r } = Ke(), s = on(t), a = s ? t : t.target, c = Ao(a);
  if (e && !c) {
    let u = !1;
    const i = [], d = {}, f = (k) => {
      const L = no(k), x = Ft(Nr);
      return x ? x(L, !0) : L;
    }, m = oe({}, r(), f(e)), [p, _, h] = zn(), [w, $, D] = zn(n), I = (k, L) => {
      D(k, L), h(k, L);
    }, [E, C, V, F, q] = Cl(t, m, () => u, ({ vn: k, Dt: L }, { Zt: x, tn: R }) => {
      const { ft: S, Ct: U, xt: N, Ht: Q, Et: se, dt: ne } = x, { nn: fe, sn: Y, en: T, cn: B } = R;
      I("updated", [y, {
        updateHints: {
          sizeChanged: !!S,
          directionChanged: !!U,
          heightIntrinsicChanged: !!N,
          overflowEdgeChanged: !!fe,
          overflowAmountChanged: !!Y,
          overflowStyleChanged: !!T,
          scrollCoordinatesChanged: !!B,
          contentMutation: !!Q,
          hostMutation: !!se,
          appear: !!ne
        },
        changedOptions: k || {},
        force: !!L
      }]);
    }, (k) => I("scroll", [y, k])), O = (k) => {
      Tl(a), Ie(i), u = !0, I("destroyed", [y, k]), _(), $();
    }, y = {
      options(k, L) {
        if (k) {
          const x = L ? r() : {}, R = $o(m, oe(x, f(k)));
          es(R) || (oe(m, R), C({
            vn: R
          }));
        }
        return oe({}, m);
      },
      on: w,
      off: (k, L) => {
        k && L && $(k, L);
      },
      state() {
        const { gn: k, bn: L } = V(), { F: x } = k, { Vt: R, Rt: S, k: U, rn: N, ln: Q, dn: se, Lt: ne } = L;
        return oe({}, {
          overflowEdge: R,
          overflowAmount: S,
          overflowStyle: U,
          hasOverflow: N,
          scrollCoordinates: {
            start: ne.D,
            end: ne.M
          },
          padding: Q,
          paddingAbsolute: se,
          directionRTL: x,
          destroyed: u
        });
      },
      elements() {
        const { vt: k, ht: L, ln: x, U: R, bt: S, gt: U, Qt: N } = F.wn, { Yt: Q, Gt: se } = F.yn, ne = (Y) => {
          const { Pt: T, Ut: B, Tt: P } = Y;
          return {
            scrollbar: P,
            track: B,
            handle: T
          };
        }, fe = (Y) => {
          const { Wt: T, Xt: B } = Y, P = ne(T[0]);
          return oe({}, P, {
            clone: () => {
              const M = ne(B());
              return C({
                hn: !0
              }), M;
            }
          });
        };
        return oe({}, {
          target: k,
          host: L,
          padding: x || R,
          viewport: R,
          content: S || R,
          scrollOffsetElement: U,
          scrollEventElement: N,
          scrollbarHorizontal: fe(Q),
          scrollbarVertical: fe(se)
        });
      },
      update: (k) => C({
        Dt: k,
        At: !0
      }),
      destroy: X(O, !1),
      plugin: (k) => d[Ue(k)[0]]
    };
    return me(i, [q]), El(a, y), wo(go, We, [y, p, d]), hl(F.wn.wt, !s && t.cancel) ? (O(!0), y) : (me(i, E()), I("initialized", [y]), y.update(), y);
  }
  return c;
};
We.plugin = (t) => {
  const e = Ge(t), n = e ? t : [t], r = n.map((s) => wo(s, We)[0]);
  return Ur(n), e ? r : r[0];
};
We.valid = (t) => {
  const e = t && t.elements, n = Re(e) && e();
  return sn(n) && !!Ao(n.target);
};
We.env = () => {
  const { N: t, T: e, P: n, G: r, st: s, et: a, Z: c, tt: u, nt: i, ot: d } = Ke();
  return oe({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: e,
    scrollbarsHiding: n,
    scrollTimeline: r,
    staticDefaultInitialization: s,
    staticDefaultOptions: a,
    getDefaultInitialization: c,
    setDefaultInitialization: u,
    getDefaultOptions: i,
    setDefaultOptions: d
  });
};
We.nonce = ul;
function Ml() {
  let t;
  const e = A(null), n = Math.floor(Math.random() * 2 ** 32), r = A(!1), s = A([]), a = () => s.value, c = () => t.getSelection(), u = () => s.value.length, i = () => t.clearSelection(!0), d = A(), f = A(null), m = A(null), p = A(null), _ = A(null);
  function h() {
    t = new vr({
      area: e.value,
      keyboardDrag: !1,
      selectedClass: "vf-explorer-selected",
      selectorClass: "vf-explorer-selector"
    }), t.subscribe("DS:start:pre", ({ items: V, event: F, isDragging: q }) => {
      if (q)
        t.Interaction._reset(F);
      else {
        r.value = !1;
        const O = e.value.offsetWidth - F.offsetX, y = e.value.offsetHeight - F.offsetY;
        O < 15 && y < 15 && t.Interaction._reset(F), F.target.classList.contains("os-scrollbar-handle") && t.Interaction._reset(F);
      }
    }), document.addEventListener("dragleave", (V) => {
      !V.buttons && r.value && (r.value = !1);
    });
  }
  const w = () => ct(() => {
    t.addSelection(
      t.getSelectables()
    ), $();
  }), $ = () => {
    s.value = t.getSelection().map((V) => JSON.parse(V.dataset.item)), d.value(s.value);
  }, D = () => ct(() => {
    const V = a().map((F) => F.path);
    i(), t.setSettings({
      selectables: document.getElementsByClassName("vf-item-" + n)
    }), t.addSelection(
      t.getSelectables().filter((F) => V.includes(JSON.parse(F.dataset.item).path))
    ), $(), E();
  }), I = (V) => {
    d.value = V, t.subscribe("DS:end", ({ items: F, event: q, isDragging: O }) => {
      s.value = F.map((y) => JSON.parse(y.dataset.item)), V(F.map((y) => JSON.parse(y.dataset.item)));
    });
  }, E = () => {
    f.value && (e.value.getBoundingClientRect().height < e.value.scrollHeight ? (m.value.style.height = e.value.scrollHeight + "px", m.value.style.display = "block") : (m.value.style.height = "100%", m.value.style.display = "none"));
  }, C = (V) => {
    if (!f.value)
      return;
    const { scrollOffsetElement: F } = f.value.elements();
    F.scrollTo(
      {
        top: e.value.scrollTop,
        left: 0
      }
    );
  };
  return $e(() => {
    We(p.value, {
      scrollbars: {
        theme: "vf-theme-dark dark:vf-theme-light"
      },
      plugins: {
        OverlayScrollbars: We
        // ScrollbarsHidingPlugin,
        // SizeObserverPlugin,
        // ClickScrollPlugin
      }
    }, {
      initialized: (V) => {
        f.value = V;
      },
      scroll: (V, F) => {
        const { scrollOffsetElement: q } = V.elements();
        e.value.scrollTo({
          top: q.scrollTop,
          left: 0
        });
      }
    }), h(), E(), _.value = new ResizeObserver(E), _.value.observe(e.value), e.value.addEventListener("scroll", C), t.subscribe("DS:scroll", ({ isDragging: V }) => V || C());
  }), Kn(() => {
    t && t.stop(), _.value && _.value.disconnect();
  }), Is(() => {
    t && t.Area.reset();
  }), {
    area: e,
    explorerId: n,
    isDraggingRef: r,
    scrollBar: m,
    scrollBarContainer: p,
    getSelected: a,
    getSelection: c,
    selectAll: w,
    clearSelection: i,
    refreshSelection: D,
    getCount: u,
    onSelect: I
  };
}
function Al(t, e) {
  const n = A(t), r = A(e), s = A([]), a = A([]), c = A([]), u = A(!1), i = A(5);
  let d = !1, f = !1;
  const m = xt({
    adapter: n,
    storages: [],
    dirname: r,
    files: []
  });
  function p() {
    let I = [], E = [], C = r.value ?? n.value + "://";
    C.length === 0 && (s.value = []), C.replace(n.value + "://", "").split("/").forEach(function(q) {
      I.push(q), I.join("/") !== "" && E.push({
        basename: q,
        name: q,
        path: n.value + "://" + I.join("/"),
        type: "dir"
      });
    }), a.value = E;
    const [V, F] = h(E, i.value);
    c.value = F, s.value = V;
  }
  function _(I) {
    i.value = I, p();
  }
  function h(I, E) {
    return I.length > E ? [I.slice(-E), I.slice(0, -E)] : [I, []];
  }
  function w(I = null) {
    u.value = I ?? !u.value;
  }
  function $() {
    return s.value && s.value.length && !0;
  }
  const D = bt(() => {
    var I;
    return ((I = s.value[s.value.length - 2]) == null ? void 0 : I.path) ?? n.value + "://";
  });
  return $e(() => {
  }), De(r, p), $e(p), {
    adapter: n,
    path: r,
    loading: d,
    searchMode: f,
    data: m,
    breadcrumbs: s,
    breadcrumbItems: a,
    limitBreadcrumbItems: _,
    hiddenBreadcrumbs: c,
    showHiddenBreadcrumbs: u,
    toggleHiddenBreadcrumbs: w,
    isGoUpAvailable: $,
    parentFolderPath: D
  };
}
const Dl = (t, e) => {
  const n = br(t.id), r = ur(), s = n.getStore("metricUnits", !1), a = $r(n, t.theme), c = e.i18n, u = t.locale ?? e.locale, i = (_) => Array.isArray(_) ? _ : kr, d = n.getStore("persist-path", t.persist), f = d ? n.getStore("path", t.path) : t.path, m = d ? n.getStore("adapter") : null, p = Ml();
  return xt({
    /** 
    * Core properties
    * */
    // app version
    version: xr,
    // root element
    root: null,
    // app id
    debug: t.debug,
    // Event Bus
    emitter: r,
    // storage
    storage: n,
    // localization object
    i18n: yr(n, u, r, c),
    // modal state
    modal: Cr(),
    // dragSelect object, it is responsible for selecting items
    dragSelect: bt(() => p),
    // http object
    requester: gr(t.request),
    // active features
    features: i(t.features),
    // view state
    view: n.getStore("viewport", "grid"),
    // fullscreen state
    fullScreen: n.getStore("full-screen", t.fullScreen),
    // show tree view
    showTreeView: n.getStore("show-tree-view", t.showTreeView),
    // pinnedFolders
    pinnedFolders: n.getStore("pinned-folders", t.pinnedFolders),
    // treeViewData
    treeViewData: [],
    // selectButton state
    selectButton: t.selectButton,
    // max file size
    maxFileSize: t.maxFileSize,
    /**
    * Settings
    * */
    // theme state
    theme: a,
    // unit state - for example: GB or GiB
    metricUnits: s,
    // human readable file sizes
    filesize: s ? Ns : Us,
    // show large icons in list view
    compactListView: n.getStore("compact-list-view", !0),
    // persist state
    persist: d,
    // show thumbnails
    showThumbnails: n.getStore("show-thumbnails", t.showThumbnails),
    // type of progress indicator
    loadingIndicator: t.loadingIndicator,
    // possible items of the context menu
    contextMenuItems: t.contextMenuItems,
    // file system
    fs: Al(m, f)
  });
}, Vl = { class: "vuefinder__modal-layout__container" }, Ll = { class: "vuefinder__modal-layout__content" }, Ol = { class: "vuefinder__modal-layout__footer" }, Ye = {
  __name: "ModalLayout",
  setup(t) {
    const e = A(null), n = re("ServiceContainer");
    return $e(() => {
      const r = document.querySelector(".v-f-modal input");
      r && r.focus(), ct(() => {
        if (document.querySelector(".v-f-modal input") && window.innerWidth < 768) {
          const s = e.value.getBoundingClientRect().bottom + 16;
          window.scrollTo({
            top: s,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }), (r, s) => (v(), g("div", {
      class: "vuefinder__modal-layout",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: s[1] || (s[1] = St((a) => o(n).modal.close(), ["esc"])),
      tabindex: "0"
    }, [
      s[2] || (s[2] = l("div", { class: "vuefinder__modal-layout__overlay" }, null, -1)),
      l("div", Vl, [
        l("div", {
          class: "vuefinder__modal-layout__wrapper",
          onMousedown: s[0] || (s[0] = et((a) => o(n).modal.close(), ["self"]))
        }, [
          l("div", {
            ref_key: "modalBody",
            ref: e,
            class: "vuefinder__modal-layout__body"
          }, [
            l("div", Ll, [
              At(r.$slots, "default")
            ]),
            l("div", Ol, [
              At(r.$slots, "buttons")
            ])
          ], 512)
        ], 32)
      ])
    ], 32));
  }
}, Do = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, s] of e)
    n[r] = s;
  return n;
}, Fl = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(t, { emit: e, slots: n }) {
    const r = re("ServiceContainer"), s = A(!1), { t: a } = r.i18n;
    let c = null;
    const u = () => {
      clearTimeout(c), s.value = !0, c = setTimeout(() => {
        s.value = !1;
      }, 2e3);
    };
    return $e(() => {
      r.emitter.on(t.on, u);
    }), Kn(() => {
      clearTimeout(c);
    }), {
      shown: s,
      t: a
    };
  }
}, Il = { key: 1 };
function Hl(t, e, n, r, s, a) {
  return v(), g("div", {
    class: le(["vuefinder__action-message", { "vuefinder__action-message--hidden": !r.shown }])
  }, [
    t.$slots.default ? At(t.$slots, "default", { key: 0 }) : (v(), g("span", Il, b(r.t("Saved.")), 1))
  ], 2);
}
const _t = /* @__PURE__ */ Do(Fl, [["render", Hl]]), Rl = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function Bl(t, e) {
  return v(), g("svg", Rl, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87q.11.06.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a8 8 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124q.108-.066.22-.128c.332-.183.582-.495.644-.869z"
    }, null, -1),
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    }, null, -1)
  ]));
}
const Ul = { render: Bl }, Nl = { class: "vuefinder__modal-header" }, Pl = { class: "vuefinder__modal-header__icon-container" }, zl = {
  class: "vuefinder__modal-header__title",
  id: "modal-title"
}, nt = {
  __name: "ModalHeader",
  props: {
    title: {
      type: String,
      required: !0
    },
    icon: {
      type: Object,
      required: !0
    }
  },
  setup(t) {
    return (e, n) => (v(), g("div", Nl, [
      l("div", Pl, [
        (v(), G(Hs(t.icon), { class: "vuefinder__modal-header__icon" }))
      ]),
      l("h3", zl, b(t.title), 1)
    ]));
  }
}, ql = { class: "vuefinder__about-modal__content" }, jl = { class: "vuefinder__about-modal__main" }, Gl = {
  class: "vuefinder__about-modal__tabs",
  "aria-label": "Tabs"
}, Wl = ["onClick", "aria-current"], Kl = {
  key: 0,
  class: "vuefinder__about-modal__tab-content"
}, Yl = { class: "vuefinder__about-modal__description" }, Xl = {
  href: "https://vuefinder.ozdemir.be",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, Zl = {
  href: "https://github.com/n1crack/vuefinder",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, Jl = {
  key: 1,
  class: "vuefinder__about-modal__tab-content"
}, Ql = { class: "vuefinder__about-modal__description" }, ea = { class: "vuefinder__about-modal__settings" }, ta = { class: "vuefinder__about-modal__setting flex" }, na = { class: "vuefinder__about-modal__setting-input" }, sa = { class: "vuefinder__about-modal__setting-label" }, oa = {
  for: "metric_unit",
  class: "vuefinder__about-modal__label"
}, ra = { class: "vuefinder__about-modal__setting flex" }, la = { class: "vuefinder__about-modal__setting-input" }, aa = { class: "vuefinder__about-modal__setting-label" }, ia = {
  for: "large_icons",
  class: "vuefinder__about-modal__label"
}, ca = { class: "vuefinder__about-modal__setting flex" }, da = { class: "vuefinder__about-modal__setting-input" }, ua = { class: "vuefinder__about-modal__setting-label" }, va = {
  for: "persist_path",
  class: "vuefinder__about-modal__label"
}, fa = { class: "vuefinder__about-modal__setting flex" }, _a = { class: "vuefinder__about-modal__setting-input" }, ma = { class: "vuefinder__about-modal__setting-label" }, pa = {
  for: "show_thumbnails",
  class: "vuefinder__about-modal__label"
}, ha = { class: "vuefinder__about-modal__setting" }, ga = { class: "vuefinder__about-modal__setting-input" }, ba = {
  for: "theme",
  class: "vuefinder__about-modal__label"
}, wa = { class: "vuefinder__about-modal__setting-label" }, ya = ["label"], ka = ["value"], xa = {
  key: 0,
  class: "vuefinder__about-modal__setting"
}, Sa = { class: "vuefinder__about-modal__setting-input" }, $a = {
  for: "language",
  class: "vuefinder__about-modal__label"
}, Ca = { class: "vuefinder__about-modal__setting-label" }, Ea = ["label"], Ta = ["value"], Ma = {
  key: 2,
  class: "vuefinder__about-modal__tab-content"
}, Aa = { class: "vuefinder__about-modal__shortcuts" }, Da = { class: "vuefinder__about-modal__shortcut" }, Va = { class: "vuefinder__about-modal__shortcut" }, La = { class: "vuefinder__about-modal__shortcut" }, Oa = { class: "vuefinder__about-modal__shortcut" }, Fa = { class: "vuefinder__about-modal__shortcut" }, Ia = { class: "vuefinder__about-modal__shortcut" }, Ha = { class: "vuefinder__about-modal__shortcut" }, Ra = { class: "vuefinder__about-modal__shortcut" }, Ba = { class: "vuefinder__about-modal__shortcut" }, Ua = {
  key: 3,
  class: "vuefinder__about-modal__tab-content"
}, Na = { class: "vuefinder__about-modal__description" }, Vo = {
  __name: "ModalAbout",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n, clearStore: r } = e.storage, { t: s } = e.i18n, a = {
      ABOUT: "about",
      SETTINGS: "settings",
      SHORTCUTS: "shortcuts",
      RESET: "reset"
    }, c = bt(() => [
      { name: s("About"), key: a.ABOUT },
      { name: s("Settings"), key: a.SETTINGS },
      { name: s("Shortcuts"), key: a.SHORTCUTS },
      { name: s("Reset"), key: a.RESET }
    ]), u = A("about"), i = async () => {
      r(), location.reload();
    }, d = (I) => {
      e.theme.set(I), e.emitter.emit("vf-theme-saved");
    }, f = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? Ns : Us, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, m = () => {
      e.compactListView = !e.compactListView, n("compactListView", e.compactListView), e.emitter.emit("vf-compact-view-saved");
    }, p = () => {
      e.showThumbnails = !e.showThumbnails, n("show-thumbnails", e.showThumbnails), e.emitter.emit("vf-show-thumbnails-saved");
    }, _ = () => {
      e.persist = !e.persist, n("persist-path", e.persist), e.emitter.emit("vf-persist-path-saved");
    }, { i18n: h } = re("VueFinderOptions"), $ = Object.fromEntries(
      Object.entries({
        ar: "Arabic (العربيّة)",
        en: "English",
        fr: "French (Français)",
        de: "German (Deutsch)",
        fa: "Persian (فارسی)",
        he: "Hebrew (עִברִית)",
        hi: "Hindi (हिंदी)",
        pl: "Polish (Polski)",
        ru: "Russian (Pусский)",
        sv: "Swedish (Svenska)",
        tr: "Turkish (Türkçe)",
        zhCN: "Simplified Chinese (简体中文)",
        zhTW: "Traditional Chinese (繁體中文)"
      }).filter(([I]) => Object.keys(h).includes(I))
    ), D = bt(() => ({
      system: s("System"),
      light: s("Light"),
      dark: s("Dark")
    }));
    return (I, E) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: E[7] || (E[7] = (C) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(s)("Close")), 1)
      ]),
      default: J(() => [
        l("div", ql, [
          z(nt, {
            icon: o(Ul),
            title: "Vuefinder " + o(e).version
          }, null, 8, ["icon", "title"]),
          l("div", jl, [
            l("div", null, [
              l("div", null, [
                l("nav", Gl, [
                  (v(!0), g(ge, null, ke(c.value, (C) => (v(), g("button", {
                    key: C.name,
                    onClick: (V) => u.value = C.key,
                    class: le([C.key === u.value ? "vuefinder__about-modal__tab--active" : "vuefinder__about-modal__tab--inactive", "vuefinder__about-modal__tab"]),
                    "aria-current": C.current ? "page" : void 0
                  }, b(C.name), 11, Wl))), 128))
                ])
              ])
            ]),
            u.value === a.ABOUT ? (v(), g("div", Kl, [
              l("div", Yl, b(o(s)("Vuefinder is a simple, lightweight, and fast file manager library for Vue.js applications")), 1),
              l("a", Xl, b(o(s)("Project home")), 1),
              l("a", Zl, b(o(s)("Follow on GitHub")), 1)
            ])) : H("", !0),
            u.value === a.SETTINGS ? (v(), g("div", Jl, [
              l("div", Ql, b(o(s)("Customize your experience with the following settings")), 1),
              l("div", ea, [
                l("fieldset", null, [
                  l("div", ta, [
                    l("div", na, [
                      ue(l("input", {
                        id: "metric_unit",
                        name: "metric_unit",
                        type: "checkbox",
                        "onUpdate:modelValue": E[0] || (E[0] = (C) => o(e).metricUnits = C),
                        onClick: f,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [jt, o(e).metricUnits]
                      ])
                    ]),
                    l("div", sa, [
                      l("label", oa, [
                        Z(b(o(s)("Use Metric Units")) + " ", 1),
                        z(_t, {
                          class: "ms-3",
                          on: "vf-metric-units-saved"
                        }, {
                          default: J(() => [
                            Z(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", ra, [
                    l("div", la, [
                      ue(l("input", {
                        id: "large_icons",
                        name: "large_icons",
                        type: "checkbox",
                        "onUpdate:modelValue": E[1] || (E[1] = (C) => o(e).compactListView = C),
                        onClick: m,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [jt, o(e).compactListView]
                      ])
                    ]),
                    l("div", aa, [
                      l("label", ia, [
                        Z(b(o(s)("Compact list view")) + " ", 1),
                        z(_t, {
                          class: "ms-3",
                          on: "vf-compact-view-saved"
                        }, {
                          default: J(() => [
                            Z(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", ca, [
                    l("div", da, [
                      ue(l("input", {
                        id: "persist_path",
                        name: "persist_path",
                        type: "checkbox",
                        "onUpdate:modelValue": E[2] || (E[2] = (C) => o(e).persist = C),
                        onClick: _,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [jt, o(e).persist]
                      ])
                    ]),
                    l("div", ua, [
                      l("label", va, [
                        Z(b(o(s)("Persist path on reload")) + " ", 1),
                        z(_t, {
                          class: "ms-3",
                          on: "vf-persist-path-saved"
                        }, {
                          default: J(() => [
                            Z(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", fa, [
                    l("div", _a, [
                      ue(l("input", {
                        id: "show_thumbnails",
                        name: "show_thumbnails",
                        type: "checkbox",
                        "onUpdate:modelValue": E[3] || (E[3] = (C) => o(e).showThumbnails = C),
                        onClick: p,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [jt, o(e).showThumbnails]
                      ])
                    ]),
                    l("div", ma, [
                      l("label", pa, [
                        Z(b(o(s)("Show thumbnails")) + " ", 1),
                        z(_t, {
                          class: "ms-3",
                          on: "vf-show-thumbnails-saved"
                        }, {
                          default: J(() => [
                            Z(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", ha, [
                    l("div", ga, [
                      l("label", ba, b(o(s)("Theme")), 1)
                    ]),
                    l("div", wa, [
                      ue(l("select", {
                        id: "theme",
                        "onUpdate:modelValue": E[4] || (E[4] = (C) => o(e).theme.value = C),
                        onChange: E[5] || (E[5] = (C) => d(C.target.value)),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: o(s)("Theme")
                        }, [
                          (v(!0), g(ge, null, ke(D.value, (C, V) => (v(), g("option", { value: V }, b(C), 9, ka))), 256))
                        ], 8, ya)
                      ], 544), [
                        [An, o(e).theme.value]
                      ]),
                      z(_t, {
                        class: "ms-3",
                        on: "vf-theme-saved"
                      }, {
                        default: J(() => [
                          Z(b(o(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  o(e).features.includes(o(de).LANGUAGE) && Object.keys(o($)).length > 1 ? (v(), g("div", xa, [
                    l("div", Sa, [
                      l("label", $a, b(o(s)("Language")), 1)
                    ]),
                    l("div", Ca, [
                      ue(l("select", {
                        id: "language",
                        "onUpdate:modelValue": E[6] || (E[6] = (C) => o(e).i18n.locale = C),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: o(s)("Language")
                        }, [
                          (v(!0), g(ge, null, ke(o($), (C, V) => (v(), g("option", { value: V }, b(C), 9, Ta))), 256))
                        ], 8, Ea)
                      ], 512), [
                        [An, o(e).i18n.locale]
                      ]),
                      z(_t, {
                        class: "ms-3",
                        on: "vf-language-saved"
                      }, {
                        default: J(() => [
                          Z(b(o(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ])) : H("", !0)
                ])
              ])
            ])) : H("", !0),
            u.value === a.SHORTCUTS ? (v(), g("div", Ma, [
              l("div", Aa, [
                l("div", Da, [
                  l("div", null, b(o(s)("Rename")), 1),
                  E[8] || (E[8] = l("kbd", null, "F2", -1))
                ]),
                l("div", Va, [
                  l("div", null, b(o(s)("Refresh")), 1),
                  E[9] || (E[9] = l("kbd", null, "F5", -1))
                ]),
                l("div", La, [
                  Z(b(o(s)("Delete")) + " ", 1),
                  E[10] || (E[10] = l("kbd", null, "Del", -1))
                ]),
                l("div", Oa, [
                  Z(b(o(s)("Escape")) + " ", 1),
                  E[11] || (E[11] = l("div", null, [
                    l("kbd", null, "Esc")
                  ], -1))
                ]),
                l("div", Fa, [
                  Z(b(o(s)("Select All")) + " ", 1),
                  E[12] || (E[12] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "A")
                  ], -1))
                ]),
                l("div", Ia, [
                  Z(b(o(s)("Search")) + " ", 1),
                  E[13] || (E[13] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "F")
                  ], -1))
                ]),
                l("div", Ha, [
                  Z(b(o(s)("Toggle Sidebar")) + " ", 1),
                  E[14] || (E[14] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "E")
                  ], -1))
                ]),
                l("div", Ra, [
                  Z(b(o(s)("Open Settings")) + " ", 1),
                  E[15] || (E[15] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, ",")
                  ], -1))
                ]),
                l("div", Ba, [
                  Z(b(o(s)("Toggle Full Screen")) + " ", 1),
                  E[16] || (E[16] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "Enter")
                  ], -1))
                ])
              ])
            ])) : H("", !0),
            u.value === a.RESET ? (v(), g("div", Ua, [
              l("div", Na, b(o(s)("Reset all settings to default")), 1),
              l("button", {
                onClick: i,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(s)("Reset Settings")), 1)
            ])) : H("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Pa = ["title"], Xe = {
  __name: "Message",
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(t, { emit: e }) {
    var d;
    const n = e, r = re("ServiceContainer"), { t: s } = r.i18n, a = A(!1), c = A(null), u = A((d = c.value) == null ? void 0 : d.strMessage);
    De(u, () => a.value = !1);
    const i = () => {
      n("hidden"), a.value = !0;
    };
    return (f, m) => (v(), g("div", null, [
      a.value ? H("", !0) : (v(), g("div", {
        key: 0,
        ref_key: "strMessage",
        ref: c,
        class: le(["vuefinder__message", t.error ? "vuefinder__message--error" : "vuefinder__message--success"])
      }, [
        At(f.$slots, "default"),
        l("div", {
          class: "vuefinder__message__close",
          onClick: i,
          title: o(s)("Close")
        }, m[0] || (m[0] = [
          l("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            stroke: "currentColor",
            class: "vuefinder__message__icon"
          }, [
            l("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M6 18L18 6M6 6l12 12"
            })
          ], -1)
        ]), 8, Pa)
      ], 2))
    ]));
  }
}, za = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function qa(t, e) {
  return v(), g("svg", za, e[0] || (e[0] = [
    l("path", { d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" }, null, -1)
  ]));
}
const Lo = { render: qa }, ja = { class: "vuefinder__delete-modal__content" }, Ga = { class: "vuefinder__delete-modal__form" }, Wa = { class: "vuefinder__delete-modal__description" }, Ka = { class: "vuefinder__delete-modal__files vf-scrollbar" }, Ya = { class: "vuefinder__delete-modal__file" }, Xa = {
  key: 0,
  class: "vuefinder__delete-modal__icon vuefinder__delete-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Za = {
  key: 1,
  class: "vuefinder__delete-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ja = { class: "vuefinder__delete-modal__file-name" }, Qa = { class: "vuefinder__delete-modal__warning" }, cs = {
  __name: "ModalDelete",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(e.modal.data.items), s = A(""), a = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: r.value.map(({ path: c, type: u }) => ({ path: c, type: u }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files deleted.") });
        },
        onError: (c) => {
          s.value = n(c.message);
        }
      });
    };
    return (c, u) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-danger"
        }, b(o(n)("Yes, Delete!")), 1),
        l("button", {
          type: "button",
          onClick: u[1] || (u[1] = (i) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1),
        l("div", Qa, b(o(n)("This action cannot be undone.")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          z(nt, {
            icon: o(Lo),
            title: o(n)("Delete files")
          }, null, 8, ["icon", "title"]),
          l("div", ja, [
            l("div", Ga, [
              l("p", Wa, b(o(n)("Are you sure you want to delete these files?")), 1),
              l("div", Ka, [
                (v(!0), g(ge, null, ke(r.value, (i) => (v(), g("p", Ya, [
                  i.type === "dir" ? (v(), g("svg", Xa, u[2] || (u[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), g("svg", Za, u[3] || (u[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", Ja, b(i.basename), 1)
                ]))), 256))
              ]),
              s.value.length ? (v(), G(Xe, {
                key: 0,
                onHidden: u[0] || (u[0] = (i) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : H("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ei = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function ti(t, e) {
  return v(), g("svg", ei, e[0] || (e[0] = [
    l("path", { d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }, null, -1)
  ]));
}
const Oo = { render: ti }, ni = { class: "vuefinder__rename-modal__content" }, si = { class: "vuefinder__rename-modal__item" }, oi = { class: "vuefinder__rename-modal__item-info" }, ri = {
  key: 0,
  class: "vuefinder__rename-modal__icon vuefinder__rename-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, li = {
  key: 1,
  class: "vuefinder__rename-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ai = { class: "vuefinder__rename-modal__item-name" }, ds = {
  __name: "ModalRename",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(e.modal.data.items[0]), s = A(e.modal.data.items[0].basename), a = A(""), c = () => {
      s.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: r.value.path,
          name: s.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is renamed.", s.value) });
        },
        onError: (u) => {
          a.value = n(u.message);
        }
      });
    };
    return (u, i) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Rename")), 1),
        l("button", {
          type: "button",
          onClick: i[2] || (i[2] = (d) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          z(nt, {
            icon: o(Oo),
            title: o(n)("Rename")
          }, null, 8, ["icon", "title"]),
          l("div", ni, [
            l("div", si, [
              l("p", oi, [
                r.value.type === "dir" ? (v(), g("svg", ri, i[3] || (i[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (v(), g("svg", li, i[4] || (i[4] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", ai, b(r.value.basename), 1)
              ]),
              ue(l("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (d) => s.value = d),
                onKeyup: St(c, ["enter"]),
                class: "vuefinder__rename-modal__input",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [$t, s.value]
              ]),
              a.value.length ? (v(), G(Xe, {
                key: 0,
                onHidden: i[1] || (i[1] = (d) => a.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(a.value), 1)
                ]),
                _: 1
              })) : H("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Ze = {
  ESCAPE: "Escape",
  F2: "F2",
  F5: "F5",
  DELETE: "Delete",
  ENTER: "Enter",
  BACKSLASH: "Backslash",
  KEY_A: "KeyA",
  KEY_E: "KeyE",
  KEY_F: "KeyF"
};
function ii(t) {
  const e = (n) => {
    n.code === Ze.ESCAPE && (t.modal.close(), t.root.focus()), !t.modal.visible && (t.fs.searchMode || (n.code === Ze.F2 && t.features.includes(de.RENAME) && (t.dragSelect.getCount() !== 1 || t.modal.open(ds, { items: t.dragSelect.getSelected() })), n.code === Ze.F5 && t.emitter.emit("vf-fetch", { params: { q: "index", adapter: t.fs.adapter, path: t.fs.data.dirname } }), n.code === Ze.DELETE && (!t.dragSelect.getCount() || t.modal.open(cs, { items: t.dragSelect.getSelected() })), n.metaKey && n.code === Ze.BACKSLASH && t.modal.open(Vo), n.metaKey && n.code === Ze.KEY_F && t.features.includes(de.SEARCH) && (t.fs.searchMode = !0, n.preventDefault()), n.metaKey && n.code === Ze.KEY_E && (t.showTreeView = !t.showTreeView, t.storage.setStore("show-tree-view", t.showTreeView)), n.metaKey && n.code === Ze.ENTER && (t.fullScreen = !t.fullScreen, t.root.focus()), n.metaKey && n.code === Ze.KEY_A && (t.dragSelect.selectAll(), n.preventDefault())));
  };
  $e(() => {
    t.root.addEventListener("keydown", e);
  });
}
const ci = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function di(t, e) {
  return v(), g("svg", ci, e[0] || (e[0] = [
    l("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1)
  ]));
}
const Fo = { render: di }, ui = { class: "vuefinder__new-folder-modal__content" }, vi = { class: "vuefinder__new-folder-modal__form" }, fi = { class: "vuefinder__new-folder-modal__description" }, _i = ["placeholder"], Io = {
  __name: "ModalNewFolder",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, r = A(""), s = A(""), a = () => {
      r.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", r.value) });
        },
        onError: (c) => {
          s.value = n(c.message);
        }
      });
    };
    return (c, u) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        l("button", {
          type: "button",
          onClick: u[2] || (u[2] = (i) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          z(nt, {
            icon: o(Fo),
            title: o(n)("New Folder")
          }, null, 8, ["icon", "title"]),
          l("div", ui, [
            l("div", vi, [
              l("p", fi, b(o(n)("Create a new folder")), 1),
              ue(l("input", {
                "onUpdate:modelValue": u[0] || (u[0] = (i) => r.value = i),
                onKeyup: St(a, ["enter"]),
                class: "vuefinder__new-folder-modal__input",
                placeholder: o(n)("Folder Name"),
                type: "text"
              }, null, 40, _i), [
                [$t, r.value]
              ]),
              s.value.length ? (v(), G(Xe, {
                key: 0,
                onHidden: u[1] || (u[1] = (i) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : H("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, mi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function pi(t, e) {
  return v(), g("svg", mi, e[0] || (e[0] = [
    l("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1)
  ]));
}
const Ho = { render: pi }, hi = { class: "vuefinder__new-file-modal__content" }, gi = { class: "vuefinder__new-file-modal__form" }, bi = { class: "vuefinder__new-file-modal__description" }, wi = ["placeholder"], yi = {
  __name: "ModalNewFile",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, r = A(""), s = A(""), a = () => {
      r.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", r.value) });
        },
        onError: (c) => {
          s.value = n(c.message);
        }
      });
    };
    return (c, u) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        l("button", {
          type: "button",
          onClick: u[2] || (u[2] = (i) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          z(nt, {
            icon: o(Ho),
            title: o(n)("New File")
          }, null, 8, ["icon", "title"]),
          l("div", hi, [
            l("div", gi, [
              l("p", bi, b(o(n)("Create a new file")), 1),
              ue(l("input", {
                "onUpdate:modelValue": u[0] || (u[0] = (i) => r.value = i),
                onKeyup: St(a, ["enter"]),
                class: "vuefinder__new-file-modal__input",
                placeholder: o(n)("File Name"),
                type: "text"
              }, null, 40, wi), [
                [$t, r.value]
              ]),
              s.value.length ? (v(), G(Xe, {
                key: 0,
                onHidden: u[1] || (u[1] = (i) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : H("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
};
function Gn(t, e = 14) {
  let n = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return t.replace(new RegExp(n), "$2..$4");
}
const ki = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function xi(t, e) {
  return v(), g("svg", ki, e[0] || (e[0] = [
    l("path", { d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }, null, -1)
  ]));
}
const Ro = { render: xi }, Si = { class: "vuefinder__upload-modal__content" }, $i = {
  key: 0,
  class: "pointer-events-none"
}, Ci = {
  key: 1,
  class: "pointer-events-none"
}, Ei = ["disabled"], Ti = ["disabled"], Mi = { class: "vuefinder__upload-modal__file-list vf-scrollbar" }, Ai = ["textContent"], Di = { class: "vuefinder__upload-modal__file-info" }, Vi = { class: "vuefinder__upload-modal__file-name hidden md:block" }, Li = { class: "vuefinder__upload-modal__file-name md:hidden" }, Oi = {
  key: 0,
  class: "ml-auto"
}, Fi = ["title", "disabled", "onClick"], Ii = {
  key: 0,
  class: "py-2"
}, Hi = ["disabled"], Ri = {
  __name: "ModalUpload",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = n("uppy"), s = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, a = A({ QUEUE_ENTRY_STATUS: s }), c = A(null), u = A(null), i = A(null), d = A(null), f = A(null), m = A(null), p = A([]), _ = A(""), h = A(!1), w = A(!1);
    let $;
    function D(x) {
      return p.value.findIndex((R) => R.id === x);
    }
    function I(x, R = null) {
      R = R ?? (x.webkitRelativePath || x.name), $.addFile({
        name: R,
        type: x.type,
        data: x,
        source: "Local"
      });
    }
    function E(x) {
      switch (x.status) {
        case s.DONE:
          return "text-green-600";
        case s.ERROR:
          return "text-red-600";
        case s.CANCELED:
          return "text-red-600";
        case s.PENDING:
        default:
          return "";
      }
    }
    const C = (x) => {
      switch (x.status) {
        case s.DONE:
          return "✓";
        case s.ERROR:
        case s.CANCELED:
          return "!";
        case s.PENDING:
        default:
          return "...";
      }
    };
    function V() {
      d.value.click();
    }
    function F() {
      if (!h.value) {
        if (!p.value.filter((x) => x.status !== s.DONE).length) {
          _.value = n("Please select file to upload first.");
          return;
        }
        _.value = "", $.retryAll(), $.upload();
      }
    }
    function q() {
      $.cancelAll({ reason: "user" }), p.value.forEach((x) => {
        x.status !== s.DONE && (x.status = s.CANCELED, x.statusName = n("Canceled"));
      }), h.value = !1;
    }
    function O(x) {
      h.value || ($.removeFile(x.id, "removed-by-user"), p.value.splice(D(x.id), 1));
    }
    function y(x) {
      if (!h.value) {
        if ($.cancelAll({ reason: "user" }), x) {
          const R = [];
          p.value.forEach((S) => {
            S.status !== s.DONE && R.push(S);
          }), p.value = [], R.forEach((S) => {
            I(S.originalFile, S.name);
          });
          return;
        }
        p.value.splice(0);
      }
    }
    function k() {
      e.modal.close();
    }
    function L() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: { q: "upload", adapter: e.fs.adapter, path: e.fs.data.dirname }
      });
    }
    return $e(async () => {
      $ = new fr({
        debug: e.debug,
        restrictions: {
          maxFileSize: Sr(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: r,
        onBeforeFileAdded(S, U) {
          if (U[S.id] != null) {
            const Q = D(S.id);
            p.value[Q].status === s.PENDING && (_.value = $.i18n("noDuplicates", { fileName: S.name })), p.value = p.value.filter((se) => se.id !== S.id);
          }
          return p.value.push({
            id: S.id,
            name: S.name,
            size: e.filesize(S.size),
            status: s.PENDING,
            statusName: n("Pending upload"),
            percent: null,
            originalFile: S.data
          }), !0;
        }
      }), $.use(_r, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(S, U) {
          let N;
          try {
            N = JSON.parse(S).message;
          } catch {
            N = n("Cannot parse server response.");
          }
          return new Error(N);
        }
      }), $.on("restriction-failed", (S, U) => {
        const N = p.value[D(S.id)];
        O(N), _.value = U.message;
      }), $.on("upload", () => {
        const S = L();
        $.setMeta({ ...S.body });
        const U = $.getPlugin("XHRUpload");
        U.opts.method = S.method, U.opts.endpoint = S.url + "?" + new URLSearchParams(S.params), U.opts.headers = S.headers, delete S.headers["Content-Type"], h.value = !0, p.value.forEach((N) => {
          N.status !== s.DONE && (N.percent = null, N.status = s.UPLOADING, N.statusName = n("Pending upload"));
        });
      }), $.on("upload-progress", (S, U) => {
        const N = Math.floor(U.bytesUploaded / U.bytesTotal * 100);
        p.value[D(S.id)].percent = `${N}%`;
      }), $.on("upload-success", (S) => {
        const U = p.value[D(S.id)];
        U.status = s.DONE, U.statusName = n("Done");
      }), $.on("upload-error", (S, U) => {
        const N = p.value[D(S.id)];
        N.percent = null, N.status = s.ERROR, U.isNetworkError ? N.statusName = n("Network Error, Unable establish connection to the server or interrupted.") : N.statusName = U ? U.message : n("Unknown Error");
      }), $.on("error", (S) => {
        _.value = S.message, h.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), $.on("complete", () => {
        h.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), d.value.addEventListener("click", () => {
        u.value.click();
      }), f.value.addEventListener("click", () => {
        i.value.click();
      }), m.value.addEventListener("dragover", (S) => {
        S.preventDefault(), w.value = !0;
      }), m.value.addEventListener("dragleave", (S) => {
        S.preventDefault(), w.value = !1;
      });
      function x(S, U) {
        U.isFile && U.file((N) => S(U, N)), U.isDirectory && U.createReader().readEntries((N) => {
          N.forEach((Q) => {
            x(S, Q);
          });
        });
      }
      m.value.addEventListener("drop", (S) => {
        S.preventDefault(), w.value = !1;
        const U = /^[/\\](.+)/;
        [...S.dataTransfer.items].forEach((N) => {
          N.kind === "file" && x((Q, se) => {
            const ne = U.exec(Q.fullPath);
            I(se, ne[1]);
          }, N.webkitGetAsEntry());
        });
      });
      const R = ({ target: S }) => {
        const U = S.files;
        for (const N of U)
          I(N);
        S.value = "";
      };
      u.value.addEventListener("change", R), i.value.addEventListener("change", R);
    }), Rs(() => {
      $ == null || $.close({ reason: "unmount" });
    }), (x, R) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: h.value,
          onClick: et(F, ["prevent"])
        }, b(o(n)("Upload")), 9, Hi),
        h.value ? (v(), g("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: et(q, ["prevent"])
        }, b(o(n)("Cancel")), 1)) : (v(), g("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: et(k, ["prevent"])
        }, b(o(n)("Close")), 1))
      ]),
      default: J(() => [
        l("div", null, [
          z(nt, {
            icon: o(Ro),
            title: o(n)("Upload Files")
          }, null, 8, ["icon", "title"]),
          l("div", Si, [
            l("div", {
              class: "vuefinder__upload-modal__drop-area",
              ref_key: "dropArea",
              ref: m,
              onClick: V
            }, [
              w.value ? (v(), g("div", $i, b(o(n)("Release to drop these files.")), 1)) : (v(), g("div", Ci, b(o(n)("Drag and drop the files/folders to here or click here.")), 1))
            ], 512),
            l("div", {
              ref_key: "container",
              ref: c,
              class: "vuefinder__upload-modal__buttons"
            }, [
              l("button", {
                ref_key: "pickFiles",
                ref: d,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(n)("Select Files")), 513),
              l("button", {
                ref_key: "pickFolders",
                ref: f,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(n)("Select Folders")), 513),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: h.value,
                onClick: R[0] || (R[0] = (S) => y(!1))
              }, b(o(n)("Clear all")), 9, Ei),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: h.value,
                onClick: R[1] || (R[1] = (S) => y(!0))
              }, b(o(n)("Clear only successful")), 9, Ti)
            ], 512),
            l("div", Mi, [
              (v(!0), g(ge, null, ke(p.value, (S) => (v(), g("div", {
                class: "vuefinder__upload-modal__file-entry",
                key: S.id
              }, [
                l("span", {
                  class: le(["vuefinder__upload-modal__file-icon", E(S)])
                }, [
                  l("span", {
                    class: "vuefinder__upload-modal__file-icon-text",
                    textContent: b(C(S))
                  }, null, 8, Ai)
                ], 2),
                l("div", Di, [
                  l("div", Vi, b(o(Gn)(S.name, 40)) + " (" + b(S.size) + ")", 1),
                  l("div", Li, b(o(Gn)(S.name, 16)) + " (" + b(S.size) + ")", 1),
                  l("div", {
                    class: le(["vuefinder__upload-modal__file-status", E(S)])
                  }, [
                    Z(b(S.statusName) + " ", 1),
                    S.status === a.value.QUEUE_ENTRY_STATUS.UPLOADING ? (v(), g("b", Oi, b(S.percent), 1)) : H("", !0)
                  ], 2)
                ]),
                l("button", {
                  type: "button",
                  class: le(["vuefinder__upload-modal__file-remove", h.value ? "disabled" : ""]),
                  title: o(n)("Delete"),
                  disabled: h.value,
                  onClick: (U) => O(S)
                }, R[3] || (R[3] = [
                  l("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    "stroke-width": "1.5",
                    stroke: "currentColor",
                    class: "vuefinder__upload-modal__file-remove-icon"
                  }, [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M6 18L18 6M6 6l12 12"
                    })
                  ], -1)
                ]), 10, Fi)
              ]))), 128)),
              p.value.length ? H("", !0) : (v(), g("div", Ii, b(o(n)("No files selected!")), 1))
            ]),
            _.value.length ? (v(), G(Xe, {
              key: 0,
              onHidden: R[2] || (R[2] = (S) => _.value = ""),
              error: ""
            }, {
              default: J(() => [
                Z(b(_.value), 1)
              ]),
              _: 1
            })) : H("", !0)
          ])
        ]),
        l("input", {
          ref_key: "internalFileInput",
          ref: u,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        l("input", {
          ref_key: "internalFolderInput",
          ref: i,
          type: "file",
          multiple: "",
          webkitdirectory: "",
          class: "hidden"
        }, null, 512)
      ]),
      _: 1
    }));
  }
}, Bi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Ui(t, e) {
  return v(), g("svg", Bi, e[0] || (e[0] = [
    l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const Bo = { render: Ui }, Ni = { class: "vuefinder__unarchive-modal__content" }, Pi = { class: "vuefinder__unarchive-modal__items" }, zi = { class: "vuefinder__unarchive-modal__item" }, qi = {
  key: 0,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ji = {
  key: 1,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--file",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Gi = { class: "vuefinder__unarchive-modal__item-name" }, Wi = { class: "vuefinder__unarchive-modal__info" }, Uo = {
  __name: "ModalUnarchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(e.modal.data.items[0]), s = A(""), a = A([]), c = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: r.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file unarchived.") });
        },
        onError: (u) => {
          s.value = n(u.message);
        }
      });
    };
    return (u, i) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Unarchive")), 1),
        l("button", {
          type: "button",
          onClick: i[1] || (i[1] = (d) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          z(nt, {
            icon: o(Bo),
            title: o(n)("Unarchive")
          }, null, 8, ["icon", "title"]),
          l("div", Ni, [
            l("div", Pi, [
              (v(!0), g(ge, null, ke(a.value, (d) => (v(), g("p", zi, [
                d.type === "dir" ? (v(), g("svg", qi, i[2] || (i[2] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (v(), g("svg", ji, i[3] || (i[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", Gi, b(d.basename), 1)
              ]))), 256)),
              l("p", Wi, b(o(n)("The archive will be unarchived at")) + " (" + b(o(e).fs.data.dirname) + ")", 1),
              s.value.length ? (v(), G(Xe, {
                key: 0,
                onHidden: i[0] || (i[0] = (d) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : H("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Ki = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Yi(t, e) {
  return v(), g("svg", Ki, e[0] || (e[0] = [
    l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const No = { render: Yi }, Xi = { class: "vuefinder__archive-modal__content" }, Zi = { class: "vuefinder__archive-modal__form" }, Ji = { class: "vuefinder__archive-modal__files vf-scrollbar" }, Qi = { class: "vuefinder__archive-modal__file" }, ec = {
  key: 0,
  class: "vuefinder__archive-modal__icon vuefinder__archive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, tc = {
  key: 1,
  class: "vuefinder__archive-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, nc = { class: "vuefinder__archive-modal__file-name" }, sc = ["placeholder"], Po = {
  __name: "ModalArchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(""), s = A(""), a = A(e.modal.data.items), c = () => {
      a.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: a.value.map(({ path: u, type: i }) => ({ path: u, type: i })),
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file(s) archived.") });
        },
        onError: (u) => {
          s.value = n(u.message);
        }
      });
    };
    return (u, i) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Archive")), 1),
        l("button", {
          type: "button",
          onClick: i[2] || (i[2] = (d) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: J(() => [
        l("div", null, [
          z(nt, {
            icon: o(No),
            title: o(n)("Archive the files")
          }, null, 8, ["icon", "title"]),
          l("div", Xi, [
            l("div", Zi, [
              l("div", Ji, [
                (v(!0), g(ge, null, ke(a.value, (d) => (v(), g("p", Qi, [
                  d.type === "dir" ? (v(), g("svg", ec, i[3] || (i[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), g("svg", tc, i[4] || (i[4] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", nc, b(d.basename), 1)
                ]))), 256))
              ]),
              ue(l("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (d) => r.value = d),
                onKeyup: St(c, ["enter"]),
                class: "vuefinder__archive-modal__input",
                placeholder: o(n)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, sc), [
                [$t, r.value]
              ]),
              s.value.length ? (v(), G(Xe, {
                key: 0,
                onHidden: i[1] || (i[1] = (d) => s.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : H("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, oc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  viewBox: "0 0 24 24"
};
function rc(t, e) {
  return v(), g("svg", oc, e[0] || (e[0] = [
    l("circle", {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      "stroke-width": "4",
      class: "opacity-25 stroke-blue-900 dark:stroke-blue-100"
    }, null, -1),
    l("path", {
      fill: "currentColor",
      d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z",
      class: "opacity-75"
    }, null, -1)
  ]));
}
const us = { render: rc }, lc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function ac(t, e) {
  return v(), g("svg", lc, e[0] || (e[0] = [
    l("path", { d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" }, null, -1)
  ]));
}
const ic = { render: ac }, cc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function dc(t, e) {
  return v(), g("svg", cc, e[0] || (e[0] = [
    l("path", { d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" }, null, -1)
  ]));
}
const uc = { render: dc }, vc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function fc(t, e) {
  return v(), g("svg", vc, e[0] || (e[0] = [
    l("path", { d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z" }, null, -1)
  ]));
}
const _c = { render: fc }, mc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function pc(t, e) {
  return v(), g("svg", mc, e[0] || (e[0] = [
    l("path", { d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" }, null, -1)
  ]));
}
const hc = { render: pc }, gc = { class: "vuefinder__toolbar" }, bc = {
  key: 0,
  class: "vuefinder__toolbar__actions"
}, wc = ["title"], yc = ["title"], kc = ["title"], xc = ["title"], Sc = ["title"], $c = ["title"], Cc = ["title"], Ec = {
  key: 1,
  class: "vuefinder__toolbar__search-results"
}, Tc = { class: "pl-2" }, Mc = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, Ac = { class: "vuefinder__toolbar__controls" }, Dc = ["title"], Vc = ["title"], Lc = {
  __name: "Toolbar",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n } = e.storage, { t: r } = e.i18n, s = e.dragSelect, a = A("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      a.value = i;
    });
    const c = () => {
      e.fullScreen = !e.fullScreen;
    };
    De(() => e.fullScreen, () => {
      e.fullScreen ? document.querySelector("body").style.overflow = "hidden" : document.querySelector("body").style.overflow = "", n("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
    });
    const u = () => {
      e.view = e.view === "list" ? "grid" : "list", s.refreshSelection(), n("viewport", e.view);
    };
    return (i, d) => (v(), g("div", gc, [
      a.value.length ? (v(), g("div", Ec, [
        l("div", Tc, [
          Z(b(o(r)("Search results for")) + " ", 1),
          l("span", Mc, b(a.value), 1)
        ]),
        o(e).loadingIndicator === "circular" && o(e).fs.loading ? (v(), G(o(us), { key: 0 })) : H("", !0)
      ])) : (v(), g("div", bc, [
        o(e).features.includes(o(de).NEW_FOLDER) ? (v(), g("div", {
          key: 0,
          class: "mx-1.5",
          title: o(r)("New Folder"),
          onClick: d[0] || (d[0] = (f) => o(e).modal.open(Io, { items: o(s).getSelected() }))
        }, [
          z(o(Fo))
        ], 8, wc)) : H("", !0),
        o(e).features.includes(o(de).NEW_FILE) ? (v(), g("div", {
          key: 1,
          class: "mx-1.5",
          title: o(r)("New File"),
          onClick: d[1] || (d[1] = (f) => o(e).modal.open(yi, { items: o(s).getSelected() }))
        }, [
          z(o(Ho))
        ], 8, yc)) : H("", !0),
        o(e).features.includes(o(de).RENAME) ? (v(), g("div", {
          key: 2,
          class: "mx-1.5",
          title: o(r)("Rename"),
          onClick: d[2] || (d[2] = (f) => o(s).getCount() !== 1 || o(e).modal.open(ds, { items: o(s).getSelected() }))
        }, [
          z(o(Oo), {
            class: le(o(s).getCount() === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, kc)) : H("", !0),
        o(e).features.includes(o(de).DELETE) ? (v(), g("div", {
          key: 3,
          class: "mx-1.5",
          title: o(r)("Delete"),
          onClick: d[3] || (d[3] = (f) => !o(s).getCount() || o(e).modal.open(cs, { items: o(s).getSelected() }))
        }, [
          z(o(Lo), {
            class: le(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, xc)) : H("", !0),
        o(e).features.includes(o(de).UPLOAD) ? (v(), g("div", {
          key: 4,
          class: "mx-1.5",
          title: o(r)("Upload"),
          onClick: d[4] || (d[4] = (f) => o(e).modal.open(Ri, { items: o(s).getSelected() }))
        }, [
          z(o(Ro))
        ], 8, Sc)) : H("", !0),
        o(e).features.includes(o(de).UNARCHIVE) && o(s).getCount() === 1 && o(s).getSelected()[0].mime_type === "application/zip" ? (v(), g("div", {
          key: 5,
          class: "mx-1.5",
          title: o(r)("Unarchive"),
          onClick: d[5] || (d[5] = (f) => !o(s).getCount() || o(e).modal.open(Uo, { items: o(s).getSelected() }))
        }, [
          z(o(Bo), {
            class: le(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, $c)) : H("", !0),
        o(e).features.includes(o(de).ARCHIVE) ? (v(), g("div", {
          key: 6,
          class: "mx-1.5",
          title: o(r)("Archive"),
          onClick: d[6] || (d[6] = (f) => !o(s).getCount() || o(e).modal.open(Po, { items: o(s).getSelected() }))
        }, [
          z(o(No), {
            class: le(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Cc)) : H("", !0)
      ])),
      l("div", Ac, [
        o(e).features.includes(o(de).FULL_SCREEN) ? (v(), g("div", {
          key: 0,
          onClick: c,
          class: "mx-1.5",
          title: o(r)("Toggle Full Screen")
        }, [
          o(e).fullScreen ? (v(), G(o(uc), { key: 0 })) : (v(), G(o(ic), { key: 1 }))
        ], 8, Dc)) : H("", !0),
        l("div", {
          class: "mx-1.5",
          title: o(r)("Change View"),
          onClick: d[7] || (d[7] = (f) => a.value.length || u())
        }, [
          o(e).view === "grid" ? (v(), G(o(_c), {
            key: 0,
            class: le(["vf-toolbar-icon", a.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : H("", !0),
          o(e).view === "list" ? (v(), G(o(hc), {
            key: 1,
            class: le(["vf-toolbar-icon", a.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : H("", !0)
        ], 8, Vc)
      ])
    ]));
  }
}, Oc = (t, e = 0, n = !1) => {
  let r;
  return (...s) => {
    n && !r && t(...s), clearTimeout(r), r = setTimeout(() => {
      t(...s);
    }, e);
  };
}, Os = (t, e, n) => {
  const r = A(t);
  return or((s, a) => ({
    get() {
      return s(), r.value;
    },
    set: Oc(
      (c) => {
        r.value = c, a();
      },
      e,
      n
    )
  }));
}, Fc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function Ic(t, e) {
  return v(), g("svg", Fc, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3"
    }, null, -1)
  ]));
}
const Hc = { render: Ic }, Rc = { class: "vuefinder__move-modal__content" }, Bc = { class: "vuefinder__move-modal__description" }, Uc = { class: "vuefinder__move-modal__files vf-scrollbar" }, Nc = { class: "vuefinder__move-modal__file" }, Pc = {
  key: 0,
  class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, zc = {
  key: 1,
  class: "vuefinder__move-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, qc = { class: "vuefinder__move-modal__file-name" }, jc = { class: "vuefinder__move-modal__target-title" }, Gc = { class: "vuefinder__move-modal__target-directory" }, Wc = { class: "vuefinder__move-modal__target-path" }, Kc = { class: "vuefinder__move-modal__selected-items" }, Wn = {
  __name: "ModalMove",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(e.modal.data.items.from), s = A(""), a = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: r.value.map(({ path: c, type: u }) => ({ path: c, type: u })),
          item: e.modal.data.items.to.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files moved.", e.modal.data.items.to.name) });
        },
        onError: (c) => {
          s.value = n(c.message);
        }
      });
    };
    return (c, u) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Yes, Move!")), 1),
        l("button", {
          type: "button",
          onClick: u[1] || (u[1] = (i) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1),
        l("div", Kc, b(o(n)("%s item(s) selected.", r.value.length)), 1)
      ]),
      default: J(() => [
        l("div", null, [
          z(nt, {
            icon: o(Hc),
            title: o(n)("Move files")
          }, null, 8, ["icon", "title"]),
          l("div", Rc, [
            l("p", Bc, b(o(n)("Are you sure you want to move these files?")), 1),
            l("div", Uc, [
              (v(!0), g(ge, null, ke(r.value, (i) => (v(), g("div", Nc, [
                l("div", null, [
                  i.type === "dir" ? (v(), g("svg", Pc, u[2] || (u[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (v(), g("svg", zc, u[3] || (u[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])))
                ]),
                l("div", qc, b(i.path), 1)
              ]))), 256))
            ]),
            l("h4", jc, b(o(n)("Target Directory")), 1),
            l("p", Gc, [
              u[4] || (u[4] = l("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "1"
              }, [
                l("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                })
              ], -1)),
              l("span", Wc, b(o(e).modal.data.items.to.path), 1)
            ]),
            s.value.length ? (v(), G(Xe, {
              key: 0,
              onHidden: u[0] || (u[0] = (i) => s.value = ""),
              error: ""
            }, {
              default: J(() => [
                Z(b(s.value), 1)
              ]),
              _: 1
            })) : H("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Yc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "-40 -40 580 580"
};
function Xc(t, e) {
  return v(), g("svg", Yc, e[0] || (e[0] = [
    l("path", { d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z" }, null, -1)
  ]));
}
const Zc = { render: Xc }, Jc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-0.5 rounded",
  viewBox: "0 0 20 20"
};
function Qc(t, e) {
  return v(), g("svg", Jc, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0",
      class: "pointer-events-none",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const ed = { render: Qc }, td = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "0 0 24 24"
};
function nd(t, e) {
  return v(), g("svg", td, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const sd = { render: nd }, od = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 20 20"
};
function rd(t, e) {
  return v(), g("svg", od, e[0] || (e[0] = [
    l("path", {
      d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
      class: "pointer-events-none"
    }, null, -1)
  ]));
}
const ld = { render: rd }, ad = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
  viewBox: "0 0 20 20"
};
function id(t, e) {
  return v(), g("svg", ad, e[0] || (e[0] = [
    l("path", { d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" }, null, -1)
  ]));
}
const cd = { render: id }, dd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "w-6 h-6 cursor-pointer",
  viewBox: "0 0 24 24"
};
function ud(t, e) {
  return v(), g("svg", dd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const vd = { render: ud }, fd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  viewBox: "0 0 24 24"
};
function _d(t, e) {
  return v(), g("svg", fd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2"
    }, null, -1)
  ]));
}
const hn = { render: _d }, md = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-6 w-6 p-1 rounded text-slate-700 dark:text-neutral-300 cursor-pointer",
  viewBox: "0 0 24 24"
};
function pd(t, e) {
  return v(), g("svg", md, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M9 6h11M12 12h8M15 18h5M5 6v.01M8 12v.01M11 18v.01" }, null, -1)
  ]));
}
const hd = { render: pd }, gd = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 rounded text-slate-700 hover:bg-neutral-100 dark:fill-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 448 512"
};
function bd(t, e) {
  return v(), g("svg", gd, e[0] || (e[0] = [
    l("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1)
  ]));
}
const wd = { render: bd }, yd = { class: "vuefinder__breadcrumb__container" }, kd = ["title"], xd = ["title"], Sd = ["title"], $d = ["title"], Cd = { class: "vuefinder__breadcrumb__list" }, Ed = {
  key: 0,
  class: "vuefinder__breadcrumb__hidden-list"
}, Td = { class: "relative" }, Md = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Ad = { class: "vuefinder__breadcrumb__search-mode" }, Dd = ["placeholder"], Vd = { class: "vuefinder__breadcrumb__hidden-dropdown" }, Ld = ["onDrop", "onClick"], Od = { class: "vuefinder__breadcrumb__hidden-item-content" }, Fd = { class: "vuefinder__breadcrumb__hidden-item-text" }, Id = {
  __name: "Breadcrumb",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = e.dragSelect, { setStore: s } = e.storage, a = A(null), c = Os(0, 100);
    De(c, (O) => {
      const y = a.value.children;
      let k = 0, L = 0, x = 5, R = 1;
      e.fs.limitBreadcrumbItems(x), ct(() => {
        for (let S = y.length - 1; S >= 0 && !(k + y[S].offsetWidth > c.value - 40); S--)
          k += parseInt(y[S].offsetWidth, 10), L++;
        L < R && (L = R), L > x && (L = x), e.fs.limitBreadcrumbItems(L);
      });
    });
    const u = () => {
      c.value = a.value.offsetWidth;
    };
    let i = A(null);
    $e(() => {
      i.value = new ResizeObserver(u), i.value.observe(a.value);
    }), Kn(() => {
      i.value.disconnect();
    });
    const d = (O, y = null) => {
      O.preventDefault(), r.isDraggingRef.value = !1, p(O), y ?? (y = e.fs.hiddenBreadcrumbs.length - 1);
      let k = JSON.parse(O.dataTransfer.getData("items"));
      if (k.find((L) => L.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, {
        items: {
          from: k,
          to: e.fs.hiddenBreadcrumbs[y] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, f = (O, y = null) => {
      O.preventDefault(), r.isDraggingRef.value = !1, p(O), y ?? (y = e.fs.breadcrumbs.length - 2);
      let k = JSON.parse(O.dataTransfer.getData("items"));
      if (k.find((L) => L.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, {
        items: {
          from: k,
          to: e.fs.breadcrumbs[y] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, m = (O) => {
      O.preventDefault(), e.fs.isGoUpAvailable() ? (O.dataTransfer.dropEffect = "copy", O.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-600")) : (O.dataTransfer.dropEffect = "none", O.dataTransfer.effectAllowed = "none");
    }, p = (O) => {
      O.preventDefault(), O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600"), e.fs.isGoUpAvailable() && O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600");
    }, _ = () => {
      F(), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    }, h = () => {
      F(), !e.fs.isGoUpAvailable() || e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.parentFolderPath
        }
      });
    }, w = (O) => {
      e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: O.path } }), e.fs.toggleHiddenBreadcrumbs(!1);
    }, $ = () => {
      e.fs.showHiddenBreadcrumbs && e.fs.toggleHiddenBreadcrumbs(!1);
    }, D = {
      mounted(O, y, k, L) {
        O.clickOutsideEvent = function(x) {
          O === x.target || O.contains(x.target) || y.value();
        }, document.body.addEventListener("click", O.clickOutsideEvent);
      },
      beforeUnmount(O, y, k, L) {
        document.body.removeEventListener("click", O.clickOutsideEvent);
      }
    }, I = () => {
      e.showTreeView = !e.showTreeView;
    };
    De(() => e.showTreeView, (O, y) => {
      O !== y && s("show-tree-view", O);
    });
    const E = A(null), C = () => {
      e.features.includes(de.SEARCH) && (e.fs.searchMode = !0, ct(() => E.value.focus()));
    }, V = Os("", 400);
    De(V, (O) => {
      e.emitter.emit("vf-toast-clear"), e.emitter.emit("vf-search-query", { newQuery: O });
    }), De(() => e.fs.searchMode, (O) => {
      O && ct(() => E.value.focus());
    });
    const F = () => {
      e.fs.searchMode = !1, V.value = "";
    };
    e.emitter.on("vf-search-exit", () => {
      F();
    });
    const q = () => {
      V.value === "" && F();
    };
    return (O, y) => (v(), g("div", yd, [
      l("span", {
        title: o(n)("Toggle Tree View")
      }, [
        z(o(hd), {
          onClick: I,
          class: le(["vuefinder__breadcrumb__toggle-tree", o(e).showTreeView ? "vuefinder__breadcrumb__toggle-tree--active" : ""])
        }, null, 8, ["class"])
      ], 8, kd),
      l("span", {
        title: o(n)("Go up a directory")
      }, [
        z(o(ed), {
          onDragover: y[0] || (y[0] = (k) => m(k)),
          onDragleave: y[1] || (y[1] = (k) => p(k)),
          onDrop: y[2] || (y[2] = (k) => f(k)),
          onClick: h,
          class: le(o(e).fs.isGoUpAvailable() ? "vuefinder__breadcrumb__go-up--active" : "vuefinder__breadcrumb__go-up--inactive")
        }, null, 8, ["class"])
      ], 8, xd),
      o(e).fs.loading ? (v(), g("span", {
        key: 1,
        title: o(n)("Cancel")
      }, [
        z(o(sd), {
          onClick: y[3] || (y[3] = (k) => o(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, $d)) : (v(), g("span", {
        key: 0,
        title: o(n)("Refresh")
      }, [
        z(o(Zc), { onClick: _ })
      ], 8, Sd)),
      ue(l("div", {
        onClick: et(C, ["self"]),
        class: "group vuefinder__breadcrumb__search-container"
      }, [
        l("div", null, [
          z(o(ld), {
            onDragover: y[4] || (y[4] = (k) => m(k)),
            onDragleave: y[5] || (y[5] = (k) => p(k)),
            onDrop: y[6] || (y[6] = (k) => f(k, -1)),
            onClick: y[7] || (y[7] = (k) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter } }))
          })
        ]),
        l("div", Cd, [
          o(e).fs.hiddenBreadcrumbs.length ? ue((v(), g("div", Ed, [
            y[13] || (y[13] = l("div", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("div", Td, [
              l("span", {
                onDragenter: y[8] || (y[8] = (k) => o(e).fs.toggleHiddenBreadcrumbs(!0)),
                onClick: y[9] || (y[9] = (k) => o(e).fs.toggleHiddenBreadcrumbs()),
                class: "vuefinder__breadcrumb__hidden-toggle"
              }, [
                z(o(wd), { class: "vuefinder__breadcrumb__hidden-toggle-icon" })
              ], 32)
            ])
          ])), [
            [D, $]
          ]) : H("", !0)
        ]),
        l("div", {
          ref_key: "breadcrumbContainer",
          ref: a,
          class: "vuefinder__breadcrumb__visible-list",
          onClick: et(C, ["self"])
        }, [
          (v(!0), g(ge, null, ke(o(e).fs.breadcrumbs, (k, L) => (v(), g("div", { key: L }, [
            y[14] || (y[14] = l("span", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("span", {
              onDragover: (x) => L === o(e).fs.breadcrumbs.length - 1 || m(x),
              onDragleave: (x) => L === o(e).fs.breadcrumbs.length - 1 || p(x),
              onDrop: (x) => L === o(e).fs.breadcrumbs.length - 1 || f(x, L),
              class: "vuefinder__breadcrumb__item",
              title: k.basename,
              onClick: (x) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter, path: k.path } })
            }, b(k.name), 41, Md)
          ]))), 128))
        ], 512),
        o(e).loadingIndicator === "circular" && o(e).fs.loading ? (v(), G(o(us), { key: 0 })) : H("", !0)
      ], 512), [
        [ze, !o(e).fs.searchMode]
      ]),
      ue(l("div", Ad, [
        l("div", null, [
          z(o(cd))
        ]),
        ue(l("input", {
          ref_key: "searchInput",
          ref: E,
          onKeydown: St(F, ["esc"]),
          onBlur: q,
          "onUpdate:modelValue": y[10] || (y[10] = (k) => rr(V) ? V.value = k : null),
          placeholder: o(n)("Search anything.."),
          class: "vuefinder__breadcrumb__search-input",
          type: "text"
        }, null, 40, Dd), [
          [$t, o(V)]
        ]),
        z(o(vd), { onClick: F })
      ], 512), [
        [ze, o(e).fs.searchMode]
      ]),
      ue(l("div", Vd, [
        (v(!0), g(ge, null, ke(o(e).fs.hiddenBreadcrumbs, (k, L) => (v(), g("div", {
          key: L,
          onDragover: y[11] || (y[11] = (x) => m(x)),
          onDragleave: y[12] || (y[12] = (x) => p(x)),
          onDrop: (x) => d(x, L),
          onClick: (x) => w(k),
          class: "vuefinder__breadcrumb__hidden-item"
        }, [
          l("div", Od, [
            l("span", null, [
              z(o(hn), { class: "vuefinder__breadcrumb__hidden-item-icon" })
            ]),
            y[15] || (y[15] = Z()),
            l("span", Fd, b(k.name), 1)
          ])
        ], 40, Ld))), 128))
      ], 512), [
        [ze, o(e).fs.showHiddenBreadcrumbs]
      ])
    ]));
  }
}, zo = (t, e = null) => new Date(t * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), Hd = ["onClick"], Rd = {
  __name: "Toast",
  setup(t) {
    const e = re("ServiceContainer"), { getStore: n } = e.storage, r = A(n("full-screen", !1)), s = A([]), a = (i) => i === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", c = (i) => {
      s.value.splice(i, 1);
    }, u = (i) => {
      let d = s.value.findIndex((f) => f.id === i);
      d !== -1 && c(d);
    };
    return e.emitter.on("vf-toast-clear", () => {
      s.value = [];
    }), e.emitter.on("vf-toast-push", (i) => {
      let d = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      i.id = d, s.value.push(i), setTimeout(() => {
        u(d);
      }, 5e3);
    }), (i, d) => (v(), g("div", {
      class: le(["vuefinder__toast", r.value.value ? "vuefinder__toast--fixed" : "vuefinder__toast--absolute"])
    }, [
      z(lr, {
        name: "vuefinder__toast-item",
        "enter-active-class": "vuefinder__toast-item--enter-active",
        "leave-active-class": "vuefinder__toast-item--leave-active",
        "leave-to-class": "vuefinder__toast-item--leave-to"
      }, {
        default: J(() => [
          (v(!0), g(ge, null, ke(s.value, (f, m) => (v(), g("div", {
            key: m,
            onClick: (p) => c(m),
            class: le(["vuefinder__toast__message", a(f.type)])
          }, b(f.label), 11, Hd))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
}, Bd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function Ud(t, e) {
  return v(), g("svg", Bd, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const Nd = { render: Ud }, Pd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function zd(t, e) {
  return v(), g("svg", Pd, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const qd = { render: zd }, Kt = {
  __name: "SortIcon",
  props: { direction: String },
  setup(t) {
    return (e, n) => (v(), g("div", null, [
      t.direction === "asc" ? (v(), G(o(Nd), { key: 0 })) : H("", !0),
      t.direction === "desc" ? (v(), G(o(qd), { key: 1 })) : H("", !0)
    ]));
  }
}, jd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500",
  viewBox: "0 0 24 24"
};
function Gd(t, e) {
  return v(), g("svg", jd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const Wd = { render: Gd }, Kd = { class: "vuefinder__item-icon" }, Tn = {
  __name: "ItemIcon",
  props: {
    type: {
      type: String,
      required: !0
    },
    small: {
      type: Boolean,
      default: !1
    }
  },
  setup(t) {
    return (e, n) => (v(), g("span", Kd, [
      t.type === "dir" ? (v(), G(o(hn), {
        key: 0,
        class: le(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
      }, null, 8, ["class"])) : (v(), G(o(Wd), {
        key: 1,
        class: le(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
      }, null, 8, ["class"]))
    ]));
  }
}, Yd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
  viewBox: "0 0 24 24"
};
function Xd(t, e) {
  return v(), g("svg", Yd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const Zd = { render: Xd }, Jd = { class: "vuefinder__drag-item__container" }, Qd = { class: "vuefinder__drag-item__count" }, eu = {
  __name: "DragItem",
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  setup(t) {
    const e = t;
    return (n, r) => (v(), g("div", Jd, [
      z(o(Zd)),
      l("div", Qd, b(e.count), 1)
    ]));
  }
}, tu = { class: "vuefinder__text-preview" }, nu = { class: "vuefinder__text-preview__header" }, su = ["title"], ou = { class: "vuefinder__text-preview__actions" }, ru = {
  key: 0,
  class: "vuefinder__text-preview__content"
}, lu = { key: 1 }, au = {
  __name: "Text",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, r = A(""), s = A(""), a = A(null), c = A(!1), u = A(""), i = A(!1), d = re("ServiceContainer"), { t: f } = d.i18n;
    $e(() => {
      d.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: d.modal.data.adapter, path: d.modal.data.item.path },
        responseType: "text"
      }).then((_) => {
        r.value = _, n("success");
      });
    });
    const m = () => {
      c.value = !c.value, s.value = r.value;
    }, p = () => {
      u.value = "", i.value = !1, d.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: d.modal.data.adapter,
          path: d.modal.data.item.path
        },
        body: {
          content: s.value
        },
        responseType: "text"
      }).then((_) => {
        u.value = f("Updated."), r.value = _, n("success"), c.value = !c.value;
      }).catch((_) => {
        u.value = f(_.message), i.value = !0;
      });
    };
    return (_, h) => (v(), g("div", tu, [
      l("div", nu, [
        l("div", {
          class: "vuefinder__text-preview__title",
          id: "modal-title",
          title: o(d).modal.data.item.path
        }, b(o(d).modal.data.item.basename), 9, su),
        l("div", ou, [
          c.value ? (v(), g("button", {
            key: 0,
            onClick: p,
            class: "vuefinder__text-preview__save-button"
          }, b(o(f)("Save")), 1)) : H("", !0),
          o(d).features.includes(o(de).EDIT) ? (v(), g("button", {
            key: 1,
            class: "vuefinder__text-preview__edit-button",
            onClick: h[0] || (h[0] = (w) => m())
          }, b(c.value ? o(f)("Cancel") : o(f)("Edit")), 1)) : H("", !0)
        ])
      ]),
      l("div", null, [
        c.value ? (v(), g("div", lu, [
          ue(l("textarea", {
            ref_key: "editInput",
            ref: a,
            "onUpdate:modelValue": h[1] || (h[1] = (w) => s.value = w),
            class: "vuefinder__text-preview__textarea",
            name: "text",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [$t, s.value]
          ])
        ])) : (v(), g("pre", ru, b(r.value), 1)),
        u.value.length ? (v(), G(Xe, {
          key: 2,
          onHidden: h[2] || (h[2] = (w) => u.value = ""),
          error: i.value
        }, {
          default: J(() => [
            Z(b(u.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : H("", !0)
      ])
    ]));
  }
}, iu = { class: "vuefinder__image-preview" }, cu = { class: "vuefinder__image-preview__header" }, du = ["title"], uu = { class: "vuefinder__image-preview__actions" }, vu = { class: "vuefinder__image-preview__image-container" }, fu = ["src"], _u = {
  __name: "Image",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, r = re("ServiceContainer"), { t: s } = r.i18n, a = A(null), c = A(null), u = A(!1), i = A(""), d = A(!1), f = () => {
      u.value = !u.value, u.value ? c.value = new pr(a.value, {
        crop(p) {
        }
      }) : c.value.destroy();
    }, m = () => {
      c.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (p) => {
          i.value = "", d.value = !1;
          const _ = new FormData();
          _.set("file", p), r.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: r.modal.data.adapter,
              path: r.modal.data.item.path
            },
            body: _
          }).then((h) => {
            i.value = s("Updated."), a.value.src = r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item), f(), n("success");
          }).catch((h) => {
            i.value = s(h.message), d.value = !0;
          });
        }
      );
    };
    return $e(() => {
      n("success");
    }), (p, _) => (v(), g("div", iu, [
      l("div", cu, [
        l("h3", {
          class: "vuefinder__image-preview__title",
          id: "modal-title",
          title: o(r).modal.data.item.path
        }, b(o(r).modal.data.item.basename), 9, du),
        l("div", uu, [
          u.value ? (v(), g("button", {
            key: 0,
            onClick: m,
            class: "vuefinder__image-preview__crop-button"
          }, b(o(s)("Crop")), 1)) : H("", !0),
          o(r).features.includes(o(de).EDIT) ? (v(), g("button", {
            key: 1,
            class: "vuefinder__image-preview__edit-button",
            onClick: _[0] || (_[0] = (h) => f())
          }, b(u.value ? o(s)("Cancel") : o(s)("Edit")), 1)) : H("", !0)
        ])
      ]),
      l("div", vu, [
        l("img", {
          ref_key: "image",
          ref: a,
          class: "vuefinder__image-preview__image",
          src: o(r).requester.getPreviewUrl(o(r).modal.data.adapter, o(r).modal.data.item),
          alt: ""
        }, null, 8, fu)
      ]),
      i.value.length ? (v(), G(Xe, {
        key: 0,
        onHidden: _[1] || (_[1] = (h) => i.value = ""),
        error: d.value
      }, {
        default: J(() => [
          Z(b(i.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : H("", !0)
    ]));
  }
}, mu = { class: "vuefinder__default-preview" }, pu = { class: "vuefinder__default-preview__header" }, hu = ["title"], gu = {
  __name: "Default",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), r = e;
    return $e(() => {
      r("success");
    }), (s, a) => (v(), g("div", mu, [
      l("div", pu, [
        l("h3", {
          class: "vuefinder__default-preview__title",
          id: "modal-title",
          title: o(n).modal.data.item.path
        }, b(o(n).modal.data.item.basename), 9, hu)
      ]),
      a[0] || (a[0] = l("div", null, null, -1))
    ]));
  }
}, bu = { class: "vuefinder__video-preview" }, wu = ["title"], yu = {
  class: "vuefinder__video-preview__video",
  preload: "",
  controls: ""
}, ku = ["src"], xu = {
  __name: "Video",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), r = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return $e(() => {
      r("success");
    }), (a, c) => (v(), g("div", bu, [
      l("h3", {
        class: "vuefinder__video-preview__title",
        id: "modal-title",
        title: o(n).modal.data.item.path
      }, b(o(n).modal.data.item.basename), 9, wu),
      l("div", null, [
        l("video", yu, [
          l("source", {
            src: s(),
            type: "video/mp4"
          }, null, 8, ku),
          c[0] || (c[0] = Z(" Your browser does not support the video tag. "))
        ])
      ])
    ]));
  }
}, Su = { class: "vuefinder__audio-preview" }, $u = ["title"], Cu = {
  class: "vuefinder__audio-preview__audio",
  controls: ""
}, Eu = ["src"], Tu = {
  __name: "Audio",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, r = re("ServiceContainer"), s = () => r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item);
    return $e(() => {
      n("success");
    }), (a, c) => (v(), g("div", Su, [
      l("h3", {
        class: "vuefinder__audio-preview__title",
        id: "modal-title",
        title: o(r).modal.data.item.path
      }, b(o(r).modal.data.item.basename), 9, $u),
      l("div", null, [
        l("audio", Cu, [
          l("source", {
            src: s(),
            type: "audio/mpeg"
          }, null, 8, Eu),
          c[0] || (c[0] = Z(" Your browser does not support the audio element. "))
        ])
      ])
    ]));
  }
}, Mu = { class: "vuefinder__pdf-preview" }, Au = ["title"], Du = ["data"], Vu = ["src"], Lu = {
  __name: "Pdf",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), r = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return $e(() => {
      r("success");
    }), (a, c) => (v(), g("div", Mu, [
      l("h3", {
        class: "vuefinder__pdf-preview__title",
        id: "modal-title",
        title: o(n).modal.data.item.path
      }, b(o(n).modal.data.item.basename), 9, Au),
      l("div", null, [
        l("object", {
          class: "vuefinder__pdf-preview__object",
          data: s(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          l("iframe", {
            class: "vuefinder__pdf-preview__iframe",
            src: s(),
            width: "100%",
            height: "100%"
          }, " Your browser does not support PDFs ", 8, Vu)
        ], 8, Du)
      ])
    ]));
  }
}, Ou = { class: "vuefinder__preview-modal__content" }, Fu = { key: 0 }, Iu = { class: "vuefinder__preview-modal__loading" }, Hu = {
  key: 0,
  class: "vuefinder__preview-modal__loading-indicator"
}, Ru = { class: "vuefinder__preview-modal__details" }, Bu = { class: "font-bold" }, Uu = { class: "font-bold pl-2" }, Nu = {
  key: 0,
  class: "vuefinder__preview-modal__note"
}, Pu = ["download", "href"], qo = {
  __name: "ModalPreview",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(!1), s = (u) => (e.modal.data.item.mime_type ?? "").startsWith(u), a = e.features.includes(de.PREVIEW);
    a || (r.value = !0);
    const c = (u, i, d) => {
      i.status = d, i && e.emitter.emit("vf-fetch", {
        params: {
          q: "updateStatus",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: i,
          status: d
        },
        onSuccess: () => {
          d == 1 ? e.emitter.emit("vf-toast-push", {
            label: n("Successfully Verified File!.")
          }) : e.emitter.emit("vf-toast-push", {
            label: "unVerified File !",
            type: "error"
          });
        },
        onError: (f) => {
        }
      }), e.emitter.emit("vf-search-exit");
    };
    return (u, i) => (v(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: i[6] || (i[6] = (d) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Close")), 1),
        o(e).features.includes(o(de).DOWNLOAD) ? (v(), g("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: o(e).requester.getDownloadUrl(
            o(e).modal.data.adapter,
            o(e).modal.data.item
          ),
          href: o(e).requester.getDownloadUrl(
            o(e).modal.data.adapter,
            o(e).modal.data.item
          )
        }, b(o(n)("Download")), 9, Pu)) : H("", !0),
        (o(e).modal.data.item.status == 0 || o(e).modal.data.item.status == null) && o(e).modal.data.item.reqVerification ? (v(), g("button", {
          key: 1,
          type: "button",
          onClick: i[7] || (i[7] = (d) => c(o(e).modal.data.adapter, o(e).modal.data.item, 1)),
          class: "vf-btn vf-btn-primary"
        }, " Verify ")) : H("", !0),
        o(e).modal.data.item.status == 1 ? (v(), g("button", {
          key: 2,
          type: "button",
          onClick: i[8] || (i[8] = (d) => c(o(e).modal.data.adapter, o(e).modal.data.item, 0)),
          class: "vf-btn vf-btn-secondary",
          style: { display: "none" }
        }, " UnVerify ")) : H("", !0)
      ]),
      default: J(() => [
        l("div", null, [
          l("div", Ou, [
            o(a) ? (v(), g("div", Fu, [
              s("text") ? (v(), G(au, {
                key: 0,
                onSuccess: i[0] || (i[0] = (d) => r.value = !0)
              })) : s("image") ? (v(), G(_u, {
                key: 1,
                onSuccess: i[1] || (i[1] = (d) => r.value = !0)
              })) : s("video") ? (v(), G(xu, {
                key: 2,
                onSuccess: i[2] || (i[2] = (d) => r.value = !0)
              })) : s("audio") ? (v(), G(Tu, {
                key: 3,
                onSuccess: i[3] || (i[3] = (d) => r.value = !0)
              })) : s("application/pdf") ? (v(), G(Lu, {
                key: 4,
                onSuccess: i[4] || (i[4] = (d) => r.value = !0)
              })) : (v(), G(gu, {
                key: 5,
                onSuccess: i[5] || (i[5] = (d) => r.value = !0)
              }))
            ])) : H("", !0),
            l("div", Iu, [
              r.value === !1 ? (v(), g("div", Hu, [
                i[9] || (i[9] = l("svg", {
                  class: "vuefinder__preview-modal__spinner",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24"
                }, [
                  l("circle", {
                    class: "vuefinder__preview-modal__spinner-circle",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "4"
                  }),
                  l("path", {
                    class: "vuefinder__preview-modal__spinner-path",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  })
                ], -1)),
                l("span", null, b(o(n)("Loading")), 1)
              ])) : H("", !0)
            ])
          ])
        ]),
        l("div", Ru, [
          l("div", null, [
            l("span", Bu, b(o(n)("File Size")) + ": ", 1),
            Z(b(o(e).filesize(o(e).modal.data.item.file_size)), 1)
          ]),
          l("div", null, [
            l("span", Uu, b(o(n)("Last Modified")) + ": ", 1),
            Z(" " + b(o(zo)(o(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        o(e).features.includes(o(de).DOWNLOAD) ? (v(), g("div", Nu, [
          l("span", null, b(o(n)(
            `Download doesn't work? You can try right-click "Download" button, select "Save link as...".`
          )), 1)
        ])) : H("", !0)
      ]),
      _: 1
    }));
  }
}, zu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function qu(t, e) {
  return v(), g("svg", zu, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "m15 4.5-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4 20 9.5" }, null, -1)
  ]));
}
const jo = { render: qu }, ju = {
  xmlns: "http://www.w3.org/2000/svg",
  "xml:space": "preserve",
  width: "20",
  height: "20",
  viewBox: "0 0 256 256"
};
function Gu(t, e) {
  return v(), g("svg", ju, e[0] || (e[0] = [
    l("g", { style: { stroke: "none", "stroke-width": "0", "stroke-dasharray": "none", "stroke-linecap": "butt", "stroke-linejoin": "miter", "stroke-miterlimit": "10", fill: "none", "fill-rule": "nonzero", opacity: "1" } }, [
      l("path", {
        d: "M45 0C20.147 0 0 20.147 0 45s20.147 45 45 45 45-20.147 45-45S69.853 0 45 0",
        style: { stroke: "none", "stroke-width": "1", "stroke-dasharray": "none", "stroke-linecap": "butt", "stroke-linejoin": "miter", "stroke-miterlimit": "10", fill: "#00aa1c", "fill-rule": "nonzero", opacity: "1" },
        transform: "translate(1.407 1.407)scale(2.81)"
      }),
      l("path", {
        d: "M38.615 71.654 16.332 38.93h8.008l13.19 10.708c6.222-10.351 20.164-22.904 31.018-28.718h6.077C60.582 31.819 46.34 53.763 38.615 71.654",
        style: { stroke: "none", "stroke-width": "1", "stroke-dasharray": "none", "stroke-linecap": "butt", "stroke-linejoin": "miter", "stroke-miterlimit": "10", fill: "#fff", "fill-rule": "nonzero", opacity: "1" },
        transform: "translate(1.407 1.407)scale(2.81)"
      })
    ], -1)
  ]));
}
const Wu = { render: Gu }, Ku = {
  xmlns: "http://www.w3.org/2000/svg",
  "xml:space": "preserve",
  width: "20",
  height: "20",
  viewBox: "0 0 256 256"
};
function Yu(t, e) {
  return v(), g("svg", Ku, e[0] || (e[0] = [
    l("g", {
      style: { stroke: "none", "stroke-width": "0", "stroke-dasharray": "none", "stroke-linecap": "butt", "stroke-linejoin": "miter", "stroke-miterlimit": "10", fill: "none", "fill-rule": "nonzero", opacity: "1" },
      transform: "translate(1.407 1.407)scale(2.81)"
    }, [
      l("path", {
        d: "M45 89.979c-11.523 0-23.047-4.387-31.82-13.159-17.545-17.546-17.545-46.095 0-63.64s46.093-17.546 63.64 0c17.545 17.545 17.545 46.094 0 63.64C68.047 85.593 56.523 89.979 45 89.979m0-75.964c-7.938 0-15.877 3.021-21.92 9.065-12.087 12.087-12.087 31.753 0 43.84s31.754 12.088 43.84 0 12.087-31.753 0-43.84c-6.043-6.044-13.982-9.065-21.92-9.065",
        style: { stroke: "none", "stroke-width": "1", "stroke-dasharray": "none", "stroke-linecap": "butt", "stroke-linejoin": "miter", "stroke-miterlimit": "10", fill: "#ff4040", "fill-rule": "nonzero", opacity: "1" }
      }),
      l("rect", {
        width: "76",
        height: "14",
        x: "7",
        y: "38",
        rx: "0",
        ry: "0",
        style: { stroke: "none", "stroke-width": "1", "stroke-dasharray": "none", "stroke-linecap": "butt", "stroke-linejoin": "miter", "stroke-miterlimit": "10", fill: "#ff4040", "fill-rule": "nonzero", opacity: "1" },
        transform: "rotate(-45.001 44.996 45)"
      })
    ], -1)
  ]));
}
const Xu = { render: Yu }, Zu = ["data-type", "data-item", "data-index"], Ju = {
  __name: "Item",
  props: {
    item: { type: Object },
    index: { type: Number },
    dragImage: { type: Object }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = e.dragSelect, r = t, s = (_) => {
      _.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: e.fs.adapter, path: _.path }
      })) : e.modal.open(qo, { adapter: e.fs.adapter, item: _ });
    }, a = {
      mounted(_, h, w, $) {
        w.props.draggable && (_.addEventListener(
          "dragstart",
          (D) => c(D, h.value)
        ), _.addEventListener(
          "dragover",
          (D) => i(D, h.value)
        ), _.addEventListener(
          "drop",
          (D) => u(D, h.value)
        ));
      },
      beforeUnmount(_, h, w, $) {
        w.props.draggable && (_.removeEventListener("dragstart", c), _.removeEventListener("dragover", i), _.removeEventListener("drop", u));
      }
    }, c = (_, h) => {
      if (_.altKey || _.ctrlKey || _.metaKey)
        return _.preventDefault(), !1;
      n.isDraggingRef.value = !0, _.dataTransfer.setDragImage(r.dragImage.$el, 0, 15), _.dataTransfer.effectAllowed = "all", _.dataTransfer.dropEffect = "copy", _.dataTransfer.setData("items", JSON.stringify(n.getSelected()));
    }, u = (_, h) => {
      _.preventDefault(), n.isDraggingRef.value = !1;
      let w = JSON.parse(_.dataTransfer.getData("items"));
      if (w.find(($) => $.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, { items: { from: w, to: h } });
    }, i = (_, h) => {
      _.preventDefault(), !h || h.type !== "dir" || n.getSelection().find((w) => w === _.currentTarget) ? (_.dataTransfer.dropEffect = "none", _.dataTransfer.effectAllowed = "none") : _.dataTransfer.dropEffect = "copy";
    };
    let d = null, f = !1;
    const m = () => {
      d && clearTimeout(d);
    }, p = (_) => {
      if (!f)
        f = !0, setTimeout(() => f = !1, 300);
      else
        return f = !1, s(r.item), clearTimeout(d), !1;
      d = setTimeout(() => {
        const h = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: _.target.getBoundingClientRect().x,
          clientY: _.target.getBoundingClientRect().y
        });
        _.target.dispatchEvent(h);
      }, 500);
    };
    return (_, h) => t.item.basename != ".verification" ? ue((v(), g("div", {
      style: an({
        opacity: o(n).isDraggingRef.value && o(n).getSelection().find((w) => _.$el === w) ? "0.5 !important" : ""
      }),
      class: le(["vuefinder__item", "vf-item-" + o(n).explorerId]),
      "data-type": t.item.type,
      key: t.item.path,
      "data-item": JSON.stringify(t.item),
      "data-index": t.index,
      onDblclick: h[0] || (h[0] = (w) => s(t.item)),
      onTouchstart: h[1] || (h[1] = (w) => p(w)),
      onTouchend: h[2] || (h[2] = (w) => m()),
      onContextmenu: h[3] || (h[3] = et((w) => o(e).emitter.emit("vf-contextmenu-show", {
        event: w,
        items: o(n).getSelected(),
        target: t.item
      }), ["prevent"]))
    }, [
      At(_.$slots, "default", {}, void 0, !0),
      l("span", null, [
        t.item.type == "file" && t.item.status == 1 ? (v(), G(o(Wu), {
          key: 0,
          class: "icon-custom"
        })) : H("", !0)
      ]),
      l("span", null, [
        t.item.type == "file" && t.item.status == 0 ? (v(), G(o(Xu), {
          key: 0,
          class: "icon-custom"
        })) : H("", !0)
      ]),
      o(e).pinnedFolders.find((w) => w.path === t.item.path) ? (v(), G(o(jo), {
        key: 0,
        class: "vuefinder__item--pinned"
      })) : H("", !0)
    ], 46, Zu)), [
      [a, t.item]
    ]) : H("", !0);
  }
}, Mn = /* @__PURE__ */ Do(Ju, [["__scopeId", "data-v-160a2153"]]), Qu = { class: "vuefinder__explorer__container" }, ev = {
  key: 0,
  class: "vuefinder__explorer__header"
}, tv = { class: "vuefinder__explorer__drag-item" }, nv = {
  key: 0,
  class: "vuefinder__linear-loader absolute"
}, sv = { class: "vuefinder__explorer__item-list-content" }, ov = { class: "vuefinder__explorer__item-list-name" }, rv = { class: "vuefinder__explorer__item-name" }, lv = { class: "vuefinder__explorer__item-path" }, av = { class: "vuefinder__explorer__item-list-content" }, iv = { class: "vuefinder__explorer__item-list-name" }, cv = { class: "vuefinder__explorer__item-name" }, dv = { class: "vuefinder__explorer__item-size" }, uv = { class: "vuefinder__explorer__item-date" }, vv = { class: "vuefinder__explorer__item-grid-content" }, fv = ["data-src", "alt"], _v = {
  key: 2,
  class: "vuefinder__explorer__item-extension"
}, mv = { class: "vuefinder__explorer__item-title break-all" }, pv = {
  __name: "Explorer",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = (m) => m == null ? void 0 : m.substring(0, 3), s = A(null), a = A(""), c = e.dragSelect;
    let u;
    e.emitter.on("vf-fullscreen-toggle", () => {
      c.area.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: m }) => {
      a.value = m, m ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname,
          filter: m
        },
        onSuccess: (p) => {
          p.files.length || e.emitter.emit("vf-toast-push", {
            label: n("No search result found.")
          });
        }
      }) : e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        }
      });
    });
    const i = xt({ active: !1, column: "", order: "" }), d = (m = !0) => {
      let p = [...e.fs.data.files], _ = i.column, h = i.order === "asc" ? 1 : -1;
      if (!m)
        return p;
      const w = ($, D) => typeof $ == "string" && typeof D == "string" ? $.toLowerCase().localeCompare(D.toLowerCase()) : $ < D ? -1 : $ > D ? 1 : 0;
      return i.active && (p = p.slice().sort(($, D) => w($[_], D[_]) * h)), p;
    }, f = (m) => {
      i.active && i.column === m ? (i.active = i.order === "asc", i.column = m, i.order = "desc") : (i.active = !0, i.column = m, i.order = "asc");
    };
    return $e(() => {
      u = new mr(c.area.value);
    }), Is(() => {
      u.update();
    }), Rs(() => {
      u.destroy();
    }), (m, p) => (v(), g("div", Qu, [
      o(e).view === "list" || a.value.length ? (v(), g("div", ev, [
        l("div", {
          onClick: p[0] || (p[0] = (_) => f("basename")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
        }, [
          Z(b(o(n)("Name")) + " ", 1),
          ue(z(Kt, {
            direction: i.order
          }, null, 8, ["direction"]), [
            [ze, i.active && i.column === "basename"]
          ])
        ]),
        a.value.length ? H("", !0) : (v(), g("div", {
          key: 0,
          onClick: p[1] || (p[1] = (_) => f("file_size")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
        }, [
          Z(b(o(n)("Size")) + " ", 1),
          ue(z(Kt, {
            direction: i.order
          }, null, 8, ["direction"]), [
            [ze, i.active && i.column === "file_size"]
          ])
        ])),
        a.value.length ? H("", !0) : (v(), g("div", {
          key: 1,
          onClick: p[2] || (p[2] = (_) => f("last_modified")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
        }, [
          Z(b(o(n)("Date")) + " ", 1),
          ue(z(Kt, {
            direction: i.order
          }, null, 8, ["direction"]), [
            [ze, i.active && i.column === "last_modified"]
          ])
        ])),
        a.value.length ? (v(), g("div", {
          key: 2,
          onClick: p[3] || (p[3] = (_) => f("path")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
        }, [
          Z(b(o(n)("Filepath")) + " ", 1),
          ue(z(Kt, {
            direction: i.order
          }, null, 8, ["direction"]), [
            [ze, i.active && i.column === "path"]
          ])
        ])) : H("", !0)
      ])) : H("", !0),
      l("div", tv, [
        z(eu, {
          ref_key: "dragImage",
          ref: s,
          count: o(c).getCount()
        }, null, 8, ["count"])
      ]),
      l("div", {
        ref: o(c).scrollBarContainer,
        class: le(["vf-explorer-scrollbar-container vuefinder__explorer__scrollbar-container", [
          { "grid-view": o(e).view === "grid" },
          { "search-active": a.value.length }
        ]])
      }, [
        l("div", {
          ref: o(c).scrollBar,
          class: "vuefinder__explorer__scrollbar"
        }, null, 512)
      ], 2),
      l("div", {
        ref: o(c).area,
        class: "vuefinder__explorer__selector-area vf-explorer-scrollbar vf-selector-area min-h-32",
        onContextmenu: p[4] || (p[4] = et((_) => o(e).emitter.emit("vf-contextmenu-show", {
          event: _,
          items: o(c).getSelected()
        }), ["self", "prevent"]))
      }, [
        o(e).loadingIndicator === "linear" && o(e).fs.loading ? (v(), g("div", nv)) : H("", !0),
        a.value.length ? (v(!0), g(ge, { key: 1 }, ke(d(), (_, h) => (v(), G(Mn, {
          item: _,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-list"
        }, {
          default: J(() => [
            l("div", sv, [
              l("div", ov, [
                z(Tn, {
                  type: _.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", rv, b(_.basename), 1)
              ]),
              l("div", lv, b(_.path), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : H("", !0),
        o(e).view === "list" && !a.value.length ? (v(!0), g(ge, { key: 2 }, ke(d(), (_, h) => (v(), G(Mn, {
          item: _,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-list",
          draggable: "true",
          key: _.path
        }, {
          default: J(() => [
            l("div", av, [
              l("div", iv, [
                z(Tn, {
                  type: _.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", cv, b(_.basename), 1)
              ]),
              l("div", dv, b(_.file_size ? o(e).filesize(_.file_size) : ""), 1),
              l("div", uv, b(o(zo)(_.last_modified)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 128)) : H("", !0),
        o(e).view === "grid" && !a.value.length ? (v(!0), g(ge, { key: 3 }, ke(d(!1), (_, h) => (v(), G(Mn, {
          item: _,
          index: h,
          dragImage: s.value,
          class: "vf-item vf-item-grid",
          draggable: "true"
        }, {
          default: J(() => [
            l("div", null, [
              l("div", vv, [
                (_.mime_type ?? "").startsWith("image") && o(e).showThumbnails ? (v(), g("img", {
                  src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                  class: "vuefinder__explorer__item-thumbnail lazy",
                  "data-src": o(e).requester.getPreviewUrl(o(e).fs.adapter, _),
                  alt: _.basename,
                  key: _.path
                }, null, 8, fv)) : (v(), G(Tn, {
                  key: 1,
                  type: _.type
                }, null, 8, ["type"])),
                !((_.mime_type ?? "").startsWith("image") && o(e).showThumbnails) && _.type !== "dir" ? (v(), g("div", _v, b(r(_.extension)), 1)) : H("", !0)
              ]),
              l("span", mv, b(o(Gn)(_.basename)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : H("", !0)
      ], 544),
      z(Rd)
    ]));
  }
}, hv = ["href", "download"], gv = ["onClick"], bv = {
  __name: "ContextMenu",
  setup(t) {
    const e = re("ServiceContainer"), n = A(null), r = A([]), s = A(""), a = xt({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    });
    e.emitter.on("vf-context-selected", (d) => {
      r.value = d;
    });
    const c = (d) => d.link(e, r), u = (d) => {
      e.emitter.emit("vf-contextmenu-hide"), d.action(e, r);
    };
    e.emitter.on("vf-search-query", ({ newQuery: d }) => {
      s.value = d;
    }), e.emitter.on("vf-contextmenu-show", ({ event: d, items: f, target: m = null }) => {
      if (a.items = e.contextMenuItems.filter((p) => p.show(e, {
        searchQuery: s.value,
        items: f,
        target: m
      })), s.value)
        if (m)
          e.emitter.emit("vf-context-selected", [m]);
        else
          return;
      else !m && !s.value ? e.emitter.emit("vf-context-selected", []) : f.length > 1 && f.some((p) => p.path === m.path) ? e.emitter.emit("vf-context-selected", f) : e.emitter.emit("vf-context-selected", [m]);
      i(d);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      a.active = !1;
    });
    const i = (d) => {
      const f = e.dragSelect.area.value, m = e.root.getBoundingClientRect(), p = f.getBoundingClientRect();
      let _ = d.clientX - m.left, h = d.clientY - m.top;
      a.active = !0, ct(() => {
        var I;
        const w = (I = n.value) == null ? void 0 : I.getBoundingClientRect();
        let $ = (w == null ? void 0 : w.height) ?? 0, D = (w == null ? void 0 : w.width) ?? 0;
        _ = p.right - d.pageX + window.scrollX < D ? _ - D : _, h = p.bottom - d.pageY + window.scrollY < $ ? h - $ : h, a.positions = {
          left: _ + "px",
          top: h + "px"
        };
      });
    };
    return (d, f) => ue((v(), g("ul", {
      ref_key: "contextmenu",
      ref: n,
      style: an(a.positions),
      class: "vuefinder__context-menu"
    }, [
      (v(!0), g(ge, null, ke(a.items, (m) => (v(), g("li", {
        class: "vuefinder__context-menu__item",
        key: m.title
      }, [
        m.link ? (v(), g("a", {
          key: 0,
          class: "vuefinder__context-menu__link",
          target: "_blank",
          href: c(m),
          download: c(m),
          onClick: f[0] || (f[0] = (p) => o(e).emitter.emit("vf-contextmenu-hide"))
        }, [
          l("span", null, b(m.title(o(e).i18n)), 1)
        ], 8, hv)) : (v(), g("div", {
          key: 1,
          class: "vuefinder__context-menu__action",
          onClick: (p) => u(m)
        }, [
          l("span", null, b(m.title(o(e).i18n)), 1)
        ], 8, gv))
      ]))), 128))
    ], 4)), [
      [ze, a.active]
    ]);
  }
}, wv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function yv(t, e) {
  return v(), g("svg", wv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    }, null, -1)
  ]));
}
const Go = { render: yv }, kv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  viewBox: "0 0 24 24"
};
function xv(t, e) {
  return v(), g("svg", kv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
    }, null, -1)
  ]));
}
const Sv = { render: xv }, $v = { class: "vuefinder__status-bar__wrapper" }, Cv = { class: "vuefinder__status-bar__storage" }, Ev = ["title"], Tv = { class: "vuefinder__status-bar__storage-icon" }, Mv = ["value"], Av = { class: "vuefinder__status-bar__info" }, Dv = { key: 0 }, Vv = { class: "vuefinder__status-bar__selected-count" }, Lv = { class: "vuefinder__status-bar__actions" }, Ov = ["disabled"], Fv = ["title"], Iv = {
  __name: "Statusbar",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { setStore: r } = e.storage, s = e.dragSelect, a = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter } }), r("adapter", e.fs.adapter);
    }, c = A("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      c.value = i;
    });
    const u = bt(() => {
      const i = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return e.selectButton.active && i;
    });
    return (i, d) => (v(), g("div", $v, [
      l("div", Cv, [
        l("div", {
          class: "vuefinder__status-bar__storage-container",
          title: o(n)("Storage")
        }, [
          l("div", Tv, [
            z(o(Go))
          ]),
          ue(l("select", {
            "onUpdate:modelValue": d[0] || (d[0] = (f) => o(e).fs.adapter = f),
            onChange: a,
            class: "vuefinder__status-bar__storage-select",
            tabindex: "-1"
          }, [
            (v(!0), g(ge, null, ke(o(e).fs.data.storages, (f) => (v(), g("option", { value: f }, b(f), 9, Mv))), 256))
          ], 544), [
            [An, o(e).fs.adapter]
          ])
        ], 8, Ev),
        l("div", Av, [
          c.value.length ? (v(), g("span", Dv, b(o(e).fs.data.files.length) + " items found. ", 1)) : H("", !0),
          l("span", Vv, b(o(e).dragSelect.getCount() > 0 ? o(n)("%s item(s) selected.", o(e).dragSelect.getCount()) : ""), 1)
        ])
      ]),
      l("div", Lv, [
        o(e).selectButton.active ? (v(), g("button", {
          key: 0,
          class: le(["vf-btn py-0 vf-btn-primary", { disabled: !u.value }]),
          disabled: !u.value,
          onClick: d[1] || (d[1] = (f) => o(e).selectButton.click(o(s).getSelected(), f))
        }, b(o(n)("Select")), 11, Ov)) : H("", !0),
        l("span", {
          class: "vuefinder__status-bar__about",
          title: o(n)("About"),
          onClick: d[2] || (d[2] = (f) => o(e).modal.open(Vo))
        }, [
          z(o(Sv))
        ], 8, Fv)
      ])
    ]));
  }
}, Hv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "text-neutral-500 fill-sky-500 stroke-gray-100/50 dark:stroke-slate-700/50 dark:fill-slate-500",
  viewBox: "0 0 24 24"
};
function Rv(t, e) {
  return v(), g("svg", Hv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3.75 9.776q.168-.026.344-.026h15.812q.176 0 .344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
    }, null, -1)
  ]));
}
const Wo = { render: Rv }, Bv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Uv(t, e) {
  return v(), g("svg", Bv, e[0] || (e[0] = [
    l("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.6 5.2a1 1 0 0 0-1.4.2L12 10.333 9.8 7.4a1 1 0 1 0-1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 0 0 1.6-1.2L13.25 12l2.55-3.4a1 1 0 0 0-.2-1.4" }, null, -1)
  ]));
}
const Nv = { render: Uv }, Pv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function zv(t, e) {
  return v(), g("svg", Pv, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M15 12H9M12 9v6" }, null, -1)
  ]));
}
const Ko = { render: zv }, qv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function jv(t, e) {
  return v(), g("svg", qv, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M9 12h6" }, null, -1)
  ]));
}
const Yo = { render: jv };
function Xo(t, e) {
  const n = t.findIndex((r) => r.path === e.path);
  n > -1 ? t[n] = e : t.push(e);
}
const Gv = { class: "vuefinder__folder-loader-indicator" }, Wv = {
  key: 1,
  class: "vuefinder__folder-loader-indicator--icon"
}, Zo = {
  __name: "FolderLoaderIndicator",
  props: /* @__PURE__ */ ar({
    adapter: {
      type: String,
      required: !0
    },
    path: {
      type: String,
      required: !0
    }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const e = t, n = re("ServiceContainer");
    n.i18n;
    const r = Bs(t, "modelValue"), s = A(!1);
    De(
      () => r.value,
      () => {
        var u;
        return ((u = a()) == null ? void 0 : u.folders.length) || c();
      }
    );
    function a() {
      return n.treeViewData.find((u) => u.path === e.path);
    }
    const c = () => {
      s.value = !0, n.requester.send({
        url: "",
        method: "get",
        params: {
          q: "subfolders",
          adapter: e.adapter,
          path: e.path
        }
      }).then((u) => {
        Xo(n.treeViewData, { path: e.path, ...u });
      }).catch((u) => {
      }).finally(() => {
        s.value = !1;
      });
    };
    return (u, i) => {
      var d;
      return v(), g("div", Gv, [
        s.value ? (v(), G(o(us), {
          key: 0,
          class: "vuefinder__folder-loader-indicator--loading"
        })) : (v(), g("div", Wv, [
          r.value && ((d = a()) != null && d.folders.length) ? (v(), G(o(Yo), {
            key: 0,
            class: "vuefinder__folder-loader-indicator--minus"
          })) : H("", !0),
          r.value ? H("", !0) : (v(), G(o(Ko), {
            key: 1,
            class: "vuefinder__folder-loader-indicator--plus"
          }))
        ]))
      ]);
    };
  }
}, Kv = { class: "vuefinder__treesubfolderlist__item-content" }, Yv = ["onClick"], Xv = ["title", "onClick"], Zv = { class: "vuefinder__treesubfolderlist__item-icon" }, Jv = { class: "vuefinder__treesubfolderlist__subfolder" }, Qv = {
  __name: "TreeSubfolderList",
  props: {
    adapter: {
      type: String,
      required: !0
    },
    path: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = A([]), r = t, s = A(null);
    $e(() => {
      r.path === r.adapter + "://" && We(s.value, {
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    });
    const a = bt(() => {
      var c;
      return ((c = e.treeViewData.find((u) => u.path === r.path)) == null ? void 0 : c.folders) || [];
    });
    return (c, u) => {
      const i = ir("TreeSubfolderList", !0);
      return v(), g("ul", {
        ref_key: "parentSubfolderList",
        ref: s,
        class: "vuefinder__treesubfolderlist__container"
      }, [
        (v(!0), g(ge, null, ke(a.value, (d, f) => (v(), g("li", {
          key: d.path,
          class: "vuefinder__treesubfolderlist__item"
        }, [
          l("div", Kv, [
            l("div", {
              class: "vuefinder__treesubfolderlist__item-toggle",
              onClick: (m) => n.value[d.path] = !n.value[d.path]
            }, [
              z(Zo, {
                adapter: t.adapter,
                path: d.path,
                modelValue: n.value[d.path],
                "onUpdate:modelValue": (m) => n.value[d.path] = m
              }, null, 8, ["adapter", "path", "modelValue", "onUpdate:modelValue"])
            ], 8, Yv),
            l("div", {
              class: "vuefinder__treesubfolderlist__item-link",
              title: d.path,
              onClick: (m) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: r.adapter, path: d.path } })
            }, [
              l("div", Zv, [
                o(e).fs.path === d.path ? (v(), G(o(Wo), { key: 0 })) : (v(), G(o(hn), { key: 1 }))
              ]),
              l("div", {
                class: le(["vuefinder__treesubfolderlist__item-text", {
                  "vuefinder__treesubfolderlist__item-text--active": o(e).fs.path === d.path
                }])
              }, b(d.basename), 3)
            ], 8, Xv)
          ]),
          l("div", Jv, [
            ue(z(i, {
              adapter: r.adapter,
              path: d.path
            }, null, 8, ["adapter", "path"]), [
              [ze, n.value[d.path]]
            ])
          ])
        ]))), 128))
      ], 512);
    };
  }
}, ef = {
  __name: "TreeStorageItem",
  props: {
    storage: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n } = e.storage, r = A(!1);
    function s(a) {
      a === e.fs.adapter ? r.value = !r.value : (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: a } }), n("adapter", a));
    }
    return (a, c) => (v(), g(ge, null, [
      l("div", {
        onClick: c[2] || (c[2] = (u) => s(t.storage)),
        class: "vuefinder__treestorageitem__header"
      }, [
        l("div", {
          class: le(["vuefinder__treestorageitem__info", t.storage === o(e).fs.adapter ? "vuefinder__treestorageitem__info--active" : ""])
        }, [
          l("div", {
            class: le(["vuefinder__treestorageitem__icon", t.storage === o(e).fs.adapter ? "vuefinder__treestorageitem__icon--active" : ""])
          }, [
            z(o(Go))
          ], 2),
          l("div", null, b(t.storage), 1)
        ], 2),
        l("div", {
          class: "vuefinder__treestorageitem__loader",
          onClick: c[1] || (c[1] = et((u) => r.value = !r.value, ["stop"]))
        }, [
          z(Zo, {
            adapter: t.storage,
            path: t.storage + "://",
            modelValue: r.value,
            "onUpdate:modelValue": c[0] || (c[0] = (u) => r.value = u)
          }, null, 8, ["adapter", "path", "modelValue"])
        ])
      ]),
      ue(z(Qv, {
        adapter: t.storage,
        path: t.storage + "://",
        class: "vuefinder__treestorageitem__subfolder"
      }, null, 8, ["adapter", "path"]), [
        [ze, r.value]
      ])
    ], 64));
  }
}, tf = { class: "vuefinder__folder-indicator" }, nf = { class: "vuefinder__folder-indicator--icon" }, sf = {
  __name: "FolderIndicator",
  props: {
    modelValue: {},
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t) {
    const e = Bs(t, "modelValue");
    return (n, r) => (v(), g("div", tf, [
      l("div", nf, [
        e.value ? (v(), G(o(Yo), {
          key: 0,
          class: "vuefinder__folder-indicator--minus"
        })) : H("", !0),
        e.value ? H("", !0) : (v(), G(o(Ko), {
          key: 1,
          class: "vuefinder__folder-indicator--plus"
        }))
      ])
    ]));
  }
}, of = { class: "vuefinder__treeview__header" }, rf = { class: "vuefinder__treeview__pinned-label" }, lf = { class: "vuefinder__treeview__pin-text text-nowrap" }, af = {
  key: 0,
  class: "vuefinder__treeview__pinned-list"
}, cf = { class: "vuefinder__treeview__pinned-item" }, df = ["onClick"], uf = ["title"], vf = ["onClick"], ff = { key: 0 }, _f = { class: "vuefinder__treeview__no-pinned" }, mf = { class: "vuefinder__treeview__storage" }, pf = {
  __name: "TreeView",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { getStore: r, setStore: s } = e.storage, a = A(190), c = A(r("pinned-folders-opened", !0));
    De(c, (f) => s("pinned-folders-opened", f));
    const u = (f) => {
      e.pinnedFolders = e.pinnedFolders.filter((m) => m.path !== f.path), e.storage.setStore("pinned-folders", e.pinnedFolders);
    }, i = (f) => {
      const m = f.clientX, p = f.target.parentElement, _ = p.getBoundingClientRect().width;
      p.classList.remove("transition-[width]"), p.classList.add("transition-none");
      const h = ($) => {
        a.value = _ + $.clientX - m, a.value < 50 && (a.value = 0, e.showTreeView = !1), a.value > 50 && (e.showTreeView = !0);
      }, w = () => {
        const $ = p.getBoundingClientRect();
        a.value = $.width, p.classList.add("transition-[width]"), p.classList.remove("transition-none"), window.removeEventListener("mousemove", h), window.removeEventListener("mouseup", w);
      };
      window.addEventListener("mousemove", h), window.addEventListener("mouseup", w);
    }, d = A(null);
    return $e(() => {
      We(d.value, {
        overflow: {
          x: "hidden"
        },
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    }), De(e.fs.data, (f, m) => {
      const p = f.files.filter((_) => _.type === "dir");
      Xo(e.treeViewData, { path: e.fs.path, folders: p.map((_) => ({
        adapter: _.storage,
        path: _.path,
        basename: _.basename
      })) });
    }), (f, m) => (v(), g(ge, null, [
      l("div", {
        onClick: m[0] || (m[0] = (p) => o(e).showTreeView = !o(e).showTreeView),
        class: le(["vuefinder__treeview__overlay", o(e).showTreeView ? "vuefinder__treeview__backdrop" : "hidden"])
      }, null, 2),
      l("div", {
        style: an(o(e).showTreeView ? "min-width:100px;max-width:75%; width: " + a.value + "px" : "width: 0"),
        class: "vuefinder__treeview__container"
      }, [
        l("div", {
          ref_key: "treeViewScrollElement",
          ref: d,
          class: "vuefinder__treeview__scroll"
        }, [
          l("div", of, [
            l("div", {
              onClick: m[2] || (m[2] = (p) => c.value = !c.value),
              class: "vuefinder__treeview__pinned-toggle"
            }, [
              l("div", rf, [
                z(o(jo), { class: "vuefinder__treeview__pin-icon" }),
                l("div", lf, b(o(n)("Pinned Folders")), 1)
              ]),
              z(sf, {
                modelValue: c.value,
                "onUpdate:modelValue": m[1] || (m[1] = (p) => c.value = p)
              }, null, 8, ["modelValue"])
            ]),
            c.value ? (v(), g("ul", af, [
              (v(!0), g(ge, null, ke(o(e).pinnedFolders, (p) => (v(), g("li", cf, [
                l("div", {
                  class: "vuefinder__treeview__pinned-folder",
                  onClick: (_) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: p.storage, path: p.path } })
                }, [
                  o(e).fs.path !== p.path ? (v(), G(o(hn), {
                    key: 0,
                    class: "vuefinder__treeview__folder-icon"
                  })) : H("", !0),
                  o(e).fs.path === p.path ? (v(), G(o(Wo), {
                    key: 1,
                    class: "vuefinder__treeview__open-folder-icon"
                  })) : H("", !0),
                  l("div", {
                    title: p.path,
                    class: le(["vuefinder__treeview__folder-name text-nowrap", {
                      "vuefinder__treeview__folder-name--active": o(e).fs.path === p.path
                    }])
                  }, b(p.basename), 11, uf)
                ], 8, df),
                l("div", {
                  class: "vuefinder__treeview__remove-favorite",
                  onClick: (_) => u(p)
                }, [
                  z(o(Nv), { class: "vuefinder__treeview__remove-icon" })
                ], 8, vf)
              ]))), 256)),
              o(e).pinnedFolders.length ? H("", !0) : (v(), g("li", ff, [
                l("div", _f, b(o(n)("No folders pinned")), 1)
              ]))
            ])) : H("", !0)
          ]),
          (v(!0), g(ge, null, ke(o(e).fs.data.storages, (p) => (v(), g("div", mf, [
            z(ef, { storage: p }, null, 8, ["storage"])
          ]))), 256))
        ], 512),
        l("div", {
          onMousedown: i,
          class: le([(o(e).showTreeView, ""), "vuefinder__treeview__resize-handle"])
        }, null, 34)
      ], 4)
    ], 64));
  }
};
class hf {
  /**
   *
   * @param {Item['title']} title
   * @param {Item['action']} action
   * @param {Item['link']} link
   * @param {Partial<SimpleItemOptions>} options
   */
  constructor(e, n, r, s) {
    this.title = e, this.action = n, this.link = r, this.options = Object.assign(
      {
        needsSearchQuery: !1,
        target: "one"
      },
      s
    );
  }
  /**
   * @type {Item['show']}
   */
  show(e, n) {
    var s, a;
    const r = (c) => c.items.length > 1 && c.items.some((u) => {
      var i;
      return u.path === ((i = c.target) == null ? void 0 : i.path);
    }) ? "many" : c.target ? "one" : null;
    return !(this.options.needsSearchQuery !== !!n.searchQuery || this.options.target !== void 0 && this.options.target !== r(n) || this.options.targetType !== void 0 && this.options.targetType !== ((s = n.target) == null ? void 0 : s.type) || this.options.mimeType !== void 0 && this.options.mimeType !== ((a = n.target) == null ? void 0 : a.mime_type) || this.options.feature !== void 0 && !e.features.includes(this.options.feature) || this.options.show !== void 0 && !this.options.show(e, n));
  }
}
function Be(t, e) {
  return t.map((n) => new hf(n.title, n.action, n.link, {
    ...e,
    feature: n.key
  }));
}
const Te = {
  newfolder: {
    key: de.NEW_FOLDER,
    title: ({ t }) => t("New Folder"),
    action: (t) => t.modal.open(Io)
  },
  selectAll: {
    title: ({ t }) => t("Select All"),
    action: (t) => t.dragSelect.selectAll()
  },
  pinFolder: {
    title: ({ t }) => t("Pin Folder"),
    action: (t, e) => {
      t.pinnedFolders = t.pinnedFolders.concat(e.value), t.storage.setStore("pinned-folders", t.pinnedFolders);
    }
  },
  unpinFolder: {
    title: ({ t }) => t("Unpin Folder"),
    action: (t, e) => {
      t.pinnedFolders = t.pinnedFolders.filter(
        (n) => !e.value.find((r) => r.path === n.path)
      ), t.storage.setStore("pinned-folders", t.pinnedFolders);
    }
  },
  delete: {
    key: de.DELETE,
    title: ({ t }) => t("Delete"),
    action: (t, e) => {
      t.modal.open(cs, { items: e });
    }
  },
  refresh: {
    title: ({ t }) => t("Refresh"),
    action: (t) => {
      t.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: t.fs.adapter,
          path: t.fs.data.dirname
        }
      });
    }
  },
  preview: {
    key: de.PREVIEW,
    title: ({ t }) => t("Preview"),
    action: (t, e) => t.modal.open(qo, {
      adapter: t.fs.adapter,
      item: e.value[0]
    })
  },
  open: {
    title: ({ t }) => t("Open"),
    action: (t, e) => {
      t.emitter.emit("vf-search-exit"), t.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: t.fs.adapter,
          path: e.value[0].path
        }
      });
    }
  },
  openDir: {
    title: ({ t }) => t("Open containing folder"),
    action: (t, e) => {
      t.emitter.emit("vf-search-exit"), t.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: t.fs.adapter,
          path: e.value[0].dir
        }
      });
    }
  },
  download: {
    key: de.DOWNLOAD,
    link: (t, e) => t.requester.getDownloadUrl(t.fs.adapter, e.value[0]),
    title: ({ t }) => t("Download"),
    action: () => {
    }
  },
  archive: {
    key: de.ARCHIVE,
    title: ({ t }) => t("Archive"),
    action: (t, e) => t.modal.open(Po, { items: e })
  },
  unarchive: {
    key: de.UNARCHIVE,
    title: ({ t }) => t("Unarchive"),
    action: (t, e) => t.modal.open(Uo, { items: e })
  },
  rename: {
    key: de.RENAME,
    title: ({ t }) => t("Rename"),
    action: (t, e) => t.modal.open(ds, { items: e })
  }
}, gf = [
  ...Be([Te.openDir], {
    needsSearchQuery: !0
  }),
  ...Be(
    [Te.refresh, Te.selectAll, Te.newfolder],
    {
      target: null
    }
  ),
  ...Be(
    [Te.refresh, Te.archive, Te.delete],
    {
      target: "many"
    }
  ),
  ...Be([Te.open], {
    targetType: "dir"
  }),
  ...Be([Te.unpinFolder], {
    targetType: "dir",
    show: (t, e) => t.pinnedFolders.findIndex((n) => {
      var r;
      return n.path === ((r = e.target) == null ? void 0 : r.path);
    }) !== -1
  }),
  ...Be([Te.pinFolder], {
    targetType: "dir",
    show: (t, e) => t.pinnedFolders.findIndex((n) => {
      var r;
      return n.path === ((r = e.target) == null ? void 0 : r.path);
    }) === -1
  }),
  ...Be([Te.preview, Te.download], {
    show: (t, e) => {
      var n;
      return ((n = e.target) == null ? void 0 : n.type) !== "dir";
    }
  }),
  ...Be([Te.rename], { numItems: "one" }),
  ...Be([Te.unarchive], {
    mimeType: "application/zip"
  }),
  ...Be([Te.archive], {
    show: (t, e) => {
      var n;
      return ((n = e.target) == null ? void 0 : n.mime_type) !== "application/zip";
    }
  }),
  ...Be([Te.delete], {})
], bf = { class: "vuefinder__main__content" }, wf = {
  __name: "VueFinder",
  props: {
    id: {
      type: String,
      default: "vf"
    },
    request: {
      type: [String, Object],
      required: !0
    },
    persist: {
      type: Boolean,
      default: !1
    },
    path: {
      type: String,
      default: ""
    },
    features: {
      type: [Array, Boolean],
      default: !0
    },
    debug: {
      type: Boolean,
      default: !1
    },
    theme: {
      type: String,
      default: "system"
    },
    locale: {
      type: String,
      default: null
    },
    maxHeight: {
      type: String,
      default: "600px"
    },
    maxFileSize: {
      type: String,
      default: "10mb"
    },
    fullScreen: {
      type: Boolean,
      default: !1
    },
    showTreeView: {
      type: Boolean,
      default: !1
    },
    pinnedFolders: {
      type: Array,
      default: []
    },
    showThumbnails: {
      type: Boolean,
      default: !0
    },
    selectButton: {
      type: Object,
      default(t) {
        return {
          active: !1,
          multiple: !1,
          click: (e) => {
          },
          ...t
        };
      }
    },
    onError: {
      type: Function,
      default: null
    },
    loadingIndicator: {
      type: String,
      default: "circular"
    },
    contextMenuItems: {
      type: Array,
      default: () => gf
    }
  },
  emits: ["select", "update:path"],
  setup(t, { expose: e, emit: n }) {
    const r = n, s = t, a = Dl(s, re("VueFinderOptions"));
    cr("ServiceContainer", a);
    const { setStore: c } = a.storage, u = A(null);
    a.root = u;
    const i = a.dragSelect;
    ii(a);
    const d = (_) => {
      Object.assign(a.fs.data, _), i.clearSelection(), i.refreshSelection();
    };
    let f;
    a.emitter.on("vf-fetch-abort", () => {
      f.abort(), a.fs.loading = !1;
    }), a.emitter.on(
      "vf-fetch",
      ({
        params: _,
        body: h = null,
        onSuccess: w = null,
        onError: $ = null,
        noCloseModal: D = !1
      }) => {
        ["index", "search"].includes(_.q) && (f && f.abort(), a.fs.loading = !0), f = new AbortController();
        const I = f.signal;
        a.requester.send({
          url: "",
          method: _.m || "get",
          params: _,
          body: h,
          abortSignal: I
        }).then((E) => {
          a.fs.adapter = E.adapter, a.persist && (a.fs.path = E.dirname, c("path", a.fs.path)), D || a.modal.close(), d(E), w && w(E);
        }).catch((E) => {
          console.error(E), $ && $(E);
        }).finally(() => {
          ["index", "search"].includes(_.q) && (a.fs.loading = !1);
        });
      }
    ), e({ getApp: () => a });
    function p(_) {
      let h = {};
      _ && _.includes("://") && (h = {
        adapter: _.split("://")[0],
        path: _
      }), a.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: a.fs.adapter, ...h },
        onError: s.onError ?? ((w) => {
          w.message && a.emitter.emit("vf-toast-push", {
            label: w.message,
            type: "error"
          });
        })
      });
    }
    return $e(() => {
      p(a.fs.path), De(
        () => s.path,
        (_) => {
          p(_);
        }
      ), i.onSelect((_) => {
        r("select", _);
      }), De(
        () => a.fs.data.dirname,
        (_) => {
          r("update:path", _);
        }
      );
    }), (_, h) => (v(), g("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: u,
      tabindex: "0"
    }, [
      l("div", {
        class: le(o(a).theme.actualValue)
      }, [
        l("div", {
          class: le([
            o(a).fullScreen ? "vuefinder__main__fixed" : "vuefinder__main__relative",
            "vuefinder__main__container"
          ]),
          style: an(o(a).fullScreen ? "" : "max-height: " + t.maxHeight),
          onMousedown: h[0] || (h[0] = (w) => o(a).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: h[1] || (h[1] = (w) => o(a).emitter.emit("vf-contextmenu-hide"))
        }, [
          z(Lc),
          z(Id),
          l("div", bf, [
            z(pf),
            z(pv)
          ]),
          z(Iv)
        ], 38),
        z(dr, { name: "fade" }, {
          default: J(() => [
            o(a).modal.visible ? (v(), G(Hs(o(a).modal.type), { key: 0 })) : H("", !0)
          ]),
          _: 1
        }),
        z(bv)
      ], 2)
    ], 512));
  }
}, Af = {
  /**
   * @param {import('vue').App} app
   * @param options
   */
  install(t, e = {}) {
    e.i18n = e.i18n ?? {};
    let [n] = Object.keys(e.i18n);
    e.locale = e.locale ?? n ?? "en", t.provide("VueFinderOptions", e), t.component("VueFinder", wf);
  }
};
export {
  hf as SimpleContextMenuItem,
  gf as contextMenuItems,
  Af as default
};
