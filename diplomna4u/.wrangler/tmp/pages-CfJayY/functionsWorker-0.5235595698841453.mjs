var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/lead.ts
var ALLOWED_HOSTS = /* @__PURE__ */ new Set([
  "diplomna4u.cx.ua",
  "www.diplomna4u.cx.ua",
  "diplomna4u.pages.dev",
  "localhost",
  "127.0.0.1"
]);
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
__name(esc, "esc");
function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      ...extra
    }
  });
}
__name(json, "json");
function cleanString(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}
__name(cleanString, "cleanString");
function isAllowedOrigin(request, env) {
  const raw = request.headers.get("origin") || request.headers.get("referer");
  if (!raw) return false;
  try {
    const host = new URL(raw).hostname.toLowerCase();
    if (ALLOWED_HOSTS.has(host)) return true;
    if (host.endsWith(".diplomna4u.pages.dev")) return true;
    const configured = (env.PUBLIC_SITE_URL || "").trim();
    if (configured) {
      try {
        if (host === new URL(configured).hostname.toLowerCase()) return true;
      } catch {
      }
    }
    return false;
  } catch {
    return false;
  }
}
__name(isAllowedOrigin, "isAllowedOrigin");
function normalizeContact(raw) {
  const value = raw.trim();
  if (!value) return null;
  let v = value;
  const m = v.match(/^https?:\/\/t\.me\/([A-Za-z][A-Za-z0-9_]{4,31})\/?$/i);
  if (m) v = "@" + m[1];
  if (/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v)) {
    return { type: "telegram", value: "@" + v };
  }
  if (/^@[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v)) {
    return { type: "telegram", value: v };
  }
  if (v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return { type: "email", value: v.toLowerCase() };
  }
  const hasPlus = v.startsWith("+");
  const digits = v.replace(/[^\d]/g, "");
  if (digits.length >= 9 && digits.length <= 15) {
    return { type: "phone", value: (hasPlus ? "+" : "+") + digits };
  }
  return null;
}
__name(normalizeContact, "normalizeContact");
function countUrls(text) {
  return (text.match(/https?:\/\/[^\s]+/gi) || []).length;
}
__name(countUrls, "countUrls");
function kyivTime() {
  const now = /* @__PURE__ */ new Date();
  const parts = new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(now);
  const get = /* @__PURE__ */ __name((type) => parts.find((p) => p.type === type)?.value || "", "get");
  return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")}`;
}
__name(kyivTime, "kyivTime");
function buildMessage(data, sourceLabel) {
  const lines = [];
  lines.push(`\u{1F195} <b>\u041D\u043E\u0432\u0430 \u0437\u0430\u044F\u0432\u043A\u0430</b> \xB7 ${esc(sourceLabel)}`);
  lines.push("");
  if (data.name) lines.push(`\u{1F464} <b>\u0406\u043C\u02BC\u044F:</b> ${esc(String(data.name))}`);
  if (data.contact) lines.push(`\u{1F4F2} <b>\u041A\u043E\u043D\u0442\u0430\u043A\u0442 (${esc(String(data.contactType))}):</b> ${esc(String(data.contact))}`);
  if (data.workType) lines.push(`\u{1F393} <b>\u0422\u0438\u043F \u0440\u043E\u0431\u043E\u0442\u0438:</b> ${esc(String(data.workType))}`);
  if (data.direction) lines.push(`\u{1F9ED} <b>\u041D\u0430\u043F\u0440\u044F\u043C:</b> ${esc(String(data.direction))}`);
  if (data.topic) lines.push(`\u{1F4DD} <b>\u0422\u0435\u043C\u0430:</b> ${esc(String(data.topic)).slice(0, 4096)}`);
  if (data.pages) lines.push(`\u{1F4C4} <b>\u041E\u0431\u0441\u044F\u0433:</b> ${esc(String(data.pages))} \u0441\u0442\u043E\u0440.`);
  if (data.deadline) lines.push(`\u23F1 <b>\u0422\u0435\u0440\u043C\u0456\u043D:</b> ${esc(String(data.deadline))}`);
  if (data.estimatedPrice) lines.push(`\u{1F4B0} <b>\u041E\u0440\u0456\u0454\u043D\u0442\u043E\u0432\u043D\u0430 \u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C:</b> ${esc(String(data.estimatedPrice))}`);
  if (data.comment) lines.push(`\u{1F4AC} <b>\u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440:</b> ${esc(String(data.comment)).slice(0, 4096)}`);
  if (data.pageUrl) lines.push(`\u{1F517} <b>\u0421\u0442\u043E\u0440\u0456\u043D\u043A\u0430:</b> ${esc(String(data.pageUrl))}`);
  if (data.utm && typeof data.utm === "object") {
    const utm = Object.entries(data.utm).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(", ");
    if (utm) lines.push(`\u{1F4C8} <b>UTM:</b> ${esc(utm)}`);
  }
  lines.push(`\u{1F552} ${kyivTime()} (\u041A\u0438\u0457\u0432)`);
  let text = lines.join("\n");
  if (text.length > 4096) text = text.slice(0, 4093) + "...";
  return text;
}
__name(buildMessage, "buildMessage");
async function sendTelegram(env, text, keyboard) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true };
  if (keyboard) payload.reply_markup = keyboard;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8e3);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timer);
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    if (res.ok && body && body.ok) return { ok: true, status: res.status };
    const retryAfter = body?.parameters?.retry_after;
    const migrateTo = body?.parameters?.migrate_to_chat_id;
    if (migrateTo) console.error("WARNING: Telegram migrate_to_chat_id", migrateTo, "update TELEGRAM_CHAT_ID");
    return {
      ok: false,
      status: res.status,
      description: body?.description || res.statusText,
      retryAfter: typeof retryAfter === "number" ? retryAfter : void 0,
      migrateTo
    };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, status: 0, description: e?.message || "network error" };
  }
}
__name(sendTelegram, "sendTelegram");
async function attemptSend(env, text, keyboard) {
  let result = await sendTelegram(env, text, keyboard);
  if (result.ok) return result;
  const retriable = result.status === 0 || result.status === 429 || result.status >= 500;
  if (retriable) {
    let wait = 1e3;
    if (result.retryAfter && result.retryAfter <= 3) wait = result.retryAfter * 1e3;
    await new Promise((r) => setTimeout(r, wait));
    result = await sendTelegram(env, text, keyboard);
  }
  return result;
}
__name(attemptSend, "attemptSend");
async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY || !token) return true;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip })
    });
    const json2 = await res.json();
    return Boolean(json2?.success);
  } catch {
    return false;
  }
}
__name(verifyTurnstile, "verifyTurnstile");
var SOURCE_LABELS = {
  contact: "\u0424\u043E\u0440\u043C\u0430 \u043D\u0430 \u0441\u0442\u043E\u0440\u0456\u043D\u0446\u0456",
  "quick-order": "\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440",
  "sticky-contact": "\u041B\u0438\u043F\u043A\u0430 \u0444\u043E\u0440\u043C\u0430",
  "sticky-widget": "\u0412\u0456\u0434\u0436\u0435\u0442 \xAB\u0417\u0432\u2019\u044F\u0437\u043E\u043A \u0437 \u043D\u0430\u043C\u0438\xBB",
  "lead": "\u0424\u043E\u0440\u043C\u0430"
};
async function handlePost(context) {
  const { request, env } = context;
  const rawEnv = env || {};
  if (!rawEnv.TELEGRAM_BOT_TOKEN || !rawEnv.TELEGRAM_CHAT_ID) {
    const missing = !rawEnv.TELEGRAM_BOT_TOKEN ? "TELEGRAM_BOT_TOKEN" : "TELEGRAM_CHAT_ID";
    console.error("Missing env var:", missing);
    return json({ ok: false, code: "config" }, 500);
  }
  if (!isAllowedOrigin(request, rawEnv)) {
    return json({ ok: false, code: "forbidden" }, 403);
  }
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return json({ ok: false, code: "content_type" }, 415);
  }
  let bodyText = "";
  try {
    bodyText = await request.text();
  } catch {
    return json({ ok: false, code: "bad_request" }, 400);
  }
  if (bodyText.length > 16 * 1024) {
    return json({ ok: false, code: "too_large" }, 413);
  }
  let data;
  try {
    data = JSON.parse(bodyText || "{}");
  } catch {
    return json({ ok: false, code: "validation", fields: { contact: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u043D\u0438\u0445" } }, 400);
  }
  if (typeof data !== "object" || data === null) {
    return json({ ok: false, code: "validation", fields: {} }, 400);
  }
  const honey = cleanString(data.website, 200);
  if (honey) {
    return json({ ok: true }, 200);
  }
  const started = Number(data.formStartedAt);
  if (started && Number.isFinite(started)) {
    const age = Date.now() - started;
    if (age < 2500) {
      return json({ ok: true }, 200);
    }
    if (age > 24 * 60 * 60 * 1e3) {
      return json({ ok: false, code: "validation", fields: {} }, 400);
    }
  }
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
  const turnstileToken = cleanString(data["cf-turnstile-response"], 2048);
  const turnstileOk = await verifyTurnstile(rawEnv, turnstileToken, ip);
  if (!turnstileOk) {
    return json({ ok: false, code: "spam", fields: {} }, 400);
  }
  const source = cleanString(data.source, 40) || "lead";
  const name = cleanString(data.name, 80);
  const workType = cleanString(data.workType, 200);
  const direction = cleanString(data.direction, 200);
  const topic = cleanString(data.topic, 200);
  const comment = cleanString(data.comment, 1e3);
  const pageUrl = cleanString(data.pageUrl, 200);
  const rawContact = cleanString(data.contact, 254);
  const pagesRaw = data.pages;
  const pages = typeof pagesRaw === "number" && Number.isInteger(pagesRaw) && pagesRaw >= 10 && pagesRaw <= 300 ? pagesRaw : void 0;
  const deadline = cleanString(data.deadline, 60) || void 0;
  const estimatedPrice = cleanString(data.estimatedPrice, 40) || void 0;
  const utmRaw = data.utm && typeof data.utm === "object" ? data.utm : {};
  const utm = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    utm[k] = cleanString(utmRaw[k], 80);
  }
  if (!utm.utm_source) utm.utm_source = cleanString(utmRaw.source, 80);
  const contact = normalizeContact(rawContact);
  const fields = {};
  if (name.length < 2) fields.name = "\u0412\u043A\u0430\u0436\u0438 \u0456\u043C\u02BC\u044F";
  if (!contact) fields.contact = "\u0412\u043A\u0430\u0436\u0438 Telegram, \u0442\u0435\u043B\u0435\u0444\u043E\u043D \u0430\u0431\u043E email";
  if (data.consent !== true) fields.consent = "\u041F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0438 \u0437\u0433\u043E\u0434\u0443 \u043D\u0430 \u043E\u0431\u0440\u043E\u0431\u043A\u0443 \u0434\u0430\u043D\u0438\u0445";
  if (Object.keys(fields).length > 0) {
    return json({ ok: false, code: "validation", fields }, 400);
  }
  const textForLinks = `${topic} ${comment}`;
  if (countUrls(textForLinks) > 3) {
    return json({ ok: true }, 200);
  }
  const consent = data.consent === true;
  const sourceLabel = SOURCE_LABELS[source] || "\u0424\u043E\u0440\u043C\u0430";
  const payload = {
    name,
    contact: contact.value,
    contactType: contact.type,
    workType,
    direction,
    topic,
    pages,
    deadline,
    estimatedPrice,
    comment,
    pageUrl,
    utm
  };
  const text = buildMessage(payload, sourceLabel);
  const keyboard = contact.type === "telegram" ? {
    inline_keyboard: [[{ text: "\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0441\u0442\u0438 \u0432 Telegram", url: `https://t.me/${contact.value.replace(/^@/, "")}` }]]
  } : void 0;
  if (rawEnv.DRY_RUN === "1") {
    return json({ ok: true, dryRun: true }, 200);
  }
  const result = await attemptSend(rawEnv, text, keyboard);
  if (result.ok) {
    return json({ ok: true }, 200);
  }
  console.error("telegram_error", result.status, result.description);
  return json({ ok: false, code: "telegram" }, 502);
}
__name(handlePost, "handlePost");
async function onRequest(context) {
  try {
    const { request } = context;
    const method = request.method.toUpperCase();
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex"
        }
      });
    }
    if (method !== "POST") {
      return json({ ok: false, code: "method_not_allowed" }, 405, { Allow: "POST" });
    }
    return await handlePost(context);
  } catch (e) {
    console.error("lead_function_error", e?.message);
    return json({ ok: false, code: "server_error" }, 500);
  }
}
__name(onRequest, "onRequest");

// ../.wrangler/tmp/pages-CfJayY/functionsRoutes-0.6807198101891191.mjs
var routes = [
  {
    routePath: "/api/lead",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  }
];

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function getOriginalPathPrefix(requestPath, normalizedPrefix) {
  let end = 0;
  for (let index = 0; index < normalizedPrefix.length; index++) {
    end++;
    if (normalizedPrefix[index] === "/") {
      while (requestPath[end] === "/") {
        end++;
      }
    }
  }
  return requestPath.slice(0, end);
}
__name(getOriginalPathPrefix, "getOriginalPathPrefix");
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  const normalizedRequestPath = requestPath.replace(/\/+/g, "/");
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath) || routeMatcher(normalizedRequestPath);
    const originalMountMatch = mountMatcher(requestPath);
    const mountMatchResult = originalMountMatch || mountMatcher(normalizedRequestPath);
    if (matchResult && mountMatchResult) {
      const path = originalMountMatch ? originalMountMatch.path : getOriginalPathPrefix(requestPath, mountMatchResult.path);
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-wpF9Ju/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-wpF9Ju/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.5235595698841453.mjs.map
