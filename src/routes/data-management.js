const express = require('express');
const { authRefreshMiddleware } = require('../middlewares/auth.js');
const {
  getHubs,
  getProjects,
  getProjectTopFolders,
  getFolderContents,
  getItemVersions
} = require('../controllers/data-management.js');

let router = express.Router();

router.use('/api/dm', authRefreshMiddleware);

/***** Get Hubs route *****/
router.get('...', async function (req, res) {
  // Get access token from session
  
  try {
      // Get hubs from APS API
      // const hubs = ...

      res.json(hubs);
    } catch (err) {
      throw err;
    }
});

/***** Get Projects from a hub *****/
router.get('...', async function (req, res, next) {
  // Retrieve hub_id from request params
  // Get access token from session

  try {
    // Get projects from APS API
    // const projects = ...

    res.json(projects);
  } catch (err) {
    throw err;
  }
});

/***** Get Top Contents of a project *****/
router.get('...', async function (req, res, next) {
  // Retrieve hub_id and project_id from request params
  // Get access token from session

  try {
      // Get top contents of a project from APS API
      // const topContents = ...

      res.json(topContents);
  } catch (err) {
      throw err;
  }
});


/***** Get Contents from a folder *****/
router.get('...', async function (req, res) {
  // Retrieve hub_id, project_id and folder_id from request params
  const encodedUrn = encodeURIComponent(folder_id); // Encode the folder_id to be used in the URL
  // Get access token from session

  try {
      // Get contents of a folder from APS API
      // const folderContents = ...

      res.json(folderContents);
  } catch (err) {
      throw err;
  }
});

/***** Get Versions of an item *****/
router.get('...', async function (req, res, next) {
  // Retrieve project_id and item_id from request params
  // Get access token from session

  try {
      // Get versions of an item from APS API
      // const versions = ...

      res.json(versions);
  } catch (err) {
      throw err;
  }
});


module.exports = router;