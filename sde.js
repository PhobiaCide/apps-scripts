/**
 * @name getData
 * @description Takes as input a table name, a table address, and a toggle for using the cache service. If a table name and a table address are boh provided, the script will use the address. The response is parsed as JSON on the return.
 * @summary Fetches the given Eve Online Static Data Export .JSON conversion and returns the parsed JSON
 *
 * @param {object} options - An object containing properties which are parameters for getData
 * @property {(string|boolean)} [options.tableName = false] - The name of the desired .JSON conversion file.
 * @property {(string|boolean)} [options.tableAddress = false] - The address of the desired .JSON conversion file, has preference over options.tableName.
 * @property {boolean} [options.useCache = false] - Weather to use the cache service or not
 *
 * @return {object}
 */
function getData({
  tableName = false,
  tableAddress = false,
  useCache = false
}) {
  return !tableAddress
    ? !tableName
      ? new Error(`
getData({
tableName:{${typeof tableName}}${tableName},
tableAddress:{${typeof tableAddress}}${tableAddress}})
Error: No valid arguments!`
        )
      : !useCache
      ? JSON.parse(
          UrlFetchApp.fetch(
            sde.tables.find(table => {
              return table.name == tableName;
            }).href
          ).getContentText()
        )
      : JSON.parse(
          cacheUrlFetchApp(
            sde.tables.find(table => {
              return table.name == tableName;
            }).href
          )
        )
    : !useCache
    ? JSON.parse(UrlFetchApp.fetch(tableAddress).getContentText())
    : JSON.parse(cacheUrlFetchApp(tableAddress));
}
const sde = {
  /**
   * @name industryActivity
   * @description An array of objects representing different industry activities and their Ids
   */
  industryActivities: [
    {
      activityId: 1,
      activityName: 'Manufacturing'
    },
    {
      activityId: 3,
      activityName: 'Researching Time Efficiency'
    },
    {
      activityId: 4,
      activityName: 'Researching Material Efficiency'
    },
    {
      activityId: 5,
      activityName: 'Copying'
    },
    {
      activityId: 8,
      activityName: 'Invention'
    },
    {
      activityId: 9,
      activityName: 'Reactions'
    }
  ],
  /**
   * @name tables
   * @description An array of objects, each of which contains a name and address to an Eve Online Static Data Export .JSON conversion
   */
  tables: getData({
    tableAddress: `http://sde.zzeve.com/tables.json`,
    useCache: true
  }),
  /**
   * @name invMarketGroups
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "invMarketGroups."
   * @example [...{ marketGroupId, marketGroupName, description }]
   */
  invMarketGroups: getData({
    tableName: 'invMarketGroups'
  })
    .map(entry => {
      const { marketGroupId, marketGroupName, description } = entry;
      return {
        marketGroupId,
        marketGroupName,
        description
      };
    })
    .sort((a, b) => {
      return a.marketGroupId - b.marketGroupId;
    }),
  /**
   * @name invCategories
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "invCategories", the list is filtered for only published entries.
   * @example [...{ categoryId, categoryName }]
   */
  invCategories: getData({
    tableName: `invCategories`,
    useCache: true
  })
    .filter(
      // filter for entries where "published" is not zero...
      entry => {
        return entry.published != 0;
      }
    )
    .map(
      // for each array entry...
      entry => {
        // return an object with these properties...
        const { categoryId, categoryName } = entry;
        return {
          categoryId,
          categoryName
        };
      }
    )
    .sort((a, b) => {
      return a.categoryId - b.categoryId;
    }),
  /**
   * @name invGroups
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "invGroups", the list is filtered for only published entries.
   * @example [...{ groupId, groupName, categoryId }]
   */
  invGroups: getData({
    tableName: `invGroups`
  })
    .filter(
      // filter for entries where "published" is not zero...
      entry => {
        return entry.published != 0;
      }
    )
    .map(
      // for each array entry...
      entry => {
        // return an object with these attributes...
        const { groupId, groupName, categoryId } = entry;
        return {
          groupId,
          groupName,
          categoryId
        };
      }
    )
    .sort((a, b) => {
      return a.groupId - b.groupId;
    }),
  /**
   * @name invTypes
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "invTypes", the list is filtered for only published entries and only certain attributes are mapped.
   * @example [...{ typeId, typeName, description, groupId, marketGroupId }]
   */
  invTypes: getData({
    tableName: 'invTypes'
  })
    .filter(
      // filter for entries where "published" is not zero...
      entry => {
        return entry.published != 0;
      }
    )
    .map(
      // for each array entry...
      entry => {
        // return an object with these attributes...
        const { typeId, typeName, description, groupId, marketGroupId } = entry;
        return {
          typeId,
          typeName,
          description,
          groupId,
          marketGroupId
        };
      }
    )
    .sort((a, b) => {
      return a.typeId - b.typeId;
    }),

  /**
   * @name industryActivityMaterials
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "industryActivityMaterials", the list is filtered for only published entries.
   * @example [...{typeId, activityId, materialtypeId, quantity}]
   *
   * @return {array}
   */
  industryActivityMaterials: getData({
    tableName: 'industryActivityMaterials'
  })
    .filter(entry => {
      return publishedTypeIds.includes(entry.typeId);
    })
    .sort((a, b) => {
      return a.typeId - b.typeId;
    }),
  /**
   * @name industryActivityProducts
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "industryActivityProducts", the list is filtered for only published entries and only certain attributes are mapped.
   * @example [...{typeId, typename, productTypeId, quantity}]
   *
   * @return {array}
   */
  industryActivityProducts: getData({
    tableName: 'industryActivityProducts'
  })
    .filter(entry => {
      return publishedTypeIds.includes(entry.typeId);
    })
    .map(entry => {
      const { typeId, activityId, productTypeId, quantity } = entry;
      return {
        typeId,
        activityId,
        productTypeId,
        quantity
      };
    })
    .sort((a, b) => {
      return a.typeId - b.typeId;
    }),
  /**
   * @name sde.industryActivity
   * @method
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "industryActivities."
   * @example [...{typeId, activityId, time}]
   *
   * @return {array}
   */
  industryActivity: getData({
    tableName: 'industryActivity'
  })
    .filter(entry => {
      return publishedTypeIds.includes(entry.typeId);
    })
    .sort((a, b) => {
      return a.typeId - b.typeId;
    }),
  /**
   * @name sde.industryActivityProbabilities
   * @method
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "industryActivityProbabilities."
   * @example [...{typeId, activityId, materialtypeId, quantity}]
   *
   * @return {array}
   */
  industryActivityProbabilities: getData({
    tableName: `industryActivityProbabilities`
  })
    .filter(entry => publishedTypeIds.includes(entry.typeId))
    .sort((a, b) => a.typeId - b.typeId),
  /**
   * @name sde.industryActivitySkills
   * @method
   * @description Returns an array of objects, each of which represents a different item. Taken from the SDE table, "industryActivitySkills."
   * @example [...{typeId, activityId, materialtypeId, quantity}]
   *
   * @return {array}
   */
  industryActivitySkills: getData({
    tableName: `industryActivitySkills`
  })
    .filter(entry => publishedTypeIds.includes(entry.typeId))
    .sort((a, b) => a.typeId - b.typeId)
};

/**
 * @name publishedTypes
 * @description Takes invTypes and takes the typeId from each entry and returns them all in an array
 */
const publishedTypeIds = sde.invTypes.map(entry => entry.typeId);
