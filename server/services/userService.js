import User     from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import logger   from '../utils/logger.js';

const MAX_HISTORY = 10;

const buildHistoryKey = (entry) => {
  if (entry.lat != null && entry.lon != null) {
    return `${Number(entry.lat).toFixed(4)},${Number(entry.lon).toFixed(4)}`;
  }

  return [entry.city, entry.state, entry.country]
    .filter(Boolean)
    .join('|')
    .toLowerCase();
};

const normalizeHistoryEntry = (cityOrEntry) => {
  if (typeof cityOrEntry === 'string') {
    return {
      city: cityOrEntry,
      state: '',
      country: '',
      lat: null,
      lon: null,
      searchedAt: new Date(),
    };
  }

  const entry = cityOrEntry || {};

  return {
    city: entry.city || '',
    state: entry.state || '',
    country: entry.country || '',
    lat: entry.lat != null ? Number(entry.lat) : null,
    lon: entry.lon != null ? Number(entry.lon) : null,
    searchedAt: entry.searchedAt || new Date(),
  };
};

/**
 * Add a city to the user's search history.
 * Deduplicates (removes old entry if same city),
 * keeps max 10 entries, most recent first.
 *
 * @param {string} userId
 * @param {string|Object} cityOrEntry
 * @returns {Promise<Array>} Updated history
 */
export const saveSearchHistory = async (userId, cityOrEntry) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const entry = normalizeHistoryEntry(cityOrEntry);
    const entryKey = buildHistoryKey(entry);

    // Remove duplicate if this location was searched before
    user.searchHistory = user.searchHistory.filter(
      (existing) => buildHistoryKey(existing) !== entryKey
    );

    // Add to front of list
    user.searchHistory.unshift(entry);

    // Keep only last MAX_HISTORY entries
    if (user.searchHistory.length > MAX_HISTORY) {
      user.searchHistory = user.searchHistory.slice(0, MAX_HISTORY);
    }

    await user.save();
    logger.debug(`[UserService] Saved search history for user ${userId}: ${entry.city}`);
    return user.searchHistory;
  } catch (error) {
    // Non-critical — log and continue; don't fail the weather request
    logger.error('[UserService] Failed to save search history:', error.message);
  }
};

/**
 * Retrieve a user's search history.
 *
 * @param {string} userId
 * @returns {Promise<Array<{ city: string, state: string, country: string, lat: number, lon: number, searchedAt: Date }>>}
 * @throws {ApiError} 404 if user not found
 */
export const getSearchHistory = async (userId) => {
  const user = await User.findById(userId).select('searchHistory');
  if (!user) throw ApiError.notFound('User not found.');
  return user.searchHistory || [];
};

/**
 * Clear all search history for a user.
 *
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const clearSearchHistory = async (userId) => {
  await User.findByIdAndUpdate(userId, { searchHistory: [] });
  logger.info(`[UserService] Cleared search history for user ${userId}`);
};