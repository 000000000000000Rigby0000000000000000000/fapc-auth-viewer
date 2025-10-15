async function getHubs(accessToken) {
  // Make a fetch request to the APS API to get the hubs
  //const response = ...

  const hubs = await response.json();
  return hubs;
};

async function getProjects(hubId, accessToken) {
  // Make a fetch request to the APS API to get the projects
  //const response = ...

  const projects = await response.json();
  return projects;
};

async function getProjectTopFolders(hubId, projectId, accessToken) {
  // Make a fetch request to the APS API to get the top folders
  //const response = ...

  const projectTopFolders = await response.json();
  return projectTopFolders;
};

async function getFolderContents(hubId, projectId, folderId, accessToken) {
  // Make a fetch request to the APS API to get the folder contents
  //const response = ...

  const folderContents = await response.json();
  return folderContents;
};

async function getItemVersions(projectId, itemId, accessToken) {
  // Make a fetch request to the APS API to get the item versions
  //const response = ...

  const itemVersions = await response.json();
  return itemVersions;
};

module.exports = {
  getHubs,
  getProjects,
  getProjectTopFolders,
  getFolderContents,
  getItemVersions
}