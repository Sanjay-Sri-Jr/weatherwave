import User     from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import logger   from '../utils/logger.js';

const MAX_HISTORY = 10;

/**
 * Add a city to the user's search history.
 * Deduplicates (removes old entry if same city),
 * keeps max 10 entries, most recent first.
 *
 * @param {string} userId
 * @param {string} city
 * @returns {Promise<Array>} Updated history
 */
export const saveSearchHistory = async (userId, city) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Remove duplicate if this city was searched before
    user.searchHistory = user.searchHistory.filter(
      (entry) => entry.city.toLowerCase() !== city.toLowerCase()
    );

    // Add to front of list
    user.searchHistory.unshift({ city, searchedAt: new Date() });

    // Keep only last MAX_HISTORY entries
    if (user.searchHistory.length > MAX_HISTORY) {
      user.searchHistory = user.searchHistory.slice(0, MAX_HISTORY);
    }

    await user.save();
    logger.debug(`[UserService] Saved search history for user ${userId}: ${city}`);
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
 * @returns {Promise<Array<{ city: string, searchedAt: Date }>>}
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