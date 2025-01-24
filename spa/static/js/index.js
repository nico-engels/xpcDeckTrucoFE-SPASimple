import games from './views/games.js';
import home from './views/home.js';

function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

function pathToRegex(path) {
  return new RegExp('^' + 
                    path.replace(/\//g, '\\/')
                        .replace(/:\w+/g, '(.+)') + 
                    '$');
}

function getParams(match) {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

  return Object.fromEntries(keys.map((key, i) => {
    return [key, values[i]];
  }));
}

async function router() {
  const routes = [
    { path: '/',          view: (params) => new home(params) },
    { path: '/jogos',     view: (params) => new games(params) },
    { path: '/jogos/:id', view: (params) => new games(params) }
  ];

  const potencialMatches = routes.map(route => {
    return {
        route: route,
        result: location.pathname.match(pathToRegex(route.path))
    };
  });

  const matchs = potencialMatches.filter(potencialMatch => potencialMatch.result !== null);
  let match;

  if (matchs.length > 1) {
    throw 'Mais de uma rota para esse caminho!';
  } else if (matchs.length === 0) {
    match = { 
      route: routes[0],
      result: [ location.pathname ]
    };
  } else {
    match = matchs[0];
  }

  const view = match.route.view(getParams(match));
  
  document.querySelector('#app').innerHTML = view.getHtml();
}

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});