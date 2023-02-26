const lookup = {
    /**
   * @name lookup.typeName
   * @method
   * @description Returns a type name for a given item type Id
   *
   * @param {(string|number)} typeId - the Id number for a particular item type
   *
   * @return {string}
   */
  typeName: typeId => {
    // search in invTypes...		// until a match is found...
    const type = invTypes.find(element => element.typeId == typeId);
    // return "typename" from entry if it is defined...
    return typeof type != 'undefined'
      ? type.typeName
      : new Error(`typeName from typeId ${typeId} is ${typeof type}`);
  },
  /**
   * @name lookup.groupId
   * @method
   * @description Returns a group Id for a given item type Id
   *
   * @param {(string|number)} typeId - the Id number for a particular item type
   *
   * @return {string}
   */
  groupId: typeId => {
    // search in invTypes...until a match is found...
    const group = invTypes.find(element => element.typeId == typeId);
    // return "typename" from entry if it is defined...
    return typeof group != 'undefined'
      ? group.groupId
      : new Error(`groupId from typeId ${typeId} is ${typeof group}`);
  },
  /**
   * @name lookup.groupName
   * @method
   * @description Returns a group name for a given item group Id
   *
   * @param {(string|number)} groupId - the Id number for a a particular item group
   *
   * @return {string}
   */
  groupName: groupId => {
    // search in invGroups...// until a match is found...
    const group = invGroups.find(element => element.groupId == groupId);
    // return "typename" from entry if it is defined...
    return typeof group != 'undefined'
      ? group.groupName
      : new Error(`groupName from groupId ${groupId} is ${typeof group}`);
  },
  /**
   * @name lookup.marketGroupId
   * @method
   * @description Returns a market group Id for a given item type Id
   *
   * @param {(string|number)} typeId - the Id number for a particular item type
   *
   * @return {string}
   */
  marketGroupId: typeId => {
    const marketGroup = invTypes.find(element => element.typeId == typeId);
    return typeof marketGroup != `undefined`
      ? marketGroup.marketGroupId
      : new Error(
          `marketGroupId from typeId ${typeId} is ${typeof marketgroup}.`
        );
  },
  /**
   * @name lookup.marketGroupName
   * @method
   * @description Returns a market group name for a given item market group Id
   *
   * @param {(string|number)} marketGroupId - the Id number for a particular item market group
   *
   * @return {string}
   */
  marketGroupName: marketGroupId => {
    const marketGroup = invMarketGroups.find(
      element => element.marketGroupId == marketGroupId
    );
    return typeof marketGroup != `undefined`
      ? marketGroup.marketGroupName
      : new Error(
          `marketGroupName failed with param(s) {${typeof marketGroupId}} ${marketGroupId}
            Output: ${marketGroup}.marketGroupName`
        );
  },
  /**
   * @name lookup.categoryId
   * @method
   * @description Returns a category Id for a given group Id
   *
   * @param {(string|number)} groupId - the Id number for a particular item group
   *
   * @return {string}
   */
  categoryId: groupId => {
    const category = invGroups.find(element => {
      return element.groupId == groupId;
    });
    return typeof category != `undefined`
      ? category.categoryId
      : new Error(`categoryId from groupId ${groupId} is ${typeof category}`);
  },
  /**
   * @name lookup.categoryName
   * @method
   * @description Returns a category name for a given category Id
   *
   * @param {(string|number)} categoryId - the Id number for a particular item category
   *
   * @return {string}
   */
  categoryName: categoryId => {
    // search in invGroups...
    const category = invCategories.find(element => {
      // until a match is found...
      return element.categoryId == categoryId;
    });
    // return "categoryName" from entry if it is defined...
    return typeof category != 'undefined'
      ? category.categoryName
      : new Error(
          `categoryName from categoryId ${categoryId} is ${typeof category}`
        );
  },
  /**
   * @name lookup.activityName
   * @method
   * @description Returns an activity name for a given activity Id
   *
   * @param {(string|number)} activityId - the Id number for a particular industry activity
   *
   * @return {string}
   */
  activityName: activityId => {
    // search in invTypes...		// until a match is found...
    const activity = industryActivities.find(
      element => element.activityId == activityId
    );
    // return "typename" from entry if it is defined...
    return typeof activity != 'undefined'
      ? activity.activityName
      : new Error(
          `activityName from activityId ${activityId} is ${typeof activity}`
        );
  }
};
