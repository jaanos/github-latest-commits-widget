
/*
 Helper to parse query string params
 */
$.extend({
  getUrlVars: function() {
    var hash, hashes, i, vars;
    vars = [];
    hash = void 0;
    hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    i = 0;
    while (i < hashes.length) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
      i++;
    }
    return vars;
  },
  getUrlVar: function(name) {
    return $.getUrlVars()[name];
  }
});

$(function() {
  var author, branch, callback, commits, container, limit, params, repo, title, url, username;
  params = $.getUrlVars();
  username = params.username;
  repo = params.repo;
  limit = params.limit;
  branch = params.branch;
  author = params.author;
  container = $('#latest-commits-widget');
  callback = function(response) {
    var index, items, result, results, ul;
    items = response.data;
    ul = $('#commit-history');
    ul.empty();
    results = [];
    for (index in items) {
      result = items[index];
      results.push((function(index, result) {
        if (result.author != null) {
          return ul.append("<li class=\"clearfix\">\n  <div class=\"left\">\n    <img class=\"commit-avatar\" src=\"" + result.author.avatar_url + "\">\n  </div>\n  <div class=\"commit-author-info left\">\n      <a class=\"left\" href=\"https://github.com/" + result.author.login + "\" target=\"_blank\"><b class=\"commit-author\">" + result.author.login + "</b></a>\n      <i class=\"commit-sha\">" + result.sha + "</i>\n      <br />\n      <a class=\"commit-message\" href=\"https://github.com/" + username + "/" + repo + "/commit/" + result.sha + "\" target=\"_blank\">" + result.commit.message + "</a>\n      <b class=\"commit-date\">" + ($.timeago(result.commit.committer.date)) + "</b>\n  </div>\n</li>");
        } else {
          return ul.append("<li class=\"clearfix\">\n  <div class=\"left\">\n    <img class=\"commit-avatar\" src=\"https://camo.githubusercontent.com/03e26a10218810ed1c3d89b271447af945ed298b/68747470733a2f2f302e67726176617461722e636f6d2f6176617461722f34613537663239656430393735356264323830376131656431313237383962363f643d68747470732533412532462532466173736574732d63646e2e6769746875622e636f6d253246696d6167657325324667726176617461727325324667726176617461722d757365722d3432302e706e6726723d7826733d313430\">\n  </div>\n  <div class=\"commit-author-info left\">\n      <div class=\"left\"><b class=\"commit-author\">" + result.commit.author.name + "</b></div>\n      <i class=\"commit-sha\">" + result.sha + "</i>\n      <br />\n      <a class=\"commit-message\" href=\"https://github.com/" + username + "/" + repo + "/commit/" + result.sha + "\" target=\"_blank\">" + result.commit.message + "</a>\n      <b class=\"commit-date\">" + ($.timeago(result.commit.committer.date)) + "</b>\n  </div>\n</li>")
        }
      })(index, result));
    }
    ul.append("<a class=\"right\" href=\"" + commits + "\" target=\"_blank\">All commits</a>")
    return results;
  };
  title = "Latest Commits to " + username + "/" + repo;
  url = "https://api.github.com/repos/" + username + "/" + repo + "/commits?callback=callback";
  commits = "https://github.com/" + username + "/" + repo + "/commits/";
  if (params.branch != null) {
    url += "&sha=" + branch;
    commits += branch;
  }
  if (params.author != null) {
    url += "&author=" + author;
    title += " by " + author;
  }
  container.find('h4').text(title);
  return $.ajax(url, {
    data: {
      per_page: limit
    },
    dataType: "jsonp",
    type: "get"
  }).success(function(response) {
    return callback(response);
  });
});

/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.11.1
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator === undefined ?  " " : $l.wordSeparator;
      return $.trim([prefix, words, suffix].join(separator));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
      var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));