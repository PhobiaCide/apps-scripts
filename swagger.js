swagger = {
  characters: {
    character: {
      /**
       * swagger.characters.character.fleet
       *
       * Requires the following scope: esi-fleets.readfleet.v1
       * Return the fleet ID the character is in, if any.
       *
       * @return {Integer} The fleet I.D.
       */
      fleet: () => {
        const { characterid } = GESI.getCharacterData(GESI.getMainCharacter());

        const endpoint = `characters/${characterid}/fleet/?datasource=tranquility`;
        const options = {
          method: `get`,
          muteHttpExceptions: true
        }

        const fetch = UrlFetchApp.fetch;
        const response = fetch(domain + endpoint, options);

        const content = response.getContentText();
        const json = JSON.parse(content);

        return response.getResponseCode() == 200 ? json : null;
        //return GESI?.getClient()?.setFunction('characterscharacterfleet')?.executeRaw() || new Error(`Must be in a fleet!`);
      },
    },
  },
  universe: {
    /**
     * swagger.universe.names
     *
     * Resolve a set of IDs to names and categories. Supported ID’s for resolving are:
     * Characters, Corporations, Alliances, Stations, Solar Systems, Constellations,
     * Regions, Types and Factions.
     *
     * @param {Object} arrTypeIDs An object containing an array of values whose key
     * is "typeids" e.g. {ids: [..., typeids, ...]}
     *
     * @return {Array} e.g. [..., [groupname, typeid, typename], ...]
     */
    names: typeIDs => {
      return GESI.getClient().setFunction('universenames').executeRaw({ ids: typeIDs });
    },
  },
  fleets: {
    fleet: {
      /**
       * swagger.fleets.fleet.members
       *
       * Requires the following scope: esi-fleets.readfleet.v1
       * Return information about fleet members
       *
       * @param {Object} intFleetID An object containing a value whose key is "fleetid"
       * e.g. {fleetid: Integer}
       *
       * @return {Array} e.g [..., [characterid {integer}, jointime {string}, role {string},
       * shiptypeid {integer}, solarsystemid {integer}, squadid	{integer},
       * stationid	{integer}, takesfleetwarp	{boolean}, wingid {integer}], ...]
       */
      members: fleetID => {
        return GESI.getClient().setFunction('fleetsfleetmembers').executeRaw({ fleetid: fleetID });
      },
    },
  },
};