// Generated by CoffeeScript 1.12.2

/**
  * Authorization Token
  * @module auth_token
 */

(function() {
  var config, crypto, digest, escape_to_lower;

  crypto = require('crypto');

  config = require('./config');

  digest = function(message, key) {
    return crypto.createHmac("sha256", new Buffer(key, "hex")).update(message).digest('hex');
  };


  /**
    * Escape url using lowercase hex code
    * @param {string} url a url string
    * @return escaped url
   */

  escape_to_lower = function(url) {
    return encodeURIComponent(url).replace(/%../g, function(match) {
      return match.toLowerCase();
    });
  };


  /**
    * Generate an authorization token
    * @param {Object} options
    * @param {string} options.key - the secret key required to sign the token
    * @param {string} [options.ip] - the IP address of the client
    * @param {number} [options.start_time=now] - the start time of the token in seconds from epoch
    * @param {string} [options.expiration] - the expiration time of the token in seconds from epoch
    * @param {string} [options.duration] - the duration of the token (from start_time)
    * @param {string} [options.acl] - the ACL for the token
    * @param {string} [options.url] - the URL to authentication in case of a URL token
    * @returns {string} the authorization token
   */

  module.exports = function(options) {
    var auth, part, ref, ref1, start, toSign, tokenName, tokenParts, url;
    tokenName = (ref = options.token_name) != null ? ref : "__cld_token__";
    if (options.expiration == null) {
      if (options.duration != null) {
        start = (ref1 = options.start_time) != null ? ref1 : Math.round(Date.now() / 1000);
        options.expiration = start + options.duration;
      } else {
        throw new Error("Must provide either expiration or duration");
      }
    }
    tokenParts = [];
    if (options.ip != null) {
      tokenParts.push("ip=" + options.ip);
    }
    if (options.start_time != null) {
      tokenParts.push("st=" + options.start_time);
    }
    tokenParts.push("exp=" + options.expiration);
    if (options.acl != null) {
      tokenParts.push("acl=" + (escape_to_lower(options.acl)));
    }
    toSign = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = tokenParts.length; i < len; i++) {
        part = tokenParts[i];
        results.push(part);
      }
      return results;
    })();
    if (options.url) {
      url = escape_to_lower(options.url);
      toSign.push("url=" + url);
    }
    auth = digest(toSign.join("~"), options.key);
    tokenParts.push("hmac=" + auth);
    return tokenName + "=" + (tokenParts.join('~'));
  };

}).call(this);

//# sourceMappingURL=auth_token.js.map
