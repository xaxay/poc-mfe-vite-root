// src/components/admin/admin-api.ts

import { getUserLogin } from "@browser-module/api/user";

// Mock
export type User = {
  name: string;
}

// Mock
export type UserDetails = User & {
  permissions: string[];
}


// Mock
export const searchUser = async (nameLike: string) : Promise<User[]> => {
  if (!nameLike) {
    return [];
  }

  const currentUserName = getUserLogin();
  if (!currentUserName.includes(nameLike)) {
    return [];
  }

  const result = [{ name: nameLike }];

  if (nameLike !== currentUserName && currentUserName.includes(nameLike)) {
    result.unshift({ name: currentUserName });
  }  

  return result;
}

// Mock
export const getUserDetails = async (name: string) : Promise<UserDetails|null> => {

  if (!name) {
    return null;
  }
  
  const currentUserName = getUserLogin();
  if (name != currentUserName) {
    return null;
  }


  const permissions = [
    'account', 
    'rumors', 
    'app4', 'app5', 'app6', 'app7', 'app8', 'app9', 
    // 'app10', 
    'app11', 'app12', 'app13', 'app14', 'app15', 'app16', 'app17', 'app18'
  ];

  if (name === 'admin') {
    permissions.push('admin');
  }

  permissions.sort(compareNames);

  return { 
    name, 
    permissions,
  } as UserDetails;
} 


const compareNames = (a: string, b: string): number => {
  // Regex to capture alphabetical part and numerical part
  const regex = /(\D+)(\d+)?/;

  // Match the parts of each string
  const aMatch = a.match(regex);
  const bMatch = b.match(regex);

  // Handle the case where match might be null
  if (!aMatch || !bMatch) {
    throw new Error('Unexpected non-matching string format');
  }

  const [, aText, aNumber] = aMatch;
  const [, bText, bNumber] = bMatch;

  // First, compare the alphabetical parts
  if (aText < bText) return -1;
  if (aText > bText) return 1;

  // If alphabetical parts are the same, compare the numerical parts (if they exist)
  if (aNumber !== undefined && bNumber !== undefined) {
    return parseInt(aNumber) - parseInt(bNumber);
  }

  // If only one has a numerical part, that one comes first
  if (aNumber !== undefined) return -1;
  if (bNumber !== undefined) return 1;

  // If both have no numerical part, they are considered equal
  return 0;
};