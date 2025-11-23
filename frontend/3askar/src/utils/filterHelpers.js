/**
 * Shared filtering utilities for Menu Bar filters
 * Centralizes the isItemVisible logic to avoid duplication
 */

/**
 * Check if an item should be visible based on current filter settings
 * @param {Object} item - The file or folder item to check
 * @param {Object} filters - Filter configuration object
 * @param {string} filters.filterMode - "files" or "folders"
 * @param {string|null} filters.typeFilter - Type filter value (e.g., "PDFs", "Images", etc.)
 * @param {string|Object|null} filters.peopleFilter - People filter value
 * @param {string|null} filters.modifiedFilter - Modified filter value ("today", "week", "month")
 * @param {string|null} filters.sourceFilter - Source/location filter value ("anywhere", "myDrive", "shared")
 * @param {Function} filters.matchesCurrentUser - Function to check if item is owned by current user
 * @param {Function} filters.matchTypeFilter - Function to check if item matches type filter
 * @param {Function} filters.filterByModified - Function to filter by modified date
 * @param {Function} filters.matchesSource - Function to check if item matches source filter
 * @returns {boolean} - True if item should be visible, false otherwise
 */
export const isItemVisible = (item, filters) => {
  if (!item) return false;

  const {
    filterMode,
    typeFilter,
    peopleFilter,
    modifiedFilter,
    sourceFilter,
    matchesCurrentUser,
    matchTypeFilter,
    filterByModified,
    matchesSource,
  } = filters;

  // A. Source/Location Filter - check first as it's a high-level filter
  if (sourceFilter && matchesSource) {
    if (!matchesSource(item, sourceFilter)) return false;
  }

  // B. Filter Mode (Files vs Folders)
  if (filterMode === "files" && item.type === "folder") return false;
  if (filterMode === "folders" && item.type !== "folder") return false;

  // C. Type Filter - use the context function which handles all 8 types
  if (typeFilter && matchTypeFilter) {
    if (!matchTypeFilter(item, typeFilter)) return false;
  }

  // D. People Filter
  if (peopleFilter) {
    if (peopleFilter === "owned") {
      if (!matchesCurrentUser || !matchesCurrentUser(item)) return false;
    } else if (peopleFilter === "sharedWithMe") {
      // Check if item is shared with current user
      // Note: sharedWith array represents items the user shared with others (owned by user),
      // not items shared with the user. Only check location.
      const location = (item.location || "").toLowerCase();
      if (!location.includes("shared")) return false;
    } else if (peopleFilter === "sharedByMe") {
      // Check if item is owned by current user AND has sharedWith entries
      if (!matchesCurrentUser || !matchesCurrentUser(item)) return false;
      const hasSharedWith = Array.isArray(item.sharedWith) && item.sharedWith.length > 0;
      if (!hasSharedWith) return false;
    } else if (
      typeof peopleFilter === "object" &&
      peopleFilter.kind === "person"
    ) {
      // Match by specific person (ownerId, ownerEmail, or ownerName)
      const ownerId = item.ownerId ? item.ownerId.toString() : null;
      const ownerEmail =
        typeof item.ownerEmail === "string"
          ? item.ownerEmail.toLowerCase()
          : null;
      const ownerName =
        typeof item.owner === "string"
          ? item.owner.trim().toLowerCase()
          : null;

      let matches = false;
      if (peopleFilter.ownerId && ownerId) {
        if (peopleFilter.ownerId === ownerId) matches = true;
      }
      if (!matches && peopleFilter.ownerEmail && ownerEmail) {
        if (peopleFilter.ownerEmail === ownerEmail) matches = true;
      }
      if (!matches && peopleFilter.ownerName && ownerName) {
        if (peopleFilter.ownerName === ownerName) matches = true;
      }
      if (!matches) return false;
    }
  }

  // E. Modified Filter - use the context function which handles today/week/month
  if (modifiedFilter && filterByModified) {
    // filterByModified expects an array, so we need to check a single item
    const testArray = [item];
    const filtered = filterByModified(testArray);
    if (filtered.length === 0) return false;
  } else if (modifiedFilter && !filterByModified) {
    // Fallback if filterByModified is not available (shouldn't happen, but defensive)
    const date = new Date(
      item.updatedAt || item.lastAccessedAt || item.uploadedAt || item.deletedAt
    );
    if (Number.isNaN(date.getTime())) return false; // Invalid date

    const today = new Date();
    switch (modifiedFilter) {
      case "today":
        if (date.toDateString() !== today.toDateString()) return false;
        break;
      case "week":
        if (today - date > 7 * 24 * 60 * 60 * 1000) return false;
        break;
      case "month":
        if (
          date.getMonth() !== today.getMonth() ||
          date.getFullYear() !== today.getFullYear()
        )
          return false;
        break;
      default:
        break;
    }
  }

  return true;
};

