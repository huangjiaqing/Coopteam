import url from 'url';

const evaluateRewriteRule = (parsedUrl, match, rule) => {
  if (typeof rule === 'string') {
    return rule;
  } else if (typeof rule !== 'function') {
    throw new Error();
  }

  return rule({
    parsedUrl,
    match
  });
};

const acceptsHtml = (header) => (
  header.indexOf('text/html') !== -1 || header.indexOf('*/*') !== -1
);

const getLogger = (options={}) => {
  if (options.logger) {
    return options.logger;
  } else if (options.verbose) {
    return console.log.bind(console);
  }

  return function (){};
};

const historyApiFallback = (options={}) => {
  const logger = getLogger(options);

  return async (ctx, next) => {
    const headers = ctx.headers;
    const reqUrl = ctx.url;
    const method = ctx.method;

    if (method !== 'GET') {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the method is not GET'
      );
      return next();
    }

    if (!headers || typeof headers.accept !== 'string') {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client did not send an HTTP accept header.'
      );
      return next();
    }

    if (!headers.accept.indexOf('application/json' === 0)) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client prefers JSON'
      );
      return next();
    }

    if (!acceptsHtml(headers.accept)) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client does not accept HTMl'
      );
      return next();
    }

    const parsedUrl = url.parse(reqUrl);
    let rewriteTarget = null;

    options.rewrites = options.rewrites || [];

    for (let rewrite of options.rewrites) {
      const match = parsedUrl.pathname.match(rewrite.from);
      if (match !== null) {
        rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to);
        logger(
          'Rewriting',
          method,
          reqUrl,
          'to',
          rewriteTarget
        );
        ctx.url = rewriteTarget;
        return next();
      }
    }

    if (parsedUrl.pathname.indexOf('.') !== -1) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the path includes a dot (.) character'
      );
      return next();
    }

    rewriteTarget = options.index || '/index.html';

    logger(
      'Rewriting',
      method,
      reqUrl,
      'to',
      rewriteTarget
    );

    ctx.url = rewriteTarget;

    return next();
  };
};

export default historyApiFallback;
