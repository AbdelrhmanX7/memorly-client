// config/us-locations.ts
// US States and major cities data

export interface CityOption {
  value: string; // "City, State" format
  city: string;
  state: string;
  stateCode: string;
}

export interface StateGroup {
  stateName: string;
  stateCode: string;
  cities: CityOption[];
}

// Major US cities grouped by state
export const US_LOCATIONS: StateGroup[] = [
  {
    stateName: "Alabama",
    stateCode: "AL",
    cities: [
      {
        value: "Birmingham, AL",
        city: "Birmingham",
        state: "Alabama",
        stateCode: "AL",
      },
      {
        value: "Montgomery, AL",
        city: "Montgomery",
        state: "Alabama",
        stateCode: "AL",
      },
      {
        value: "Mobile, AL",
        city: "Mobile",
        state: "Alabama",
        stateCode: "AL",
      },
      {
        value: "Huntsville, AL",
        city: "Huntsville",
        state: "Alabama",
        stateCode: "AL",
      },
    ],
  },
  {
    stateName: "Alaska",
    stateCode: "AK",
    cities: [
      {
        value: "Anchorage, AK",
        city: "Anchorage",
        state: "Alaska",
        stateCode: "AK",
      },
      {
        value: "Fairbanks, AK",
        city: "Fairbanks",
        state: "Alaska",
        stateCode: "AK",
      },
      { value: "Juneau, AK", city: "Juneau", state: "Alaska", stateCode: "AK" },
    ],
  },
  {
    stateName: "Arizona",
    stateCode: "AZ",
    cities: [
      {
        value: "Phoenix, AZ",
        city: "Phoenix",
        state: "Arizona",
        stateCode: "AZ",
      },
      {
        value: "Tucson, AZ",
        city: "Tucson",
        state: "Arizona",
        stateCode: "AZ",
      },
      { value: "Mesa, AZ", city: "Mesa", state: "Arizona", stateCode: "AZ" },
      {
        value: "Chandler, AZ",
        city: "Chandler",
        state: "Arizona",
        stateCode: "AZ",
      },
      {
        value: "Scottsdale, AZ",
        city: "Scottsdale",
        state: "Arizona",
        stateCode: "AZ",
      },
    ],
  },
  {
    stateName: "Arkansas",
    stateCode: "AR",
    cities: [
      {
        value: "Little Rock, AR",
        city: "Little Rock",
        state: "Arkansas",
        stateCode: "AR",
      },
      {
        value: "Fort Smith, AR",
        city: "Fort Smith",
        state: "Arkansas",
        stateCode: "AR",
      },
      {
        value: "Fayetteville, AR",
        city: "Fayetteville",
        state: "Arkansas",
        stateCode: "AR",
      },
    ],
  },
  {
    stateName: "California",
    stateCode: "CA",
    cities: [
      {
        value: "Los Angeles, CA",
        city: "Los Angeles",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "San Diego, CA",
        city: "San Diego",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "San Jose, CA",
        city: "San Jose",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "San Francisco, CA",
        city: "San Francisco",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "Fresno, CA",
        city: "Fresno",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "Sacramento, CA",
        city: "Sacramento",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "Long Beach, CA",
        city: "Long Beach",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "Oakland, CA",
        city: "Oakland",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "Bakersfield, CA",
        city: "Bakersfield",
        state: "California",
        stateCode: "CA",
      },
      {
        value: "Anaheim, CA",
        city: "Anaheim",
        state: "California",
        stateCode: "CA",
      },
    ],
  },
  {
    stateName: "Colorado",
    stateCode: "CO",
    cities: [
      {
        value: "Denver, CO",
        city: "Denver",
        state: "Colorado",
        stateCode: "CO",
      },
      {
        value: "Colorado Springs, CO",
        city: "Colorado Springs",
        state: "Colorado",
        stateCode: "CO",
      },
      {
        value: "Aurora, CO",
        city: "Aurora",
        state: "Colorado",
        stateCode: "CO",
      },
      {
        value: "Fort Collins, CO",
        city: "Fort Collins",
        state: "Colorado",
        stateCode: "CO",
      },
    ],
  },
  {
    stateName: "Connecticut",
    stateCode: "CT",
    cities: [
      {
        value: "Bridgeport, CT",
        city: "Bridgeport",
        state: "Connecticut",
        stateCode: "CT",
      },
      {
        value: "New Haven, CT",
        city: "New Haven",
        state: "Connecticut",
        stateCode: "CT",
      },
      {
        value: "Hartford, CT",
        city: "Hartford",
        state: "Connecticut",
        stateCode: "CT",
      },
      {
        value: "Stamford, CT",
        city: "Stamford",
        state: "Connecticut",
        stateCode: "CT",
      },
    ],
  },
  {
    stateName: "Delaware",
    stateCode: "DE",
    cities: [
      {
        value: "Wilmington, DE",
        city: "Wilmington",
        state: "Delaware",
        stateCode: "DE",
      },
      { value: "Dover, DE", city: "Dover", state: "Delaware", stateCode: "DE" },
      {
        value: "Newark, DE",
        city: "Newark",
        state: "Delaware",
        stateCode: "DE",
      },
    ],
  },
  {
    stateName: "Florida",
    stateCode: "FL",
    cities: [
      {
        value: "Jacksonville, FL",
        city: "Jacksonville",
        state: "Florida",
        stateCode: "FL",
      },
      { value: "Miami, FL", city: "Miami", state: "Florida", stateCode: "FL" },
      { value: "Tampa, FL", city: "Tampa", state: "Florida", stateCode: "FL" },
      {
        value: "Orlando, FL",
        city: "Orlando",
        state: "Florida",
        stateCode: "FL",
      },
      {
        value: "St. Petersburg, FL",
        city: "St. Petersburg",
        state: "Florida",
        stateCode: "FL",
      },
      {
        value: "Tallahassee, FL",
        city: "Tallahassee",
        state: "Florida",
        stateCode: "FL",
      },
      {
        value: "Fort Lauderdale, FL",
        city: "Fort Lauderdale",
        state: "Florida",
        stateCode: "FL",
      },
    ],
  },
  {
    stateName: "Georgia",
    stateCode: "GA",
    cities: [
      {
        value: "Atlanta, GA",
        city: "Atlanta",
        state: "Georgia",
        stateCode: "GA",
      },
      {
        value: "Augusta, GA",
        city: "Augusta",
        state: "Georgia",
        stateCode: "GA",
      },
      {
        value: "Columbus, GA",
        city: "Columbus",
        state: "Georgia",
        stateCode: "GA",
      },
      {
        value: "Savannah, GA",
        city: "Savannah",
        state: "Georgia",
        stateCode: "GA",
      },
    ],
  },
  {
    stateName: "Hawaii",
    stateCode: "HI",
    cities: [
      {
        value: "Honolulu, HI",
        city: "Honolulu",
        state: "Hawaii",
        stateCode: "HI",
      },
      {
        value: "Pearl City, HI",
        city: "Pearl City",
        state: "Hawaii",
        stateCode: "HI",
      },
      { value: "Hilo, HI", city: "Hilo", state: "Hawaii", stateCode: "HI" },
    ],
  },
  {
    stateName: "Idaho",
    stateCode: "ID",
    cities: [
      { value: "Boise, ID", city: "Boise", state: "Idaho", stateCode: "ID" },
      {
        value: "Meridian, ID",
        city: "Meridian",
        state: "Idaho",
        stateCode: "ID",
      },
      { value: "Nampa, ID", city: "Nampa", state: "Idaho", stateCode: "ID" },
    ],
  },
  {
    stateName: "Illinois",
    stateCode: "IL",
    cities: [
      {
        value: "Chicago, IL",
        city: "Chicago",
        state: "Illinois",
        stateCode: "IL",
      },
      {
        value: "Aurora, IL",
        city: "Aurora",
        state: "Illinois",
        stateCode: "IL",
      },
      {
        value: "Rockford, IL",
        city: "Rockford",
        state: "Illinois",
        stateCode: "IL",
      },
      {
        value: "Joliet, IL",
        city: "Joliet",
        state: "Illinois",
        stateCode: "IL",
      },
      {
        value: "Naperville, IL",
        city: "Naperville",
        state: "Illinois",
        stateCode: "IL",
      },
    ],
  },
  {
    stateName: "Indiana",
    stateCode: "IN",
    cities: [
      {
        value: "Indianapolis, IN",
        city: "Indianapolis",
        state: "Indiana",
        stateCode: "IN",
      },
      {
        value: "Fort Wayne, IN",
        city: "Fort Wayne",
        state: "Indiana",
        stateCode: "IN",
      },
      {
        value: "Evansville, IN",
        city: "Evansville",
        state: "Indiana",
        stateCode: "IN",
      },
    ],
  },
  {
    stateName: "Iowa",
    stateCode: "IA",
    cities: [
      {
        value: "Des Moines, IA",
        city: "Des Moines",
        state: "Iowa",
        stateCode: "IA",
      },
      {
        value: "Cedar Rapids, IA",
        city: "Cedar Rapids",
        state: "Iowa",
        stateCode: "IA",
      },
      {
        value: "Davenport, IA",
        city: "Davenport",
        state: "Iowa",
        stateCode: "IA",
      },
    ],
  },
  {
    stateName: "Kansas",
    stateCode: "KS",
    cities: [
      {
        value: "Wichita, KS",
        city: "Wichita",
        state: "Kansas",
        stateCode: "KS",
      },
      {
        value: "Overland Park, KS",
        city: "Overland Park",
        state: "Kansas",
        stateCode: "KS",
      },
      {
        value: "Kansas City, KS",
        city: "Kansas City",
        state: "Kansas",
        stateCode: "KS",
      },
      { value: "Topeka, KS", city: "Topeka", state: "Kansas", stateCode: "KS" },
    ],
  },
  {
    stateName: "Kentucky",
    stateCode: "KY",
    cities: [
      {
        value: "Louisville, KY",
        city: "Louisville",
        state: "Kentucky",
        stateCode: "KY",
      },
      {
        value: "Lexington, KY",
        city: "Lexington",
        state: "Kentucky",
        stateCode: "KY",
      },
      {
        value: "Bowling Green, KY",
        city: "Bowling Green",
        state: "Kentucky",
        stateCode: "KY",
      },
    ],
  },
  {
    stateName: "Louisiana",
    stateCode: "LA",
    cities: [
      {
        value: "New Orleans, LA",
        city: "New Orleans",
        state: "Louisiana",
        stateCode: "LA",
      },
      {
        value: "Baton Rouge, LA",
        city: "Baton Rouge",
        state: "Louisiana",
        stateCode: "LA",
      },
      {
        value: "Shreveport, LA",
        city: "Shreveport",
        state: "Louisiana",
        stateCode: "LA",
      },
    ],
  },
  {
    stateName: "Maine",
    stateCode: "ME",
    cities: [
      {
        value: "Portland, ME",
        city: "Portland",
        state: "Maine",
        stateCode: "ME",
      },
      {
        value: "Lewiston, ME",
        city: "Lewiston",
        state: "Maine",
        stateCode: "ME",
      },
      { value: "Bangor, ME", city: "Bangor", state: "Maine", stateCode: "ME" },
    ],
  },
  {
    stateName: "Maryland",
    stateCode: "MD",
    cities: [
      {
        value: "Baltimore, MD",
        city: "Baltimore",
        state: "Maryland",
        stateCode: "MD",
      },
      {
        value: "Frederick, MD",
        city: "Frederick",
        state: "Maryland",
        stateCode: "MD",
      },
      {
        value: "Rockville, MD",
        city: "Rockville",
        state: "Maryland",
        stateCode: "MD",
      },
      {
        value: "Annapolis, MD",
        city: "Annapolis",
        state: "Maryland",
        stateCode: "MD",
      },
    ],
  },
  {
    stateName: "Massachusetts",
    stateCode: "MA",
    cities: [
      {
        value: "Boston, MA",
        city: "Boston",
        state: "Massachusetts",
        stateCode: "MA",
      },
      {
        value: "Worcester, MA",
        city: "Worcester",
        state: "Massachusetts",
        stateCode: "MA",
      },
      {
        value: "Springfield, MA",
        city: "Springfield",
        state: "Massachusetts",
        stateCode: "MA",
      },
      {
        value: "Cambridge, MA",
        city: "Cambridge",
        state: "Massachusetts",
        stateCode: "MA",
      },
    ],
  },
  {
    stateName: "Michigan",
    stateCode: "MI",
    cities: [
      {
        value: "Detroit, MI",
        city: "Detroit",
        state: "Michigan",
        stateCode: "MI",
      },
      {
        value: "Grand Rapids, MI",
        city: "Grand Rapids",
        state: "Michigan",
        stateCode: "MI",
      },
      {
        value: "Warren, MI",
        city: "Warren",
        state: "Michigan",
        stateCode: "MI",
      },
      {
        value: "Ann Arbor, MI",
        city: "Ann Arbor",
        state: "Michigan",
        stateCode: "MI",
      },
    ],
  },
  {
    stateName: "Minnesota",
    stateCode: "MN",
    cities: [
      {
        value: "Minneapolis, MN",
        city: "Minneapolis",
        state: "Minnesota",
        stateCode: "MN",
      },
      {
        value: "St. Paul, MN",
        city: "St. Paul",
        state: "Minnesota",
        stateCode: "MN",
      },
      {
        value: "Rochester, MN",
        city: "Rochester",
        state: "Minnesota",
        stateCode: "MN",
      },
    ],
  },
  {
    stateName: "Mississippi",
    stateCode: "MS",
    cities: [
      {
        value: "Jackson, MS",
        city: "Jackson",
        state: "Mississippi",
        stateCode: "MS",
      },
      {
        value: "Gulfport, MS",
        city: "Gulfport",
        state: "Mississippi",
        stateCode: "MS",
      },
      {
        value: "Southaven, MS",
        city: "Southaven",
        state: "Mississippi",
        stateCode: "MS",
      },
    ],
  },
  {
    stateName: "Missouri",
    stateCode: "MO",
    cities: [
      {
        value: "Kansas City, MO",
        city: "Kansas City",
        state: "Missouri",
        stateCode: "MO",
      },
      {
        value: "St. Louis, MO",
        city: "St. Louis",
        state: "Missouri",
        stateCode: "MO",
      },
      {
        value: "Springfield, MO",
        city: "Springfield",
        state: "Missouri",
        stateCode: "MO",
      },
    ],
  },
  {
    stateName: "Montana",
    stateCode: "MT",
    cities: [
      {
        value: "Billings, MT",
        city: "Billings",
        state: "Montana",
        stateCode: "MT",
      },
      {
        value: "Missoula, MT",
        city: "Missoula",
        state: "Montana",
        stateCode: "MT",
      },
      {
        value: "Great Falls, MT",
        city: "Great Falls",
        state: "Montana",
        stateCode: "MT",
      },
    ],
  },
  {
    stateName: "Nebraska",
    stateCode: "NE",
    cities: [
      { value: "Omaha, NE", city: "Omaha", state: "Nebraska", stateCode: "NE" },
      {
        value: "Lincoln, NE",
        city: "Lincoln",
        state: "Nebraska",
        stateCode: "NE",
      },
      {
        value: "Bellevue, NE",
        city: "Bellevue",
        state: "Nebraska",
        stateCode: "NE",
      },
    ],
  },
  {
    stateName: "Nevada",
    stateCode: "NV",
    cities: [
      {
        value: "Las Vegas, NV",
        city: "Las Vegas",
        state: "Nevada",
        stateCode: "NV",
      },
      {
        value: "Henderson, NV",
        city: "Henderson",
        state: "Nevada",
        stateCode: "NV",
      },
      { value: "Reno, NV", city: "Reno", state: "Nevada", stateCode: "NV" },
    ],
  },
  {
    stateName: "New Hampshire",
    stateCode: "NH",
    cities: [
      {
        value: "Manchester, NH",
        city: "Manchester",
        state: "New Hampshire",
        stateCode: "NH",
      },
      {
        value: "Nashua, NH",
        city: "Nashua",
        state: "New Hampshire",
        stateCode: "NH",
      },
      {
        value: "Concord, NH",
        city: "Concord",
        state: "New Hampshire",
        stateCode: "NH",
      },
    ],
  },
  {
    stateName: "New Jersey",
    stateCode: "NJ",
    cities: [
      {
        value: "Newark, NJ",
        city: "Newark",
        state: "New Jersey",
        stateCode: "NJ",
      },
      {
        value: "Jersey City, NJ",
        city: "Jersey City",
        state: "New Jersey",
        stateCode: "NJ",
      },
      {
        value: "Paterson, NJ",
        city: "Paterson",
        state: "New Jersey",
        stateCode: "NJ",
      },
      {
        value: "Elizabeth, NJ",
        city: "Elizabeth",
        state: "New Jersey",
        stateCode: "NJ",
      },
    ],
  },
  {
    stateName: "New Mexico",
    stateCode: "NM",
    cities: [
      {
        value: "Albuquerque, NM",
        city: "Albuquerque",
        state: "New Mexico",
        stateCode: "NM",
      },
      {
        value: "Las Cruces, NM",
        city: "Las Cruces",
        state: "New Mexico",
        stateCode: "NM",
      },
      {
        value: "Rio Rancho, NM",
        city: "Rio Rancho",
        state: "New Mexico",
        stateCode: "NM",
      },
    ],
  },
  {
    stateName: "New York",
    stateCode: "NY",
    cities: [
      {
        value: "New York City, NY",
        city: "New York City",
        state: "New York",
        stateCode: "NY",
      },
      {
        value: "Buffalo, NY",
        city: "Buffalo",
        state: "New York",
        stateCode: "NY",
      },
      {
        value: "Rochester, NY",
        city: "Rochester",
        state: "New York",
        stateCode: "NY",
      },
      {
        value: "Yonkers, NY",
        city: "Yonkers",
        state: "New York",
        stateCode: "NY",
      },
      {
        value: "Syracuse, NY",
        city: "Syracuse",
        state: "New York",
        stateCode: "NY",
      },
    ],
  },
  {
    stateName: "North Carolina",
    stateCode: "NC",
    cities: [
      {
        value: "Charlotte, NC",
        city: "Charlotte",
        state: "North Carolina",
        stateCode: "NC",
      },
      {
        value: "Raleigh, NC",
        city: "Raleigh",
        state: "North Carolina",
        stateCode: "NC",
      },
      {
        value: "Greensboro, NC",
        city: "Greensboro",
        state: "North Carolina",
        stateCode: "NC",
      },
      {
        value: "Durham, NC",
        city: "Durham",
        state: "North Carolina",
        stateCode: "NC",
      },
    ],
  },
  {
    stateName: "North Dakota",
    stateCode: "ND",
    cities: [
      {
        value: "Fargo, ND",
        city: "Fargo",
        state: "North Dakota",
        stateCode: "ND",
      },
      {
        value: "Bismarck, ND",
        city: "Bismarck",
        state: "North Dakota",
        stateCode: "ND",
      },
      {
        value: "Grand Forks, ND",
        city: "Grand Forks",
        state: "North Dakota",
        stateCode: "ND",
      },
    ],
  },
  {
    stateName: "Ohio",
    stateCode: "OH",
    cities: [
      {
        value: "Columbus, OH",
        city: "Columbus",
        state: "Ohio",
        stateCode: "OH",
      },
      {
        value: "Cleveland, OH",
        city: "Cleveland",
        state: "Ohio",
        stateCode: "OH",
      },
      {
        value: "Cincinnati, OH",
        city: "Cincinnati",
        state: "Ohio",
        stateCode: "OH",
      },
      { value: "Toledo, OH", city: "Toledo", state: "Ohio", stateCode: "OH" },
    ],
  },
  {
    stateName: "Oklahoma",
    stateCode: "OK",
    cities: [
      {
        value: "Oklahoma City, OK",
        city: "Oklahoma City",
        state: "Oklahoma",
        stateCode: "OK",
      },
      { value: "Tulsa, OK", city: "Tulsa", state: "Oklahoma", stateCode: "OK" },
      {
        value: "Norman, OK",
        city: "Norman",
        state: "Oklahoma",
        stateCode: "OK",
      },
    ],
  },
  {
    stateName: "Oregon",
    stateCode: "OR",
    cities: [
      {
        value: "Portland, OR",
        city: "Portland",
        state: "Oregon",
        stateCode: "OR",
      },
      { value: "Salem, OR", city: "Salem", state: "Oregon", stateCode: "OR" },
      { value: "Eugene, OR", city: "Eugene", state: "Oregon", stateCode: "OR" },
    ],
  },
  {
    stateName: "Pennsylvania",
    stateCode: "PA",
    cities: [
      {
        value: "Philadelphia, PA",
        city: "Philadelphia",
        state: "Pennsylvania",
        stateCode: "PA",
      },
      {
        value: "Pittsburgh, PA",
        city: "Pittsburgh",
        state: "Pennsylvania",
        stateCode: "PA",
      },
      {
        value: "Allentown, PA",
        city: "Allentown",
        state: "Pennsylvania",
        stateCode: "PA",
      },
      {
        value: "Erie, PA",
        city: "Erie",
        state: "Pennsylvania",
        stateCode: "PA",
      },
    ],
  },
  {
    stateName: "Rhode Island",
    stateCode: "RI",
    cities: [
      {
        value: "Providence, RI",
        city: "Providence",
        state: "Rhode Island",
        stateCode: "RI",
      },
      {
        value: "Warwick, RI",
        city: "Warwick",
        state: "Rhode Island",
        stateCode: "RI",
      },
      {
        value: "Cranston, RI",
        city: "Cranston",
        state: "Rhode Island",
        stateCode: "RI",
      },
    ],
  },
  {
    stateName: "South Carolina",
    stateCode: "SC",
    cities: [
      {
        value: "Charleston, SC",
        city: "Charleston",
        state: "South Carolina",
        stateCode: "SC",
      },
      {
        value: "Columbia, SC",
        city: "Columbia",
        state: "South Carolina",
        stateCode: "SC",
      },
      {
        value: "North Charleston, SC",
        city: "North Charleston",
        state: "South Carolina",
        stateCode: "SC",
      },
    ],
  },
  {
    stateName: "South Dakota",
    stateCode: "SD",
    cities: [
      {
        value: "Sioux Falls, SD",
        city: "Sioux Falls",
        state: "South Dakota",
        stateCode: "SD",
      },
      {
        value: "Rapid City, SD",
        city: "Rapid City",
        state: "South Dakota",
        stateCode: "SD",
      },
      {
        value: "Aberdeen, SD",
        city: "Aberdeen",
        state: "South Dakota",
        stateCode: "SD",
      },
    ],
  },
  {
    stateName: "Tennessee",
    stateCode: "TN",
    cities: [
      {
        value: "Nashville, TN",
        city: "Nashville",
        state: "Tennessee",
        stateCode: "TN",
      },
      {
        value: "Memphis, TN",
        city: "Memphis",
        state: "Tennessee",
        stateCode: "TN",
      },
      {
        value: "Knoxville, TN",
        city: "Knoxville",
        state: "Tennessee",
        stateCode: "TN",
      },
      {
        value: "Chattanooga, TN",
        city: "Chattanooga",
        state: "Tennessee",
        stateCode: "TN",
      },
    ],
  },
  {
    stateName: "Texas",
    stateCode: "TX",
    cities: [
      {
        value: "Houston, TX",
        city: "Houston",
        state: "Texas",
        stateCode: "TX",
      },
      {
        value: "San Antonio, TX",
        city: "San Antonio",
        state: "Texas",
        stateCode: "TX",
      },
      { value: "Dallas, TX", city: "Dallas", state: "Texas", stateCode: "TX" },
      { value: "Austin, TX", city: "Austin", state: "Texas", stateCode: "TX" },
      {
        value: "Fort Worth, TX",
        city: "Fort Worth",
        state: "Texas",
        stateCode: "TX",
      },
      {
        value: "El Paso, TX",
        city: "El Paso",
        state: "Texas",
        stateCode: "TX",
      },
    ],
  },
  {
    stateName: "Utah",
    stateCode: "UT",
    cities: [
      {
        value: "Salt Lake City, UT",
        city: "Salt Lake City",
        state: "Utah",
        stateCode: "UT",
      },
      {
        value: "West Valley City, UT",
        city: "West Valley City",
        state: "Utah",
        stateCode: "UT",
      },
      { value: "Provo, UT", city: "Provo", state: "Utah", stateCode: "UT" },
    ],
  },
  {
    stateName: "Vermont",
    stateCode: "VT",
    cities: [
      {
        value: "Burlington, VT",
        city: "Burlington",
        state: "Vermont",
        stateCode: "VT",
      },
      { value: "Essex, VT", city: "Essex", state: "Vermont", stateCode: "VT" },
      {
        value: "South Burlington, VT",
        city: "South Burlington",
        state: "Vermont",
        stateCode: "VT",
      },
    ],
  },
  {
    stateName: "Virginia",
    stateCode: "VA",
    cities: [
      {
        value: "Virginia Beach, VA",
        city: "Virginia Beach",
        state: "Virginia",
        stateCode: "VA",
      },
      {
        value: "Norfolk, VA",
        city: "Norfolk",
        state: "Virginia",
        stateCode: "VA",
      },
      {
        value: "Chesapeake, VA",
        city: "Chesapeake",
        state: "Virginia",
        stateCode: "VA",
      },
      {
        value: "Richmond, VA",
        city: "Richmond",
        state: "Virginia",
        stateCode: "VA",
      },
    ],
  },
  {
    stateName: "Washington",
    stateCode: "WA",
    cities: [
      {
        value: "Seattle, WA",
        city: "Seattle",
        state: "Washington",
        stateCode: "WA",
      },
      {
        value: "Spokane, WA",
        city: "Spokane",
        state: "Washington",
        stateCode: "WA",
      },
      {
        value: "Tacoma, WA",
        city: "Tacoma",
        state: "Washington",
        stateCode: "WA",
      },
      {
        value: "Vancouver, WA",
        city: "Vancouver",
        state: "Washington",
        stateCode: "WA",
      },
    ],
  },
  {
    stateName: "West Virginia",
    stateCode: "WV",
    cities: [
      {
        value: "Charleston, WV",
        city: "Charleston",
        state: "West Virginia",
        stateCode: "WV",
      },
      {
        value: "Huntington, WV",
        city: "Huntington",
        state: "West Virginia",
        stateCode: "WV",
      },
      {
        value: "Morgantown, WV",
        city: "Morgantown",
        state: "West Virginia",
        stateCode: "WV",
      },
    ],
  },
  {
    stateName: "Wisconsin",
    stateCode: "WI",
    cities: [
      {
        value: "Milwaukee, WI",
        city: "Milwaukee",
        state: "Wisconsin",
        stateCode: "WI",
      },
      {
        value: "Madison, WI",
        city: "Madison",
        state: "Wisconsin",
        stateCode: "WI",
      },
      {
        value: "Green Bay, WI",
        city: "Green Bay",
        state: "Wisconsin",
        stateCode: "WI",
      },
    ],
  },
  {
    stateName: "Wyoming",
    stateCode: "WY",
    cities: [
      {
        value: "Cheyenne, WY",
        city: "Cheyenne",
        state: "Wyoming",
        stateCode: "WY",
      },
      {
        value: "Casper, WY",
        city: "Casper",
        state: "Wyoming",
        stateCode: "WY",
      },
      {
        value: "Laramie, WY",
        city: "Laramie",
        state: "Wyoming",
        stateCode: "WY",
      },
    ],
  },
];

// Flatten all cities into a single searchable array
export const ALL_US_CITIES: CityOption[] = US_LOCATIONS.flatMap(
  (state) => state.cities,
);

// Get cities for a specific state
export function getCitiesByState(stateCode: string): CityOption[] {
  const state = US_LOCATIONS.find((s) => s.stateCode === stateCode);

  return state?.cities || [];
}

// Search cities by query
export function searchCities(query: string): CityOption[] {
  const lowerQuery = query.toLowerCase();

  return ALL_US_CITIES.filter(
    (city) =>
      city.city.toLowerCase().includes(lowerQuery) ||
      city.state.toLowerCase().includes(lowerQuery) ||
      city.stateCode.toLowerCase().includes(lowerQuery) ||
      city.value.toLowerCase().includes(lowerQuery),
  );
}
