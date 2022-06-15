import { InMemoryCache } from "@apollo/client";
import { darkModeVar } from "./variables";

export default new InMemoryCache({
  dataIdFromObject: o => o.id ? `${o.__typename}-${o.id}` : `${o.__typename}-${o.cursor}`,
  typePolicies: {
    // Pool: {
    //   // Singleton types that have no identifying field can use an empty
    //   // array for their keyFields.
    //   keyFields: ["pair"],
    // },
    Query: {
      fields: {
        darkMode() {
          return darkModeVar();
        },
      },
    },
  },
});
