import Activity from "../models/Activity.js";
export const logActivity = (action, user, event, meta) =>
  Activity.create({ action, user, event, meta }).catch(() => {});