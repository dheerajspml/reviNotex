/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
export const appDirectory = "app";
export const browserBuildDirectory = "public/build";
export const publicPath = "/build/";
export const serverBuildDirectory = "build";
export const devServerPort = 8002;
export const ignoredRouteFiles = [".*"];
export const routes = {
  '/': require.resolve('./app/routes/index'),
  '/searchs/:noteId': require.resolve('./app/routes/searchs/[noteId]'),
  '/myNote/:subjectId/:folderId/:noteId/edit': require.resolve('./app/routes/myNote/[subjectId]/[folderId]/[noteId]/edit'),
};