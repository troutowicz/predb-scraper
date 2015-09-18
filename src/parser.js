import cheerio from 'cheerio';

export default function parse(html) {
  let $ = cheerio.load(html);

  if ($('.content .post-list').hasClass('single')) {
    return parseRelease($);
  }

  return parseReleases($);
}

function parseRelease($) {
  const filters = ['group', 'tags', 'size', 'nukes'];
  let release = {};

  release.rlsname = $('.p-title').text()
  release.released = $('.p-time').attr('data');
  release.category = {
    main: $('.p-cat .c-adult').text(),
    sub: $('.p-cat .c-child').text(),
  };

  $('.post-body-table .pb-r').each((index, element) => {
    const key = $(element).children().first().text().toLowerCase();
    let val = $(element).children().last().text();

    if (val === '···') val = '';

    switch (key) {
      case 'tags':
        release[key] = val && val.split(', ');
        break;
      case 'size':
        release[key] = val.split(' ')[0]
        release.files = val.split(' ')[3];
        break;
      default:
        if (filters.indexOf(key) >= 0) release[key] = val;
    }
  });

  return release;
}

function parseReleases($) {
  let info = {};
  info.releases = [];

  $('.post').each((index, element) => {
    let release = {};

    if (index === 0) {
      info.lastId = $(element).attr('id');
    }

    release.id = $(element).attr('id');
    release.rlsname = $(element).find('.p-title').text()
    release.released = $(element).find('.p-time').attr('data');
    release.category = {
      main: $(element).find('.p-cat .c-adult').text(),
      sub: $(element).find('.p-cat .c-child').text(),
    };
    release.nukes = $(element).find('.tb-nuked').attr('title') || '';
    release.nukes = release.nukes && release.nukes.substring(7);

    info.releases.push(release);
  });

  // Add extra info for full page scrapes
  if (!$('.jsload').length) {
    info.currentPage = $('.page-list .page-current').text();
    info.numPages =$('.page-list .last-page').text().substring(0, 3);
    info.numReleases = $('.s-blurb .release-count').attr('data');
  }

  return info;
}
