define(function() {
  return function getStatics(component) {
    if (component.type) {
      return component.type;
    }
    else if (component.constructor) {
      return component.constructor;
    }
    else {
      console.warn(component);
      throw new Error("Unable to get a reference to #statics of component. See console.");
    }
  };
});