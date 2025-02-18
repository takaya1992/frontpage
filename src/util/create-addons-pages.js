const path = require('path');
// eslint-disable-next-line
const remark = require('remark');
const remarkHTML = require('remark-html');
const buildTagLinks = require('./build-tag-links');
const absoluteLinks = require('./absolute-links');

const addonDetail = `
  id: name
  name
  displayName
  description
  icon
  authors {
    id: username
    avatarUrl: gravatarUrl
    name: username
  }
  weeklyDownloads
  appearance: verified
  verifiedCreator`;

module.exports = function createAddonsPages({ actions, graphql }) {
  const { createPage } = actions;
  return fetchCategoryPages(createPage, graphql)
    .then(() => fetchAddonsDetailPages(createPage, graphql))
    .then(() => fetchTagPages(createPage, graphql));
};

function fetchCategoryPages(createPage, graphql) {
  return graphql(
    `
      {
        addons {
          categoryPages: tags(isCategory: true) {
            name
            displayName
            description
            icon
            addons: top(sort: monthlyDownloads) {
              ${addonDetail}
            }
          }
        }
      }
    `
  )
    .then(checkForErrors)
    .then(
      ({
        data: {
          addons: { categoryPages },
        },
      }) => {
        categoryPages.forEach((category) => {
          createPage({
            path: `/addons/tag/${category.name}/`,
            component: path.resolve(
              `./src/components/screens/AddonsCategoryScreen/AddonsCategoryScreen.js`
            ),
            context: {
              category: category.displayName,
              description: category.description,
              addons: category.addons,
            },
          });
        });
      }
    );
}

function fetchAddonsDetailPages(createPage, graphql, skip = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  })
    .then(() =>
      graphql(
        `{
          addons {
            addonPages: addons(limit: 30, skip: ${skip}) {
              ${addonDetail}
              tags {
                name
                displayName
                description
                icon
              }
              compatibility {
                name
                displayName
                icon
              }
              status
              readme
              publishedAt
              repositoryUrl
              homepageUrl
              npmUrl
            }
          }
        }`
      )
    )
    .then(checkForErrors)
    .then(
      ({
        data: {
          addons: { addonPages },
        },
      }) => {
        if (addonPages && addonPages.length > 0) {
          createAddonsDetailPages(createPage, addonPages);
          return fetchAddonsDetailPages(createPage, graphql, skip + addonPages.length);
        }

        return null;
      }
    );
}

function createAddonsDetailPages(createPage, addonPages) {
  addonPages.forEach((addon) => {
    const processor = remark()
      .use(absoluteLinks, {
        base: `${addon.repositoryUrl}/`,
      })
      .use(remarkHTML);

    createPage({
      path: `/addons/${addon.name}/`,
      component: path.resolve(`./src/components/screens/AddonsDetailScreen/AddonsDetailScreen.js`),
      context: {
        ...addon,
        tags: buildTagLinks(addon.tags),
        readme: processor.processSync(addon.readme).toString(),
      },
    });
  });
}

function fetchTagPages(createPage, graphql, skip = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  })
    .then(() =>
      graphql(
        `{
      addons {
        tagPages: tags(isCategory: false, limit: 30, skip: ${skip}) {
          name
          displayName
          description
          icon
          relatedTags {
            name
            displayName
            icon
          }
          addons: top(sort: monthlyDownloads) {
            ${addonDetail}
          }
        }
      }
    }`
      )
    )
    .then(checkForErrors)
    .then(
      ({
        data: {
          addons: { tagPages },
        },
      }) => {
        if (tagPages.length > 0) {
          createTagPages(createPage, tagPages);
          return fetchTagPages(createPage, graphql, skip + tagPages.length);
        }

        return null;
      }
    );
}

function createTagPages(createPage, tagPages) {
  tagPages.forEach((tag) => {
    createPage({
      path: `/addons/tag/${tag.name}/`,
      component: path.resolve(`./src/components/screens/AddonsTagScreen/AddonsTagScreen.js`),
      context: {
        tag,
      },
    });
  });
}

function checkForErrors(response) {
  if (response.error) {
    throw new Error(response.error.errorMessage || response.errors[0].message);
  }

  return response;
}
