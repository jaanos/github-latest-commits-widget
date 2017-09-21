
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
