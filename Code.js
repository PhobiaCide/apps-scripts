/**
 * @format
 *
 * @name fetchApiPages
 * @version 1.0.0
 * @date 11/26/2022
 *
 * @author PhobiaCide
 * @license MIT License
 * @copyright © 2022 Andrew Amason
 *
 * @summary Fetches all existing pages of an ESI endpoint response
 * @description Fetches the first page of an Eve Swagger Interface (ESI) api request and determines the total number of pages to be fetched. Then, it fetches them all and returns them as an array of objects.
 *
 * @param {string} url - The address to which to make the api call
 * @param {string} options - Optional standard fetch parameters
 *
 * @return {array}
 */
function fetchApiPages_(url, options) {
  /**
   * @constant
   * @alias fetchApiPage
   * @summary Fetches a single response page
   * @description
   * @param {number} page - The number of the desired page
   * @returns {(object|Error)} - The server response or a new error if server response code is anything other than 200
   */
  const fetchApiPage = (page = 1) => {
    /**
     * @constant
     * @alias fetchResponse
     * @summary Makes
     * @returns
     */
    const fetchResponse = () => {
      const response = UrlFetchApp.fetch(`${url}${page}`, options);
      const code = response.getResponseCode();
      return code == 200
        ? response
        : new Error(
            `HTTP request unsuccessful at ${url}${page}, ${options}. Server response: ${response.getResponseCode()}.`
          );
    };
    if (fetchResponse() != null) {
      const quantity = fetchResponse.getHeaders()[`x-pages`];
      const json = JSON.parse(fetchResponse.getContentText());

      return page < quantity ? json.concat(fetchApiPage(page + 1)) : json;
    }
  };
  return fetchApiPage();
}

/**
 * Checks if the return from a URL fetch is in cache. If so, it retrieves
 * it from cache instead of making another network request. If not, it
 * makes a new request and adds it to the cache.
 *
 * @async
 * @function
 * @param {string} fetchUrl - The URL to fetch
 * @param {Object} [parameters={ method: 'get', payload: '' }] - The parameters to pass to the `UrlFetchApp.fetch` method
 * @param {string} [cacheService='script'] - The cache service to use. Must be one of 'script', 'document', or 'user'
 * @return {Promise<string>} - The content of the URL response
 */

async function cacheUrlFetchApp(
  fetchUrl,
  parameters = { method: `get`, payload: `` },
  cacheService = `script`
) {
  // Set up public cache
  const cache =
    cacheService === `script`
      ? CacheService.getScriptCache()
      : cacheService === `document`
      ? CacheService.getDocumentCache()
      : cacheService === `user`
      ? CacheService.getUserCache()
      : CacheService.getScriptCache();

  // Turn the requested Url into a string based on the MD5
  const digest = Utilities.base64Encode(
    Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, fetchUrl)
  );
  // Based on this MD5, lookup the Url in the cache
  const cached = cache.get(digest);
  // If a result has been already cached, use it
  if (cached != null) {
    return cached;
  }
  // Make the network requests at random intervals to avoId server overload
  await new Promise(resolve => setTimeout(resolve, Math.random() * 5000));
  // Fetch the Url
  const resultXML = UrlFetchApp.fetch(fetchUrl, parameters);
  // Get the text of the Url call
  const result = resultXML.getContentText();
  // Cache the result in chunks
  const chunkSize = 100000; // 100KB
  const chunks = Array.from(
    { length: Math.ceil(result.length / chunkSize) },
    (_, index) => {
      const start = i * chunkSize;
      return [digest + '_' + index, result.substring(start, start + chunkSize)];
    }
  );
  cache.putAll(chunks, 21600);
  // return the result
  return result;
}
