# some words behind calculations

## Bazi Reverse or 八字反推

1. Year Ganzhi -> estimate the start of this Year Ganzhi (UT).  
   Year Ganzhi's repeat in 60 years, start at 立春 （sun's true geocentric ecliptic longitude is 315 degree）
   This estimation's error is less than 30 days using UT or less than 10 days if using TT.

2. Month Zhi -> Get the start and end of this Month Zhi (UT).  
   Month Zhi start at when sun's longitude (geocentric, true, appearent) is at a given degree.

3. Day Ganzhi + Hour Zhi + longitude of observer -> convert to a day sequence (Local Time).

4. Does that date sequence locates in the range of the month? Add the result list if true.

## Chart Reverse Search Engineering

### For DateTime

1. Saturn's longitude -> estimate the date.  
   This estimation's error is no more than 12 degrees. (which means whichin ± 365 days)

2. Sun's longitude -> search Sun's longitude backwards and forwards, get 2 possible candidates datetime.

3. Check the saturn and moon at this two candidates datetime. Append the result if the saturn and mooon's longitude close to the given number.

### For Longitude (observer's lon)

1. Sidereal Time.  
   Use the DateTime we found in the last step.

2. Convert (lon, 0) in True Geocentric Ecliptic Coordinates (ECT in Astronomy Engine) to (ra, dec) in True Geocentric Equatorial Coordinates (EQD)

3. diff = sidereal time - ra, convert this to observer's longitude.  
   Pay attention to the units.

### For Latitude (observer's lat)

- Reverse from the [definition](https://en.wikipedia.org/wiki/Ascendant) of ASC.
