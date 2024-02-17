// import { useState } from "react";

// function getInitialValue<T>(key: string, fallback: T): T {
//   const item = window.localStorage.getItem(key);
//   if (item !== null) {
//     try {
//       return JSON.parse(item) as T;
//     } catch (error) {
//       console.error("Error parsing localStorage item:", key);
//     }
//   }
//   window.localStorage.setItem(key, JSON.stringify(fallback));
//   return fallback;
// }

// const useLocalStorage = <T>(
//   storageKey: string,
//   fallbackState: T
// ): [T, React.Dispatch<React.SetStateAction<T>>] => {
//   const [storedValue, setStoredValue] = useState<T>(() =>
//     getInitialValue(storageKey, fallbackState)
//   );

//   const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
//     try {
//       const valueToStore =
//         value instanceof Function ? value(storedValue) : value;
//       setStoredValue(valueToStore);
//       window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
//     } catch (error) {
//       console.error("Error setting localStorage key:", storageKey);
//     }
//   };

//   return [storedValue, setValue];
// };

// export default useLocalStorage;
