var tr = Object.defineProperty;
var nr = (t, e, n) => e in t ? tr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var xn = (t, e, n) => nr(t, typeof e != "symbol" ? e + "" : e, n);
import { reactive as xt, watch as De, ref as A, shallowRef as sr, onMounted as $e, onUnmounted as Kn, onUpdated as Is, nextTick as ct, computed as bt, inject as re, openBlock as f, createElementBlock as h, withKeys as St, unref as o, createElementVNode as l, withModifiers as et, renderSlot as At, normalizeClass as le, toDisplayString as b, createBlock as G, resolveDynamicComponent as Hs, withCtx as J, createVNode as z, Fragment as ge, renderList as ke, createCommentVNode as H, withDirectives as ue, vModelCheckbox as jt, createTextVNode as Z, vModelSelect as An, vModelText as $t, onBeforeUnmount as Rs, customRef as or, vShow as ze, isRef as rr, TransitionGroup as lr, normalizeStyle as an, mergeModels as ar, useModel as Bs, resolveComponent as ir, provide as cr, Transition as dr } from "vue";
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
    ), i = Object.assign({}, n.params, e.params), c = e.body, u = n.baseUrl + e.url, a = e.method;
    let d;
    a !== "get" && (c instanceof FormData ? (d = c, n.body != null && Object.entries(this.config.body).forEach(([v, p]) => {
      d.append(v, p);
    })) : (d = { ...c }, n.body != null && Object.assign(d, this.config.body)));
    const _ = {
      url: u,
      method: a,
      headers: s,
      params: i,
      body: d
    };
    if (n.transformRequest != null) {
      const v = n.transformRequest({
        url: u,
        method: a,
        headers: s,
        params: i,
        body: d
      });
      v.url != null && (_.url = v.url), v.method != null && (_.method = v.method), v.params != null && (_.params = v.params ?? {}), v.headers != null && (_.headers = v.headers ?? {}), v.body != null && (_.body = v.body);
    }
    return _;
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
    }, i = n.url + "?" + new URLSearchParams(n.params);
    if (n.method !== "get" && n.body != null) {
      let u;
      n.body instanceof FormData ? u = e.body : (u = JSON.stringify(n.body), s.headers["Content-Type"] = "application/json"), s.body = u;
    }
    this.config.fetchParams && Object.assign(s, this.config.fetchParams);
    const c = await this.customFetch(i, s);
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
  function s(a, d) {
    n[a] = d;
  }
  function i(a) {
    delete n[a];
  }
  function c() {
    Object.keys(n).map((a) => i(a));
  }
  return { getStore: (a, d = null) => n.hasOwnProperty(a) ? n[a] : d, setStore: s, removeStore: i, clearStore: c };
}
async function wr(t, e) {
  const n = e[t];
  return typeof n == "function" ? (await n()).default : n;
}
function yr(t, e, n, r) {
  const { getStore: s, setStore: i } = t, c = A({}), u = A(s("locale", e)), a = (v, p = e) => {
    wr(v, r).then((m) => {
      c.value = m, i("locale", v), u.value = v, i("translations", m), Object.values(r).length > 1 && (n.emit("vf-toast-push", { label: "The language is set to " + v }), n.emit("vf-language-saved"));
    }).catch((m) => {
      p ? (n.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), a(p, null)) : n.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  De(u, (v) => {
    a(v);
  }), !s("locale") && !r.length ? a(e) : c.value = s("translations");
  const d = (v, ...p) => p.length ? d(v = v.replace("%s", p.shift()), ...p) : v;
  function _(v, ...p) {
    return c.value && c.value.hasOwnProperty(v) ? d(c.value[v], ...p) : d(v, ...p);
  }
  return xt({ t: _, locale: u });
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
  const s = window.matchMedia("(prefers-color-scheme: dark)"), i = (c) => {
    n.value === st.DARK || n.value === st.SYSTEM && c.matches ? r.value = st.DARK : r.value = st.LIGHT;
  };
  return i(s), s.addEventListener("change", i), {
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
      n.value = c, c !== st.SYSTEM ? t.setStore("theme", c) : t.removeStore("theme"), i(s);
    }
  };
}
function Cr() {
  const t = sr(null), e = A(!1), n = A();
  return { visible: e, type: t, data: n, open: (i, c = null) => {
    document.querySelector("body").style.overflow = "hidden", e.value = !0, t.value = i, n.value = c;
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
  let i = n, c;
  const u = (_, v) => {
    const p = i, m = _, g = v || (r ? !r(p, m) : p !== m);
    return (g || s) && (i = m, c = p), [i, g, c];
  };
  return [e ? (_) => u(e(i, c), _) : u, (_) => [i, !!_, c]];
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
    return ae(n, (i) => {
      const c = t[i], u = e[i];
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
  const { _: n, p: r, v: s, S: i } = e || {};
  let c, u, a, d, _ = dt;
  const v = function($) {
    _(), Vn(c), d = c = u = void 0, _ = dt, t.apply(this, $);
  }, p = (x) => i && u ? i(u, x) : x, m = () => {
    _ !== dt && v(p(a) || a);
  }, g = function() {
    const $ = lt(arguments), T = Re(n) ? n() : n;
    if (je(T) && T >= 0) {
      const D = Re(r) ? r() : r, C = je(D) && D >= 0, V = T > 0 ? en : Yn, F = T > 0 ? Vn : zs, O = p($) || $, w = v.bind(0, O);
      let y;
      _(), s && !d ? (w(), d = !0, y = V(() => d = void 0, T)) : (y = V(w, T), C && !c && (c = en(m, D))), _ = () => F(y), u = a = O;
    } else
      v($);
  };
  return g.m = m, g;
}, to = (t, e) => Object.prototype.hasOwnProperty.call(t, e), Ue = (t) => t ? Object.keys(t) : [], oe = (t, e, n, r, s, i, c) => {
  const u = [e, n, r, s, i, c];
  return (typeof t != "object" || dn(t)) && !Re(t) && (t = {}), ae(u, (a) => {
    ae(a, (d, _) => {
      const v = a[_];
      if (t === v)
        return !0;
      const p = Ge(v);
      if (v && sn(v)) {
        const m = t[_];
        let g = m;
        p && !Ge(m) ? g = [] : !p && !sn(m) && (g = {}), t[_] = oe(g, v);
      } else
        t[_] = p ? v.slice() : v;
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
  const n = ut(ts(t, e)), r = X(Je, t, e), s = (i, c) => {
    const u = new Set(n);
    return ae(ut(i), (a) => {
      u[c](a);
    }), lt(u).join(" ");
  };
  return {
    O: (i) => r(s(i, "delete")),
    $: (i) => r(s(i, "add")),
    C: (i) => {
      const c = ut(i);
      return c.reduce((u, a) => u && n.includes(a), c.length > 0);
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
  const r = pt(t, e), s = t && Vr(n, r), i = pt(s, e) === r;
  return r && s ? r === t || s === t || i && pt(pt(t, n), e) !== r : !1;
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
      const s = t.style, i = dn(n) || Zn(n) ? "" : je(n) ? vo(n) : n;
      r.indexOf("--") === 0 ? s.setProperty(r, i) : s[r] = i;
    } catch {
    }
  });
}
function tt(t, e, n) {
  const r = Ot(e);
  let s = r ? "" : {};
  if (t) {
    const i = Ve.getComputedStyle(t, n) || t.style;
    s = r ? gs(i, e) : lt(e).reduce((c, u) => (c[u] = gs(i, u), c), s);
  }
  return s;
}
const bs = (t, e, n) => {
  const r = e ? `${e}-` : "", s = n ? `-${n}` : "", i = `${r}top${s}`, c = `${r}right${s}`, u = `${r}bottom${s}`, a = `${r}left${s}`, d = tt(t, [i, c, u, a]);
  return {
    t: Gt(d[i]),
    r: Gt(d[c]),
    b: Gt(d[u]),
    l: Gt(d[a])
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
  const i = (s = r && r.H) != null ? s : !0, c = r && r.I || !1, u = r && r.A || !1, a = {
    passive: i,
    capture: c
  };
  return X(Ie, ut(e).map((d) => {
    const _ = u ? (v) => {
      ws(t, d, _, c), n && n(v);
    } : n;
    return t && t.addEventListener(d, _, a), X(ws, t, d, _, c);
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
  const { D: n, M: r } = t, { w: s, h: i } = e, c = (v, p, m) => {
    let g = ms(v) * m, x = ms(p) * m;
    if (g === x) {
      const $ = Qt(v), T = Qt(p);
      x = $ > T ? 0 : x, g = $ < T ? 0 : g;
    }
    return g = g === x ? 0 : g, [g + 0, x + 0];
  }, [u, a] = c(n.x, r.x, s), [d, _] = c(n.y, r.y, i);
  return {
    D: {
      x: u,
      y: d
    },
    M: {
      x: a,
      y: _
    }
  };
}, ys = ({ D: t, M: e }) => {
  const n = (r, s) => r === 0 && r <= s;
  return {
    x: n(t.x, e.x),
    y: n(t.y, e.y)
  };
}, ks = ({ D: t, M: e }, n) => {
  const r = (s, i, c) => so(0, 1, (s - c) / (s - i) || 0);
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
  const e = /* @__PURE__ */ new Map(), n = (i, c) => {
    if (i) {
      const u = e.get(i);
      xs((a) => {
        u && u[a ? "delete" : "clear"](a);
      }, c);
    } else
      e.forEach((u) => {
        u.clear();
      }), e.clear();
  }, r = (i, c) => {
    if (Ot(i)) {
      const d = e.get(i) || /* @__PURE__ */ new Set();
      return e.set(i, d), xs((_) => {
        Re(_) && d.add(_);
      }, c), X(n, i, c);
    }
    Zn(c) && c && n();
    const u = Ue(i), a = [];
    return ae(u, (d) => {
      const _ = i[d];
      _ && me(a, r(d, _));
    }), X(Ie, a);
  }, s = (i, c) => {
    ae(lt(e.get(i)), (u) => {
      c && !Ln(c) ? u.apply(0, c) : u();
    });
  };
  return r(t || {}), [r, n, s];
}, go = {}, bo = {}, Ur = (t) => {
  ae(t, (e) => ae(e, (n, r) => {
    go[r] = e[r];
  }));
}, wo = (t, e, n) => Ue(t).map((r) => {
  const { static: s, instance: i } = t[r], [c, u, a] = n || [], d = n ? i : s;
  if (d) {
    const _ = n ? d(c, u, e) : d(e);
    return (a || bo)[r] = _;
  }
}), Ft = (t) => bo[t], Nr = "__osOptionsValidationPlugin", Ct = "data-overlayscrollbars", Zt = "os-environment", Wt = `${Zt}-scrollbar-hidden`, Cn = `${Ct}-initialize`, Jt = "noClipping", Ss = `${Ct}-body`, rt = Ct, Pr = "host", Qe = `${Ct}-viewport`, zr = Js, qr = Qs, jr = "arrange", yo = "measuring", Gr = "scrolling", ko = "scrollbarHidden", Wr = "noContent", qn = `${Ct}-padding`, $s = `${Ct}-content`, ls = "os-size-observer", Kr = `${ls}-appear`, Yr = `${ls}-listener`, Xr = "os-trinsic-observer", Zr = "os-theme-none", He = "os-scrollbar", Jr = `${He}-rtl`, Qr = `${He}-horizontal`, el = `${He}-vertical`, xo = `${He}-track`, as = `${He}-handle`, tl = `${He}-visible`, nl = `${He}-cornerless`, Cs = `${He}-interaction`, Es = `${He}-unusable`, jn = `${He}-auto-hide`, Ts = `${jn}-hidden`, Ms = `${He}-wheel`, sl = `${xo}-interactive`, ol = `${as}-interactive`, rl = "__osSizeObserverPlugin", ll = (t, e) => {
  const { T: n } = e, [r, s] = t("showNativeOverlaidScrollbars");
  return [r && n.x && n.y, s];
}, kt = (t) => t.indexOf(ot) === 0, al = (t, e) => {
  const n = (s, i, c, u) => {
    const a = s === ot ? it : s.replace(`${ot}-`, ""), d = kt(s), _ = kt(c);
    return !i && !u ? it : d && _ ? ot : d ? i && u ? a : i ? ot : it : i ? a : _ && u ? ot : it;
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
    const i = t[s], c = e[s];
    if (nn(i) && nn(c))
      oe(n[s] = {}, $o(i, c)), es(n[s]) && delete n[s];
    else if (to(e, s) && c !== i) {
      let u = !0;
      if (Ge(i) || Ge(c))
        try {
          As(i) === As(c) && (u = !1);
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
    const q = fo(C), O = gt(C), w = rs(V);
    return F && yt(C), {
      x: O.h - q.h + w.h,
      y: O.w - q.w + w.w
    };
  }, e = (C) => {
    let V = !1;
    const F = os(C, Wt);
    try {
      V = tt(C, "scrollbar-width") === "none" || tt(C, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return F(), V;
  }, n = `.${Zt}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${Zt} div{width:200%;height:200%;margin:10px 0}.${Wt}{scrollbar-width:none!important}.${Wt}::-webkit-scrollbar,.${Wt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, s = co(`<div class="${Zt}"><div></div><style>${n}</style></div>`)[0], i = s.firstChild, c = s.lastChild, u = dl();
  u && (c.nonce = u);
  const [a, , d] = zn(), [_, v] = Le({
    o: t(s, i),
    i: Xt
  }, X(t, s, i, !0)), [p] = v(), m = e(s), g = {
    x: p.x === 0,
    y: p.y === 0
  }, x = {
    elements: {
      host: null,
      padding: !m,
      viewport: (C) => m && io(C) && C,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, $ = oe({}, cl), T = X(oe, {}, $), I = X(oe, {}, x), D = {
    N: p,
    T: g,
    P: m,
    G: !!Yt,
    K: X(a, "r"),
    Z: I,
    tt: (C) => oe(x, C) && I(),
    nt: T,
    ot: (C) => oe($, C) && T(),
    st: oe({}, x),
    et: oe({}, $)
  };
  if (Pe(s, "style"), yt(s), ve(Ve, "resize", () => {
    d("r", []);
  }), Re(Ve.matchMedia) && !m && (!g.x || !g.y)) {
    const C = (V) => {
      const F = Ve.matchMedia(`(resolution: ${Ve.devicePixelRatio}dppx)`);
      ve(F, "change", () => {
        V(), C(V);
      }, {
        A: !0
      });
    };
    C(() => {
      const [V, F] = _();
      oe(D.N, V), d("r", [F]);
    });
  }
  return D;
}, Ke = () => (En || (En = vl()), En), fl = (t, e, n) => {
  let r = !1;
  const s = n ? /* @__PURE__ */ new WeakMap() : !1, i = () => {
    r = !0;
  }, c = (u) => {
    if (s && n) {
      const a = n.map((d) => {
        const [_, v] = d || [];
        return [v && _ ? (u || ao)(_, t) : [], v];
      });
      ae(a, (d) => ae(d[0], (_) => {
        const v = d[1], p = s.get(_) || [];
        if (t.contains(_) && v) {
          const g = ve(_, v, (x) => {
            r ? (g(), s.delete(_)) : e(x);
          });
          s.set(_, me(p, g));
        } else
          Ie(p), s.delete(_);
      }));
    }
  };
  return c(), [i, c];
}, Ls = (t, e, n, r) => {
  let s = !1;
  const { ct: i, rt: c, lt: u, it: a, ut: d, _t: _ } = r || {}, v = Fn(() => s && n(!0), {
    _: 33,
    p: 99
  }), [p, m] = fl(t, v, u), g = i || [], x = c || [], $ = Dt(g, x), T = (D, C) => {
    if (!Ln(C)) {
      const V = d || dt, F = _ || dt, q = [], O = [];
      let w = !1, y = !1;
      if (ae(C, (L) => {
        const { attributeName: k, target: R, type: S, oldValue: U, addedNodes: N, removedNodes: Q } = L, se = S === "attributes", ne = S === "childList", fe = t === R, Y = se && k, E = Y && ts(R, k || ""), B = Ot(E) ? E : null, P = Y && U !== B, M = qs(x, k) && P;
        if (e && (ne || !fe)) {
          const W = se && P, j = W && a && In(R, a), te = (j ? !V(R, k, U, B) : !se || W) && !F(L, !!j, t, r);
          ae(N, (ie) => me(q, ie)), ae(Q, (ie) => me(q, ie)), y = y || te;
        }
        !e && fe && P && !V(R, k, U, B) && (me(O, k), w = w || M);
      }), m((L) => On(q).reduce((k, R) => (me(k, ao(L, R)), In(R, L) ? me(k, R) : k), [])), e)
        return !D && y && n(!1), [!1];
      if (!Ln(O) || w) {
        const L = [On(O), w];
        return !D && n.apply(0, L), L;
      }
    }
  }, I = new Mr(X(T, !1));
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
      return v.m(), T(!0, I.takeRecords());
  }];
}, Eo = (t, e, n) => {
  const { dt: r } = n || {}, s = Ft(rl), [i] = Le({
    o: !1,
    u: !0
  });
  return () => {
    const c = [], a = co(`<div class="${ls}"><div class="${Yr}"></div></div>`)[0], d = a.firstChild, _ = (v) => {
      const p = v instanceof ResizeObserverEntry;
      let m = !1, g = !1;
      if (p) {
        const [x, , $] = i(v.contentRect), T = Un(x);
        g = _o(x, $), m = !g && !T;
      } else
        g = v === !0;
      m || e({
        ft: !0,
        dt: g
      });
    };
    if (tn) {
      const v = new tn((p) => _(p.pop()));
      v.observe(d), me(c, () => {
        v.disconnect();
      });
    } else if (s) {
      const [v, p] = s(d, _, r);
      me(c, Dt([os(a, Kr), ve(a, "animationstart", v)], p));
    } else
      return dt;
    return X(Ie, me(c, Oe(t, a)));
  };
}, _l = (t, e) => {
  let n;
  const r = (a) => a.h === 0 || a.isIntersecting || a.intersectionRatio > 0, s = ht(Xr), [i] = Le({
    o: !1
  }), c = (a, d) => {
    if (a) {
      const _ = i(r(a)), [, v] = _;
      return v && !d && e(_) && [_];
    }
  }, u = (a, d) => c(d.pop(), a);
  return [() => {
    const a = [];
    if (ps)
      n = new ps(X(u, !1), {
        root: t
      }), n.observe(s), me(a, () => {
        n.disconnect();
      });
    else {
      const d = () => {
        const _ = gt(s);
        c(_);
      };
      me(a, Eo(s, d)()), d();
    }
    return X(Ie, me(a, Oe(t, s)));
  }, () => n && u(!0, n.takeRecords())];
}, ml = (t, e, n, r) => {
  let s, i, c, u, a, d;
  const _ = `[${rt}]`, v = `[${Qe}]`, p = ["id", "class", "style", "open", "wrap", "cols", "rows"], { vt: m, ht: g, U: x, gt: $, bt: T, L: I, wt: D, yt: C, St: V, Ot: F } = t, q = (M) => tt(M, "direction") === "rtl", O = {
    $t: !1,
    F: q(m)
  }, w = Ke(), y = Ft(So), [L] = Le({
    i: eo,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const M = y && y.V(t, e, O, w, n).X, j = !(D && I) && ss(g, rt, Jt), K = !I && C(jr), te = K && Fe($), ie = te && F(), ye = V(yo, j), pe = K && M && M()[0], Ce = ln(x), ee = rs(x);
    return pe && pe(), qe($, te), ie && ie(), j && ye(), {
      w: Ce.w + ee.w,
      h: Ce.h + ee.h
    };
  }), k = Fn(r, {
    _: () => s,
    p: () => i,
    S(M, W) {
      const [j] = M, [K] = W;
      return [Dt(Ue(j), Ue(K)).reduce((te, ie) => (te[ie] = j[ie] || K[ie], te), {})];
    }
  }), R = (M) => {
    const W = q(m);
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
    const K = !(M && !W) && w.P ? k : r, te = {
      ft: M || W,
      dt: W
    };
    R(te), K(te);
  }, N = (M, W) => {
    const [, j] = L(), K = {
      Ht: j
    };
    return R(K), j && !W && (M ? r : k)(K), K;
  }, Q = (M, W, j) => {
    const K = {
      Et: W
    };
    return R(K), W && !j && k(K), K;
  }, [se, ne] = T ? _l(g, S) : [], fe = !I && Eo(g, U, {
    dt: !0
  }), [Y, E] = Ls(g, !1, Q, {
    rt: p,
    ct: p
  }), B = I && tn && new tn((M) => {
    const W = M[M.length - 1].contentRect;
    U({
      ft: !0,
      dt: _o(W, a)
    }), a = W;
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
    B && B.observe(g);
    const M = fe && fe(), W = se && se(), j = Y(), K = w.K((te) => {
      te ? k({
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
      const [we, he] = Ls(T || x, !0, N, {
        ct: Dt(p, ie || []),
        lt: pe,
        it: _,
        _t: (_e, ce) => {
          const { target: Se, attributeName: Me } = _e;
          return (!ce && Me && !I ? Lr(Se, _, v) : !1) || !!pt(Se, `.${He}`) || !!xe(_e);
        }
      });
      u = we(), c = he;
    }
    if (be)
      if (k.m(), Ge(ee)) {
        const we = ee[0], he = ee[1];
        s = je(we) && we, i = je(he) && he;
      } else je(ee) ? (s = ee, i = !1) : (s = !1, i = !1);
    if (Ee) {
      const we = E(), he = ne && ne(), _e = c && c();
      we && oe(K, Q(we[0], we[1], Ee)), he && oe(K, S(he[0], Ee)), _e && oe(K, N(_e[0], Ee));
    }
    return R(K), K;
  }, O];
}, To = (t, e) => Re(e) ? e.apply(0, t) : e, pl = (t, e, n, r) => {
  const s = Xn(r) ? n : r;
  return To(t, s) || e.apply(0, t);
}, Mo = (t, e, n, r) => {
  const s = Xn(r) ? n : r, i = To(t, s);
  return !!i && (on(i) ? i : e.apply(0, t));
}, hl = (t, e) => {
  const { nativeScrollbarsOverlaid: n, body: r } = e || {}, { T: s, P: i, Z: c } = Ke(), { nativeScrollbarsOverlaid: u, body: a } = c().cancel, d = n ?? u, _ = Xn(r) ? a : r, v = (s.x || s.y) && d, p = t && (dn(_) ? !i : _);
  return !!v || !!p;
}, gl = (t, e, n, r) => {
  const s = "--os-viewport-percent", i = "--os-scroll-percent", c = "--os-scroll-direction", { Z: u } = Ke(), { scrollbars: a } = u(), { slot: d } = a, { vt: _, ht: v, U: p, Mt: m, gt: g, wt: x, L: $ } = e, { scrollbars: T } = m ? {} : t, { slot: I } = T || {}, D = [], C = [], V = [], F = Mo([_, v, p], () => $ && x ? _ : v, d, I), q = (Y) => {
    if (Yt) {
      const E = new Yt({
        source: g,
        axis: Y
      });
      return {
        kt: (P) => {
          const M = P.Tt.animate({
            clear: ["left"],
            [i]: [0, 1]
          }, {
            timeline: E
          });
          return () => M.cancel();
        }
      };
    }
  }, O = {
    x: q("x"),
    y: q("y")
  }, w = () => {
    const { Rt: Y, Vt: E } = n, B = (P, M) => so(0, 1, P / (P + M) || 0);
    return {
      x: B(E.x, Y.x),
      y: B(E.y, Y.y)
    };
  }, y = (Y, E, B) => {
    const P = B ? os : lo;
    ae(Y, (M) => {
      P(M.Tt, E);
    });
  }, L = (Y, E) => {
    ae(Y, (B) => {
      const [P, M] = E(B);
      Lt(P, M);
    });
  }, k = (Y, E, B) => {
    const P = Zn(B), M = P ? B : !0, W = P ? !B : !0;
    M && y(C, Y, E), W && y(V, Y, E);
  }, R = () => {
    const Y = w(), E = (B) => (P) => [P.Tt, {
      [s]: Bn(B) + ""
    }];
    L(C, E(Y.x)), L(V, E(Y.y));
  }, S = () => {
    if (!Yt) {
      const { Lt: Y } = n, E = ks(Y, Fe(g)), B = (P) => (M) => [M.Tt, {
        [i]: Bn(P) + ""
      }];
      L(C, B(E.x)), L(V, B(E.y));
    }
  }, U = () => {
    const { Lt: Y } = n, E = ys(Y), B = (P) => (M) => [M.Tt, {
      [c]: P ? "0" : "1"
    }];
    L(C, B(E.x)), L(V, B(E.y));
  }, N = () => {
    if ($ && !x) {
      const { Rt: Y, Lt: E } = n, B = ys(E), P = ks(E, Fe(g)), M = (W) => {
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
    const E = Y ? "x" : "y", P = ht(`${He} ${Y ? Qr : el}`), M = ht(xo), W = ht(as), j = {
      Tt: P,
      Ut: M,
      Pt: W
    }, K = O[E];
    return me(Y ? C : V, j), me(D, [Oe(P, M), Oe(M, W), X(yt, P), K && K.kt(j), r(j, k, Y)]), j;
  }, se = X(Q, !0), ne = X(Q, !1), fe = () => (Oe(F, C[0].Tt), Oe(F, V[0].Tt), X(Ie, D));
  return se(), ne(), [{
    Nt: R,
    qt: S,
    Bt: U,
    Ft: N,
    jt: k,
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
}, bl = (t, e, n, r) => (s, i, c) => {
  const { ht: u, U: a, L: d, gt: _, Kt: v, Ot: p } = e, { Tt: m, Ut: g, Pt: x } = s, [$, T] = mt(333), [I, D] = mt(444), C = (q) => {
    Re(_.scrollBy) && _.scrollBy({
      behavior: "smooth",
      left: q.x,
      top: q.y
    });
  }, V = () => {
    const q = "pointerup pointercancel lostpointercapture", O = `client${c ? "X" : "Y"}`, w = c ? vn : fn, y = c ? "left" : "top", L = c ? "w" : "h", k = c ? "x" : "y", R = (U, N) => (Q) => {
      const { Rt: se } = n, ne = gt(g)[L] - gt(x)[L], Y = N * Q / ne * se[k];
      qe(_, {
        [k]: U + Y
      });
    }, S = [];
    return ve(g, "pointerdown", (U) => {
      const N = pt(U.target, `.${as}`) === x, Q = N ? x : g, se = t.scrollbars, ne = se[N ? "dragScroll" : "clickScroll"], { button: fe, isPrimary: Y, pointerType: E } = U, { pointers: B } = se;
      if (fe === 0 && Y && ne && (B || []).includes(E)) {
        Ie(S), D();
        const M = !N && (U.shiftKey || ne === "instant"), W = X($n, x), j = X($n, g), K = (ce, Se) => (ce || W())[y] - (Se || j())[y], te = Dn($n(_)[w]) / gt(_)[L] || 1, ie = R(Fe(_)[k], 1 / te), ye = U[O], pe = W(), Ce = j(), ee = pe[w], be = K(pe, Ce) + ee / 2, Ae = ye - Ce[y], Ee = N ? 0 : Ae - be, xe = (ce) => {
          Ie(_e), Q.releasePointerCapture(ce.pointerId);
        }, we = N || M, he = p(), _e = [ve(v, q, xe), ve(v, "selectstart", (ce) => Nn(ce), {
          H: !1
        }), ve(g, q, xe), we && ve(g, "pointermove", (ce) => ie(Ee + (ce[O] - ye))), we && (() => {
          const ce = Fe(_);
          he();
          const Se = Fe(_), Me = {
            x: Se.x - ce.x,
            y: Se.y - ce.y
          };
          (Qt(Me.x) > 3 || Qt(Me.y) > 3) && (p(), qe(_, ce), C(Me), I(he));
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
  return X(Ie, [ve(x, "pointermove pointerleave", r), ve(m, "pointerenter", () => {
    i(Cs, !0);
  }), ve(m, "pointerleave pointercancel", () => {
    i(Cs, !1);
  }), !d && ve(m, "mousedown", () => {
    const q = Rn();
    (hs(q, Qe) || hs(q, rt) || q === document.body) && en(X(Pn, a), 25);
  }), ve(m, "wheel", (q) => {
    const { deltaX: O, deltaY: w, deltaMode: y } = q;
    F && y === 0 && Vt(m) === u && C({
      x: O,
      y: w
    }), F = !1, i(Ms, !0), $(() => {
      F = !0, i(Ms);
    }), Nn(q);
  }, {
    H: !1,
    I: !0
  }), ve(m, "pointerdown", X(ve, v, "click", po, {
    A: !0,
    I: !0,
    H: !1
  }), {
    I: !0
  }), V(), T, D]);
}, wl = (t, e, n, r, s, i) => {
  let c, u, a, d, _, v = dt, p = 0;
  const m = ["mouse", "pen"], g = (E) => m.includes(E.pointerType), [x, $] = mt(), [T, I] = mt(100), [D, C] = mt(100), [V, F] = mt(() => p), [q, O] = gl(t, s, r, bl(e, s, r, (E) => g(E) && se())), { ht: w, Qt: y, wt: L } = s, { jt: k, Nt: R, qt: S, Bt: U, Ft: N } = q, Q = (E, B) => {
    if (F(), E)
      k(Ts);
    else {
      const P = X(k, Ts, !0);
      p > 0 && !B ? V(P) : P();
    }
  }, se = () => {
    (a ? !c : !d) && (Q(!0), T(() => {
      Q(!1);
    }));
  }, ne = (E) => {
    k(jn, E, !0), k(jn, E, !1);
  }, fe = (E) => {
    g(E) && (c = a, a && Q(!0));
  }, Y = [F, I, C, $, () => v(), ve(w, "pointerover", fe, {
    A: !0
  }), ve(w, "pointerenter", fe), ve(w, "pointerleave", (E) => {
    g(E) && (c = !1, a && Q(!1));
  }), ve(w, "pointermove", (E) => {
    g(E) && u && se();
  }), ve(y, "scroll", (E) => {
    x(() => {
      S(), se();
    }), i(E), N();
  })];
  return [() => X(Ie, me(Y, O())), ({ It: E, Dt: B, Zt: P, tn: M }) => {
    const { nn: W, sn: j, en: K, cn: te } = M || {}, { Ct: ie, dt: ye } = P || {}, { F: pe } = n, { T: Ce } = Ke(), { k: ee, rn: be } = r, [Ae, Ee] = E("showNativeOverlaidScrollbars"), [xe, we] = E("scrollbars.theme"), [he, _e] = E("scrollbars.visibility"), [ce, Se] = E("scrollbars.autoHide"), [Me, Et] = E("scrollbars.autoHideSuspend"), [It] = E("scrollbars.autoHideDelay"), [gn, at] = E("scrollbars.dragScroll"), [Ht, bn] = E("scrollbars.clickScroll"), [wn, yn] = E("overflow"), vs = ye && !B, Ne = be.x || be.y, kn = W || j || te || ie || B, Rt = K || _e || yn, vt = Ae && Ce.x && Ce.y, Bt = (ft, Tt, Ut) => {
      const Mt = ft.includes(wt) && (he === ot || he === "auto" && Tt === wt);
      return k(tl, Mt, Ut), Mt;
    };
    if (p = It, vs && (Me && Ne ? (ne(!1), v(), D(() => {
      v = ve(y, "scroll", X(ne, !0), {
        A: !0
      });
    })) : ne(!0)), Ee && k(Zr, vt), we && (k(_), k(xe, !0), _ = xe), Et && !Me && ne(!0), Se && (u = ce === "move", a = ce === "leave", d = ce === "never", Q(d, !0)), at && k(ol, gn), bn && k(sl, !!Ht), Rt) {
      const ft = Bt(wn.x, ee.x, !0), Tt = Bt(wn.y, ee.y, !1);
      k(nl, !(ft && Tt));
    }
    kn && (S(), R(), N(), te && U(), k(Es, !be.x, !0), k(Es, !be.y, !1), k(Jr, pe && !L));
  }, {}, q];
}, yl = (t) => {
  const e = Ke(), { Z: n, P: r } = e, { elements: s } = n(), { padding: i, viewport: c, content: u } = s, a = on(t), d = a ? {} : t, { elements: _ } = d, { padding: v, viewport: p, content: m } = _ || {}, g = a ? t : d.target, x = io(g), $ = g.ownerDocument, T = $.documentElement, I = () => $.defaultView || Ve, D = X(pl, [g]), C = X(Mo, [g]), V = X(ht, ""), F = X(D, V, c), q = X(C, V, u), O = (ee) => {
    const be = gt(ee), Ae = ln(ee), Ee = tt(ee, Js), xe = tt(ee, Qs);
    return Ae.w - be.w > 0 && !kt(Ee) || Ae.h - be.h > 0 && !kt(xe);
  }, w = F(p), y = w === g, L = y && x, k = !y && q(m), R = !y && w === k, S = L ? T : w, U = L ? S : g, N = !y && C(V, i, v), Q = !R && k, se = [Q, S, N, U].map((ee) => on(ee) && !Vt(ee) && ee), ne = (ee) => ee && qs(se, ee), fe = !ne(S) && O(S) ? S : g, Y = L ? T : S, B = {
    vt: g,
    ht: U,
    U: S,
    ln: N,
    bt: Q,
    gt: Y,
    Qt: L ? $ : S,
    an: x ? T : fe,
    Kt: $,
    wt: x,
    Mt: a,
    L: y,
    un: I,
    yt: (ee) => ss(S, Qe, ee),
    St: (ee, be) => rn(S, Qe, ee, be),
    Ot: () => rn(Y, Qe, Gr, !0)
  }, { vt: P, ht: M, ln: W, U: j, bt: K } = B, te = [() => {
    Pe(M, [rt, Cn]), Pe(P, Cn), x && Pe(T, [Cn, rt]);
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
    return Je(M, rt, y ? "" : Pr), Je(W, qn, ""), Je(j, Qe, ""), Je(K, $s, ""), y || (Je(j, xe, we || "-1"), x && Je(T, Ss, "")), Oe(ye, ie), Oe(M, W), Oe(W || M, !y && j), Oe(j, K), me(te, [he, () => {
      const _e = Rn(), ce = ne(j), Se = ce && _e === j ? P : _e, Me = Ee(Se);
      Pe(W, qn), Pe(K, $s), Pe(j, Qe), x && Pe(T, Ss), we ? Je(j, xe, we) : Pe(j, xe), ne(K) && Ae(K), ce && Ae(j), ne(W) && Ae(W), Pn(Se), Me();
    }]), r && !y && (ns(j, Qe, ko), me(te, X(Pe, j, Qe))), Pn(!y && x && be === P && ee.top === ee ? j : be), he(), ie = 0, pe;
  }, pe];
}, kl = ({ bt: t }) => ({ Zt: e, _n: n, Dt: r }) => {
  const { xt: s } = e || {}, { $t: i } = n;
  t && (s || r) && Lt(t, {
    [fn]: i && "100%"
  });
}, xl = ({ ht: t, ln: e, U: n, L: r }, s) => {
  const [i, c] = Le({
    i: Dr,
    o: bs()
  }, X(bs, t, "padding", ""));
  return ({ It: u, Zt: a, _n: d, Dt: _ }) => {
    let [v, p] = c(_);
    const { P: m } = Ke(), { ft: g, Ht: x, Ct: $ } = a || {}, { F: T } = d, [I, D] = u("paddingAbsolute");
    (g || p || (_ || x)) && ([v, p] = i(_));
    const V = !r && (D || $ || p);
    if (V) {
      const F = !I || !e && !m, q = v.r + v.l, O = v.t + v.b, w = {
        [Xs]: F && !T ? -q : 0,
        [Zs]: F ? -O : 0,
        [Ys]: F && T ? -q : 0,
        top: F ? -v.t : 0,
        right: F ? T ? -v.r : "auto" : 0,
        left: F ? T ? "auto" : -v.l : 0,
        [vn]: F && `calc(100% + ${q}px)`
      }, y = {
        [js]: F ? v.t : 0,
        [Gs]: F ? v.r : 0,
        [Ks]: F ? v.b : 0,
        [Ws]: F ? v.l : 0
      };
      Lt(e || n, w), Lt(n, y), oe(s, {
        ln: v,
        dn: !F,
        j: e ? y : oe({}, w, y)
      });
    }
    return {
      fn: V
    };
  };
}, Sl = (t, e) => {
  const n = Ke(), { ht: r, ln: s, U: i, L: c, Qt: u, gt: a, wt: d, St: _, un: v } = t, { P: p } = n, m = d && c, g = X(Ps, 0), x = {
    display: () => !1,
    direction: (E) => E !== "ltr",
    flexDirection: (E) => E.endsWith("-reverse"),
    writingMode: (E) => E !== "horizontal-tb"
  }, $ = Ue(x), T = {
    i: eo,
    o: {
      w: 0,
      h: 0
    }
  }, I = {
    i: Xt,
    o: {}
  }, D = (E) => {
    _(yo, !m && E);
  }, C = (E) => {
    if (!$.some((ye) => {
      const pe = E[ye];
      return pe && x[ye](pe);
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
    D(!0);
    const P = Fe(a), M = _(Wr, !0), W = ve(u, wt, (ye) => {
      const pe = Fe(a);
      ye.isTrusted && pe.x === P.x && pe.y === P.y && mo(ye);
    }, {
      I: !0,
      A: !0
    });
    qe(a, {
      x: 0,
      y: 0
    }), M();
    const j = Fe(a), K = ln(a);
    qe(a, {
      x: K.w,
      y: K.h
    });
    const te = Fe(a);
    qe(a, {
      x: te.x - j.x < 1 && -K.w,
      y: te.y - j.y < 1 && -K.h
    });
    const ie = Fe(a);
    return qe(a, P), Yn(() => W()), {
      D: j,
      M: ie
    };
  }, V = (E, B) => {
    const P = Ve.devicePixelRatio % 1 !== 0 ? 1 : 0, M = {
      w: g(E.w - B.w),
      h: g(E.h - B.h)
    };
    return {
      w: M.w > P ? M.w : 0,
      h: M.h > P ? M.h : 0
    };
  }, [F, q] = Le(T, X(rs, i)), [O, w] = Le(T, X(ln, i)), [y, L] = Le(T), [k] = Le(I), [R, S] = Le(T), [U] = Le(I), [N] = Le({
    i: (E, B) => _n(E, B, $),
    o: {}
  }, () => Rr(i) ? tt(i, $) : {}), [Q, se] = Le({
    i: (E, B) => Xt(E.D, B.D) && Xt(E.M, B.M),
    o: ho()
  }), ne = Ft(So), fe = (E, B) => `${B ? zr : qr}${Ar(E)}`, Y = (E) => {
    const B = (M) => [ot, it, wt].map((W) => fe(W, M)), P = B(!0).concat(B()).join(" ");
    _(P), _(Ue(E).map((M) => fe(E[M], M === "x")).join(" "), !0);
  };
  return ({ It: E, Zt: B, _n: P, Dt: M }, { fn: W }) => {
    const { ft: j, Ht: K, Ct: te, dt: ie, zt: ye } = B || {}, pe = ne && ne.V(t, e, P, n, E), { W: Ce, X: ee, J: be } = pe || {}, [Ae, Ee] = ll(E, n), [xe, we] = E("overflow"), he = kt(xe.x), _e = kt(xe.y);
    let ce = q(M), Se = w(M), Me = L(M), Et = S(M);
    Ee && p && _(ko, !Ae);
    {
      ss(r, rt, Jt) && D(!0);
      const [fs] = ee ? ee() : [], [Nt] = ce = F(M), [Pt] = Se = O(M), zt = fo(i), qt = m && Hr(v()), er = {
        w: g(Pt.w + Nt.w),
        h: g(Pt.h + Nt.h)
      }, _s = {
        w: g((qt ? qt.w : zt.w + g(zt.w - Pt.w)) + Nt.w),
        h: g((qt ? qt.h : zt.h + g(zt.h - Pt.h)) + Nt.h)
      };
      fs && fs(), Et = R(_s), Me = y(V(er, _s), M);
    }
    const [It, gn] = Et, [at, Ht] = Me, [bn, wn] = Se, [yn, vs] = ce, [Ne, kn] = k({
      x: at.w > 0,
      y: at.h > 0
    }), Rt = he && _e && (Ne.x || Ne.y) || he && Ne.x && !Ne.y || _e && Ne.y && !Ne.x, vt = al(Ne, xe), [Bt, ft] = U(vt.k), [Tt, Ut] = N(M), Mt = te || ie || Ut || kn || M, [Jo, Qo] = Mt ? Q(C(Tt), M) : se();
    return ft && Y(vt.k), be && Ce && Lt(i, be(vt, P, Ce(vt, bn, yn))), D(!1), rn(r, rt, Jt, Rt), rn(s, qn, Jt, Rt), oe(e, {
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
  }, { vt: i, gt: c, L: u, Ot: a } = e, { P: d, T: _ } = Ke(), v = !d && (_.x || _.y), p = [kl(e), xl(e, s), Sl(e, s)];
  return [n, (m) => {
    const g = {}, $ = v && Fe(c), T = $ && a();
    return ae(p, (I) => {
      oe(g, I(m, g) || {});
    }), qe(c, $), T && T(), !u && qe(i, 0), g;
  }, s, e, r];
}, Cl = (t, e, n, r, s) => {
  let i = !1;
  const c = Vs(e, {}), [u, a, d, _, v] = $l(t), [p, m, g] = ml(_, d, c, (C) => {
    D({}, C);
  }), [x, $, , T] = wl(t, e, g, d, _, s), I = (C) => Ue(C).some((V) => !!C[V]), D = (C, V) => {
    if (n())
      return !1;
    const { vn: F, Dt: q, At: O, hn: w } = C, y = F || {}, L = !!q || !i, k = {
      It: Vs(e, y, L),
      vn: y,
      Dt: L
    };
    if (w)
      return $(k), !1;
    const R = V || m(oe({}, k, {
      At: O
    })), S = a(oe({}, k, {
      _n: g,
      Zt: R
    }));
    $(oe({}, k, {
      Zt: R,
      tn: S
    }));
    const U = I(R), N = I(S), Q = U || N || !es(y) || L;
    return i = !0, Q && r(C, {
      Zt: R,
      tn: S
    }), Q;
  };
  return [() => {
    const { an: C, gt: V, Ot: F } = _, q = Fe(C), O = [p(), u(), x()], w = F();
    return qe(V, q), w(), X(Ie, O);
  }, D, () => ({
    gn: g,
    bn: d
  }), {
    wn: _,
    yn: T
  }, v];
}, is = /* @__PURE__ */ new WeakMap(), El = (t, e) => {
  is.set(t, e);
}, Tl = (t) => {
  is.delete(t);
}, Ao = (t) => is.get(t), We = (t, e, n) => {
  const { nt: r } = Ke(), s = on(t), i = s ? t : t.target, c = Ao(i);
  if (e && !c) {
    let u = !1;
    const a = [], d = {}, _ = (y) => {
      const L = no(y), k = Ft(Nr);
      return k ? k(L, !0) : L;
    }, v = oe({}, r(), _(e)), [p, m, g] = zn(), [x, $, T] = zn(n), I = (y, L) => {
      T(y, L), g(y, L);
    }, [D, C, V, F, q] = Cl(t, v, () => u, ({ vn: y, Dt: L }, { Zt: k, tn: R }) => {
      const { ft: S, Ct: U, xt: N, Ht: Q, Et: se, dt: ne } = k, { nn: fe, sn: Y, en: E, cn: B } = R;
      I("updated", [w, {
        updateHints: {
          sizeChanged: !!S,
          directionChanged: !!U,
          heightIntrinsicChanged: !!N,
          overflowEdgeChanged: !!fe,
          overflowAmountChanged: !!Y,
          overflowStyleChanged: !!E,
          scrollCoordinatesChanged: !!B,
          contentMutation: !!Q,
          hostMutation: !!se,
          appear: !!ne
        },
        changedOptions: y || {},
        force: !!L
      }]);
    }, (y) => I("scroll", [w, y])), O = (y) => {
      Tl(i), Ie(a), u = !0, I("destroyed", [w, y]), m(), $();
    }, w = {
      options(y, L) {
        if (y) {
          const k = L ? r() : {}, R = $o(v, oe(k, _(y)));
          es(R) || (oe(v, R), C({
            vn: R
          }));
        }
        return oe({}, v);
      },
      on: x,
      off: (y, L) => {
        y && L && $(y, L);
      },
      state() {
        const { gn: y, bn: L } = V(), { F: k } = y, { Vt: R, Rt: S, k: U, rn: N, ln: Q, dn: se, Lt: ne } = L;
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
          directionRTL: k,
          destroyed: u
        });
      },
      elements() {
        const { vt: y, ht: L, ln: k, U: R, bt: S, gt: U, Qt: N } = F.wn, { Yt: Q, Gt: se } = F.yn, ne = (Y) => {
          const { Pt: E, Ut: B, Tt: P } = Y;
          return {
            scrollbar: P,
            track: B,
            handle: E
          };
        }, fe = (Y) => {
          const { Wt: E, Xt: B } = Y, P = ne(E[0]);
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
          target: y,
          host: L,
          padding: k || R,
          viewport: R,
          content: S || R,
          scrollOffsetElement: U,
          scrollEventElement: N,
          scrollbarHorizontal: fe(Q),
          scrollbarVertical: fe(se)
        });
      },
      update: (y) => C({
        Dt: y,
        At: !0
      }),
      destroy: X(O, !1),
      plugin: (y) => d[Ue(y)[0]]
    };
    return me(a, [q]), El(i, w), wo(go, We, [w, p, d]), hl(F.wn.wt, !s && t.cancel) ? (O(!0), w) : (me(a, D()), I("initialized", [w]), w.update(), w);
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
  const { N: t, T: e, P: n, G: r, st: s, et: i, Z: c, tt: u, nt: a, ot: d } = Ke();
  return oe({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: e,
    scrollbarsHiding: n,
    scrollTimeline: r,
    staticDefaultInitialization: s,
    staticDefaultOptions: i,
    getDefaultInitialization: c,
    setDefaultInitialization: u,
    getDefaultOptions: a,
    setDefaultOptions: d
  });
};
We.nonce = ul;
function Ml() {
  let t;
  const e = A(null), n = Math.floor(Math.random() * 2 ** 32), r = A(!1), s = A([]), i = () => s.value, c = () => t.getSelection(), u = () => s.value.length, a = () => t.clearSelection(!0), d = A(), _ = A(null), v = A(null), p = A(null), m = A(null);
  function g() {
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
        const O = e.value.offsetWidth - F.offsetX, w = e.value.offsetHeight - F.offsetY;
        O < 15 && w < 15 && t.Interaction._reset(F), F.target.classList.contains("os-scrollbar-handle") && t.Interaction._reset(F);
      }
    }), document.addEventListener("dragleave", (V) => {
      !V.buttons && r.value && (r.value = !1);
    });
  }
  const x = () => ct(() => {
    t.addSelection(
      t.getSelectables()
    ), $();
  }), $ = () => {
    s.value = t.getSelection().map((V) => JSON.parse(V.dataset.item)), d.value(s.value);
  }, T = () => ct(() => {
    const V = i().map((F) => F.path);
    a(), t.setSettings({
      selectables: document.getElementsByClassName("vf-item-" + n)
    }), t.addSelection(
      t.getSelectables().filter((F) => V.includes(JSON.parse(F.dataset.item).path))
    ), $(), D();
  }), I = (V) => {
    d.value = V, t.subscribe("DS:end", ({ items: F, event: q, isDragging: O }) => {
      s.value = F.map((w) => JSON.parse(w.dataset.item)), V(F.map((w) => JSON.parse(w.dataset.item)));
    });
  }, D = () => {
    _.value && (e.value.getBoundingClientRect().height < e.value.scrollHeight ? (v.value.style.height = e.value.scrollHeight + "px", v.value.style.display = "block") : (v.value.style.height = "100%", v.value.style.display = "none"));
  }, C = (V) => {
    if (!_.value)
      return;
    const { scrollOffsetElement: F } = _.value.elements();
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
        _.value = V;
      },
      scroll: (V, F) => {
        const { scrollOffsetElement: q } = V.elements();
        e.value.scrollTo({
          top: q.scrollTop,
          left: 0
        });
      }
    }), g(), D(), m.value = new ResizeObserver(D), m.value.observe(e.value), e.value.addEventListener("scroll", C), t.subscribe("DS:scroll", ({ isDragging: V }) => V || C());
  }), Kn(() => {
    t && t.stop(), m.value && m.value.disconnect();
  }), Is(() => {
    t && t.Area.reset();
  }), {
    area: e,
    explorerId: n,
    isDraggingRef: r,
    scrollBar: v,
    scrollBarContainer: p,
    getSelected: i,
    getSelection: c,
    selectAll: x,
    clearSelection: a,
    refreshSelection: T,
    getCount: u,
    onSelect: I
  };
}
function Al(t, e) {
  const n = A(t), r = A(e), s = A([]), i = A([]), c = A([]), u = A(!1), a = A(5);
  let d = !1, _ = !1;
  const v = xt({
    adapter: n,
    storages: [],
    dirname: r,
    files: []
  });
  function p() {
    let I = [], D = [], C = r.value ?? n.value + "://";
    C.length === 0 && (s.value = []), C.replace(n.value + "://", "").split("/").forEach(function(q) {
      I.push(q), I.join("/") !== "" && D.push({
        basename: q,
        name: q,
        path: n.value + "://" + I.join("/"),
        type: "dir"
      });
    }), i.value = D;
    const [V, F] = g(D, a.value);
    c.value = F, s.value = V;
  }
  function m(I) {
    a.value = I, p();
  }
  function g(I, D) {
    return I.length > D ? [I.slice(-D), I.slice(0, -D)] : [I, []];
  }
  function x(I = null) {
    u.value = I ?? !u.value;
  }
  function $() {
    return s.value && s.value.length && !0;
  }
  const T = bt(() => {
    var I;
    return ((I = s.value[s.value.length - 2]) == null ? void 0 : I.path) ?? n.value + "://";
  });
  return $e(() => {
  }), De(r, p), $e(p), {
    adapter: n,
    path: r,
    loading: d,
    searchMode: _,
    data: v,
    breadcrumbs: s,
    breadcrumbItems: i,
    limitBreadcrumbItems: m,
    hiddenBreadcrumbs: c,
    showHiddenBreadcrumbs: u,
    toggleHiddenBreadcrumbs: x,
    isGoUpAvailable: $,
    parentFolderPath: T
  };
}
const Dl = (t, e) => {
  const n = br(t.id), r = ur(), s = n.getStore("metricUnits", !1), i = $r(n, t.theme), c = e.i18n, u = t.locale ?? e.locale, a = (m) => Array.isArray(m) ? m : kr, d = n.getStore("persist-path", t.persist), _ = d ? n.getStore("path", t.path) : t.path, v = d ? n.getStore("adapter") : null, p = Ml();
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
    features: a(t.features),
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
    theme: i,
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
    fs: Al(v, _)
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
    }), (r, s) => (f(), h("div", {
      class: "vuefinder__modal-layout",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: s[1] || (s[1] = St((i) => o(n).modal.close(), ["esc"])),
      tabindex: "0"
    }, [
      s[2] || (s[2] = l("div", { class: "vuefinder__modal-layout__overlay" }, null, -1)),
      l("div", Vl, [
        l("div", {
          class: "vuefinder__modal-layout__wrapper",
          onMousedown: s[0] || (s[0] = et((i) => o(n).modal.close(), ["self"]))
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
    const r = re("ServiceContainer"), s = A(!1), { t: i } = r.i18n;
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
      t: i
    };
  }
}, Il = { key: 1 };
function Hl(t, e, n, r, s, i) {
  return f(), h("div", {
    class: le(["vuefinder__action-message", { "vuefinder__action-message--hidden": !r.shown }])
  }, [
    t.$slots.default ? At(t.$slots, "default", { key: 0 }) : (f(), h("span", Il, b(r.t("Saved.")), 1))
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
  return f(), h("svg", Rl, e[0] || (e[0] = [
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
    return (e, n) => (f(), h("div", Nl, [
      l("div", Pl, [
        (f(), G(Hs(t.icon), { class: "vuefinder__modal-header__icon" }))
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
    const e = re("ServiceContainer"), { setStore: n, clearStore: r } = e.storage, { t: s } = e.i18n, i = {
      ABOUT: "about",
      SETTINGS: "settings",
      SHORTCUTS: "shortcuts",
      RESET: "reset"
    }, c = bt(() => [
      { name: s("About"), key: i.ABOUT },
      { name: s("Settings"), key: i.SETTINGS },
      { name: s("Shortcuts"), key: i.SHORTCUTS },
      { name: s("Reset"), key: i.RESET }
    ]), u = A("about"), a = async () => {
      r(), location.reload();
    }, d = (I) => {
      e.theme.set(I), e.emitter.emit("vf-theme-saved");
    }, _ = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? Ns : Us, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, v = () => {
      e.compactListView = !e.compactListView, n("compactListView", e.compactListView), e.emitter.emit("vf-compact-view-saved");
    }, p = () => {
      e.showThumbnails = !e.showThumbnails, n("show-thumbnails", e.showThumbnails), e.emitter.emit("vf-show-thumbnails-saved");
    }, m = () => {
      e.persist = !e.persist, n("persist-path", e.persist), e.emitter.emit("vf-persist-path-saved");
    }, { i18n: g } = re("VueFinderOptions"), $ = Object.fromEntries(
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
      }).filter(([I]) => Object.keys(g).includes(I))
    ), T = bt(() => ({
      system: s("System"),
      light: s("Light"),
      dark: s("Dark")
    }));
    return (I, D) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: D[7] || (D[7] = (C) => o(e).modal.close()),
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
                  (f(!0), h(ge, null, ke(c.value, (C) => (f(), h("button", {
                    key: C.name,
                    onClick: (V) => u.value = C.key,
                    class: le([C.key === u.value ? "vuefinder__about-modal__tab--active" : "vuefinder__about-modal__tab--inactive", "vuefinder__about-modal__tab"]),
                    "aria-current": C.current ? "page" : void 0
                  }, b(C.name), 11, Wl))), 128))
                ])
              ])
            ]),
            u.value === i.ABOUT ? (f(), h("div", Kl, [
              l("div", Yl, b(o(s)("Vuefinder is a simple, lightweight, and fast file manager library for Vue.js applications")), 1),
              l("a", Xl, b(o(s)("Project home")), 1),
              l("a", Zl, b(o(s)("Follow on GitHub")), 1)
            ])) : H("", !0),
            u.value === i.SETTINGS ? (f(), h("div", Jl, [
              l("div", Ql, b(o(s)("Customize your experience with the following settings")), 1),
              l("div", ea, [
                l("fieldset", null, [
                  l("div", ta, [
                    l("div", na, [
                      ue(l("input", {
                        id: "metric_unit",
                        name: "metric_unit",
                        type: "checkbox",
                        "onUpdate:modelValue": D[0] || (D[0] = (C) => o(e).metricUnits = C),
                        onClick: _,
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
                        "onUpdate:modelValue": D[1] || (D[1] = (C) => o(e).compactListView = C),
                        onClick: v,
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
                        "onUpdate:modelValue": D[2] || (D[2] = (C) => o(e).persist = C),
                        onClick: m,
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
                        "onUpdate:modelValue": D[3] || (D[3] = (C) => o(e).showThumbnails = C),
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
                        "onUpdate:modelValue": D[4] || (D[4] = (C) => o(e).theme.value = C),
                        onChange: D[5] || (D[5] = (C) => d(C.target.value)),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: o(s)("Theme")
                        }, [
                          (f(!0), h(ge, null, ke(T.value, (C, V) => (f(), h("option", { value: V }, b(C), 9, ka))), 256))
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
                  o(e).features.includes(o(de).LANGUAGE) && Object.keys(o($)).length > 1 ? (f(), h("div", xa, [
                    l("div", Sa, [
                      l("label", $a, b(o(s)("Language")), 1)
                    ]),
                    l("div", Ca, [
                      ue(l("select", {
                        id: "language",
                        "onUpdate:modelValue": D[6] || (D[6] = (C) => o(e).i18n.locale = C),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: o(s)("Language")
                        }, [
                          (f(!0), h(ge, null, ke(o($), (C, V) => (f(), h("option", { value: V }, b(C), 9, Ta))), 256))
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
            u.value === i.SHORTCUTS ? (f(), h("div", Ma, [
              l("div", Aa, [
                l("div", Da, [
                  l("div", null, b(o(s)("Rename")), 1),
                  D[8] || (D[8] = l("kbd", null, "F2", -1))
                ]),
                l("div", Va, [
                  l("div", null, b(o(s)("Refresh")), 1),
                  D[9] || (D[9] = l("kbd", null, "F5", -1))
                ]),
                l("div", La, [
                  Z(b(o(s)("Delete")) + " ", 1),
                  D[10] || (D[10] = l("kbd", null, "Del", -1))
                ]),
                l("div", Oa, [
                  Z(b(o(s)("Escape")) + " ", 1),
                  D[11] || (D[11] = l("div", null, [
                    l("kbd", null, "Esc")
                  ], -1))
                ]),
                l("div", Fa, [
                  Z(b(o(s)("Select All")) + " ", 1),
                  D[12] || (D[12] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "A")
                  ], -1))
                ]),
                l("div", Ia, [
                  Z(b(o(s)("Search")) + " ", 1),
                  D[13] || (D[13] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "F")
                  ], -1))
                ]),
                l("div", Ha, [
                  Z(b(o(s)("Toggle Sidebar")) + " ", 1),
                  D[14] || (D[14] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "E")
                  ], -1))
                ]),
                l("div", Ra, [
                  Z(b(o(s)("Open Settings")) + " ", 1),
                  D[15] || (D[15] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, ",")
                  ], -1))
                ]),
                l("div", Ba, [
                  Z(b(o(s)("Toggle Full Screen")) + " ", 1),
                  D[16] || (D[16] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "Enter")
                  ], -1))
                ])
              ])
            ])) : H("", !0),
            u.value === i.RESET ? (f(), h("div", Ua, [
              l("div", Na, b(o(s)("Reset all settings to default")), 1),
              l("button", {
                onClick: a,
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
    const n = e, r = re("ServiceContainer"), { t: s } = r.i18n, i = A(!1), c = A(null), u = A((d = c.value) == null ? void 0 : d.strMessage);
    De(u, () => i.value = !1);
    const a = () => {
      n("hidden"), i.value = !0;
    };
    return (_, v) => (f(), h("div", null, [
      i.value ? H("", !0) : (f(), h("div", {
        key: 0,
        ref_key: "strMessage",
        ref: c,
        class: le(["vuefinder__message", t.error ? "vuefinder__message--error" : "vuefinder__message--success"])
      }, [
        At(_.$slots, "default"),
        l("div", {
          class: "vuefinder__message__close",
          onClick: a,
          title: o(s)("Close")
        }, v[0] || (v[0] = [
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
  return f(), h("svg", za, e[0] || (e[0] = [
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(e.modal.data.items), s = A(""), i = () => {
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
    return (c, u) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-danger"
        }, b(o(n)("Yes, Delete!")), 1),
        l("button", {
          type: "button",
          onClick: u[1] || (u[1] = (a) => o(e).modal.close()),
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
                (f(!0), h(ge, null, ke(r.value, (a) => (f(), h("p", Ya, [
                  a.type === "dir" ? (f(), h("svg", Xa, u[2] || (u[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), h("svg", Za, u[3] || (u[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", Ja, b(a.basename), 1)
                ]))), 256))
              ]),
              s.value.length ? (f(), G(Xe, {
                key: 0,
                onHidden: u[0] || (u[0] = (a) => s.value = ""),
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
  return f(), h("svg", ei, e[0] || (e[0] = [
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(e.modal.data.items[0]), s = A(e.modal.data.items[0].basename), i = A(""), c = () => {
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
          i.value = n(u.message);
        }
      });
    };
    return (u, a) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Rename")), 1),
        l("button", {
          type: "button",
          onClick: a[2] || (a[2] = (d) => o(e).modal.close()),
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
                r.value.type === "dir" ? (f(), h("svg", ri, a[3] || (a[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (f(), h("svg", li, a[4] || (a[4] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", ai, b(r.value.basename), 1)
              ]),
              ue(l("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (d) => s.value = d),
                onKeyup: St(c, ["enter"]),
                class: "vuefinder__rename-modal__input",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [$t, s.value]
              ]),
              i.value.length ? (f(), G(Xe, {
                key: 0,
                onHidden: a[1] || (a[1] = (d) => i.value = ""),
                error: ""
              }, {
                default: J(() => [
                  Z(b(i.value), 1)
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
  return f(), h("svg", ci, e[0] || (e[0] = [
    l("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1)
  ]));
}
const Fo = { render: di }, ui = { class: "vuefinder__new-folder-modal__content" }, vi = { class: "vuefinder__new-folder-modal__form" }, fi = { class: "vuefinder__new-folder-modal__description" }, _i = ["placeholder"], Io = {
  __name: "ModalNewFolder",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, r = A(""), s = A(""), i = () => {
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
    return (c, u) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        l("button", {
          type: "button",
          onClick: u[2] || (u[2] = (a) => o(e).modal.close()),
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
                "onUpdate:modelValue": u[0] || (u[0] = (a) => r.value = a),
                onKeyup: St(i, ["enter"]),
                class: "vuefinder__new-folder-modal__input",
                placeholder: o(n)("Folder Name"),
                type: "text"
              }, null, 40, _i), [
                [$t, r.value]
              ]),
              s.value.length ? (f(), G(Xe, {
                key: 0,
                onHidden: u[1] || (u[1] = (a) => s.value = ""),
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
  return f(), h("svg", mi, e[0] || (e[0] = [
    l("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1)
  ]));
}
const Ho = { render: pi }, hi = { class: "vuefinder__new-file-modal__content" }, gi = { class: "vuefinder__new-file-modal__form" }, bi = { class: "vuefinder__new-file-modal__description" }, wi = ["placeholder"], yi = {
  __name: "ModalNewFile",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, r = A(""), s = A(""), i = () => {
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
    return (c, u) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        l("button", {
          type: "button",
          onClick: u[2] || (u[2] = (a) => o(e).modal.close()),
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
                "onUpdate:modelValue": u[0] || (u[0] = (a) => r.value = a),
                onKeyup: St(i, ["enter"]),
                class: "vuefinder__new-file-modal__input",
                placeholder: o(n)("File Name"),
                type: "text"
              }, null, 40, wi), [
                [$t, r.value]
              ]),
              s.value.length ? (f(), G(Xe, {
                key: 0,
                onHidden: u[1] || (u[1] = (a) => s.value = ""),
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
  return f(), h("svg", ki, e[0] || (e[0] = [
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
    }, i = A({ QUEUE_ENTRY_STATUS: s }), c = A(null), u = A(null), a = A(null), d = A(null), _ = A(null), v = A(null), p = A([]), m = A(""), g = A(!1), x = A(!1);
    let $;
    function T(k) {
      return p.value.findIndex((R) => R.id === k);
    }
    function I(k, R = null) {
      R = R ?? (k.webkitRelativePath || k.name), $.addFile({
        name: R,
        type: k.type,
        data: k,
        source: "Local"
      });
    }
    function D(k) {
      switch (k.status) {
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
    const C = (k) => {
      switch (k.status) {
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
      if (!g.value) {
        if (!p.value.filter((k) => k.status !== s.DONE).length) {
          m.value = n("Please select file to upload first.");
          return;
        }
        m.value = "", $.retryAll(), $.upload();
      }
    }
    function q() {
      $.cancelAll({ reason: "user" }), p.value.forEach((k) => {
        k.status !== s.DONE && (k.status = s.CANCELED, k.statusName = n("Canceled"));
      }), g.value = !1;
    }
    function O(k) {
      g.value || ($.removeFile(k.id, "removed-by-user"), p.value.splice(T(k.id), 1));
    }
    function w(k) {
      if (!g.value) {
        if ($.cancelAll({ reason: "user" }), k) {
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
    function y() {
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
            const Q = T(S.id);
            p.value[Q].status === s.PENDING && (m.value = $.i18n("noDuplicates", { fileName: S.name })), p.value = p.value.filter((se) => se.id !== S.id);
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
        const N = p.value[T(S.id)];
        O(N), m.value = U.message;
      }), $.on("upload", () => {
        const S = L();
        $.setMeta({ ...S.body });
        const U = $.getPlugin("XHRUpload");
        U.opts.method = S.method, U.opts.endpoint = S.url + "?" + new URLSearchParams(S.params), U.opts.headers = S.headers, delete S.headers["Content-Type"], g.value = !0, p.value.forEach((N) => {
          N.status !== s.DONE && (N.percent = null, N.status = s.UPLOADING, N.statusName = n("Pending upload"));
        });
      }), $.on("upload-progress", (S, U) => {
        const N = Math.floor(U.bytesUploaded / U.bytesTotal * 100);
        p.value[T(S.id)].percent = `${N}%`;
      }), $.on("upload-success", (S) => {
        const U = p.value[T(S.id)];
        U.status = s.DONE, U.statusName = n("Done");
      }), $.on("upload-error", (S, U) => {
        const N = p.value[T(S.id)];
        N.percent = null, N.status = s.ERROR, U.isNetworkError ? N.statusName = n("Network Error, Unable establish connection to the server or interrupted.") : N.statusName = U ? U.message : n("Unknown Error");
      }), $.on("error", (S) => {
        m.value = S.message, g.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), $.on("complete", () => {
        g.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), d.value.addEventListener("click", () => {
        u.value.click();
      }), _.value.addEventListener("click", () => {
        a.value.click();
      }), v.value.addEventListener("dragover", (S) => {
        S.preventDefault(), x.value = !0;
      }), v.value.addEventListener("dragleave", (S) => {
        S.preventDefault(), x.value = !1;
      });
      function k(S, U) {
        U.isFile && U.file((N) => S(U, N)), U.isDirectory && U.createReader().readEntries((N) => {
          N.forEach((Q) => {
            k(S, Q);
          });
        });
      }
      v.value.addEventListener("drop", (S) => {
        S.preventDefault(), x.value = !1;
        const U = /^[/\\](.+)/;
        [...S.dataTransfer.items].forEach((N) => {
          N.kind === "file" && k((Q, se) => {
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
      u.value.addEventListener("change", R), a.value.addEventListener("change", R);
    }), Rs(() => {
      $ == null || $.close({ reason: "unmount" });
    }), (k, R) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: g.value,
          onClick: et(F, ["prevent"])
        }, b(o(n)("Upload")), 9, Hi),
        g.value ? (f(), h("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: et(q, ["prevent"])
        }, b(o(n)("Cancel")), 1)) : (f(), h("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: et(y, ["prevent"])
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
              ref: v,
              onClick: V
            }, [
              x.value ? (f(), h("div", $i, b(o(n)("Release to drop these files.")), 1)) : (f(), h("div", Ci, b(o(n)("Drag and drop the files/folders to here or click here.")), 1))
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
                ref: _,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(n)("Select Folders")), 513),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: g.value,
                onClick: R[0] || (R[0] = (S) => w(!1))
              }, b(o(n)("Clear all")), 9, Ei),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: g.value,
                onClick: R[1] || (R[1] = (S) => w(!0))
              }, b(o(n)("Clear only successful")), 9, Ti)
            ], 512),
            l("div", Mi, [
              (f(!0), h(ge, null, ke(p.value, (S) => (f(), h("div", {
                class: "vuefinder__upload-modal__file-entry",
                key: S.id
              }, [
                l("span", {
                  class: le(["vuefinder__upload-modal__file-icon", D(S)])
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
                    class: le(["vuefinder__upload-modal__file-status", D(S)])
                  }, [
                    Z(b(S.statusName) + " ", 1),
                    S.status === i.value.QUEUE_ENTRY_STATUS.UPLOADING ? (f(), h("b", Oi, b(S.percent), 1)) : H("", !0)
                  ], 2)
                ]),
                l("button", {
                  type: "button",
                  class: le(["vuefinder__upload-modal__file-remove", g.value ? "disabled" : ""]),
                  title: o(n)("Delete"),
                  disabled: g.value,
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
              p.value.length ? H("", !0) : (f(), h("div", Ii, b(o(n)("No files selected!")), 1))
            ]),
            m.value.length ? (f(), G(Xe, {
              key: 0,
              onHidden: R[2] || (R[2] = (S) => m.value = ""),
              error: ""
            }, {
              default: J(() => [
                Z(b(m.value), 1)
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
          ref: a,
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
  return f(), h("svg", Bi, e[0] || (e[0] = [
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(e.modal.data.items[0]), s = A(""), i = A([]), c = () => {
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
    return (u, a) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Unarchive")), 1),
        l("button", {
          type: "button",
          onClick: a[1] || (a[1] = (d) => o(e).modal.close()),
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
              (f(!0), h(ge, null, ke(i.value, (d) => (f(), h("p", zi, [
                d.type === "dir" ? (f(), h("svg", qi, a[2] || (a[2] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (f(), h("svg", ji, a[3] || (a[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", Gi, b(d.basename), 1)
              ]))), 256)),
              l("p", Wi, b(o(n)("The archive will be unarchived at")) + " (" + b(o(e).fs.data.dirname) + ")", 1),
              s.value.length ? (f(), G(Xe, {
                key: 0,
                onHidden: a[0] || (a[0] = (d) => s.value = ""),
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
  return f(), h("svg", Ki, e[0] || (e[0] = [
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(""), s = A(""), i = A(e.modal.data.items), c = () => {
      i.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: i.value.map(({ path: u, type: a }) => ({ path: u, type: a })),
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
    return (u, a) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Archive")), 1),
        l("button", {
          type: "button",
          onClick: a[2] || (a[2] = (d) => o(e).modal.close()),
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
                (f(!0), h(ge, null, ke(i.value, (d) => (f(), h("p", Qi, [
                  d.type === "dir" ? (f(), h("svg", ec, a[3] || (a[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), h("svg", tc, a[4] || (a[4] = [
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
                "onUpdate:modelValue": a[0] || (a[0] = (d) => r.value = d),
                onKeyup: St(c, ["enter"]),
                class: "vuefinder__archive-modal__input",
                placeholder: o(n)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, sc), [
                [$t, r.value]
              ]),
              s.value.length ? (f(), G(Xe, {
                key: 0,
                onHidden: a[1] || (a[1] = (d) => s.value = ""),
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
  return f(), h("svg", oc, e[0] || (e[0] = [
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
  return f(), h("svg", lc, e[0] || (e[0] = [
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
  return f(), h("svg", cc, e[0] || (e[0] = [
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
  return f(), h("svg", vc, e[0] || (e[0] = [
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
  return f(), h("svg", mc, e[0] || (e[0] = [
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
    const e = re("ServiceContainer"), { setStore: n } = e.storage, { t: r } = e.i18n, s = e.dragSelect, i = A("");
    e.emitter.on("vf-search-query", ({ newQuery: a }) => {
      i.value = a;
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
    return (a, d) => (f(), h("div", gc, [
      i.value.length ? (f(), h("div", Ec, [
        l("div", Tc, [
          Z(b(o(r)("Search results for")) + " ", 1),
          l("span", Mc, b(i.value), 1)
        ]),
        o(e).loadingIndicator === "circular" && o(e).fs.loading ? (f(), G(o(us), { key: 0 })) : H("", !0)
      ])) : (f(), h("div", bc, [
        o(e).features.includes(o(de).NEW_FOLDER) ? (f(), h("div", {
          key: 0,
          class: "mx-1.5",
          title: o(r)("New Folder"),
          onClick: d[0] || (d[0] = (_) => o(e).modal.open(Io, { items: o(s).getSelected() }))
        }, [
          z(o(Fo))
        ], 8, wc)) : H("", !0),
        o(e).features.includes(o(de).NEW_FILE) ? (f(), h("div", {
          key: 1,
          class: "mx-1.5",
          title: o(r)("New File"),
          onClick: d[1] || (d[1] = (_) => o(e).modal.open(yi, { items: o(s).getSelected() }))
        }, [
          z(o(Ho))
        ], 8, yc)) : H("", !0),
        o(e).features.includes(o(de).RENAME) ? (f(), h("div", {
          key: 2,
          class: "mx-1.5",
          title: o(r)("Rename"),
          onClick: d[2] || (d[2] = (_) => o(s).getCount() !== 1 || o(e).modal.open(ds, { items: o(s).getSelected() }))
        }, [
          z(o(Oo), {
            class: le(o(s).getCount() === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, kc)) : H("", !0),
        o(e).features.includes(o(de).DELETE) ? (f(), h("div", {
          key: 3,
          class: "mx-1.5",
          title: o(r)("Delete"),
          onClick: d[3] || (d[3] = (_) => !o(s).getCount() || o(e).modal.open(cs, { items: o(s).getSelected() }))
        }, [
          z(o(Lo), {
            class: le(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, xc)) : H("", !0),
        o(e).features.includes(o(de).UPLOAD) ? (f(), h("div", {
          key: 4,
          class: "mx-1.5",
          title: o(r)("Upload"),
          onClick: d[4] || (d[4] = (_) => o(e).modal.open(Ri, { items: o(s).getSelected() }))
        }, [
          z(o(Ro))
        ], 8, Sc)) : H("", !0),
        o(e).features.includes(o(de).UNARCHIVE) && o(s).getCount() === 1 && o(s).getSelected()[0].mime_type === "application/zip" ? (f(), h("div", {
          key: 5,
          class: "mx-1.5",
          title: o(r)("Unarchive"),
          onClick: d[5] || (d[5] = (_) => !o(s).getCount() || o(e).modal.open(Uo, { items: o(s).getSelected() }))
        }, [
          z(o(Bo), {
            class: le(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, $c)) : H("", !0),
        o(e).features.includes(o(de).ARCHIVE) ? (f(), h("div", {
          key: 6,
          class: "mx-1.5",
          title: o(r)("Archive"),
          onClick: d[6] || (d[6] = (_) => !o(s).getCount() || o(e).modal.open(Po, { items: o(s).getSelected() }))
        }, [
          z(o(No), {
            class: le(o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Cc)) : H("", !0)
      ])),
      l("div", Ac, [
        o(e).features.includes(o(de).FULL_SCREEN) ? (f(), h("div", {
          key: 0,
          onClick: c,
          class: "mx-1.5",
          title: o(r)("Toggle Full Screen")
        }, [
          o(e).fullScreen ? (f(), G(o(uc), { key: 0 })) : (f(), G(o(ic), { key: 1 }))
        ], 8, Dc)) : H("", !0),
        l("div", {
          class: "mx-1.5",
          title: o(r)("Change View"),
          onClick: d[7] || (d[7] = (_) => i.value.length || u())
        }, [
          o(e).view === "grid" ? (f(), G(o(_c), {
            key: 0,
            class: le(["vf-toolbar-icon", i.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : H("", !0),
          o(e).view === "list" ? (f(), G(o(hc), {
            key: 1,
            class: le(["vf-toolbar-icon", i.value.length ? "vf-toolbar-icon-disabled" : ""])
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
  return or((s, i) => ({
    get() {
      return s(), r.value;
    },
    set: Oc(
      (c) => {
        r.value = c, i();
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
  return f(), h("svg", Fc, e[0] || (e[0] = [
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(e.modal.data.items.from), s = A(""), i = () => {
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
    return (c, u) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Yes, Move!")), 1),
        l("button", {
          type: "button",
          onClick: u[1] || (u[1] = (a) => o(e).modal.close()),
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
              (f(!0), h(ge, null, ke(r.value, (a) => (f(), h("div", Nc, [
                l("div", null, [
                  a.type === "dir" ? (f(), h("svg", Pc, u[2] || (u[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), h("svg", zc, u[3] || (u[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])))
                ]),
                l("div", qc, b(a.path), 1)
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
            s.value.length ? (f(), G(Xe, {
              key: 0,
              onHidden: u[0] || (u[0] = (a) => s.value = ""),
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
  return f(), h("svg", Yc, e[0] || (e[0] = [
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
  return f(), h("svg", Jc, e[0] || (e[0] = [
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
  return f(), h("svg", td, e[0] || (e[0] = [
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
  return f(), h("svg", od, e[0] || (e[0] = [
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
  return f(), h("svg", ad, e[0] || (e[0] = [
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
  return f(), h("svg", dd, e[0] || (e[0] = [
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
  return f(), h("svg", fd, e[0] || (e[0] = [
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
  return f(), h("svg", md, e[0] || (e[0] = [
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
  return f(), h("svg", gd, e[0] || (e[0] = [
    l("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1)
  ]));
}
const wd = { render: bd }, yd = { class: "vuefinder__breadcrumb__container" }, kd = ["title"], xd = ["title"], Sd = ["title"], $d = ["title"], Cd = { class: "vuefinder__breadcrumb__list" }, Ed = {
  key: 0,
  class: "vuefinder__breadcrumb__hidden-list"
}, Td = { class: "relative" }, Md = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Ad = { class: "vuefinder__breadcrumb__search-mode" }, Dd = ["placeholder"], Vd = { class: "vuefinder__breadcrumb__hidden-dropdown" }, Ld = ["onDrop", "onClick"], Od = { class: "vuefinder__breadcrumb__hidden-item-content" }, Fd = { class: "vuefinder__breadcrumb__hidden-item-text" }, Id = {
  __name: "Breadcrumb",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = e.dragSelect, { setStore: s } = e.storage, i = A(null), c = Os(0, 100);
    De(c, (O) => {
      const w = i.value.children;
      let y = 0, L = 0, k = 5, R = 1;
      e.fs.limitBreadcrumbItems(k), ct(() => {
        for (let S = w.length - 1; S >= 0 && !(y + w[S].offsetWidth > c.value - 40); S--)
          y += parseInt(w[S].offsetWidth, 10), L++;
        L < R && (L = R), L > k && (L = k), e.fs.limitBreadcrumbItems(L);
      });
    });
    const u = () => {
      c.value = i.value.offsetWidth;
    };
    let a = A(null);
    $e(() => {
      a.value = new ResizeObserver(u), a.value.observe(i.value);
    }), Kn(() => {
      a.value.disconnect();
    });
    const d = (O, w = null) => {
      O.preventDefault(), r.isDraggingRef.value = !1, p(O), w ?? (w = e.fs.hiddenBreadcrumbs.length - 1);
      let y = JSON.parse(O.dataTransfer.getData("items"));
      if (y.find((L) => L.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, {
        items: {
          from: y,
          to: e.fs.hiddenBreadcrumbs[w] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, _ = (O, w = null) => {
      O.preventDefault(), r.isDraggingRef.value = !1, p(O), w ?? (w = e.fs.breadcrumbs.length - 2);
      let y = JSON.parse(O.dataTransfer.getData("items"));
      if (y.find((L) => L.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, {
        items: {
          from: y,
          to: e.fs.breadcrumbs[w] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, v = (O) => {
      O.preventDefault(), e.fs.isGoUpAvailable() ? (O.dataTransfer.dropEffect = "copy", O.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-600")) : (O.dataTransfer.dropEffect = "none", O.dataTransfer.effectAllowed = "none");
    }, p = (O) => {
      O.preventDefault(), O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600"), e.fs.isGoUpAvailable() && O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600");
    }, m = () => {
      F(), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    }, g = () => {
      F(), !e.fs.isGoUpAvailable() || e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.parentFolderPath
        }
      });
    }, x = (O) => {
      e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: O.path } }), e.fs.toggleHiddenBreadcrumbs(!1);
    }, $ = () => {
      e.fs.showHiddenBreadcrumbs && e.fs.toggleHiddenBreadcrumbs(!1);
    }, T = {
      mounted(O, w, y, L) {
        O.clickOutsideEvent = function(k) {
          O === k.target || O.contains(k.target) || w.value();
        }, document.body.addEventListener("click", O.clickOutsideEvent);
      },
      beforeUnmount(O, w, y, L) {
        document.body.removeEventListener("click", O.clickOutsideEvent);
      }
    }, I = () => {
      e.showTreeView = !e.showTreeView;
    };
    De(() => e.showTreeView, (O, w) => {
      O !== w && s("show-tree-view", O);
    });
    const D = A(null), C = () => {
      e.features.includes(de.SEARCH) && (e.fs.searchMode = !0, ct(() => D.value.focus()));
    }, V = Os("", 400);
    De(V, (O) => {
      e.emitter.emit("vf-toast-clear"), e.emitter.emit("vf-search-query", { newQuery: O });
    }), De(() => e.fs.searchMode, (O) => {
      O && ct(() => D.value.focus());
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
    return (O, w) => (f(), h("div", yd, [
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
          onDragover: w[0] || (w[0] = (y) => v(y)),
          onDragleave: w[1] || (w[1] = (y) => p(y)),
          onDrop: w[2] || (w[2] = (y) => _(y)),
          onClick: g,
          class: le(o(e).fs.isGoUpAvailable() ? "vuefinder__breadcrumb__go-up--active" : "vuefinder__breadcrumb__go-up--inactive")
        }, null, 8, ["class"])
      ], 8, xd),
      o(e).fs.loading ? (f(), h("span", {
        key: 1,
        title: o(n)("Cancel")
      }, [
        z(o(sd), {
          onClick: w[3] || (w[3] = (y) => o(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, $d)) : (f(), h("span", {
        key: 0,
        title: o(n)("Refresh")
      }, [
        z(o(Zc), { onClick: m })
      ], 8, Sd)),
      ue(l("div", {
        onClick: et(C, ["self"]),
        class: "group vuefinder__breadcrumb__search-container"
      }, [
        l("div", null, [
          z(o(ld), {
            onDragover: w[4] || (w[4] = (y) => v(y)),
            onDragleave: w[5] || (w[5] = (y) => p(y)),
            onDrop: w[6] || (w[6] = (y) => _(y, -1)),
            onClick: w[7] || (w[7] = (y) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter } }))
          })
        ]),
        l("div", Cd, [
          o(e).fs.hiddenBreadcrumbs.length ? ue((f(), h("div", Ed, [
            w[13] || (w[13] = l("div", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("div", Td, [
              l("span", {
                onDragenter: w[8] || (w[8] = (y) => o(e).fs.toggleHiddenBreadcrumbs(!0)),
                onClick: w[9] || (w[9] = (y) => o(e).fs.toggleHiddenBreadcrumbs()),
                class: "vuefinder__breadcrumb__hidden-toggle"
              }, [
                z(o(wd), { class: "vuefinder__breadcrumb__hidden-toggle-icon" })
              ], 32)
            ])
          ])), [
            [T, $]
          ]) : H("", !0)
        ]),
        l("div", {
          ref_key: "breadcrumbContainer",
          ref: i,
          class: "vuefinder__breadcrumb__visible-list",
          onClick: et(C, ["self"])
        }, [
          (f(!0), h(ge, null, ke(o(e).fs.breadcrumbs, (y, L) => (f(), h("div", { key: L }, [
            w[14] || (w[14] = l("span", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("span", {
              onDragover: (k) => L === o(e).fs.breadcrumbs.length - 1 || v(k),
              onDragleave: (k) => L === o(e).fs.breadcrumbs.length - 1 || p(k),
              onDrop: (k) => L === o(e).fs.breadcrumbs.length - 1 || _(k, L),
              class: "vuefinder__breadcrumb__item",
              title: y.basename,
              onClick: (k) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter, path: y.path } })
            }, b(y.name), 41, Md)
          ]))), 128))
        ], 512),
        o(e).loadingIndicator === "circular" && o(e).fs.loading ? (f(), G(o(us), { key: 0 })) : H("", !0)
      ], 512), [
        [ze, !o(e).fs.searchMode]
      ]),
      ue(l("div", Ad, [
        l("div", null, [
          z(o(cd))
        ]),
        ue(l("input", {
          ref_key: "searchInput",
          ref: D,
          onKeydown: St(F, ["esc"]),
          onBlur: q,
          "onUpdate:modelValue": w[10] || (w[10] = (y) => rr(V) ? V.value = y : null),
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
        (f(!0), h(ge, null, ke(o(e).fs.hiddenBreadcrumbs, (y, L) => (f(), h("div", {
          key: L,
          onDragover: w[11] || (w[11] = (k) => v(k)),
          onDragleave: w[12] || (w[12] = (k) => p(k)),
          onDrop: (k) => d(k, L),
          onClick: (k) => x(y),
          class: "vuefinder__breadcrumb__hidden-item"
        }, [
          l("div", Od, [
            l("span", null, [
              z(o(hn), { class: "vuefinder__breadcrumb__hidden-item-icon" })
            ]),
            w[15] || (w[15] = Z()),
            l("span", Fd, b(y.name), 1)
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
    const e = re("ServiceContainer"), { getStore: n } = e.storage, r = A(n("full-screen", !1)), s = A([]), i = (a) => a === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", c = (a) => {
      s.value.splice(a, 1);
    }, u = (a) => {
      let d = s.value.findIndex((_) => _.id === a);
      d !== -1 && c(d);
    };
    return e.emitter.on("vf-toast-clear", () => {
      s.value = [];
    }), e.emitter.on("vf-toast-push", (a) => {
      let d = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      a.id = d, s.value.push(a), setTimeout(() => {
        u(d);
      }, 5e3);
    }), (a, d) => (f(), h("div", {
      class: le(["vuefinder__toast", r.value.value ? "vuefinder__toast--fixed" : "vuefinder__toast--absolute"])
    }, [
      z(lr, {
        name: "vuefinder__toast-item",
        "enter-active-class": "vuefinder__toast-item--enter-active",
        "leave-active-class": "vuefinder__toast-item--leave-active",
        "leave-to-class": "vuefinder__toast-item--leave-to"
      }, {
        default: J(() => [
          (f(!0), h(ge, null, ke(s.value, (_, v) => (f(), h("div", {
            key: v,
            onClick: (p) => c(v),
            class: le(["vuefinder__toast__message", i(_.type)])
          }, b(_.label), 11, Hd))), 128))
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
  return f(), h("svg", Bd, e[0] || (e[0] = [
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
  return f(), h("svg", Pd, e[0] || (e[0] = [
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
    return (e, n) => (f(), h("div", null, [
      t.direction === "asc" ? (f(), G(o(Nd), { key: 0 })) : H("", !0),
      t.direction === "desc" ? (f(), G(o(qd), { key: 1 })) : H("", !0)
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
  return f(), h("svg", jd, e[0] || (e[0] = [
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
    return (e, n) => (f(), h("span", Kd, [
      t.type === "dir" ? (f(), G(o(hn), {
        key: 0,
        class: le(t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large")
      }, null, 8, ["class"])) : (f(), G(o(Wd), {
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
  return f(), h("svg", Yd, e[0] || (e[0] = [
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
    return (n, r) => (f(), h("div", Jd, [
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
    const n = e, r = A(""), s = A(""), i = A(null), c = A(!1), u = A(""), a = A(!1), d = re("ServiceContainer"), { t: _ } = d.i18n;
    $e(() => {
      d.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: d.modal.data.adapter, path: d.modal.data.item.path },
        responseType: "text"
      }).then((m) => {
        r.value = m, n("success");
      });
    });
    const v = () => {
      c.value = !c.value, s.value = r.value;
    }, p = () => {
      u.value = "", a.value = !1, d.requester.send({
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
      }).then((m) => {
        u.value = _("Updated."), r.value = m, n("success"), c.value = !c.value;
      }).catch((m) => {
        u.value = _(m.message), a.value = !0;
      });
    };
    return (m, g) => (f(), h("div", tu, [
      l("div", nu, [
        l("div", {
          class: "vuefinder__text-preview__title",
          id: "modal-title",
          title: o(d).modal.data.item.path
        }, b(o(d).modal.data.item.basename), 9, su),
        l("div", ou, [
          c.value ? (f(), h("button", {
            key: 0,
            onClick: p,
            class: "vuefinder__text-preview__save-button"
          }, b(o(_)("Save")), 1)) : H("", !0),
          o(d).features.includes(o(de).EDIT) ? (f(), h("button", {
            key: 1,
            class: "vuefinder__text-preview__edit-button",
            onClick: g[0] || (g[0] = (x) => v())
          }, b(c.value ? o(_)("Cancel") : o(_)("Edit")), 1)) : H("", !0)
        ])
      ]),
      l("div", null, [
        c.value ? (f(), h("div", lu, [
          ue(l("textarea", {
            ref_key: "editInput",
            ref: i,
            "onUpdate:modelValue": g[1] || (g[1] = (x) => s.value = x),
            class: "vuefinder__text-preview__textarea",
            name: "text",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [$t, s.value]
          ])
        ])) : (f(), h("pre", ru, b(r.value), 1)),
        u.value.length ? (f(), G(Xe, {
          key: 2,
          onHidden: g[2] || (g[2] = (x) => u.value = ""),
          error: a.value
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
    const n = e, r = re("ServiceContainer"), { t: s } = r.i18n, i = A(null), c = A(null), u = A(!1), a = A(""), d = A(!1), _ = () => {
      u.value = !u.value, u.value ? c.value = new pr(i.value, {
        crop(p) {
        }
      }) : c.value.destroy();
    }, v = () => {
      c.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (p) => {
          a.value = "", d.value = !1;
          const m = new FormData();
          m.set("file", p), r.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: r.modal.data.adapter,
              path: r.modal.data.item.path
            },
            body: m
          }).then((g) => {
            a.value = s("Updated."), i.value.src = r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item), _(), n("success");
          }).catch((g) => {
            a.value = s(g.message), d.value = !0;
          });
        }
      );
    };
    return $e(() => {
      n("success");
    }), (p, m) => (f(), h("div", iu, [
      l("div", cu, [
        l("h3", {
          class: "vuefinder__image-preview__title",
          id: "modal-title",
          title: o(r).modal.data.item.path
        }, b(o(r).modal.data.item.basename), 9, du),
        l("div", uu, [
          u.value ? (f(), h("button", {
            key: 0,
            onClick: v,
            class: "vuefinder__image-preview__crop-button"
          }, b(o(s)("Crop")), 1)) : H("", !0),
          o(r).features.includes(o(de).EDIT) ? (f(), h("button", {
            key: 1,
            class: "vuefinder__image-preview__edit-button",
            onClick: m[0] || (m[0] = (g) => _())
          }, b(u.value ? o(s)("Cancel") : o(s)("Edit")), 1)) : H("", !0)
        ])
      ]),
      l("div", vu, [
        l("img", {
          ref_key: "image",
          ref: i,
          class: "vuefinder__image-preview__image",
          src: o(r).requester.getPreviewUrl(o(r).modal.data.adapter, o(r).modal.data.item),
          alt: ""
        }, null, 8, fu)
      ]),
      a.value.length ? (f(), G(Xe, {
        key: 0,
        onHidden: m[1] || (m[1] = (g) => a.value = ""),
        error: d.value
      }, {
        default: J(() => [
          Z(b(a.value), 1)
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
    }), (s, i) => (f(), h("div", mu, [
      l("div", pu, [
        l("h3", {
          class: "vuefinder__default-preview__title",
          id: "modal-title",
          title: o(n).modal.data.item.path
        }, b(o(n).modal.data.item.basename), 9, hu)
      ]),
      i[0] || (i[0] = l("div", null, null, -1))
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
    }), (i, c) => (f(), h("div", bu, [
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
    }), (i, c) => (f(), h("div", Su, [
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
    }), (i, c) => (f(), h("div", Mu, [
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = A(!1), s = (u) => (e.modal.data.item.mime_type ?? "").startsWith(u), i = e.features.includes(de.PREVIEW);
    i || (r.value = !0);
    const c = (u, a, d) => {
      a.status = d, a && e.emitter.emit("vf-fetch", {
        params: {
          q: "updateStatus",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: a,
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
        onError: (_) => {
        }
      }), e.emitter.emit("vf-search-exit");
    };
    return (u, a) => (f(), G(Ye, null, {
      buttons: J(() => [
        l("button", {
          type: "button",
          onClick: a[6] || (a[6] = (d) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Close")), 1),
        o(e).features.includes(o(de).DOWNLOAD) ? (f(), h("a", {
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
        (o(e).modal.data.item.status == 0 || o(e).modal.data.item.status == null) && o(e).modal.data.item.reqVerification ? (f(), h("button", {
          key: 1,
          type: "button",
          onClick: a[7] || (a[7] = (d) => c(o(e).modal.data.adapter, o(e).modal.data.item, 1)),
          class: "vf-btn vf-btn-primary"
        }, " Verify ")) : H("", !0),
        o(e).modal.data.item.status == 1 ? (f(), h("button", {
          key: 2,
          type: "button",
          onClick: a[8] || (a[8] = (d) => c(o(e).modal.data.adapter, o(e).modal.data.item, 0)),
          class: "vf-btn vf-btn-secondary",
          style: { display: "none" }
        }, " UnVerify ")) : H("", !0)
      ]),
      default: J(() => [
        l("div", null, [
          l("div", Ou, [
            o(i) ? (f(), h("div", Fu, [
              s("text") ? (f(), G(au, {
                key: 0,
                onSuccess: a[0] || (a[0] = (d) => r.value = !0)
              })) : s("image") ? (f(), G(_u, {
                key: 1,
                onSuccess: a[1] || (a[1] = (d) => r.value = !0)
              })) : s("video") ? (f(), G(xu, {
                key: 2,
                onSuccess: a[2] || (a[2] = (d) => r.value = !0)
              })) : s("audio") ? (f(), G(Tu, {
                key: 3,
                onSuccess: a[3] || (a[3] = (d) => r.value = !0)
              })) : s("application/pdf") ? (f(), G(Lu, {
                key: 4,
                onSuccess: a[4] || (a[4] = (d) => r.value = !0)
              })) : (f(), G(gu, {
                key: 5,
                onSuccess: a[5] || (a[5] = (d) => r.value = !0)
              }))
            ])) : H("", !0),
            l("div", Iu, [
              r.value === !1 ? (f(), h("div", Hu, [
                a[9] || (a[9] = l("svg", {
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
        o(e).features.includes(o(de).DOWNLOAD) ? (f(), h("div", Nu, [
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
  return f(), h("svg", zu, e[0] || (e[0] = [
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
  return f(), h("svg", ju, e[0] || (e[0] = [
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
  return f(), h("svg", Ku, e[0] || (e[0] = [
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
    const e = re("ServiceContainer"), n = e.dragSelect, r = t, s = (m) => {
      m.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: e.fs.adapter, path: m.path }
      })) : e.modal.open(qo, { adapter: e.fs.adapter, item: m });
    }, i = {
      mounted(m, g, x, $) {
        x.props.draggable && (m.addEventListener(
          "dragstart",
          (T) => c(T, g.value)
        ), m.addEventListener(
          "dragover",
          (T) => a(T, g.value)
        ), m.addEventListener(
          "drop",
          (T) => u(T, g.value)
        ));
      },
      beforeUnmount(m, g, x, $) {
        x.props.draggable && (m.removeEventListener("dragstart", c), m.removeEventListener("dragover", a), m.removeEventListener("drop", u));
      }
    }, c = (m, g) => {
      if (m.altKey || m.ctrlKey || m.metaKey)
        return m.preventDefault(), !1;
      n.isDraggingRef.value = !0, m.dataTransfer.setDragImage(r.dragImage.$el, 0, 15), m.dataTransfer.effectAllowed = "all", m.dataTransfer.dropEffect = "copy", m.dataTransfer.setData("items", JSON.stringify(n.getSelected()));
    }, u = (m, g) => {
      m.preventDefault(), n.isDraggingRef.value = !1;
      let x = JSON.parse(m.dataTransfer.getData("items"));
      if (x.find(($) => $.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, { items: { from: x, to: g } });
    }, a = (m, g) => {
      m.preventDefault(), !g || g.type !== "dir" || n.getSelection().find((x) => x === m.currentTarget) ? (m.dataTransfer.dropEffect = "none", m.dataTransfer.effectAllowed = "none") : m.dataTransfer.dropEffect = "copy";
    };
    let d = null, _ = !1;
    const v = () => {
      d && clearTimeout(d);
    }, p = (m) => {
      if (!_)
        _ = !0, setTimeout(() => _ = !1, 300);
      else
        return _ = !1, s(r.item), clearTimeout(d), !1;
      d = setTimeout(() => {
        const g = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: m.target.getBoundingClientRect().x,
          clientY: m.target.getBoundingClientRect().y
        });
        m.target.dispatchEvent(g);
      }, 500);
    };
    return (m, g) => t.item.basename != ".verification" ? ue((f(), h("div", {
      style: an({
        opacity: o(n).isDraggingRef.value && o(n).getSelection().find((x) => m.$el === x) ? "0.5 !important" : ""
      }),
      class: le(["vuefinder__item", "vf-item-" + o(n).explorerId]),
      "data-type": t.item.type,
      key: t.item.path,
      "data-item": JSON.stringify(t.item),
      "data-index": t.index,
      onDblclick: g[0] || (g[0] = (x) => s(t.item)),
      onTouchstart: g[1] || (g[1] = (x) => p(x)),
      onTouchend: g[2] || (g[2] = (x) => v()),
      onContextmenu: g[3] || (g[3] = et((x) => o(e).emitter.emit("vf-contextmenu-show", {
        event: x,
        items: o(n).getSelected(),
        target: t.item
      }), ["prevent"]))
    }, [
      At(m.$slots, "default", {}, void 0, !0),
      l("span", null, [
        t.item.type == "file" && t.item.status == 1 ? (f(), G(o(Wu), {
          key: 0,
          class: "icon-custom"
        })) : H("", !0)
      ]),
      l("span", null, [
        t.item.type == "file" && t.item.status == 0 ? (f(), G(o(Xu), {
          key: 0,
          class: "icon-custom"
        })) : H("", !0)
      ]),
      o(e).pinnedFolders.find((x) => x.path === t.item.path) ? (f(), G(o(jo), {
        key: 0,
        class: "vuefinder__item--pinned"
      })) : H("", !0)
    ], 46, Zu)), [
      [i, t.item]
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = (v) => v == null ? void 0 : v.substring(0, 3), s = A(null), i = A(""), c = e.dragSelect;
    let u;
    e.emitter.on("vf-fullscreen-toggle", () => {
      c.area.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: v }) => {
      i.value = v, v ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname,
          filter: v
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
    const a = xt({ active: !1, column: "", order: "" }), d = (v = !0) => {
      let p = [...e.fs.data.files], m = a.column, g = a.order === "asc" ? 1 : -1;
      if (!v)
        return p;
      const x = ($, T) => typeof $ == "string" && typeof T == "string" ? $.toLowerCase().localeCompare(T.toLowerCase()) : $ < T ? -1 : $ > T ? 1 : 0;
      return a.active && (p = p.slice().sort(($, T) => x($[m], T[m]) * g)), p;
    }, _ = (v) => {
      a.active && a.column === v ? (a.active = a.order === "asc", a.column = v, a.order = "desc") : (a.active = !0, a.column = v, a.order = "asc");
    };
    return $e(() => {
      u = new mr(c.area.value);
    }), Is(() => {
      u.update();
    }), Rs(() => {
      u.destroy();
    }), (v, p) => (f(), h("div", Qu, [
      o(e).view === "list" || i.value.length ? (f(), h("div", ev, [
        l("div", {
          onClick: p[0] || (p[0] = (m) => _("basename")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
        }, [
          Z(b(o(n)("Name")) + " ", 1),
          ue(z(Kt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [ze, a.active && a.column === "basename"]
          ])
        ]),
        i.value.length ? H("", !0) : (f(), h("div", {
          key: 0,
          onClick: p[1] || (p[1] = (m) => _("file_size")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
        }, [
          Z(b(o(n)("Size")) + " ", 1),
          ue(z(Kt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [ze, a.active && a.column === "file_size"]
          ])
        ])),
        i.value.length ? H("", !0) : (f(), h("div", {
          key: 1,
          onClick: p[2] || (p[2] = (m) => _("last_modified")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
        }, [
          Z(b(o(n)("Date")) + " ", 1),
          ue(z(Kt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [ze, a.active && a.column === "last_modified"]
          ])
        ])),
        i.value.length ? (f(), h("div", {
          key: 2,
          onClick: p[3] || (p[3] = (m) => _("path")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
        }, [
          Z(b(o(n)("Filepath")) + " ", 1),
          ue(z(Kt, {
            direction: a.order
          }, null, 8, ["direction"]), [
            [ze, a.active && a.column === "path"]
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
          { "search-active": i.value.length }
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
        onContextmenu: p[4] || (p[4] = et((m) => o(e).emitter.emit("vf-contextmenu-show", {
          event: m,
          items: o(c).getSelected()
        }), ["self", "prevent"]))
      }, [
        o(e).loadingIndicator === "linear" && o(e).fs.loading ? (f(), h("div", nv)) : H("", !0),
        i.value.length ? (f(!0), h(ge, { key: 1 }, ke(d(), (m, g) => (f(), G(Mn, {
          item: m,
          index: g,
          dragImage: s.value,
          class: "vf-item vf-item-list"
        }, {
          default: J(() => [
            l("div", sv, [
              l("div", ov, [
                z(Tn, {
                  type: m.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", rv, b(m.basename), 1)
              ]),
              l("div", lv, b(m.path), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : H("", !0),
        o(e).view === "list" && !i.value.length ? (f(!0), h(ge, { key: 2 }, ke(d(), (m, g) => (f(), G(Mn, {
          item: m,
          index: g,
          dragImage: s.value,
          class: "vf-item vf-item-list",
          draggable: "true",
          key: m.path
        }, {
          default: J(() => [
            l("div", av, [
              l("div", iv, [
                z(Tn, {
                  type: m.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", cv, b(m.basename), 1)
              ]),
              l("div", dv, b(m.file_size ? o(e).filesize(m.file_size) : ""), 1),
              l("div", uv, b(o(zo)(m.last_modified)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 128)) : H("", !0),
        o(e).view === "grid" && !i.value.length ? (f(!0), h(ge, { key: 3 }, ke(d(!1), (m, g) => (f(), G(Mn, {
          item: m,
          index: g,
          dragImage: s.value,
          class: "vf-item vf-item-grid",
          draggable: "true"
        }, {
          default: J(() => [
            l("div", null, [
              l("div", vv, [
                (m.mime_type ?? "").startsWith("image") && o(e).showThumbnails ? (f(), h("img", {
                  src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                  class: "vuefinder__explorer__item-thumbnail lazy",
                  "data-src": o(e).requester.getPreviewUrl(o(e).fs.adapter, m),
                  alt: m.basename,
                  key: m.path
                }, null, 8, fv)) : (f(), G(Tn, {
                  key: 1,
                  type: m.type
                }, null, 8, ["type"])),
                !((m.mime_type ?? "").startsWith("image") && o(e).showThumbnails) && m.type !== "dir" ? (f(), h("div", _v, b(r(m.extension)), 1)) : H("", !0)
              ]),
              l("span", mv, b(o(Gn)(m.basename)), 1)
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
    const e = re("ServiceContainer"), n = A(null), r = A([]), s = A(""), i = xt({
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
    }), e.emitter.on("vf-contextmenu-show", ({ event: d, items: _, target: v = null }) => {
      if (i.items = e.contextMenuItems.filter((p) => p.show(e, {
        searchQuery: s.value,
        items: _,
        target: v
      })), s.value)
        if (v)
          e.emitter.emit("vf-context-selected", [v]);
        else
          return;
      else !v && !s.value ? e.emitter.emit("vf-context-selected", []) : _.length > 1 && _.some((p) => p.path === v.path) ? e.emitter.emit("vf-context-selected", _) : e.emitter.emit("vf-context-selected", [v]);
      a(d);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      i.active = !1;
    });
    const a = (d) => {
      const _ = e.dragSelect.area.value, v = e.root.getBoundingClientRect(), p = _.getBoundingClientRect();
      let m = d.clientX - v.left, g = d.clientY - v.top;
      i.active = !0, ct(() => {
        var I;
        const x = (I = n.value) == null ? void 0 : I.getBoundingClientRect();
        let $ = (x == null ? void 0 : x.height) ?? 0, T = (x == null ? void 0 : x.width) ?? 0;
        m = p.right - d.pageX + window.scrollX < T ? m - T : m, g = p.bottom - d.pageY + window.scrollY < $ ? g - $ : g, i.positions = {
          left: m + "px",
          top: g + "px"
        };
      });
    };
    return (d, _) => ue((f(), h("ul", {
      ref_key: "contextmenu",
      ref: n,
      style: an(i.positions),
      class: "vuefinder__context-menu"
    }, [
      (f(!0), h(ge, null, ke(i.items, (v) => (f(), h("li", {
        class: "vuefinder__context-menu__item",
        key: v.title
      }, [
        v.link ? (f(), h("a", {
          key: 0,
          class: "vuefinder__context-menu__link",
          target: "_blank",
          href: c(v),
          download: c(v),
          onClick: _[0] || (_[0] = (p) => o(e).emitter.emit("vf-contextmenu-hide"))
        }, [
          l("span", null, b(v.title(o(e).i18n)), 1)
        ], 8, hv)) : (f(), h("div", {
          key: 1,
          class: "vuefinder__context-menu__action",
          onClick: (p) => u(v)
        }, [
          l("span", null, b(v.title(o(e).i18n)), 1)
        ], 8, gv))
      ]))), 128))
    ], 4)), [
      [ze, i.active]
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
  return f(), h("svg", wv, e[0] || (e[0] = [
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
  return f(), h("svg", kv, e[0] || (e[0] = [
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, { setStore: r } = e.storage, s = e.dragSelect, i = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter } }), r("adapter", e.fs.adapter);
    }, c = A("");
    e.emitter.on("vf-search-query", ({ newQuery: a }) => {
      c.value = a;
    });
    const u = bt(() => {
      const a = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return e.selectButton.active && a;
    });
    return (a, d) => (f(), h("div", $v, [
      l("div", Cv, [
        l("div", {
          class: "vuefinder__status-bar__storage-container",
          title: o(n)("Storage")
        }, [
          l("div", Tv, [
            z(o(Go))
          ]),
          ue(l("select", {
            "onUpdate:modelValue": d[0] || (d[0] = (_) => o(e).fs.adapter = _),
            onChange: i,
            class: "vuefinder__status-bar__storage-select",
            tabindex: "-1"
          }, [
            (f(!0), h(ge, null, ke(o(e).fs.data.storages, (_) => (f(), h("option", { value: _ }, b(_), 9, Mv))), 256))
          ], 544), [
            [An, o(e).fs.adapter]
          ])
        ], 8, Ev),
        l("div", Av, [
          c.value.length ? (f(), h("span", Dv, b(o(e).fs.data.files.length) + " items found. ", 1)) : H("", !0),
          l("span", Vv, b(o(e).dragSelect.getCount() > 0 ? o(n)("%s item(s) selected.", o(e).dragSelect.getCount()) : ""), 1)
        ])
      ]),
      l("div", Lv, [
        o(e).selectButton.active ? (f(), h("button", {
          key: 0,
          class: le(["vf-btn py-0 vf-btn-primary", { disabled: !u.value }]),
          disabled: !u.value,
          onClick: d[1] || (d[1] = (_) => o(e).selectButton.click(o(s).getSelected(), _))
        }, b(o(n)("Select")), 11, Ov)) : H("", !0),
        l("span", {
          class: "vuefinder__status-bar__about",
          title: o(n)("About"),
          onClick: d[2] || (d[2] = (_) => o(e).modal.open(Vo))
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
  return f(), h("svg", Hv, e[0] || (e[0] = [
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
  return f(), h("svg", Bv, e[0] || (e[0] = [
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
  return f(), h("svg", Pv, e[0] || (e[0] = [
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
  return f(), h("svg", qv, e[0] || (e[0] = [
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
        return ((u = i()) == null ? void 0 : u.folders.length) || c();
      }
    );
    function i() {
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
    return (u, a) => {
      var d;
      return f(), h("div", Gv, [
        s.value ? (f(), G(o(us), {
          key: 0,
          class: "vuefinder__folder-loader-indicator--loading"
        })) : (f(), h("div", Wv, [
          r.value && ((d = i()) != null && d.folders.length) ? (f(), G(o(Yo), {
            key: 0,
            class: "vuefinder__folder-loader-indicator--minus"
          })) : H("", !0),
          r.value ? H("", !0) : (f(), G(o(Ko), {
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
    const i = bt(() => {
      var c;
      return ((c = e.treeViewData.find((u) => u.path === r.path)) == null ? void 0 : c.folders) || [];
    });
    return (c, u) => {
      const a = ir("TreeSubfolderList", !0);
      return f(), h("ul", {
        ref_key: "parentSubfolderList",
        ref: s,
        class: "vuefinder__treesubfolderlist__container"
      }, [
        (f(!0), h(ge, null, ke(i.value, (d, _) => (f(), h("li", {
          key: d.path,
          class: "vuefinder__treesubfolderlist__item"
        }, [
          l("div", Kv, [
            l("div", {
              class: "vuefinder__treesubfolderlist__item-toggle",
              onClick: (v) => n.value[d.path] = !n.value[d.path]
            }, [
              z(Zo, {
                adapter: t.adapter,
                path: d.path,
                modelValue: n.value[d.path],
                "onUpdate:modelValue": (v) => n.value[d.path] = v
              }, null, 8, ["adapter", "path", "modelValue", "onUpdate:modelValue"])
            ], 8, Yv),
            l("div", {
              class: "vuefinder__treesubfolderlist__item-link",
              title: d.path,
              onClick: (v) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: r.adapter, path: d.path } })
            }, [
              l("div", Zv, [
                o(e).fs.path === d.path ? (f(), G(o(Wo), { key: 0 })) : (f(), G(o(hn), { key: 1 }))
              ]),
              l("div", {
                class: le(["vuefinder__treesubfolderlist__item-text", {
                  "vuefinder__treesubfolderlist__item-text--active": o(e).fs.path === d.path
                }])
              }, b(d.basename), 3)
            ], 8, Xv)
          ]),
          l("div", Jv, [
            ue(z(a, {
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
    function s(i) {
      i === e.fs.adapter ? r.value = !r.value : (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: i } }), n("adapter", i));
    }
    return (i, c) => (f(), h(ge, null, [
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
    return (n, r) => (f(), h("div", tf, [
      l("div", nf, [
        e.value ? (f(), G(o(Yo), {
          key: 0,
          class: "vuefinder__folder-indicator--minus"
        })) : H("", !0),
        e.value ? H("", !0) : (f(), G(o(Ko), {
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
    const e = re("ServiceContainer"), { t: n } = e.i18n, { getStore: r, setStore: s } = e.storage, i = A(190), c = A(r("pinned-folders-opened", !0));
    De(c, (_) => s("pinned-folders-opened", _));
    const u = (_) => {
      e.pinnedFolders = e.pinnedFolders.filter((v) => v.path !== _.path), e.storage.setStore("pinned-folders", e.pinnedFolders);
    }, a = (_) => {
      const v = _.clientX, p = _.target.parentElement, m = p.getBoundingClientRect().width;
      p.classList.remove("transition-[width]"), p.classList.add("transition-none");
      const g = ($) => {
        i.value = m + $.clientX - v, i.value < 50 && (i.value = 0, e.showTreeView = !1), i.value > 50 && (e.showTreeView = !0);
      }, x = () => {
        const $ = p.getBoundingClientRect();
        i.value = $.width, p.classList.add("transition-[width]"), p.classList.remove("transition-none"), window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", x);
      };
      window.addEventListener("mousemove", g), window.addEventListener("mouseup", x);
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
    }), De(e.fs.data, (_, v) => {
      const p = _.files.filter((m) => m.type === "dir");
      Xo(e.treeViewData, { path: e.fs.path, folders: p.map((m) => ({
        adapter: m.storage,
        path: m.path,
        basename: m.basename
      })) });
    }), (_, v) => (f(), h(ge, null, [
      l("div", {
        onClick: v[0] || (v[0] = (p) => o(e).showTreeView = !o(e).showTreeView),
        class: le(["vuefinder__treeview__overlay", o(e).showTreeView ? "vuefinder__treeview__backdrop" : "hidden"])
      }, null, 2),
      l("div", {
        style: an(o(e).showTreeView ? "min-width:100px;max-width:75%; width: " + i.value + "px" : "width: 0"),
        class: "vuefinder__treeview__container"
      }, [
        l("div", {
          ref_key: "treeViewScrollElement",
          ref: d,
          class: "vuefinder__treeview__scroll"
        }, [
          l("div", of, [
            l("div", {
              onClick: v[2] || (v[2] = (p) => c.value = !c.value),
              class: "vuefinder__treeview__pinned-toggle"
            }, [
              l("div", rf, [
                z(o(jo), { class: "vuefinder__treeview__pin-icon" }),
                l("div", lf, b(o(n)("Pinned Folders")), 1)
              ]),
              z(sf, {
                modelValue: c.value,
                "onUpdate:modelValue": v[1] || (v[1] = (p) => c.value = p)
              }, null, 8, ["modelValue"])
            ]),
            c.value ? (f(), h("ul", af, [
              (f(!0), h(ge, null, ke(o(e).pinnedFolders, (p) => (f(), h("li", cf, [
                l("div", {
                  class: "vuefinder__treeview__pinned-folder",
                  onClick: (m) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: p.storage, path: p.path } })
                }, [
                  o(e).fs.path !== p.path ? (f(), G(o(hn), {
                    key: 0,
                    class: "vuefinder__treeview__folder-icon"
                  })) : H("", !0),
                  o(e).fs.path === p.path ? (f(), G(o(Wo), {
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
                  onClick: (m) => u(p)
                }, [
                  z(o(Nv), { class: "vuefinder__treeview__remove-icon" })
                ], 8, vf)
              ]))), 256)),
              o(e).pinnedFolders.length ? H("", !0) : (f(), h("li", ff, [
                l("div", _f, b(o(n)("No folders pinned")), 1)
              ]))
            ])) : H("", !0)
          ]),
          (f(!0), h(ge, null, ke(o(e).fs.data.storages, (p) => (f(), h("div", mf, [
            z(ef, { storage: p }, null, 8, ["storage"])
          ]))), 256))
        ], 512),
        l("div", {
          onMousedown: a,
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
    var s, i;
    const r = (c) => c.items.length > 1 && c.items.some((u) => {
      var a;
      return u.path === ((a = c.target) == null ? void 0 : a.path);
    }) ? "many" : c.target ? "one" : null;
    return !(this.options.needsSearchQuery !== !!n.searchQuery || this.options.target !== void 0 && this.options.target !== r(n) || this.options.targetType !== void 0 && this.options.targetType !== ((s = n.target) == null ? void 0 : s.type) || this.options.mimeType !== void 0 && this.options.mimeType !== ((i = n.target) == null ? void 0 : i.mime_type) || this.options.feature !== void 0 && !e.features.includes(this.options.feature) || this.options.show !== void 0 && !this.options.show(e, n));
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
  setup(t, { emit: e }) {
    const n = e, r = t, s = Dl(r, re("VueFinderOptions"));
    cr("ServiceContainer", s);
    const { setStore: i } = s.storage, c = A(null);
    s.root = c;
    const u = s.dragSelect;
    ii(s);
    const a = (v) => {
      Object.assign(s.fs.data, v), u.clearSelection(), u.refreshSelection();
    };
    let d;
    s.emitter.on("vf-fetch-abort", () => {
      d.abort(), s.fs.loading = !1;
    }), s.emitter.on("vf-fetch", ({ params: v, body: p = null, onSuccess: m = null, onError: g = null, noCloseModal: x = !1 }) => {
      ["index", "search"].includes(v.q) && (d && d.abort(), s.fs.loading = !0), d = new AbortController();
      const $ = d.signal;
      s.requester.send({
        url: "",
        method: v.m || "get",
        params: v,
        body: p,
        abortSignal: $
      }).then((T) => {
        s.fs.adapter = T.adapter, s.persist && (s.fs.path = T.dirname, i("path", s.fs.path)), x || s.modal.close(), a(T), m && m(T);
      }).catch((T) => {
        console.error(T), g && g(T);
      }).finally(() => {
        ["index", "search"].includes(v.q) && (s.fs.loading = !1);
      });
    });
    function _(v) {
      let p = {};
      v && v.includes("://") && (p = {
        adapter: v.split("://")[0],
        path: v
      }), s.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: s.fs.adapter, ...p },
        onError: r.onError ?? ((m) => {
          m.message && s.emitter.emit("vf-toast-push", { label: m.message, type: "error" });
        })
      });
    }
    return $e(() => {
      _(s.fs.path), De(() => r.path, (v) => {
        _(v);
      }), u.onSelect((v) => {
        n("select", v);
      }), De(() => s.fs.data.dirname, (v) => {
        n("update:path", v);
      });
    }), (v, p) => (f(), h("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: c,
      tabindex: "0"
    }, [
      l("div", {
        class: le(o(s).theme.actualValue)
      }, [
        l("div", {
          class: le([o(s).fullScreen ? "vuefinder__main__fixed" : "vuefinder__main__relative", "vuefinder__main__container"]),
          style: an(o(s).fullScreen ? "" : "max-height: " + t.maxHeight),
          onMousedown: p[0] || (p[0] = (m) => o(s).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: p[1] || (p[1] = (m) => o(s).emitter.emit("vf-contextmenu-hide"))
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
            o(s).modal.visible ? (f(), G(Hs(o(s).modal.type), { key: 0 })) : H("", !0)
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
