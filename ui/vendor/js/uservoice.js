window.UserVoice = {
  events: window.UserVoice || [],
  push: function (x) {
    window.UserVoice.events.push(x)
  },
  account: {
    "campaign": "footer_poweredby",
    "white_labeled": false,
    "subdomain_ssl_host": "pibi.uservoice.com",
    "subdomain_site_host": "support.pibiapp.com",
    "subdomain_key": "pibi",
    "subdomain_id": 129424,
    "client_key": "IGFZOiGatwXmZvZu5vYyA",
    "client_options": null,
    "smartvote_autoprompt_enabled": true,
    "satisfaction_autoprompt_enabled": true
  },
  client_widgets: {}
};
if (typeof (UserVoice) === "undefined" || !UserVoice.showLightbox) {
  (function (window, document, undefined) {
    var Babayaga = (function (window, undefined) {
      function base64Encode(input) {
        function uTF8Encode(string) {
          string = string.replace(/\x0d\x0a/g, "\x0a");
          var output = "";
          for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
              output += String.fromCharCode(c)
            } else {
              if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128)
              } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128)
              }
            }
          }
          return output
        }
        var keyString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = uTF8Encode(input);
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64
          } else {
            if (isNaN(chr3)) {
              enc4 = 64
            }
          }
          output = output + keyString.charAt(enc1) + keyString.charAt(enc2) + keyString.charAt(enc3) + keyString.charAt(enc4)
        }
        return output
      }
      var jsonStringify = null;
      var jsonParse = null;
      (function () {
        function f(n) {
          return n < 10 ? "0" + n : n
        }
        if (typeof Date.prototype.toJSON !== "function") {
          Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
          };
          String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf()
          }
        }
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
          }, rep;

        function quote(string) {
          escapable.lastIndex = 0;
          return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
          }) + '"' : '"' + string + '"'
        }

        function str(key, holder) {
          var i, k, v, length, mind = gap,
            partial, value = holder[key];
          if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
          }
          if (typeof rep === "function") {
            value = rep.call(holder, key, value)
          }
          switch (typeof value) {
          case "string":
            return quote(value);
          case "number":
            return isFinite(value) ? String(value) : "null";
          case "boolean":
          case "null":
            return String(value);
          case "object":
            if (!value) {
              return "null"
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
              length = value.length;
              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || "null"
              }
              v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
              gap = mind;
              return v
            }
            if (rep && typeof rep === "object") {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                k = rep[i];
                if (typeof k === "string") {
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ": " : ":") + v)
                  }
                }
              }
            } else {
              for (k in value) {
                if (Object.hasOwnProperty.call(value, k)) {
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ": " : ":") + v)
                  }
                }
              }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v
          }
        }
        jsonStringify = function (value, replacer, space) {
          var i;
          gap = "";
          indent = "";
          if (typeof space === "number") {
            for (i = 0; i < space; i += 1) {
              indent += " "
            }
          } else {
            if (typeof space === "string") {
              indent = space
            }
          }
          rep = replacer;
          if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
            throw new Error("JSON.stringify")
          }
          return str("", {
            "": value
          })
        };
        jsonParse = function (text, reviver) {
          var j;

          function walk(holder, key) {
            var k, v, value = holder[key];
            if (value && typeof value === "object") {
              for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                  v = walk(value, k);
                  if (v !== undefined) {
                    value[k] = v
                  } else {
                    delete value[k]
                  }
                }
              }
            }
            return reviver.call(holder, key, value)
          }
          text = String(text);
          cx.lastIndex = 0;
          if (cx.test(text)) {
            text = text.replace(cx, function (a) {
              return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            })
          }
          if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            j = eval("(" + text + ")");
            return typeof reviver === "function" ? walk({
              "": j
            }, "") : j
          }
          throw new SyntaxError("JSON.parse")
        }
      }());

      function extend(obj) {
        var extenders = Array.prototype.slice.call(arguments, 1),
          l = extenders.length,
          i = 0;
        for (; i < l; i++) {
          for (var k in extenders[i]) {
            if (extenders[i].hasOwnProperty(k)) {
              obj[k] = extenders[i][k]
            }
          }
        }
        return obj
      }

      function values(obj) {
        var results = [],
          k;
        if (obj == null) {
          return results
        }
        for (k in obj) {
          if (obj.hasOwnProperty(k)) {
            results.push(obj[k])
          }
        }
        return results
      }

      function sanitizeHash(hash) {
        var sanHash = {}, k, v;
        if (typeof (hash) !== "object") {
          return sanHash
        } else {
          for (k in hash) {
            if (hash.hasOwnProperty(k)) {
              v = hash[k];
              if (typeof (v) === "string" || typeof (v) === "boolean") {
                sanHash[k] = v
              } else {
                if (typeof (v) === "number") {
                  if (/_at$/.test(k)) {
                    if (v < 44308744825) {
                      v = v * 1000
                    }
                  }
                  sanHash[k] = v
                } else {
                  if (v && typeof (v) === "object" && v.constructor === Date && v.getTime) {
                    sanHash[k] = v.getTime()
                  }
                }
              }
            }
          }
        }
        return sanHash
      }

      function setCookie(name, value, opts) {
        opts = extend({
          path: "/",
          domain: "",
          expires: new Date()
        }, opts || {});
        var cookie = [name, "=", encodeURIComponent(value), "; path=", opts.path, "; domain=", opts.domain];
        if (opts.expires) {
          opts.expires.setFullYear(opts.expires.getFullYear() + 1);
          cookie.push("; expires=");
          cookie.push(opts.expires.toUTCString())
        }
        document.cookie = cookie.join("");
        return value
      }

      function getCookie(name) {
        var cookies = (document.cookie || "").split(";"),
          l = cookies.length,
          i = 0,
          cookie;
        for (; i < l; i++) {
          cookie = trim(cookies[i]);
          if (cookie.substr(0, name.length + 1) === (name + "=")) {
            return decodeURIComponent(cookie.substr(name.length + 1))
          }
        }
      }
      var localStorage = (function () {
        var storage = null,
          localStorageEnabled = false,
          testValue = "__uvx";
        try {
          localStorageEnabled = ("localStorage" in window && window.localStorage)
        } catch (err) {}
        if (!localStorageEnabled) {
          return null
        }
        try {
          storage = window.localStorage;
          storage.setItem(testValue, testValue);
          if (storage.getItem(testValue) !== testValue) {
            return null
          }
          storage.removeItem(testValue)
        } catch (e) {
          return null
        }
        return {
          set: function (k, v) {
            storage.setItem(k, jsonStringify(v))
          },
          get: function (k) {
            var v = storage.getItem(k),
              j;
            if (typeof v !== "string") {
              return undefined
            }
            try {
              j = jsonParse(v)
            } catch (e) {}
            return j
          }
        }
      }());

      function getInLocalStorage(k) {
        if (localStorage) {
          return localStorage.get(k)
        } else {
          return undefined
        }
      }

      function setInLocalStorage(k, v) {
        if (localStorage) {
          localStorage.set(k, v)
        }
      }

      function trim(str) {
        var nativeTrim = String.prototype.trim;
        if (nativeTrim) {
          return nativeTrim.apply(str)
        }
        return str.replace(/^\s+|\s+$/g, "")
      }

      function lpad(number, length) {
        var str = "" + number;
        while (str.length < length) {
          str = "0" + str
        }
        return str
      }

      function getTzOffset() {
        var offset = new Date().getTimezoneOffset(),
          signed = offset > 0 ? "-" : "+",
          hour = Math.floor(Math.abs(offset) / 60),
          minute = Math.abs(offset) % 60;
        return signed + lpad(hour, 2) + ":" + lpad(minute, 2)
      }

      function log() {
        if (typeof console !== "undefined" && typeof console.log !== "undefined" && typeof console.log.apply !== "undefined") {
          console.log.apply(console, arguments)
        }
      }

      function isSpider() {
        return /(google web preview|baiduspider|yandexbot)/i.test(window.navigator.userAgent)
      }
      var babayagaCount = 0;
      window.__babas = window.__babas || [];

      function Babayaga(subdomain, config) {
        this.subdomain = subdomain;
        this.config = extend({}, Babayaga.default_config, config || {});
        this.props = {};
        this.isReady = false;
        this.tracks = [];
        this.identified = false;
        this.babaId = babayagaCount++;
        this.firedUvts = false;
        this.firedSession = false;
        this.cookieable = null;
        this.countActiveDays();
        this.setInitialSession();
        window.__babas.push(this)
      }
      byproto = Babayaga.prototype;
      byproto.identify = function (hash) {
        var accountHash, prefixedAccountHash = {}, wasIdentified = this.identified,
          i, k, v;
        hash = hash || {};
        if (hash.account) {
          accountHash = sanitizeHash(hash.account);
          delete hash.account;
          for (k in accountHash) {
            if (accountHash.hasOwnProperty(k)) {
              prefixedAccountHash["account_" + k] = accountHash[k]
            }
          }
        }
        hash = sanitizeHash(hash);
        hash = extend(hash, prefixedAccountHash);
        extend(this.props, hash);
        for (i = 0; i < SessionKeys.length; i += 1) {
          k = SessionKeys[i];
          v = hash[k];
          if (v !== undefined) {
            setInLocalStorage(k, v)
          }
        }
        this.identified = false;
        if (wasIdentified) {
          this.flush()
        }
      };
      byproto.sessionCallbackName = function () {
        var self = this;
        if (this.callbackName) {
          return this.callbackName
        } else {
          this.callbackName = "__uvSessionData" + this.babaId;
          window[this.callbackName] = function (sess) {
            self.setSession(sess)
          };
          return this.callbackName
        }
      };
      byproto.cookieDomain = function (hostname) {
        hostname = hostname || window.location.hostname;
        hostname = hostname.split(".").slice(-2);
        hostname = hostname.length > 1 ? "." + hostname.join(".") : hostname.join(".");
        return hostname
      };
      byproto.countActiveDays = function () {
        var lastDate = getInLocalStorage("lastDate"),
          curDate = new Date().toLocaleDateString(),
          curActiveDays = parseInt(getInLocalStorage("active_days") || 0, 10),
          k;
        if (curDate != lastDate) {
          setInLocalStorage("active_days", curActiveDays + 1)
        }
        setInLocalStorage("lastDate", curDate)
      };
      byproto.setInitialSession = function () {
        var uvts = getCookie(this.config.cookie_name),
          uvf = getCookie("uvf"),
          hasStoredSession = uvts && uvf;
        this.session = this.persistedSession();
        if (uvts) {
          this.setUvts(uvts)
        }
        if (hasStoredSession) {
          this.setSession({}, true)
        }
      };
      byproto.persistedSession = function () {
        var sess = {}, i, k, v;
        for (i = 0; i < SessionKeys.length; i += 1) {
          k = SessionKeys[i];
          v = getInLocalStorage(k);
          if (v) {
            sess[k] = v
          }
        }
        return sess
      };
      byproto.getSession = function () {
        return this.session
      };
      byproto.setSession = function (sess, fromCache) {
        this.log("SET SESSION: ", sess, "(from cache: " + (fromCache || false) + ")");
        this.hasSession = true;
        this.updateSession(sess);
        this.setUvts(this.session.uvts);
        if (!this.firedSession) {
          if (typeof this.config.onSession === "function") {
            this.config.onSession(this.session)
          }
          this.firedSession = true
        }
        if (!fromCache) {
          setCookie("uvf", "1", {
            expires: null
          });
          this.flush()
        }
      };
      byproto.setUvts = function (uvts) {
        this.session = extend(this.session || {}, {
          uvts: uvts
        });
        setCookie(this.config.cookie_name, uvts, {
          domain: this.cookieDomain()
        });
        if (!this.firedUvts) {
          if (typeof this.config.onUvts === "function") {
            this.config.onUvts(uvts)
          }
          this.firedUvts = true
        }
      };
      byproto.getUvts = function () {
        if (this.session) {
          return this.session.uvts
        } else {
          return null
        }
      };
      byproto.updateSession = function (hash) {
        var i, k;
        this.session = extend(this.session || {}, hash);
        for (i = 0; i < SessionKeys.length; i += 1) {
          k = SessionKeys[i];
          if (hash[k] !== undefined) {
            setInLocalStorage(k, hash[k])
          }
        }
      };
      byproto.setConfig = function (hash) {
        this.config = extend(this.config, hash)
      };
      byproto.setChannel = function (channel) {
        this.setConfig({
          channel: channel
        })
      };
      byproto.track = function (evt, props, channel) {
        var e = {
          evt: evt,
          props: props
        };
        if (channel) {
          e.channel = channel
        }
        this.tracks.push(e);
        this.flush()
      };
      byproto.trackExternalView = function () {
        if (this.config.channel === "external") {
          this.track("view_page", {
            u: document.location.toString(),
            r: document.referrer
          })
        }
      };
      byproto.flush = function () {
        if (!this.isReady || !this.config.enabled) {
          return
        }
        var i, hasIdentity = values(this.props).length > 0,
          track, uvts = this.getUvts(),
          l;
        if ((this.tracks.length === 0) && (!uvts || (hasIdentity && !this.identified))) {
          this.tracks.push({
            evt: "identify"
          })
        }
        l = this.tracks.length;
        if (!uvts && !this.shouldTrack()) {
          return
        }
        for (i = 0; i < l; i += 1) {
          track = this.tracks.shift();
          if (!this.identified && (hasIdentity || !uvts)) {
            this.sendTrack(track.channel || this.config.channel, track.evt, track.props, this.props);
            this.identified = true;
            break
          } else {
            this.sendTrack(track.channel || this.config.channel, track.evt, track.props)
          }
        }
      };
      byproto.sendTrack = function (channel, evt, eventProps, props) {
        var url = [this.config.domain, "/t/", this.subdomain, "/", ChannelMinifier[channel] || "_", "/", EventMinifier[evt] || "_"],
          data = {}, uvts = this.getUvts();
        if (uvts) {
          url.push("/");
          url.push(uvts)
        }
        url.push("/track.js?_=" + new Date().getTime());
        url.push("&s=" + (this.hasSession ? "1" : "0"));
        url = url.join("");
        if (props && values(props).length > 0) {
          data.u = props
        }
        if (eventProps && values(eventProps).length > 0) {
          data.e = eventProps
        }
        this.log("SENDING TRACK: ", url, data);
        if (values(data).length > 0) {
          data = encodeURIComponent(base64Encode(jsonStringify(data)))
        } else {
          data = null
        } if (false && CORS) {} else {
          var embed, script, params;
          params = ["&c=", this.sessionCallbackName()];
          if (data) {
            params.push("&d=");
            params.push(data)
          }
          embed = document.getElementsByTagName("script")[0];
          script = document.createElement("script");
          script.type = "application/javascript";
          script.async = true;
          script.defer = true;
          script.src = url + params.join("");
          embed.parentNode.insertBefore(script, embed)
        }
      };
      byproto.ready = function () {
        if (this.isReady) {
          return
        }
        this.isReady = true;
        this.flush();
        this.afterReady()
      };
      byproto.afterReady = function () {};
      byproto.shouldTrack = function () {
        return (!isSpider() && this.haveCookies())
      };
      byproto.haveCookies = function () {
        if (this.cookieable === null) {
          setCookie("__uvt", "1");
          this.cookieable = !! getCookie("__uvt");
          setCookie("__uvt", "")
        }
        this.log("COOKIEABLE: " + this.cookieable);
        return this.cookieable
      };
      byproto.log = function () {
        if (this.config.logging_enabled) {
          log.apply(null, arguments)
        }
      };
      var ChannelMinifier = {
        external: "x",
        classic_widget: "w",
        smartvote_widget: "e",
        instant_answers_widget: "o",
        satisfaction_widget: "t",
        site2: "s",
        admin: "a"
      };
      var EventMinifier = {
        view_page: "p",
        view_forum: "m",
        view_topic: "c",
        view_kb: "k",
        view_channel: "o",
        view_idea: "i",
        view_article: "f",
        view_comparison: "a",
        authenticate: "u",
        search_ideas: "s",
        search_articles: "r",
        vote_idea: "v",
        vote_article: "z",
        submit_ticket: "t",
        submit_idea: "d",
        subscribe_idea: "b",
        rate_satisfaction: "e",
        identify: "y",
        comment_idea: "h",
        dismiss: "w",
        autoprompt: "x",
        pick_idea: "1",
        view_tweet_button: "2",
        clicked_tweet_button: "3",
        posted_tweet: "4"
      };
      var SessionKeys = ["created_at", "last_sat_at", "last_smartvote_at", "dismissed_smartvote_at", "active_days", "sat_prompted"];
      Babayaga.default_config = {
        cookie_name: "uvts",
        domain: "https://by.uservoice.com",
        channel: "external",
        enabled: true,
        logging_enabled: false
      };
      Babayaga.helpers = {
        base64Encode: base64Encode,
        jsonStringify: jsonStringify,
        jsonParse: jsonParse,
        extend: extend,
        values: values,
        sanitizeHash: sanitizeHash,
        setCookie: setCookie,
        getCookie: getCookie,
        getTzOffset: getTzOffset,
        lpad: lpad,
        trim: trim,
        log: log
      };
      return Babayaga
    }(this));
    var base64Encode = Babayaga.helpers.base64Encode,
      jsonStringify = Babayaga.helpers.jsonStringify,
      jsonParse = Babayaga.helpers.jsonParse,
      extend = Babayaga.helpers.extend,
      values = Babayaga.helpers.values,
      sanitizeHash = Babayaga.helpers.sanitizeHash,
      setCookie = Babayaga.helpers.setCookie,
      getCookie = Babayaga.helpers.getCookie,
      getTzOffset = Babayaga.helpers.getTzOffset,
      lpad = Babayaga.helpers.lpad,
      trim = Babayaga.helpers.trim,
      log = Babayaga.helpers.log;

    function error(message) {
      log("Error: " + message + " See https://www.uservoice.com/o/javascript-sdk for more help.")
    }
    var widgetEnvironmentCss = ".uv-icon{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:inline-block;cursor:pointer;position:relative;-webkit-transition:all 300ms;-moz-transition:all 300ms;-o-transition:all 300ms;transition:all 300ms;width:39px;height:39px;position:fixed;z-index:100002;opacity:0.8;-webkit-transition:opacity 100ms;-moz-transition:opacity 100ms;-o-transition:opacity 100ms;transition:opacity 100ms}.uv-icon.uv-bottom-right{bottom:10px;right:12px}.uv-icon.uv-top-right{top:10px;right:12px}.uv-icon.uv-bottom-left{bottom:10px;left:12px}.uv-icon.uv-top-left{top:10px;left:12px}.uv-icon.uv-is-selected,.uv-icon:hover{opacity:1}.uv-icon svg{width:39px;height:39px}.uv-popover{font-family:sans-serif;font-weight:100;font-size:13px;color:black;position:fixed;z-index:100001}.uv-popover-content{-webkit-border-radius:5px;-moz-border-radius:5px;-ms-border-radius:5px;-o-border-radius:5px;border-radius:5px;background:white;position:relative;width:325px;height:325px;-webkit-transition:background 200ms;-moz-transition:background 200ms;-o-transition:background 200ms;transition:background 200ms}.uv-bottom .uv-popover-content{-webkit-box-shadow:rgba(0,0,0,0.3) 0 -10px 60px,rgba(0,0,0,0.1) 0 0 20px;-moz-box-shadow:rgba(0,0,0,0.3) 0 -10px 60px,rgba(0,0,0,0.1) 0 0 20px;box-shadow:rgba(0,0,0,0.3) 0 -10px 60px,rgba(0,0,0,0.1) 0 0 20px}.uv-top .uv-popover-content{-webkit-box-shadow:rgba(0,0,0,0.3) 0 10px 60px,rgba(0,0,0,0.1) 0 0 20px;-moz-box-shadow:rgba(0,0,0,0.3) 0 10px 60px,rgba(0,0,0,0.1) 0 0 20px;box-shadow:rgba(0,0,0,0.3) 0 10px 60px,rgba(0,0,0,0.1) 0 0 20px}.uv-left .uv-popover-content{-webkit-box-shadow:rgba(0,0,0,0.3) 10px 0 60px,rgba(0,0,0,0.1) 0 0 20px;-moz-box-shadow:rgba(0,0,0,0.3) 10px 0 60px,rgba(0,0,0,0.1) 0 0 20px;box-shadow:rgba(0,0,0,0.3) 10px 0 60px,rgba(0,0,0,0.1) 0 0 20px}.uv-right .uv-popover-content{-webkit-box-shadow:rgba(0,0,0,0.3) -10px 0 60px,rgba(0,0,0,0.1) 0 0 20px;-moz-box-shadow:rgba(0,0,0,0.3) -10px 0 60px,rgba(0,0,0,0.1) 0 0 20px;box-shadow:rgba(0,0,0,0.3) -10px 0 60px,rgba(0,0,0,0.1) 0 0 20px}.uv-ie8 .uv-popover-content{position:relative}.uv-ie8 .uv-popover-content .uv-popover-content-shadow{display:block;background:black;content:'';position:absolute;left:-15px;top:-15px;width:100%;height:100%;filter:progid:DXImageTransform.Microsoft.Blur(PixelRadius=15,MakeShadow=true,ShadowOpacity=0.30);z-index:-1}.uv-popover-tail{border:8px solid transparent;width:0;z-index:10;position:absolute;-webkit-transition:border-top-color 200ms;-moz-transition:border-top-color 200ms;-o-transition:border-top-color 200ms;transition:border-top-color 200ms}.uv-top .uv-popover-tail{bottom:-20px;border-top:12px solid white}.uv-bottom .uv-popover-tail{top:-20px;border-bottom:12px solid white}.uv-left .uv-popover-tail{right:-20px;border-left:12px solid white}.uv-right .uv-popover-tail{left:-20px;border-right:12px solid white}.uv-popover-loading{background:white;-webkit-border-radius:5px;-moz-border-radius:5px;-ms-border-radius:5px;-o-border-radius:5px;border-radius:5px;position:absolute;width:100%;height:100%;left:0;top:0}.uv-popover-loading-text{position:absolute;top:50%;margin-top:-0.5em;width:100%;text-align:center}.uv-popover-iframe-container{height:100%}.uv-popover-iframe{-webkit-border-radius:5px;-moz-border-radius:5px;-ms-border-radius:5px;-o-border-radius:5px;border-radius:5px;overflow:hidden}.uv-is-hidden{display:none}.uv-is-invisible{display:block !important;visibility:hidden !important}.uv-is-transitioning{display:block !important}.uv-no-transition{-moz-transition:none !important;-webkit-transition:none !important;-o-transition:color 0 ease-in !important;transition:none !important}.uv-fade{opacity:1;-webkit-transition:opacity 200ms ease-out;-moz-transition:opacity 200ms ease-out;-o-transition:opacity 200ms ease-out;transition:opacity 200ms ease-out}.uv-fade.uv-is-hidden{opacity:0}.uv-scale-top,.uv-scale-top-left,.uv-scale-top-right,.uv-scale-bottom,.uv-scale-bottom-left,.uv-scale-bottom-right,.uv-scale-right,.uv-scale-right-top,.uv-scale-right-bottom,.uv-scale-left,.uv-scale-left-top,.uv-scale-left-bottom,.uv-slide-top,.uv-slide-bottom,.uv-slide-left,.uv-slide-right{opacity:1;-webkit-transition:all 80ms ease-out;-moz-transition:all 80ms ease-out;-o-transition:all 80ms ease-out;transition:all 80ms ease-out}.uv-scale-top.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateY(-15%);-moz-transform:scale(0.8) translateY(-15%);-ms-transform:scale(0.8) translateY(-15%);-o-transform:scale(0.8) translateY(-15%);transform:scale(0.8) translateY(-15%)}.uv-scale-top-left.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateY(-15%) translateX(-10%);-moz-transform:scale(0.8) translateY(-15%) translateX(-10%);-ms-transform:scale(0.8) translateY(-15%) translateX(-10%);-o-transform:scale(0.8) translateY(-15%) translateX(-10%);transform:scale(0.8) translateY(-15%) translateX(-10%)}.uv-scale-top-right.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateY(-15%) translateX(10%);-moz-transform:scale(0.8) translateY(-15%) translateX(10%);-ms-transform:scale(0.8) translateY(-15%) translateX(10%);-o-transform:scale(0.8) translateY(-15%) translateX(10%);transform:scale(0.8) translateY(-15%) translateX(10%)}.uv-scale-bottom.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateY(15%);-moz-transform:scale(0.8) translateY(15%);-ms-transform:scale(0.8) translateY(15%);-o-transform:scale(0.8) translateY(15%);transform:scale(0.8) translateY(15%)}.uv-scale-bottom-left.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateY(15%) translateX(-10%);-moz-transform:scale(0.8) translateY(15%) translateX(-10%);-ms-transform:scale(0.8) translateY(15%) translateX(-10%);-o-transform:scale(0.8) translateY(15%) translateX(-10%);transform:scale(0.8) translateY(15%) translateX(-10%)}.uv-scale-bottom-right.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateY(15%) translateX(10%);-moz-transform:scale(0.8) translateY(15%) translateX(10%);-ms-transform:scale(0.8) translateY(15%) translateX(10%);-o-transform:scale(0.8) translateY(15%) translateX(10%);transform:scale(0.8) translateY(15%) translateX(10%)}.uv-scale-right.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateX(15%);-moz-transform:scale(0.8) translateX(15%);-ms-transform:scale(0.8) translateX(15%);-o-transform:scale(0.8) translateX(15%);transform:scale(0.8) translateX(15%)}.uv-scale-right-top.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateX(15%) translateY(-10%);-moz-transform:scale(0.8) translateX(15%) translateY(-10%);-ms-transform:scale(0.8) translateX(15%) translateY(-10%);-o-transform:scale(0.8) translateX(15%) translateY(-10%);transform:scale(0.8) translateX(15%) translateY(-10%)}.uv-scale-right-bottom.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateX(15%) translateY(10%);-moz-transform:scale(0.8) translateX(15%) translateY(10%);-ms-transform:scale(0.8) translateX(15%) translateY(10%);-o-transform:scale(0.8) translateX(15%) translateY(10%);transform:scale(0.8) translateX(15%) translateY(10%)}.uv-scale-left.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateX(-15%);-moz-transform:scale(0.8) translateX(-15%);-ms-transform:scale(0.8) translateX(-15%);-o-transform:scale(0.8) translateX(-15%);transform:scale(0.8) translateX(-15%)}.uv-scale-left-top.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateX(-15%) translateY(-10%);-moz-transform:scale(0.8) translateX(-15%) translateY(-10%);-ms-transform:scale(0.8) translateX(-15%) translateY(-10%);-o-transform:scale(0.8) translateX(-15%) translateY(-10%);transform:scale(0.8) translateX(-15%) translateY(-10%)}.uv-scale-left-bottom.uv-is-hidden{opacity:0;-webkit-transform:scale(0.8) translateX(-15%) translateY(10%);-moz-transform:scale(0.8) translateX(-15%) translateY(10%);-ms-transform:scale(0.8) translateX(-15%) translateY(10%);-o-transform:scale(0.8) translateX(-15%) translateY(10%);transform:scale(0.8) translateX(-15%) translateY(10%)}.uv-slide-top.uv-is-hidden{-webkit-transform:translateY(-100%);-moz-transform:translateY(-100%);-ms-transform:translateY(-100%);-o-transform:translateY(-100%);transform:translateY(-100%)}.uv-slide-bottom.uv-is-hidden{-webkit-transform:translateY(100%);-moz-transform:translateY(100%);-ms-transform:translateY(100%);-o-transform:translateY(100%);transform:translateY(100%)}.uv-slide-left.uv-is-hidden{-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);-ms-transform:translateX(-100%);-o-transform:translateX(-100%);transform:translateX(-100%)}.uv-slide-right.uv-is-hidden{-webkit-transform:translateX(100%);-moz-transform:translateX(100%);-ms-transform:translateX(100%);-o-transform:translateX(100%);transform:translateX(100%)}\n";
    var PostMessageHandler = (function () {
      function PostMessageHandler(events) {
        this.events = events;
        this.timer = null;
        this.last_hash = null
      }
      PostMessageHandler.prototype.listen = function () {
        var manager = this;
        if ("postMessage" in window) {
          if ("addEventListener" in window) {
            window.addEventListener("message", function (evt) {
              manager.dispatchEvent.apply(manager, [evt])
            }, false)
          } else {
            window.attachEvent("onmessage", function (evt) {
              manager.dispatchEvent.apply(manager, [evt])
            })
          }
        }
        return this
      };
      PostMessageHandler.prototype.dispatchEvent = function (evt) {
        var message = evt.data;
        try {
          message = jsonParse(message)
        } catch (e) {}
        if (message === Object(message)) {
          for (var key in message) {
            if (message.hasOwnProperty(key) && this.events.hasOwnProperty(key)) {
              this.events[key](message[key], evt.source, evt.origin)
            }
          }
        } else {
          if (this.events.hasOwnProperty(message)) {
            this.events[message]()
          }
        }
      };
      PostMessageHandler.getHash = function () {
        var match = window.location.href.match(/#(.*)$/);
        return match ? match[1] : ""
      };
      return PostMessageHandler
    }());
    var UA = {};
    if ((/IEMobile/i).test(navigator.userAgent)) {
      UA.ieMobile = true
    } else {
      if ((/msie (\d+\.\d+);/i).test(navigator.userAgent)) {
        UA.ie = true;
        UA.version = parseInt(RegExp.$1, 10);
        UA["ie" + UA.version] = true;
        if (UA.version === 7 && (/Trident/i).test(navigator.userAgent)) {
          UA.ieCompatibility = true
        }
        if (document.compatMode && document.compatMode === "BackCompat") {
          UA.ieQuirks = true
        }
      } else {
        if (("ontouchstart" in window) && (/like Mac OS X/i).test(navigator.userAgent)) {
          UA.iOS = true
        } else {
          if ("ontouchstart" in window) {
            UA.touch = true
          }
        }
      }
    }
    UA.handheld = (/iPhone|IEMobile|Android/i).test(window.navigator.userAgent);
    var $ = (function () {
      var $ = function () {
        var el, tagName, className;
        if (arguments.length === 1) {
          el = document;
          tagName = "div";
          className = arguments[0]
        } else {
          if (arguments.length === 2) {
            el = arguments[0];
            tagName = "div";
            className = arguments[1]
          } else {
            el = arguments[0];
            tagName = arguments[1];
            className = arguments[2]
          }
        } if (el.querySelector) {
          return el.querySelector(tagName + "." + className)
        } else {
          var els = el.getElementsByTagName(tagName),
            regexp = new RegExp("\b" + className + "\b", "gmi");
          for (var i = 0; i < els.length; i++) {
            if (regexp.test(els[i].className)) {
              return els[i]
            }
          }
          return null
        }
      };
      var uniqIdCount = 0;
      $.uniqId = function () {
        uniqIdCount += 1;
        return "uv-" + uniqIdCount
      };
      $.identify = function (el) {
        var id = el.getAttribute("id");
        if (id) {
          return id
        } else {
          id = $.uniqId();
          el.setAttribute("id", id);
          return id
        }
      };
      $.data = (function () {
        var d = {};

        function data(el, key, value) {
          var id = $.identify(el);
          d[id] = d[id] || {};
          if (arguments.length > 2) {
            return d[id][key] = value
          } else {
            return d[id][key]
          }
        }
        return data
      })();
      $.addClass = function (el, name) {
        if ((new RegExp("(^|\\s+)" + name + "(\\s+|$)")).test(el.className)) {
          return
        }
        el.className += (el.className ? " " : "") + name
      };
      $.removeClass = function (el, name) {
        el.className = el.className.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), " ")
      };
      $.hasClass = function (el, name) {
        return el.className.indexOf(name) > -1
      };
      $.dimensions = function (el) {
        var d = el.display;
        if (d !== "none" && d !== null) {
          return {
            width: el.offsetWidth,
            height: el.offsetHeight
          }
        }
        var s = el.style,
          vis = s.visibility,
          pos = s.position,
          dis = s.display;
        s.visibility = "hidden";
        s.position = "absolute";
        s.display = "block";
        var w = el.clientWidth,
          h = el.clientHeight;
        s.display = dis;
        s.position = pos;
        s.visibility = vis;
        return {
          width: w,
          height: h
        }
      };
      $.offset = function (el) {
        var e = el,
          o = {
            top: 0,
            left: 0
          };
        while (e) {
          o.top += e.offsetTop;
          o.left += e.offsetLeft;
          e = e.offsetParent
        }
        return o
      };
      $.on = function (el, name, f) {
        if ("addEventListener" in el) {
          el.addEventListener(name, f, false)
        } else {
          el.attachEvent("on" + name, function () {
            return f.call(el, window.event)
          })
        }
      };
      $.off = function (el, name, f) {
        if ("removeEventListener" in el) {
          el.removeEventListener(name, f, false)
        } else {
          el.detachEvent(name, f)
        }
      };
      $.one = function (el, name, f) {
        var wrapper = function () {
          f(arguments);
          $.off(el, name, wrapper)
        };
        $.on(el, name, wrapper)
      };
      $.ready = function (f) {
        if (document.addEventListener) {
          if ("complete" === document.readyState) {
            f()
          } else {
            document.addEventListener("DOMContentLoaded", f, false);
            window.addEventListener("load", f, false)
          }
        } else {
          if (document.attachEvent) {
            document.attachEvent("onreadystatechange", f);
            window.attachEvent("onload", f);
            var topf = false;
            try {
              topf = (window.frameElement === null)
            } catch (e) {}
            if (document.documentElement.doScroll && topf) {
              function scrollCheck() {
                try {
                  document.documentElement.doScroll("left")
                } catch (e) {
                  setTimeout(scrollCheck, 1);
                  return
                }
                f()
              }
            }
          }
        }
      };
      $.element = function (el) {
        if (el.nodeName) {
          return el
        } else {
          return document.getElementById(el.substr(1))
        }
      };
      $.getComputedStyle = function (el) {
        var style = window.getComputedStyle(el);
        return style ? style : {}
      };
      return $
    })();

    function copyNodeList(nodeList) {
      var array = [];
      for (var i = 0; i < nodeList.length; i++) {
        array.push(nodeList[i])
      }
      return array
    }

    function constrainedOffset(center, size, min, max, margin) {
      var x = center - size / 2;
      if (x - margin < min) {
        x = min + margin
      }
      if (x + size + margin > max) {
        x = max - size - margin
      }
      return x
    }

    function prepareTransition(el) {
      if ("getComputedStyle" in window) {
        var props = ["transitionDuration", "MozTransitionDuration", "WebkitTransitionDuration", "OTransitionDuration", "msTransitionDuration"],
          duration = 0;
        for (var i = 0, l = props.length; i < l; i++) {
          var prop = props[i],
            value = $.getComputedStyle(el)[prop] || el.style[prop];
          if (value) {
            duration = 1000 * parseFloat(value);
            break
          }
        }
        if (duration !== 0) {
          var timer = $.data(el, "transition-timer"),
            timeoutAt = $.data(el, "transition-timeout-at"),
            finishAt = +new Date() + duration;
          $.addClass(el, "uv-is-transitioning");
          el.offsetWidth;
          if (timer === undefined || (finishAt > timeoutAt)) {
            clearTimeout(timer);
            $.data(el, "transition-timer", setTimeout(function () {
              $.removeClass(el, "uv-is-transitioning");
              el.offsetWidth
            }, duration));
            $.data(el, "transition-timeout-at", finishAt)
          }
        }
      }
    }

    function createViewportMetaTag(content) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      meta.setAttribute("content", content);
      document.head.appendChild(meta)
    }

    function getViewportMetaTag() {
      var metas = document.getElementsByTagName("meta"),
        meta;
      for (var i = 0; i < metas.length; i++) {
        if ((/viewport/i).test(metas[i].getAttribute("name"))) {
          meta = metas[i];
          break
        }
      }
      return meta
    }
    var zoomLocked = false,
      originalViewportMetaTag;

    function lockZoom() {
      if (!zoomLocked) {
        var meta = getViewportMetaTag(),
          zoom = /user-scalable\s*=\s*(0|1|no|yes)/;
        if (meta) {
          originalViewportMetaTag = meta;
          var content = meta.getAttribute("content");
          meta.parentNode.removeChild(meta);
          if (zoom.test(content)) {
            createViewportMetaTag(content.replace(zoom, "user-scalable=0"))
          } else {
            createViewportMetaTag(content + "; user-scalable=0")
          }
        } else {
          createViewportMetaTag("user-scalable=0")
        }
        zoomLocked = true
      }
    }

    function unlockZoom() {
      if (zoomLocked) {
        var meta = getViewportMetaTag();
        meta.parentNode.removeChild(meta);
        if (originalViewportMetaTag) {
          document.head.appendChild(originalViewportMetaTag)
        } else {
          createViewportMetaTag("user-scalable=1")
        }
        zoomLocked = false
      }
    }

    function render(template, params) {
      return template.replace(/\#\{([^{}]*)\}/g, function (a, b) {
        var r = params[b];
        return typeof r === "string" || typeof r === "number" ? r : a
      })
    }

    function insertHtml(html) {
      var dummy = document.createElement("div");
      dummy.innerHTML = html;
      document.body.insertBefore(dummy.firstChild, document.body.firstChild);
      return document.body.firstChild
    }

    function htmlentities(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }

    function param(obj, encoder) {
      encoder || (encoder = function (identity) {
        return identity
      });
      var params = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var param = encoder(key) + "=" + encoder(obj[key]);
          params.push(param)
        }
      }
      return params.join("&")
    }

    function deepMerge(obj) {
      var extenders = Array.prototype.slice.call(arguments, 1),
        l = extenders.length,
        i = 0;
      for (; i < l; i++) {
        for (var k in extenders[i]) {
          if (extenders[i].hasOwnProperty(k)) {
            if (typeof obj[k] === "object" && typeof extenders[i][k] === "object") {
              deepMerge(obj[k], extenders[i][k])
            } else {
              obj[k] = extenders[i][k]
            }
          }
        }
      }
      return obj
    }

    function includeCss(css, media) {
      var styles = document.createElement("style");
      styles.type = "text/css";
      styles.media = media || "screen";
      if (styles.styleSheet) {
        styles.styleSheet.cssText = css
      } else {
        styles.appendChild(document.createTextNode(css))
      }
      document.getElementsByTagName("head")[0].appendChild(styles)
    }
    var printCssIncluded = false;

    function includePrintCss() {
      if (!printCssIncluded) {
        includeCss("#uvTab, .uv-tray, .uv-icon, .uv-popover, .uv-bubble {display:none !important;}", "print");
        printCssIncluded = true
      }
    }

    function htmlElement() {
      return document.getElementsByTagName("html")[0]
    }

    function pageDimensions() {
      var de = document.documentElement;
      var width = (de && de.clientWidth) || document.body.clientWidth;
      var height = window.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
      return {
        width: width,
        height: height
      }
    }

    function getScrollTop() {
      var scrollTop;
      if (typeof (window.pageYOffset) === "number") {
        scrollTop = window.pageYOffset
      } else {
        if (document.body && (document.body.scrollTop)) {
          scrollTop = document.body.scrollTop
        } else {
          if (document.documentElement && (document.documentElement.scrollTop)) {
            scrollTop = document.documentElement.scrollTop
          }
        }
      }
      return scrollTop
    }

    function getDocumentHeight() {
      var D = document;
      return Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight))
    }
    var assetHost = [("https:" === document.location.protocol ? "https://" : "http://"), "widget.uservoice.com"].join("");
    var tabCss = {
      "tab-light-bottom-right": "background:red url(#{bgImage}) 0 50% no-repeat;border:1px solid red;border-bottom:none;-moz-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;border-radius:4px 4px 0 0;-moz-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;right:10px;bottom:0;z-index:9999;background-color:##{color};border-color:##{color};",
      "tab-dark-bottom-right": "background:red url(#{bgImage}) 0 50% no-repeat;border:1px solid #FFF;border-bottom:none;-moz-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;border-radius:4px 4px 0 0;-moz-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;right:10px;bottom:0;z-index:9999;background-color:##{color};",
      "tab-light-top-right": "background:red url(#{bgImage}) 0 50% no-repeat;border:1px solid red;border-top:none;-moz-border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;border-radius:0 0 4px 4px;-moz-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;right:10px;top:0;z-index:9999;background-color:##{color};border-color:##{color};",
      "tab-dark-top-right": "background:red url(#{bgImage}) 0 50% no-repeat;border:1px solid #FFF;border-top:none;-moz-border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;border-radius:0 0 4px 4px;-moz-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;right:10px;top:0;z-index:9999;background-color:##{color};",
      "tab-light-bottom-left": "background:red url(#{bgImage}) 0 50% no-repeat;border:1px solid red;border-bottom:none;-moz-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;border-radius:4px 4px 0 0;-moz-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;left:10px;bottom:0;z-index:9999;background-color:##{color};border-color:##{color};",
      "tab-dark-bottom-left": "background:red url(#{bgImage}) 0 50% no-repeat;border:1px solid #FFF;border-bottom:none;-moz-border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;border-radius:4px 4px 0 0;-moz-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;left:10px;bottom:0;z-index:9999;background-color:##{color};",
      "tab-light-top-left": "background:red url(#{bgImage}) 0 50% no-repeat;border:1px solid red;border-top:none;-moz-border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;border-radius:0 0 4px 4px;-moz-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;left:10px;top:0;z-index:9999;background-color:##{color};border-color:##{color};",
      "tab-dark-top-left": "background:red url(#{bgImage}) 0 50% no-repeat;border:1px solid #FFF;border-top:none;-moz-border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px;border-radius:0 0 4px 4px;-moz-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;left:10px;top:0;z-index:9999;background-color:##{color};",
      "tab-light-middle-left": "background:red url(#{bgImage}) 50% 0 no-repeat;border:1px solid red;border-left:none;-moz-border-radius:0 4px 4px 0;-webkit-border-radius:0 4px 4px 0;border-radius:0 4px 4px 0;-moz-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;left:0;top:50%;z-index:9999;background-color:##{color};border-color:##{color};",
      "tab-dark-middle-left": "background:red url(#{bgImage}) 50% 0 no-repeat;border:1px solid #FFF;border-left:none;-moz-border-radius:0 4px 4px 0;-webkit-border-radius:0 4px 4px 0;border-radius:0 4px 4px 0;-moz-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;left:0;top:50%;z-index:9999;background-color:##{color};",
      "tab-light-middle-right": "background:red url(#{bgImage}) 50% 0 no-repeat;border:1px solid red;border-right:none;-moz-border-radius:4px 0 0 4px;-webkit-border-radius:4px 0 0 4px;border-radius:4px 0 0 4px;-moz-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.9) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;right:0;top:50%;z-index:9999;background-color:##{color};border-color:##{color};",
      "tab-dark-middle-right": "background:red url(#{bgImage}) 50% 0 no-repeat;border:1px solid #FFF;border-right:none;-moz-border-radius:4px 0 0 4px;-webkit-border-radius:4px 0 0 4px;border-radius:4px 0 0 4px;-moz-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;-webkit-box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;box-shadow:inset rgba(255,255,255,.25) 1px 1px 1px, rgba(0,0,0,.5) 0 1px 2px;font:normal normal bold 14px/1em Arial, sans-serif;position:fixed;right:0;top:50%;z-index:9999;background-color:##{color};",
      "link-vertical": "display:block;padding:39px 5px 10px 5px;text-decoration:none;",
      "link-horizontal": "display:block;padding:6px 10px 2px 42px;text-decoration:none;",
      "link-vertical-no-bullhorn": "display:block;padding:10px 5px 10px 5px;text-decoration:none;",
      "link-horizontal-no-bullhorn": "display:block;padding:6px 10px 2px 10px;text-decoration:none;"
    };
    var dialogCss = "    html.uvw-dialog-open object,    html.uvw-dialog-open iframe,    html.uvw-dialog-open embed {      visibility: hidden;    }    html.uvw-dialog-open iframe.uvw-dialog-iframe {      visibility: visible;    }    ";
    var Tab = (function () {
      function Tab(options) {
        this.template = '<div id="uvTab" style="#{tabStyle}"><a id="uvTabLabel" style="background-color: transparent; #{linkStyle}" href="javascript:return false;"><img src="#{imgSrc}" alt="#{tab_label}" style="border:0; background-color: transparent; padding:0; margin:0;" /></a></div>';
        this.widgets = [];
        this.options = options;
        this.processOptions()
      }
      Tab.prototype.push = function (widget) {
        this.widget = widget;
        this.widgets.push(widget)
      };
      Tab.prototype.pop = function () {
        if (this.widgets.length === 1) {
          return
        }
        this.widgets.pop();
        this.widget = this.widgets[this.widgets.length - 1]
      };
      Tab.prototype.render = function () {
        if (this.el && this.el.parentNode) {
          this.el.parentNode.removeChild(this.el)
        }
        var img = new Image();
        var self = this;
        $.on(img, "load", function () {
          self.createElement();
          self.show()
        });
        img.src = this.options.imgSrc;
        includePrintCss()
      };
      Tab.prototype.createElement = function () {
        var el = this.el = insertHtml(render(this.template, this.options)),
          a = el.getElementsByTagName("a")[0],
          self = this;
        $.addClass(el, "uv-tab uv-slide-" + this.edge);
        this.dimensions = $.dimensions(el);
        this.hide(false);
        if (this.rotation) {
          el.style.marginTop = ["-", Math.round(this.dimensions.height / 2), "px"].join("")
        }
        $.on(a, "click", function (e) {
          e.preventDefault && e.preventDefault();
          if (self.visibleWidget) {
            self.visibleWidget.hide()
          } else {
            self.widget.show()
          }
          return false
        })
      };
      Tab.prototype.remove = function () {
        this.widget.hide();
        this.hide()
      };
      Tab.prototype.hide = function (animate) {
        animate = animate === undefined ? true : animate;
        if (animate) {
          prepareTransition(this.el)
        }
        $.addClass(this.el, "uv-is-hidden");
        this.el.offsetWidth
      };
      Tab.prototype.show = function () {
        prepareTransition(this.el);
        $.removeClass(this.el, "uv-is-hidden");
        this.el.offsetWidth
      };
      Tab.prototype.processOptions = function () {
        var defaults = {
          trigger_position: "right",
          trigger_background_color: "CC6D00",
          tab_label: "feedback",
          tab_inverted: false
        };
        var opts = extend({}, defaults, this.options);
        if (!opts.trigger_position.match(/^((top|bottom|middle)-(left|right)|left|right)$/)) {
          opts.trigger_position = defaults.trigger_position
        }
        if (opts.trigger_position.match(/^(right|left)$/)) {
          opts.trigger_position = "middle-" + opts.trigger_position
        }
        if (typeof opts.trigger_background_color === "string" && opts.trigger_background_color.match(/^#/)) {
          opts.trigger_background_color = opts.trigger_background_color.substring(1)
        }
        var posArray = /([^\-]+)-([^\-]+)/.exec(opts.trigger_position);
        var verticalPos = posArray[1];
        var horizontalPos = posArray[2];
        var rotation = posArray[1] === "middle" ? 90 : 0;
        var whiteLabel = UserVoice.account.white_labeled ? "-no-bullhorn" : "";
        var tabStyle = ["tab-", opts.inverted ? "light-" : "dark-", opts.trigger_position].join("");
        var linkStyle = [rotation ? "link-vertical" : "link-horizontal", whiteLabel].join("");
        var image = [assetHost, "/dcache", "/widget/feedback-tab.png?t=", encodeURIComponent(opts.tab_label), "&c=", opts.tab_inverted ? encodeURIComponent(opts.trigger_background_color) : "ffffff", "&r=", encodeURIComponent(rotation), opts.tab_inverted ? "&i=yes" : ""].join("");
        var bgImage = opts.trigger_position.replace(/middle-/, "").replace(/(bottom|top)-(right|left)/, "horizontal");
        bgImage = [assetHost, "/images/clients/widget2/tab-", bgImage, opts.tab_inverted ? "-light" : "-dark", whiteLabel, ".png"].join("");
        opts.bgImage = bgImage;
        opts.imgSrc = image;
        opts.tab_label = htmlentities(opts.tab_label);
        tabStyle = tabCss[tabStyle];
        linkStyle = tabCss[linkStyle];
        if (UA.ie6 || UA.ieQuirks) {
          tabStyle += "position:absolute !important;";
          if (verticalPos === "top") {
            tabStyle += "top: expression(((document.documentElement.scrollTop || document.body.scrollTop) + (!this.offsetHeight && 0)) + 'px');"
          } else {
            if (verticalPos === "middle") {
              tabStyle += "top: expression(((document.documentElement.scrollTop || document.body.scrollTop) + ((((document.documentElement.clientHeight || document.body.clientHeight) + (!this.offsetHeight && 0)) / 2) >> 0)) + 'px');"
            } else {
              if (verticalPos === "bottom") {
                tabStyle += "top: expression(((document.documentElement.scrollTop || document.body.scrollTop) + (document.documentElement.clientHeight || document.body.clientHeight) - this.offsetHeight) + 'px');"
              }
            }
          }
        }
        opts.tabStyle = render(tabStyle, {
          color: opts.trigger_background_color,
          bgImage: opts.bgImage
        });
        opts.linkStyle = linkStyle;
        if (verticalPos === "top") {
          this.edge = "top"
        } else {
          if (verticalPos === "bottom") {
            this.edge = "bottom"
          } else {
            if (horizontalPos === "left") {
              this.edge = "left"
            } else {
              if (horizontalPos === "right") {
                this.edge = "right"
              }
            }
          }
        }
        this.rotation = rotation;
        this.options = opts
      };
      return Tab
    })();
    var Window = (function () {
      function Window() {}
      Window.template = '      <div class="uv-popover-content">        <div class="uv-popover-iframe-container"></div>        <div class="uv-popover-loading"><div class="uv-popover-loading-text">Loading&#8230;</div></div>        <!-- shadow for ie8 -->        <div class="uv-popover-content-shadow"></div>      </div>    ';
      Window.prototype.show = function (animate) {
        animate = animate === undefined ? true : animate;
        WidgetEnv.hideActive();
        WidgetEnv.active = this;
        if (this.trigger) {
          this.trigger.visibleWidget = this
        }
        if (this.trigger && this.trigger.popoverWillShow) {
          this.trigger.popoverWillShow()
        }
        if (animate) {
          this.animateIn()
        } else {
          $.removeClass(this.el, "uv-is-hidden")
        }
        this.iframe.poke({
          show: true
        });
        this.iframe.poke({
          focus: null
        })
      };
      Window.prototype.hide = function (animate) {
        animate = animate === undefined ? true : animate;
        WidgetEnv.active = null;
        if (this.trigger) {
          this.trigger.visibleWidget = null
        }
        if (this.trigger && this.trigger.popoverWillHide) {
          this.trigger.popoverWillHide()
        }
        if (animate) {
          this.animateOut()
        } else {
          $.addClass(this.el, "uv-is-hidden")
        } if (this.temp) {
          var el = this.el;
          setTimeout(function () {
            el.parentNode.removeChild(el)
          }, 500)
        }
      };
      Window.prototype.toggle = function (animate) {
        if (this.visible()) {
          this.hide(animate)
        } else {
          this.show(animate)
        }
      };
      Window.prototype.animateIn = function () {
        this.position();
        prepareTransition(this.el);
        $.removeClass(this.el, "uv-is-hidden");
        this.el.offsetWidth;
        this.createIframe()
      };
      Window.prototype.preload = function () {
        this.createIframe(true)
      };
      Window.prototype.animateOut = function () {
        prepareTransition(this.el);
        $.addClass(this.el, "uv-is-hidden")
      };
      Window.prototype.visible = function () {
        return !$.hasClass(this.el, "uv-is-hidden") && !this.preloading
      };
      Window.prototype.paneOpened = function (key, options) {
        if (options.needsReload) {
          this.needsReload = true
        }
      };
      Window.prototype.position = function () {
        if (this.preloading) {
          $.addClass(this.el, "uv-is-hidden");
          this.el.style.left = "";
          this.preloading = false
        }
        var visible = this.visible();
        $.addClass(this.el, "uv-no-transition");
        if (!visible) {
          $.addClass(this.el, "uv-is-invisible");
          this.el.style.left = "-1000px"
        }
        $.removeClass(this.el, "uv-scale-\\S+");
        this.el.offsetWidth;
        this.calculatePosition();
        this.el.offsetWidth;
        if (!visible) {
          $.removeClass(this.el, "uv-is-invisible")
        }
        $.removeClass(this.el, "uv-no-transition");
        this.el.offsetWidth
      };
      Window.prototype.createIframe = function (preload) {
        var iframeContainer = $(this.el, "uv-popover-iframe-container"),
          loading = $(this.el, "uv-popover-loading"),
          self = this;
        if (this.iframe && !this.needsReload) {
          return
        }
        if (this.iframe) {
          iframeContainer.removeChild(this.iframe.el);
          this.needsReload = false
        }
        if (preload) {
          $.removeClass(this.el, "uv-is-hidden");
          this.el.style.left = "-10000px";
          this.preloading = true
        }
        this.iframe = new Iframe("popover", this.options.widgetType, extend({
          height: "100%"
        }, UserVoice.globalOptions, this.options));
        this.iframe.render();
        $.addClass(this.iframe.el, "uv-popover-iframe");
        iframeContainer.appendChild(this.iframe.el);
        if (UA.ie8) {
          $.addClass(this.el, "uv-ie8")
        }
        $.on(window, "resize", function () {
          if (self.visible()) {
            self.calculatePosition()
          }
        });
        if (loading && loading.parentNode) {
          if (this.iframe.loaded || (UA.ie && UA.version < 10)) {
            loading.parentNode.removeChild(loading)
          } else {
            $.one(this.iframe.el, "load", function (e) {
              if (self.preloading) {
                $.addClass(self.el, "uv-is-hidden");
                self.el.style.left = "";
                self.preloading = false
              }
              loading.parentNode.removeChild(loading)
            })
          }
        }
      };
      Window.prototype.createElement = function () {
        var el = this.el = document.createElement("div");
        el.innerHTML = this.template;
        el.setAttribute("data-html2canvas-ignore", true);
        $.addClass(this.el, "uv-popover uv-is-hidden");
        document.body.appendChild(el)
      };
      return Window
    })();
    var Toast = (function () {
      function Toast(options) {
        this.template = Window.template;
        this.options = options;
        this.createElement();
        includePrintCss()
      }
      Toast.prototype = extend({}, Window.prototype);
      Toast.prototype.show = function () {
        if (UA.handheld) {
          lockZoom()
        }
        Window.prototype.show.apply(this, arguments);
        if (UA.handheld) {
          var toast = this;
          this.sizeForHandheld();
          this.resizeForHandheld = function () {
            toast.sizeForHandheld()
          };
          $.on(window, "scroll", this.resizeForHandheld)
        }
      };
      Toast.prototype.hide = function () {
        Window.prototype.hide.apply(this, arguments);
        if (UA.handheld) {
          unlockZoom();
          $.off(window, "scroll", this.resizeForHandheld);
          this.needsReload = true
        }
      };
      Toast.prototype.sizeForHandheld = function () {
        var toast = this;
        setTimeout(function () {
          var content = $(toast.el, "uv-popover-content"),
            container = $(content, "uv-popover-iframe-container"),
            iframe = $(container, "iframe", "uv-popover-iframe"),
            height = toast.el.offsetHeight,
            width = toast.el.offsetWidth;
          content.style.height = height + "px";
          container.style.height = height + "px";
          iframe.style.height = height + "px";
          content.style.width = width + "px";
          container.style.width = width + "px";
          iframe.style.width = width + "px"
        }, 200)
      };
      Toast.prototype.calculatePosition = function () {
        var position = this.options.position.match(/^(top|bottom)-(left|right)$/) ? this.options.position : "bottom-right",
          keys = /(\w+)-(\w+)/.exec(position);
        this.el.style.zIndex = 100003;
        if (!UA.handheld) {
          var offset = 20;
          this.el.style.left = "";
          this.el.style[keys[1]] = offset + "px";
          this.el.style[keys[2]] = offset + "px"
        } else {
          var content = $(this.el, "uv-popover-content"),
            viewportWidth = window.innerWidth,
            width = 325,
            offset = 10,
            scale = viewportWidth / (width + (offset * 2)),
            scaledOffset = Math.round(scale * offset);
          content.style.width = "100%";
          content.style.height = "100%";
          this.el.style.position = "fixed";
          this.el.style.top = scaledOffset + "px";
          this.el.style.left = scaledOffset + "px";
          this.el.style.bottom = scaledOffset + "px";
          this.el.style.right = scaledOffset + "px"
        }
        $.addClass(this.el, "uv-" + (keys[1] === "bottom" ? "top" : "bottom"));
        $.addClass(this.el, "uv-scale-" + position)
      };
      return Toast
    })();
    var Popover = (function () {
      function Popover(options, trigger) {
        this.template = Window.template + '<div class="uv-popover-tail"></div>';
        this.createElement();
        this.options = options;
        this.trigger = trigger;
        includePrintCss()
      }
      Popover.prototype = extend({}, Window.prototype);
      Popover.prototype.paneOpened = function (key, options) {
        Window.prototype.paneOpened.apply(this, arguments);
        this.setTailColor(options.backgroundColor)
      };
      Popover.prototype.defaultPosition = function (target) {
        var targetOffset = $.offset(target),
          targetDimensions = $.dimensions(target),
          targetPositionStyle = target.currentStyle ? target.currentStyle.position : $.getComputedStyle(target, null).position,
          threshold = 100;
        if (targetPositionStyle !== "fixed") {
          targetOffset.top -= document.body.scrollTop;
          targetOffset.left -= document.body.scrollLeft
        }
        return (targetOffset.top < threshold) ? "bottom" : (targetOffset.top + targetDimensions.height + threshold > pageDimensions().height) ? "top" : (targetOffset.left < threshold) ? "right" : (targetOffset.left + targetDimensions.width + threshold > pageDimensions().width) ? "left" : (targetOffset.top > targetOffset.top + targetDimensions.height - pageDimensions().height) ? "bottom" : "top"
      };
      Popover.prototype.calculatePosition = function () {
        var tail = $(this.el, "uv-popover-tail"),
          target = (this.options.target === "self" ? this.trigger.el : $.element(this.options.target)),
          position = this.options.position === "automatic" ? this.defaultPosition(target) : this.options.position,
          _position = position === "top" ? "bottom" : (position === "right" ? "left" : (position === "left" ? "right" : "top")),
          offsetKey = (position === "top" || position === "bottom") ? "left" : "top",
          sizeKey = offsetKey === "left" ? "width" : "height",
          _offsetKey = offsetKey === "left" ? "top" : "left",
          _sizeKey = sizeKey === "width" ? "height" : "width",
          dimensions = $.dimensions(this.el),
          triggerDimensions = $.dimensions(target),
          triggerOffset = $.offset(target),
          offset = constrainedOffset(triggerOffset[offsetKey] + triggerDimensions[sizeKey] / 2, dimensions[sizeKey], 0, pageDimensions()[sizeKey], 10),
          tailOffset = constrainedOffset(triggerOffset[offsetKey] - offset + triggerDimensions[sizeKey] / 2, $.dimensions(tail)[sizeKey], 0, dimensions[sizeKey], 15),
          relativeTailOffset = (tailOffset - $.dimensions(tail)[sizeKey] / 2) * 1 / dimensions[sizeKey],
          tailEnd = relativeTailOffset <= 1 / 3 ? (offsetKey === "left" ? "-left" : "-top") : (relativeTailOffset <= 2 / 3 ? "" : (offsetKey === "left" ? "-right" : "-bottom")),
          targetPositionStyle = target.currentStyle ? target.currentStyle.position : $.getComputedStyle(target, null).position;
        this.currentPosition = position;
        this.el.style.position = targetPositionStyle === "fixed" ? "fixed" : "absolute";
        this.el.style[offsetKey] = offset + "px";
        tail.style[offsetKey] = tailOffset + "px";
        $.removeClass(this.el, "uv-(bottom|top|left|right)");
        $.addClass(this.el, "uv-" + position);
        $.addClass(this.el, "uv-scale-" + _position + tailEnd);
        if (position === "top" || position === "left") {
          this.el.style[_offsetKey] = (triggerOffset[_offsetKey] - dimensions[_sizeKey] - 14) + "px"
        } else {
          if (position === "bottom" || position === "right") {
            this.el.style[_offsetKey] = (triggerOffset[_offsetKey] + triggerDimensions[_sizeKey] + 14) + "px"
          }
        }
      };
      Popover.prototype.setTailColor = function (color) {
        if (color === "transparent") {
          return
        }
        if (color === "#ffffff" || color === "rgb(255, 255, 255)" || color === "white" || color === "") {
          $.removeClass(this.el, "uv-reversed")
        } else {
          $.addClass(this.el, "uv-reversed")
        }
        $(this.el, "uv-popover-content").style.backgroundColor = color;
        $(this.el, "uv-popover-tail").style["border" + this.currentPosition[0].toUpperCase() + this.currentPosition.slice(1) + "Color"] = color
      };
      return Popover
    })();
    var Icon = (function () {
      function Icon(options) {
        var defaults = {
          trigger_background_color: "rgba(46, 49, 51, 0.6)",
          trigger_position: "bottom-right"
        };
        this.options = extend({}, defaults, options);
        if (!this.options.trigger_position.match(/^(bottom|top)-(left|right)$/)) {
          this.options.trigger_position = defaults.trigger_position
        }
        this.widgets = [];
        includePrintCss()
      }
      Icon.icon_images = {
        contact: '\u003Csvg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\r\n\t width="39px" height="39px" viewBox="0 0 39 39" enable-background="new 0 0 39 39" xml:space="preserve"\u003E\r\n\u003Cg\u003E\r\n\t\u003Cpath class="uv-bubble-background" fill="rgba(46, 49, 51, 0.6)" d="M31.425,34.514c-0.432-0.944-0.579-2.007-0.591-2.999c4.264-3.133,7.008-7.969,7.008-13.409\r\n\t\tC37.842,8.658,29.594,1,19.421,1S1,8.658,1,18.105c0,9.446,7.932,16.79,18.105,16.79c1.845,0,3.94,0.057,5.62-0.412\r\n\t\tc0.979,1.023,2.243,2.3,2.915,2.791c3.785,2.759,7.571,0,7.571,0S32.687,37.274,31.425,34.514z"/\u003E\r\n\t\u003Cg\u003E\r\n\t\t\u003Cg\u003E\r\n\t\t\t\u003Cpath class="uv-bubble-foreground" fill="#FFFFFF" d="M16.943,19.467c0-3.557,4.432-3.978,4.432-6.058c0-0.935-0.723-1.721-2.383-1.721\r\n\t\t\t\tc-1.508,0-2.773,0.725-3.709,1.87l-2.441-2.743c1.598-1.9,4.01-2.924,6.602-2.924c3.891,0,6.271,1.959,6.271,4.765\r\n\t\t\t\tc0,4.4-5.037,4.732-5.037,7.265c0,0.481,0.243,0.994,0.574,1.266l-3.316,0.965C17.303,21.459,16.943,20.522,16.943,19.467z\r\n\t\t\t\t M16.943,26.19c0-1.326,1.114-2.441,2.44-2.441c1.327,0,2.442,1.115,2.442,2.441c0,1.327-1.115,2.441-2.442,2.441\r\n\t\t\t\tC18.058,28.632,16.943,27.518,16.943,26.19z"/\u003E\r\n\t\t\u003C/g\u003E\r\n\t\u003C/g\u003E\r\n\u003C/g\u003E\r\n\u003C/svg\u003E\r\n',
        post_idea: '\u003Csvg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\r\n\t width="39px" height="39px" viewBox="0 0 39 39" enable-background="new 0 0 39 39" xml:space="preserve"\u003E\r\n\u003Cg\u003E\r\n\t\u003Cpath class="uv-bubble-background" fill="rgba(46, 49, 51, 0.6)" d="M31.425,34.514c-0.432-0.944-0.579-2.007-0.591-2.999c4.264-3.133,7.008-7.969,7.008-13.409\r\n\t\tC37.842,8.658,29.594,1,19.421,1S1,8.658,1,18.105c0,9.446,7.932,16.79,18.105,16.79c1.845,0,3.94,0.057,5.62-0.412\r\n\t\tc0.979,1.023,2.243,2.3,2.915,2.791c3.785,2.759,7.571,0,7.571,0S32.687,37.274,31.425,34.514z"/\u003E\r\n\u003C/g\u003E\r\n\u003Cg\u003E\r\n\t\u003Cg\u003E\r\n\t\t\u003Cellipse class="uv-bubble-foreground" fill="#FFFFFF" cx="19.5" cy="25.75" rx="2.5" ry="2.25"/\u003E\r\n\t\t\u003Cpath class="uv-bubble-foreground" fill="#FFFFFF" d="M18.138,22h2.722c0,0,1.191-9.208,1.362-11.379c0.061-0.807,0-2.621,0-2.621h-5.443\r\n\t\t\tc0,0-0.064,1.814,0,2.621C16.947,12.792,18.138,22,18.138,22z"/\u003E\r\n\t\u003C/g\u003E\r\n\u003C/g\u003E\r\n\u003C/svg\u003E\r\n',
        satisfaction: '\u003Csvg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\r\n\t width="39px" height="39px" viewBox="0 0 39 39" enable-background="new 0 0 39 39" xml:space="preserve"\u003E\r\n\u003Cg\u003E\r\n\t\u003Cpath class="uv-bubble-background" fill="rgba(46, 49, 51, 0.6)" d="M31.425,34.514c-0.432-0.944-0.579-2.007-0.591-2.999c4.264-3.133,7.008-7.969,7.008-13.409\r\n\t\tC37.842,8.658,29.594,1,19.421,1S1,8.658,1,18.105c0,9.446,7.932,16.79,18.105,16.79c1.845,0,3.94,0.057,5.62-0.412\r\n\t\tc0.979,1.023,2.243,2.3,2.915,2.791c3.785,2.759,7.571,0,7.571,0S32.687,37.274,31.425,34.514z"/\u003E\r\n\u003C/g\u003E\r\n\u003Cg\u003E\r\n\t\u003Cg\u003E\r\n\t\t\u003Cpath class="uv-bubble-foreground" fill="#FFFFFF" d="M13.501,19.25c0.308,0.3,0.501,0.891,0.427,1.314l-1.02,5.95c-0.073,0.423,0.18,0.604,0.56,0.404\r\n\t\t\tl5.338-2.806c0.381-0.2,1.004-0.2,1.385,0l5.338,2.806c0.38,0.201,0.633,0.018,0.561-0.404l-1.02-5.95\r\n\t\t\tC25,20.141,25.191,19.55,25.499,19.25l4.321-4.21c0.308-0.3,0.211-0.596-0.215-0.658l-5.968-0.868\r\n\t\t\tc-0.426-0.062-0.93-0.427-1.119-0.813l-2.673-5.412c-0.19-0.385-0.501-0.385-0.691,0l-2.671,5.412\r\n\t\t\tc-0.191,0.385-0.695,0.75-1.12,0.813l-5.967,0.868c-0.426,0.062-0.523,0.358-0.215,0.658L13.501,19.25z"/\u003E\r\n\t\u003C/g\u003E\r\n\u003C/g\u003E\r\n\u003C/svg\u003E\r\n',
        smartvote: '\u003Csvg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t width="39px" height="39px" viewBox="0 0 39 39" enable-background="new 0 0 39 39" xml:space="preserve"\u003E\n\u003Cg\u003E\n\t\u003Cpath class="uv-bubble-background" fill="rgba(46, 49, 51, 0.6)"  d="M31.425,34.514c-0.432-0.944-0.579-2.007-0.591-2.999c4.264-3.133,7.008-7.969,7.008-13.409\n\t\tC37.842,8.658,29.594,1,19.421,1S1,8.658,1,18.105c0,9.446,7.932,16.79,18.105,16.79c1.845,0,3.94,0.057,5.62-0.412\n\t\tc0.979,1.023,2.243,2.3,2.915,2.791c3.785,2.759,7.571,0,7.571,0S32.687,37.274,31.425,34.514z"/\u003E\n\u003C/g\u003E\n\u003Cg\u003E\n\t\u003Cg\u003E\n\t\t\u003Cpath class="uv-bubble-foreground" fill="#FFFFFF" d="M24.951,9.07c-0.83-0.836-1.857-1.453-2.976-1.786C21.337,7.096,20.672,7,20,7\n\t\t\tc-1.87,0-3.628,0.736-4.952,2.07C13.728,10.403,13,11.864,13,13.751l0.03,0.648c0.086,0.972,0.368,1.896,0.834,2.752\n\t\t\tc0.776,1.399,2.367,2.849,2.637,4.993l0.163,0.972C16.809,23.703,17.105,24,17.549,24h5.054c0.445,0,0.742-0.297,0.884-0.884\n\t\t\tl0.014-0.972c0.268-2.144,1.802-3.593,2.657-4.993c0.443-0.855,0.725-1.779,0.811-2.752L27,13.751\n\t\t\tC26.999,11.864,26.271,10.405,24.951,9.07z M17.101,26.554h5.741v-1.66h-5.741V26.554z M18.392,28.668h3.216l0.414-0.83h-4.101\n\t\t\tL18.392,28.668z"/\u003E\n\t\u003C/g\u003E\n\u003C/g\u003E\n\u003C/svg\u003E\n'
      };
      Icon.icon_images_ie8 = {
        contact: "//widget.uservoice.com/omnibox/icons/question_mark_bubble_icon.png",
        post_idea: "//widget.uservoice.com/omnibox/icons/exclamation_mark_bubble_icon.png",
        satisfaction: "//widget.uservoice.com/omnibox/icons/star_bubble_icon.png",
        smartvote: "//widget.uservoice.com/omnibox/icons/lightbulb_bubble_icon.png"
      };
      Icon.prototype.remove = function () {
        this.widget.hide();
        document.body.removeChild(this.el)
      };
      Icon.prototype.push = function (widget) {
        this.widget = widget;
        this.widgets.push(widget)
      };
      Icon.prototype.pop = function () {
        if (this.widgets.length === 1) {
          return
        }
        this.widgets.pop();
        this.widget = this.widgets[this.widgets.length - 1]
      };
      Icon.prototype.render = function () {
        var self = this,
          iconType = this.widget.options.mode === "classic_widget" ? "contact" : this.widget.options.mode;
        if (!this.el) {
          this.createElement()
        }
        var iconHtml = Icon.icon_images[iconType];
        if (UA.ie8) {
          var iconURL = Icon.icon_images_ie8[iconType];
          iconURL += "?trigger_color=" + encodeURIComponent(this.options.trigger_color);
          iconURL += "&trigger_background_color=" + encodeURIComponent(this.options.trigger_background_color);
          iconURL += "&icon_version=2";
          iconHtml = "<img src='" + iconURL + "'/>"
        }
        this.el.innerHTML = iconHtml;
        if (!UA.ie8) {
          if (this.options.trigger_color) {
            $(this.el, "path", "uv-bubble-foreground").style.fill = this.options.trigger_color
          }
          if (this.options.trigger_background_color) {
            $(this.el, "path", "uv-bubble-background").style.fill = this.options.trigger_background_color
          }
        }
        $.on(this.el, "click", function () {
          if (self.visibleWidget) {
            self.visibleWidget.hide()
          } else {
            self.widget.show()
          }
        });
        if (!UA.handheld || !UA.ie || (UA.ie && UA.version > 9)) {
          $.one(self.el, "mousemove", function () {
            self.widget.preload()
          })
        }
      };
      Icon.prototype.createElement = function () {
        var el = this.el = document.createElement("div");
        el.setAttribute("data-html2canvas-ignore", true);
        $.addClass(this.el, "uv-icon uv-" + this.options.trigger_position);
        if (UA.ie8) {
          $.addClass(this.el, "uv-ie8")
        }
        document.body.appendChild(this.el)
      };
      Icon.prototype.popoverWillShow = function () {
        $.addClass(this.el, "uv-is-selected")
      };
      Icon.prototype.popoverWillHide = function () {
        $.removeClass(this.el, "uv-is-selected")
      };
      return Icon
    })();
    var CustomTrigger = (function () {
      function CustomTrigger(el, options) {
        this.el = el;
        this.options = options;
        $.data(this.el, "trigger", this)
      }
      CustomTrigger.prototype.render = function () {
        var self = this;
        this.clickHandler = function (e) {
          if (self.options.trigger_prevent_default_enabled) {
            e.preventDefault && e.preventDefault()
          }
          self.widget.toggle();
          if (self.options.trigger_prevent_default_enabled) {
            return false
          }
        };
        $.on(this.el, "click", this.clickHandler);
        if (!UA.handheld || !UA.ie || (UA.ie && UA.version > 9)) {
          $.one(this.el, "mousemove", function () {
            if (!self.removed) {
              self.widget.preload()
            }
          })
        }
      };
      CustomTrigger.prototype.remove = function () {
        this.removed = true;
        $.off(this.el, "click", this.clickHandler)
      };
      return CustomTrigger
    })();
    var Iframe = (function () {
      function Iframe(embedType, type, options) {
        this.options = extend({
          css: "display: block; background: transparent; padding: none; margin: none; border: none; width: #{width}; height: #{height}",
          cdn: type === "omnibox",
          embed_type: embedType,
          type: type,
          width: "100%",
          height: "100%"
        }, options);
        if (this.options.mode.match(/contact|instant/)) {
          this.options.mode = "instant-answers"
        } else {
          if (this.options.mode === "post_idea") {
            this.options.mode = "instant-answers";
            this.options.contact_enabled = false
          } else {
            if (this.options.mode === "satisfaction") {
              this.options.survey_lockout = false
            }
          }
        }
        this.pokes = [];
        this.loaded = false;
        this.setLocation();
        this.src = [this.location.baseUrl, this.queryString()].join("?");
        this.sendUvtsAndEmail();
        Iframe.all.push(this)
      }
      Iframe.all = [];
      Iframe.prototype.setLocation = function () {
        var scheme = "https";
        if (this.options.cdn) {
          var cdnDomain = "widget.uservoice.com";
          this.location = {
            host: cdnDomain,
            protocol: scheme,
            baseUrl: scheme + "://" + cdnDomain + "/" + this.options.type + "/" + UserVoice.account.client_key
          }
        } else {
          this.location = {
            host: UserVoice.account.subdomain_ssl_host,
            protocol: scheme,
            baseUrl: scheme + "://" + UserVoice.account.subdomain_ssl_host + "/clients/widgets/" + this.options.type
          }
        }
        this.location.origin = [this.location.protocol, "://", this.location.host].join("")
      };
      Iframe.prototype.doLoad = function () {
        this.loaded = true;
        this.poke()
      };
      Iframe.prototype.poke = function (message) {
        if (message) {
          if (typeof message === "object") {
            message = jsonStringify(message)
          }
          this.pokes.push(message)
        }
        if (this.loaded && this.el && this.el.contentWindow) {
          var target = this.el.contentWindow,
            i = 0,
            l = this.pokes.length;
          for (; i < l; i++) {
            if ("postMessage" in window) {
              target.postMessage(this.pokes[i], this.location.origin)
            } else {
              try {
                target.location.href = [this.src, (+new Date()).toString() + "&" + this.pokes[i]].join("#")
              } catch (e) {}
            }
          }
          this.pokes = []
        }
      };
      Iframe.prototype.render = function () {
        this.loaded = false;
        this.options.startIframeLoad = +new Date();
        var el = this.el = document.createElement("iframe"),
          self = this,
          cssOptions = {
            height: this.options.height,
            width: this.options.width
          }, css = render(this.options.css, cssOptions);
        if (el.attachEvent) {
          el.attachEvent("onload", function () {
            self.doLoad()
          })
        } else {
          el.onload = function () {
            self.doLoad()
          }
        }
        el.name = "uvw-iframe-" + this.options.id;
        $.addClass(el, "uvw-dialog-iframe");
        if (UA.ie) {
          el.style.setAttribute("cssText", css, 0)
        } else {
          el.setAttribute("style", css)
        }
        el.setAttribute("allowtransparency", "true");
        el.setAttribute("frameBorder", "0");
        el.frameBorder = 0;
        if (!(UA.ie && UA.version < 9)) {
          el.style.visibility = "hidden";
          var fn = el.onload;
          el.onload = function () {
            if (typeof fn === "function") {
              fn()
            }
            el.style.visibility = "visible"
          }
        }
        el.src = this.src;
        return el
      };
      Iframe.prototype.queryString = function () {
        var params = {}, paramKeys = ["sso", "sess", "mode", "locale", "link_color", "topic_id", "forum_id", "feedback_tab_name", "support_tab_name", "contact_us", "email", "status_ids", "states", "category_ids", "survey_lockout", "primary_color", "accent_color", "trigger_color", "trigger_background_color", "header", "border", "custom_template_id", "design_settings_id", "mixpanel_channel", "allow_tests", "demo", "startIframeLoad", "org_name", "post_idea_title", "contact_title", "smartvote_title", "context", "embed_type", "trigger_method", "menu", "screenshot_enabled", "handheld", "twitter_demo", "twitter_demo_username", "twitter_demo_message", "twitter_demo_satisfaction_thanks_mode", "twitter_demo_satisfaction_thanks_message", "permalinks_enabled", "instant_answers", "smartvote", "satisfaction", "contact_enabled", "feedback_enabled"];
        for (var i = 0; i < paramKeys.length; i++) {
          var key = paramKeys[i],
            value = this.options[key];
          if (value === undefined) {
            value = this.options["__" + key]
          }
          if (value !== undefined) {
            if (typeof value === "string" && key.match(/color/) && value.match(/^#/)) {
              value = value.substring(1)
            }
            if (typeof value === "object") {
              value = jsonStringify(value)
            }
            params[key] = value
          }
        }
        var customFields = this.options.ticket_custom_fields || this.options.custom_fields;
        if (customFields && typeof customFields === "object") {
          params.custom_fields = base64Encode(jsonStringify(customFields))
        }
        if (this.options.menu_enabled !== undefined) {
          params.menu = this.options.menu_enabled
        }
        if (this.options.smartvote_enabled !== undefined) {
          params.smartvote = this.options.smartvote_enabled
        }
        if (this.options.satisfaction_enabled !== undefined) {
          params.satisfaction = this.options.satisfaction_enabled
        }
        if (this.options.post_idea_enabled !== undefined) {
          params.feedback_enabled = this.options.post_idea_enabled
        }
        if (this.options.type === "classic_widget") {
          if (this.options.classic_default_mode !== undefined) {
            params.default_mode = this.options.classic_default_mode
          }
          params.mode = this.options.contact_enabled ? (this.options.post_idea_enabled ? "full" : "support") : "feedback"
        }
        params.referrer = window.location.href;
        return param(params, function (s) {
          try {
            s = decodeURIComponent(s)
          } catch (e) {}
          return encodeURIComponent(s)
        })
      };
      Iframe.prototype.sendUvtsAndEmail = function () {
        if (WidgetEnv.uvts) {
          this.poke({
            setUvts: WidgetEnv.uvts
          })
        }
        if (WidgetEnv.email) {
          this.poke({
            setEmail: WidgetEnv.email
          })
        }
      };
      Iframe.sendUvtsAndEmail = function () {
        for (var i = 0; i < this.all.length; i++) {
          this.all[i].sendUvtsAndEmail()
        }
      };
      return Iframe
    })();
    var Embed = (function () {
      function Embed(el, options) {
        var height = $.dimensions(el).height,
          defaults = {
            trigger_method: "embed",
            height: (height < 10 ? "325px" : "100%"),
            contact_enabled: true,
            post_idea_enabled: true,
            smartvote_enabled: true,
            feedback_enabled: true
          }, opts = WidgetEnv.processModeOptions(extend(defaults, UserVoice.globalOptions, options)),
          iframe = new Iframe("inline", opts.widgetType, opts),
          position = el.currentStyle ? el.currentStyle.position : $.getComputedStyle(el, null).position;
        if (position === "static") {
          el.style.position = "relative"
        }
        while (el.firstChild) {
          el.removeChild(el.firstChild)
        }
        el.appendChild(iframe.render());
        iframe.poke({
          show: true
        })
      }
      return Embed
    })();
    var Lightbox = (function () {
      function Lightbox(options, trigger) {
        this.iframe = new Iframe("lightbox", options.widgetType, extend({
          css: "display: block; border: none; -moz-border-radius: 3px; -webkit-border-radius: 3px; height: 100%; padding: none; position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%;-webkit-transform: translate3d(0,0,0);"
        }, options));
        this.template = '<div class="uvOverlay1" id="uvw-overlay-#{id}" style="position: relative; visibility:hidden; z-index: 100003;"><div id="uvw-overlay-background-#{id}" style="background: #000; -ms-filter: alpha(opacity=75); filter: alpha(opacity=75); opacity: .75; position: fixed; top: 0; right: 0; bottom: 0; left: 0;"></div><div class="uvOverlay2" style="height: 100%; overflow: auto; position: fixed; top: 0; right: 0; bottom: 0; left: 0;"><div class="uvOverlay3" style="height: 100%; min-height: 550px; min-width: 900px; position: relative; width: 100%;"><div id="#{dialog_id}" style="-webkit-box-shadow: rgba(0,0,0,.5) 0 5px 5px; height: 500px; margin: -250px 0 0 -444px; position: absolute; top: 50%; left: 50%; width: 888px;"><div id="#{dialog_close_id}" title="Close Dialog" style="z-index: 100004; background: transparent url(' + assetHost + '/images/clients/widget2/close.png) 0 0 no-repeat; height: 48px; margin: 0; padding: 0; position: absolute; top: -22px; right: -24px; width: 48px;"><button style="background: none; border: none; -moz-box-shadow: none; -webkit-box-shadow: none; box-shadow: none; cursor: pointer; height: 30px; margin: 6px 0 0 9px; padding: 0; width: 30px; text-indent: -9000px;">Close Dialog</button></div><div id="#{dialog_content_id}" style="position:static; width:100%; height:100%"></div>' + (UserVoice.account.campaign ? '<a id="uvw-dialog-powered-by-#{id}" href="http://www.uservoice.com/?utm_campaign=' + UserVoice.account.campaign + "&amp;utm_medium=widget2&amp;utm_source=" + UserVoice.account.subdomain_ssl_host + '" target="_blank" style="background: url(' + assetHost + '/images/clients/widget2/powered_by.png) 0 0 no-repeat; font-size: 11px; height: 20px; position: absolute; bottom: -25px; right: 10px; text-indent: -9000px; width: 150px;">Powered by UserVoice</a>' : "") + "</div></div></div></div>";
        this.id = $.uniqId();
        this.dialog_id = "uvw-dialog-" + this.id;
        this.dialog_close_id = "uvw-dialog-close-" + this.id;
        this.dialog_content_id = "uvw-dialog-content-" + this.id;
        this.options = options
      }
      Lightbox.prototype.toggle = function () {
        this.show()
      };
      Lightbox.prototype.show = function () {
        if (UA.ie6 || UA.touch || UA.ieMobile || UA.iOS || UA.ieQuirks) {
          window.open(this.iframe.src, "uservoice_widget", "height=500,width=888,resizable=yes,scrollbars=1")
        } else {
          this.initPopup();
          this.overlay.style.visibility = "visible";
          this.overlay.style.display = "block";
          this.dialog.focus();
          $.addClass(htmlElement(), "uvw-dialog-open")
        }
      };
      Lightbox.prototype.preload = function () {};
      Lightbox.prototype.hide = function () {
        this.iframe.poke("reset");
        if (this.overlay) {
          this.overlay.style.display = "none"
        }
        $.removeClass(htmlElement(), "uvw-dialog-open")
      };
      Lightbox.prototype.initPopup = function () {
        if (!this.overlay) {
          includeCss(dialogCss);
          this.overlay = insertHtml(render(this.template, this))
        }
        this.iframe.poke("opened");
        if (!this.dialog || this.dialog.getAttribute("data-widget-key") !== this.id) {
          this.iframe.render();
          this.dialogContent = document.getElementById(this.dialog_content_id);
          while (this.dialogContent.firstChild) {
            this.dialogContent.removeChild(this.dialogContent.firstChild)
          }
          this.dialogContent.appendChild(this.iframe.el);
          this.dialog = document.getElementById(this.dialog_id);
          this.dialog.setAttribute("data-widget-key", this.id);
          var self = this;
          $.on(document.getElementById(this.dialog_close_id), "click", function (e) {
            return self.hide()
          })
        }
      };
      return Lightbox
    })();
    var WidgetEnv = (function () {
      var WidgetEnv = {};
      WidgetEnv.setUvts = function (uvts) {
        WidgetEnv.uvts = uvts;
        Iframe.sendUvtsAndEmail()
      };
      WidgetEnv.setEmail = function (email) {
        WidgetEnv.email = email;
        Iframe.sendUvtsAndEmail()
      };
      WidgetEnv.setSession = function (session) {
        WidgetEnv.session = session;
        if (WidgetEnv.pendingAutoprompt) {
          WidgetEnv.autoprompt();
          WidgetEnv.pendingAutoprompt = false
        }
      };
      WidgetEnv.tracker = new Babayaga(UserVoice.account.subdomain_id, {
        channel: document.location.host === UserVoice.account.subdomain_site_host ? "site2" : "external",
        onUvts: WidgetEnv.setUvts,
        onSession: WidgetEnv.setSession
      });
      WidgetEnv.autoprompt = function () {
        if (this.session === undefined) {
          this.pendingAutoprompt = true;
          return
        }
        if (!("localStorage" in window && window.localStorage)) {
          return
        }
        if (this.session.sat_prompted === true) {
          WidgetEnv.pushSystemWidget({
            mode: "satisfaction"
          })
        } else {
          if (this.shouldShowSatisfactionPrompt()) {
            WidgetEnv.pushSystemWidget({
              mode: "satisfaction"
            });
            WidgetEnv.showAutoprompt({
              mode: "satisfaction"
            });
            this.tracker.track("autoprompt", {}, "satisfaction_widget");
            this.tracker.updateSession({
              sat_prompted: true
            })
          }
        } if (this.shouldShowSmartVotePrompt()) {
          WidgetEnv.showAutoprompt({
            mode: "smartvote"
          });
          this.tracker.track("autoprompt", {}, "smartvote_widget");
          this.tracker.updateSession({
            dismissed_smartvote_at: new Date().getTime()
          })
        }
      };
      WidgetEnv.shouldShowSatisfactionPrompt = function () {
        if (!UserVoice.account.satisfaction_autoprompt_enabled) {
          return false
        }
        var now = new Date().getTime(),
          last = Math.max(this.session.created_at || 0, this.session.last_sat_at || 0, this.session.dismissed_sat_at || 0);
        if (last !== 0) {
          var diff = now - last,
            days = diff / 1000 / 60 / 60 / 24;
          return days >= 60
        }
        return false
      };
      WidgetEnv.shouldShowSmartVotePrompt = function () {
        if (!UserVoice.account.smartvote_autoprompt_enabled) {
          return false
        }
        var now = new Date().getTime(),
          last = Math.max(this.session.last_smartvote_at || 0, this.session.dismissed_smartvote_at || 0);
        if (last !== 0) {
          var diff = now - last,
            days = diff / 1000 / 60 / 60 / 24;
          return days >= 42
        } else {
          return this.session.active_days === 7
        }
      };
      WidgetEnv.scan = function () {
        var els = copyNodeList(document.getElementsByTagName("*")),
          attach;
        attach = function (el, attr, fn) {
          var v = el.getAttribute(attr);
          if (el.hasAttribute && el.hasAttribute(attr) && !el.getAttribute("data-uv-scanned")) {
            el.setAttribute("data-uv-scanned", "true");
            fn(el, v, WidgetEnv.extractOptions(el))
          }
        };
        for (var i = 0; i < els.length; i++) {
          var el = els[i];
          attach(el, "data-uv-inline", this.renderInline);
          attach(el, "data-uv-embed", this.renderInline);
          attach(el, "data-uv-lightbox", this.linkToLightbox);
          attach(el, "data-uv-show", this.linkToPopover);
          attach(el, "data-uv-trigger", this.linkToPopover)
        }
      };
      WidgetEnv.renderInline = function (el, type, options) {
        if (type === "classic_widget") {
          new Embed(el, processLegacyOptions(type, options))
        } else {
          new Embed(el, extend({
            mode: type,
            contact_enabled: true,
            post_idea_enabled: true,
            smartvote_enabled: true,
            feedback_enabled: true
          }, options))
        }
      };
      WidgetEnv.linkToLightbox = function (el, widgetType, options) {
        WidgetEnv.createCustomTrigger(el, extend({
          target: "lightbox"
        }, processLegacyOptions(widgetType, options)))
      };
      WidgetEnv.linkToPopover = function (el, type, options) {
        WidgetEnv.createCustomTrigger(el, extend({
          mode: type
        }, options))
      };
      WidgetEnv.extractOptions = function (el) {
        var options = {};
        for (var i = 0; i < el.attributes.length; i++) {
          var attr = el.attributes[i],
            val = attr.value;
          if (attr.specified && attr.name.match(/^data-uv-/)) {
            if (val.match(/^(true|false)$/)) {
              val = val === "true"
            }
            options[attr.name.replace(/^data-uv-/, "").replace(/-/g, "_")] = val
          }
        }
        return options
      };
      WidgetEnv.processModeOptions = function (opts) {
        opts.mode = opts.mode || (opts.contact_enabled ? "contact" : (opts.smartvote_enabled ? "smartvote" : "post_idea"));
        if (opts.mode.match(/instant/)) {
          opts.mode = "contact"
        }
        opts.widgetType = opts.mode === "classic_widget" ? opts.mode : "omnibox";
        return opts
      };
      WidgetEnv.active = null;
      WidgetEnv.hideActive = function () {
        if (WidgetEnv.active) {
          WidgetEnv.active.hide()
        }
      };
      WidgetEnv.createCustomTrigger = function (el, options) {
        var trigger = new CustomTrigger(el, extend({
          trigger_prevent_default_enabled: true
        }, UserVoice.globalOptions, options)),
          widget = WidgetEnv.createWidget(extend({
            trigger_method: "custom_trigger"
          }, options), trigger);
        if (options && options.autoprompt) {
          WidgetEnv.autopromptOptions = extend({
            target: el
          }, Widget.autopromptOptions || {})
        }
        trigger.widget = widget;
        trigger.render();
        return trigger
      };
      WidgetEnv.createSystemTrigger = function (options) {
        var triggerOptions = extend({
          trigger_color: "white"
        }, UserVoice.globalOptions, options || {}),
          triggerStyle = triggerOptions.trigger_style || "icon",
          trigger = triggerStyle === "icon" ? new Icon(triggerOptions) : new Tab(triggerOptions),
          widget = WidgetEnv.createWidget(extend({
            trigger_method: "pin"
          }, options), trigger);
        trigger.push(widget);
        trigger.render();
        return trigger
      };
      WidgetEnv.createWidget = function (widgetOptions, trigger) {
        var defaults = {
          target: "self",
          contact_enabled: true,
          post_idea_enabled: true,
          smartvote_enabled: true,
          feedback_enabled: true
        }, opts = WidgetEnv.processModeOptions(extend(defaults, UserVoice.globalOptions, widgetOptions));
        if (UA.handheld) {
          opts.handheld = true
        }
        if (opts.target === "lightbox" || opts.mode === "classic_widget") {
          return new Lightbox(opts, trigger)
        } else {
          if (opts.target === false || (opts.target === "self" && !trigger)) {
            opts.position = opts.position || "bottom-right";
            return new Toast(opts, trigger)
          } else {
            if (!opts.position || !opts.position.match(/^(automatic|top|bottom|left|right)$/)) {
              opts.position = "automatic"
            }
            if (UA.handheld) {
              return new Toast(opts, trigger)
            } else {
              return new Popover(opts, trigger)
            }
          }
        }
      };
      WidgetEnv.showWidget = function (widgetOptions) {
        WidgetEnv.createWidget(extend({
          temp: true
        }, widgetOptions), WidgetEnv.systemTrigger).show()
      };
      WidgetEnv.showAutoprompt = function (widgetOptions) {
        WidgetEnv.showWidget(extend({
          trigger_method: "autoprompt"
        }, WidgetEnv.autopromptOptions || {}, widgetOptions))
      };
      WidgetEnv.pushSystemWidget = function (widgetOptions) {
        if (WidgetEnv.systemTrigger) {
          WidgetEnv.systemTrigger.push(WidgetEnv.createWidget(widgetOptions, WidgetEnv.systemTrigger))
        }
      };
      WidgetEnv.includeCss = function () {
        includeCss(widgetEnvironmentCss)
      };
      new PostMessageHandler({
        openPane: function (data) {
          if (WidgetEnv.active) {
            WidgetEnv.active.paneOpened(data[0], data[1])
          }
        },
        close: function () {
          if (WidgetEnv.active) {
            WidgetEnv.active.hide()
          }
        },
        dismiss: function () {
          if (WidgetEnv.active) {
            WidgetEnv.active.hide()
          }
        },
        voteSubmitted: function () {
          WidgetEnv.tracker.updateSession({
            last_smartvote_at: new Date().getTime()
          })
        },
        ratingSubmitted: function () {
          if (WidgetEnv.systemTrigger) {
            WidgetEnv.systemTrigger.pop()
          }
          WidgetEnv.tracker.updateSession({
            last_sat_at: new Date().getTime(),
            sat_prompted: false
          })
        },
        captureScreenshot: function (identifier, source, origin) {
          if (origin !== "http://widget.uservoice.com" && origin !== "https://widget.uservoice.com") {
            return
          }
          window.html2canvas_onload_options = {
            onrendered: function (canvas) {
              var dataUrl = canvas.toDataURL("image/png");
              if (dataUrl) {
                var data = dataUrl.split(",", 2)[1];
                source.postMessage(jsonStringify({
                  identifier: identifier,
                  content_type: "image/png",
                  base64data: data,
                  width: canvas.width,
                  height: canvas.height
                }), origin)
              }
            }
          };
          (function () {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//cdn.uservoice.com/packages/screenshot.js?" + identifier;
            var x = document.getElementsByTagName("head")[0];
            x.appendChild(s)
          })()
        }
      }).listen();
      return WidgetEnv
    })();
    UserVoice.globalOptions = {};
    UserVoice.push = function (array) {
      var fn = array[0],
        args = array.slice(1);
      if (typeof (UserVoice[fn]) === "function") {
        UserVoice[fn].apply(null, args)
      }
    };
    UserVoice.set = function (key, value) {
      if (typeof key === "object") {
        UserVoice.globalOptions = deepMerge(UserVoice.globalOptions, key)
      } else {
        var h = {};
        h[key] = value;
        UserVoice.set(h)
      }
    };
    UserVoice.embed = function () {
      var widgetType = arguments[0],
        el = arguments[1],
        options = arguments[2];
      if (typeof widgetType !== "string" || widgetType[0] === "#") {
        el = arguments[0];
        options = arguments[1];
        widgetType = null
      }
      if (el === undefined) {
        return error("please specify where to embed it.")
      }
      WidgetEnv.renderInline($.element(el), widgetType, options)
    };
    UserVoice.addTrigger = function (el, options) {
      if (el && el.nodeName || typeof el === "string") {
        WidgetEnv.createCustomTrigger($.element(el), options)
      } else {
        options = el || {};
        if (WidgetEnv.systemTrigger) {
          WidgetEnv.systemTrigger.remove()
        }
        WidgetEnv.systemTrigger = WidgetEnv.createSystemTrigger(processLegacyTriggerOptions(options))
      }
    };
    UserVoice.show = function (options) {
      if (typeof arguments[0] === "string") {
        options = extend({
          mode: arguments[0]
        }, arguments[1] || {})
      }
      WidgetEnv.showWidget(extend({
        trigger_method: "show"
      }, options || {}))
    };
    UserVoice.hide = function () {
      WidgetEnv.hideActive()
    };
    UserVoice.removeTrigger = function (el) {
      if (el) {
        $.data($.element(el), "trigger").remove()
      } else {
        WidgetEnv.systemTrigger.remove();
        WidgetEnv.systemTrigger = null
      }
    };
    UserVoice.autoprompt = function (options) {
      WidgetEnv.autopromptOptions = options;
      WidgetEnv.autoprompt()
    };
    UserVoice.identify = function (hash) {
      WidgetEnv.tracker.identify(hash);
      if (hash && hash.email) {
        WidgetEnv.setEmail(hash.email)
      }
    };
    UserVoice.track = function (evt, props) {
      WidgetEnv.tracker.track(evt, props)
    };
    UserVoice.footprint = function (enabled) {
      WidgetEnv.tracker.setConfig({
        enabled: enabled
      })
    };

    function processLegacyTriggerOptions(options) {
      if (options) {
        if (options.tab_color !== undefined) {
          options.trigger_background_color = options.tab_color
        }
        if (options.tab_position !== undefined) {
          options.trigger_position = options.tab_position
        }
      }
      return options || {}
    }

    function processLegacyOptions(type, options) {
      if (options) {
        if (options.mode === "support") {
          options.post_idea_enabled = false
        } else {
          if (options.mode === "feedback") {
            options.contact_enabled = false
          }
        }
        delete options.mode;
        if (options.default_mode !== undefined) {
          options.classic_default_mode = options.default_mode
        }
        processLegacyTriggerOptions(options)
      }
      return extend({
        mode: type
      }, options || {})
    }
    UserVoice.setOption = UserVoice.setOptions = UserVoice.set;
    UserVoice.setSSO = function (v) {
      UserVoice.set("sso", v)
    };
    UserVoice.setCustomFields = function (v) {
      UserVoice.set("ticket_custom_fields", v)
    };
    UserVoice.setLocale = function (v) {
      UserVoice.set("locale", v)
    };
    UserVoice.showPrompt = UserVoice.showPopover = UserVoice.show;
    UserVoice.showLightbox = function (type, opts) {
      WidgetEnv.showWidget(extend({
        target: "lightbox"
      }, processLegacyOptions(type, opts)))
    };
    UserVoice.hideLightbox = function () {};
    UserVoice.showIcon = UserVoice.pin = function (type, options) {
      if (options) {
        options.trigger_position = options.position;
        options.position = "automatic"
      }
      UserVoice.addTrigger(extend({
        mode: type,
        trigger_style: "icon"
      }, options || {}))
    };
    UserVoice.showTab = function (type, options) {
      UserVoice.addTrigger(extend({
        trigger_style: "tab"
      }, processLegacyOptions(type, options)))
    };
    WidgetEnv.includeCss();
    for (var i = 0; i < UserVoice.events.length; i++) {
      UserVoice.push(UserVoice.events[i])
    }
    WidgetEnv.scan();

    function onDomReady() {
      if (!onDomReady.fired) {
        onDomReady.fired = true;
        WidgetEnv.tracker.trackExternalView();
        WidgetEnv.tracker.ready();
        WidgetEnv.scan()
      }
    }
    $.ready(onDomReady)
  })(window, document)
};