/**
 * @preserve Copyright (c) 2018-2022 NN Solex, www.sublunar.space
 * License MIT: http://www.opensource.org/licenses/MIT
 */

/**
 * @brief Modified by u-blusky Swep-Wasm
 *
 */

#define ONLINE 1
#define OFFLINE 2

#ifndef USECASE
#endif

#include <stdlib.h>
#include <stdio.h>
// #include <time.h>
#include <math.h>
#include "swephexp.h"
// #include "swephlib.h"
#if USECASE == OFFLINE
#include <emscripten.h>
#endif

#define PLSEL_D "0123456789mtABC"
#define PLSEL_P "0123456789mtABCDEFGHI"
#define PLSEL_H "JKLMNOPQRSTUVWX"
#define PLSEL_A "0123456789mtABCDEFGHIJKLMNOPQRSTUVWX"

#define CROSS_PRECISION (1 / 360000.0) // one milliarc sec
// #define CROSS_PRECISION_2 (1 / 2160000.0) // one milliarc sec
const double distance_sun_AU[] = {
    0,
    0,
    0.387098310,
    0.723329820,
    1.523679342,
    5.202603191,
    9.554909596, 19.218446062, 30.110386869, 39.482}; // Does swisseph previde these? copy from swecl.c el_sema
const double sync_period[] = {
    365.2422,
    29.53059,
    115.88,
    583.9,
    779.9,
    398.9,
    378.1, 369.7, 367.5, 366.7}; // Does swisseph previde these? copy from swecl.c el_sema

static char serr[AS_MAXCH];
static double find_aspects(int planet1, int planet2, double x2cross, double *jd_ut_ptr, int forward, double precision, int flag);
static double first_day(double tjd_ut, int second_half);
// static int find_zero(double y00, double y11, double y2, double dx,
//                      double *dxret, double *dxret2);
// static int find_maximum(double y00, double y11, double y2, double dx,
//                         double *dxret, double *yret);
// y1 = f(x-dx); y2 = f(x); y3 = f(x+dx)
// static int find_maximum(double y1, double y2, double y3, double *dx);
AS_BOOL sign_change(double x0, double x1)
{
  return (x0 < 0) ^ (x1 < 0);
}
// static double helio_sync(double tj_et, int planet);
// #define SEFLG_SIDEREAL 64*1024L
// type correspond to which kind of calc needed
// 1: Chart (planet )
// 2: house (cusps )
// 4: e: convert to lat
// 8: year_chinese
// 16|8: 24 jieqi in the Chinese Year (start from sun in 315 degree)
// 32: Full moon/ new moon //TODO: not implement, might delete
// 64: vedic
// 128: fixed stars
// 256: twilights, sun/moon rise and set
// 512: month info: full moon, new moon, cusps of Sun
// 1024: day info: does this date tjd_ut is a date with month >6? 1024: second half year
const char *astro(double tjd_ut, int sid, double lon, double lat, double height, char *iHouse, long flag, long type)
{
  double xx1[6], xx2[6];
  double ascmc[10];
  double cusp[12 + 1];
  long iflagret;
  int buflen = 100000;
  char *Buffer = malloc(buflen); // should I use char Buffer[buflen]?
  // char Buffer[100000];
  int length = 0;
  char comma = ' '; // either ' ' or ','
  int iflag = flag;
  char snam[40];
  int i, j, k;
  double e_jd; // E = LAT - LMT
  double geopos[] = {lon, lat, height};
  // double tjd_et = swe_deltat_ex(tjd_ut, iflag, serr) + tjd_ut;
  // prepare
  swe_set_ephe_path("eph");
  if (sid >= 0)
  {
    iflag = flag | SEFLG_SIDEREAL;
    swe_set_sid_mode(sid, 0, 0);
  }
  // get tjd_ut
  // tjd_ut = swe_julday(year, month, day, (double)hour + (double)minute / 60 + (double)second / 3600, SE_GREG_CAL);

  length += snprintf(Buffer + length, buflen - length, "{");
  length += snprintf(Buffer + length, buflen - length,
                     "\"jd_ut\":%.17g", tjd_ut);
  length += snprintf(Buffer + length, buflen - length,
                     ",\"reflag\":%ld", iflag);
  length += snprintf(Buffer + length, buflen - length,
                     ",\"retype\":%ld", type);
  // Planets
  if (type & 1)
  {
    length += snprintf(Buffer + length, buflen - length, ",\"planets\":{");
    // int end_index =
    for (i = SE_SUN; i < ((type & 64) ? SE_MEAN_APOG : SE_NPLANETS); i++)
    {
      // if ((!(iflag & 8)) && (i == SE_EARTH))
      //   continue;
      // if ((iflag & 8) && ((i == SE_SUN) || (i == SE_MOON) || (i > SE_PLUTO && i < SE_EARTH)))
      //   continue;
      // if ((type & 64) && ((i == SE_URANUS) || (i == SE_NEPTUNE) || (i == SE_PLUTO)))
      //   continue;

      // strcpy(sChar, ", ");
      // if (((!(iflag & 8)) && (i == 0)) || ((iflag & 8) && (i == SE_MERCURY)))
      //   strcpy(sChar, " ");
      iflagret = swe_calc_ut(tjd_ut, i, iflag, xx1, serr);
      swe_get_planet_name(i, snam);
      length += snprintf(Buffer + length, buflen - length,
                         "\"%d\":{\"name\":\"%s\",\"lon\": %.17g,\"lat\":%.17g,\"distance\":%.17g,\"speed\":%.17g,\"speed_lat\":%.17g,\"speed_distance\":%.17g,\"iflagret\":%ld},", i, snam, xx1[0], xx1[1], xx1[2], xx1[3], xx1[4], xx1[5], iflagret);
    } // house_ascmc
    swe_houses_ex(tjd_ut, iflag, lat, lon, (int)*iHouse, cusp, ascmc);
    // vedic only need asc
    if (!(type & 64))
    {
      length += snprintf(Buffer + length, buflen - length,
                         "\"-6\":{\"name\":\"%s\",\"lon\": %.17g},", "MC", ascmc[1]);
      length += snprintf(Buffer + length, buflen - length,
                         "\"-8\":{\"name\":\"%s\",\"lon\": %.17g},", "EP", ascmc[4]);
      length += snprintf(Buffer + length, buflen - length,
                         "\"-2\":{\"name\":\"%s\",\"lon\": %.17g},", "Vtx", ascmc[3]);
    }
    length += snprintf(Buffer + length, buflen - length,
                       "\"-4\":{\"name\":\"%s\",\"lon\": %.17g}", "Asc", ascmc[0]);
    length += snprintf(Buffer + length, buflen - length, "}");

    // house_cusps
    if (type & 2)
    {
      length += snprintf(Buffer + length, buflen - length, ",\"house\":[");
      for (i = 1; i <= 12; i++)
      {
        comma = ',';
        if (i == 12)
          comma = ' ';
        length += snprintf(Buffer + length, buflen - length,
                           "%.17g%c", cusp[i], comma);
      }
      length += snprintf(Buffer + length, buflen - length, "]");
    }
  }

  if (type & 4)
  {
    swe_time_equ(tjd_ut, &e_jd, serr);
    // E = LAT - LMT
    length += snprintf(Buffer + length, buflen - length, ",\"e\": %.17g", e_jd);
  }
  // fixed star
  if (type & 128)
  {
    double mag[1];

    length += snprintf(Buffer + length, buflen - length, ",\"fixstar\":{");
    const char *array[] = {
        ",M44",
        ",al-2Lib",
        ",alAur",
        ",alBoo",
        ",alCMa",
        ",alCMi",
        ",alCar",
        ",alCen",
        ",alCrB",
        ",alGem",
        ",alLeo",
        ",alLyr",
        ",alOri",
        ",alPeg",
        ",alPsA",
        ",alSco",
        ",alSer",
        ",alTau",
        ",alVir",
        ",beAnd",
        ",beGem",
        ",beLeo",
        ",beLib",
        ",beOri",
        ",bePer",
        ",deCap",
        ",deCnc",
        ",deCrv",
        ",etTau",
        ",etUMa",
        ",ga-1And",
        ",gaCnc",
        ",kaVir",
        ",piSco",
        ",siSco",
        ",mu-1Sco",
        ",phSgr",
        ",ga-2Sgr",
        ",beCap",
        ",epAqr",
        ",beAqr",
        ",alAqr",
        ",gaPeg",
        ",zeAnd",
        ",beAri",
        ",17Tau",
        ",epTau",
        ",ph-1Ori",
        ",deOri",
        ",muGem",
        ",deHya",
        ",alHya",
        ",up-1Hya",
        ",alCrt",
        ",gaCrv",
        ",35Ari",
        ",thCnc"};
    int array_size = sizeof(array) / sizeof(array[0]);
    for (int i = 0; i < array_size; ++i)
    {
      strcpy(snam, array[i]);
      iflagret = swe_fixstar2_ut(snam, tjd_ut, iflag, xx1, serr);
      iflagret = swe_fixstar2_mag(snam, mag, serr);
      comma = ',';
      if (i == 0)
        comma = ' ';
      length += snprintf(Buffer + length, buflen - length,
                         "%c\"%s\":{\"name\": \"%s\",\"lon\": %.17g,\"lat\":%.17g,\"mag\":%.17g,\"iflagret\":%ld}", comma, array[i], snam, xx1[0], xx1[1], mag[0], iflagret);
    }
    length += snprintf(Buffer + length, buflen - length, "}");
  }

  // Jieqi
  if (type & 8)
  {
    // planet: Sun always calc in bazi-related method
    iflagret = swe_calc_ut(tjd_ut, SE_SUN, 258, xx1, serr);
    length += snprintf(Buffer + length, buflen - length,
                       ",\"SUN_tropical\":%.17g", xx1[0]);
    double year_intpart, year_fractpart;
    double year_estimated = (tjd_ut - 70.35645600542128) / 365.24219 - 4712;
    year_fractpart = modf(year_estimated, &year_intpart); // -> over -4712, need a check on if (year_fractpart<0)
    int year = (int)year_intpart;
    if ((xx1[0] < 315) && (xx1[0] > 300) && (year_fractpart < 0.5))
    {
      year -= 1;
    }
    else if ((xx1[0] >= 315) && (year_fractpart > 0.5))
    {
      year += 1;
    }
    length += snprintf(Buffer + length, buflen - length, ",\"year_chinese\":%d", year);
    if (type & 16)
    {
      double cross_jd_ut = tjd_ut - fmod(tjd_ut, 365.24219); // to 1/1 of this year
      length += snprintf(Buffer + length, buflen - length, ",\"jieqi\":[");
      for (i = 0; i <= 23; i++)
      {
        cross_jd_ut = swe_solcross_ut((315 + 15 * i) % 360, cross_jd_ut, 258, serr);
        comma = ',';
        if (i == 23)
          comma = ' ';
        length += snprintf(Buffer + length, buflen - length,
                           "%.17g%c", cross_jd_ut, comma);
      }
      length += snprintf(Buffer + length, buflen - length, "]");
    }
  }
  // Calendar Day Change
  if (type & 256)
  {
    // Sun rise and set
    // middle, (rise set)*(astronomy twilight, nav twi, civil twi, real(upper arm), hindu(ASC))
    int array_sun[] = {4, 4096 | 1, 4096 | 2, 2048 | 1, 2048 | 2, 1024 | 1, 1024 | 2, 1, 2, 1 | SE_BIT_HINDU_RISING, 2 | SE_BIT_HINDU_RISING};
    int array_sun_size = sizeof(array_sun) / sizeof(array_sun[0]);
    length += snprintf(Buffer + length, buflen - length, ",\"day_sunrise\":[");
    for (i = 0; i < array_sun_size; i++)
    {
      comma = ',';
      if (i == 0)
        comma = ' ';
      iflagret = swe_rise_trans(tjd_ut, SE_SUN, NULL, 258, array_sun[i], geopos, 0, 15, xx1, serr);
      length += snprintf(Buffer + length, buflen - length,
                         "%c%.17g", comma, xx1[0]);
    }
    length += snprintf(Buffer + length, buflen - length, "]");
    // Moon rise and set: midheaven, rise, set
    int array_moon[] = {4, 1, 2};
    int array_moon_size = sizeof(array_moon) / sizeof(array_moon[0]);
    length += snprintf(Buffer + length, buflen - length, ",\"day_moonrise\":[");
    for (i = 0; i < array_moon_size; i++)
    {
      comma = ',';
      if (i == 0)
        comma = ' ';
      iflagret = swe_rise_trans(tjd_ut, SE_MOON, NULL, 258, array_moon[i], geopos, 0, 15, xx1, serr);
      length += snprintf(Buffer + length, buflen - length,
                         "%c%.17g", comma, xx1[0]);
    }
    length += snprintf(Buffer + length, buflen - length, "]");
    // TODO: Tithi?
  }

  // Calendar Year Change
  if (type & 512)
  {
    tjd_ut = first_day(tjd_ut, type & 1024) - 2.5; // start 2 two day beforehand, get rid of the effect of time offset(<1) and leap year (~1.3)
    double jd_found, long_found, x_sun[6], x_moon[6];
    int target;
    printf("Hello");
    // planet: Sun always need to calculate
    swe_calc_ut(tjd_ut, SE_SUN, iflag, x_sun, serr);
    swe_calc_ut(tjd_ut, SE_MOON, iflag, x_moon, serr);
    // swe_pheno_ut(tjd_ut, SE_VENUS, 258, attr_venus, serr); // attr_venus[0] phase angle
    // Jieqi: from tjd_ut, 25 jieqi
    target = (int)(x_sun[0] / 15);
    printf("%d\n", target);
    target *= 15;
    jd_found = tjd_ut;
    length += snprintf(Buffer + length, buflen - length,
                       ",\"month_jieqi\":[");

    for (i = 0; i < 25; i++)
    {
      target += 15;
      target = target % 360;
      jd_found = swe_solcross_ut(target, jd_found, iflag, serr);
      comma = ',';
      if (i == 0)
        comma = ' ';
      length += snprintf(Buffer + length, buflen - length,
                         "%c[%.17g, %d]", comma, jd_found, target);
    }
    length += snprintf(Buffer + length, buflen - length,
                       "]");

    // Moons: from tjd_ut, 25 full/new moons, half moon
    // 180: pass full moon, the first search is new moon;
    // 0: not pass full moon, the first search is full moon;
    double diff = swe_degnorm(x_moon[0] - x_sun[0]);
    if (diff > 270)
    {
      target = 0;
    }
    else if (diff > 180)
    {
      target = 270;
    }
    else if (diff > 90)
    {
      target = 180;
    }
    else
    {
      target = 90;
    }
    jd_found = tjd_ut;
    length += snprintf(Buffer + length, buflen - length,
                       ",\"month_moons\":[");
    for (i = 0; i < 51; i++) //->366/29.53*4+1=51
    {
      target += 90;
      target = target % 360;
      long_found = find_aspects(SE_SUN, SE_MOON, target, &jd_found, 1, CROSS_PRECISION, 258);
      comma = ',';
      if (i == 0)
        comma = ' ';
      length += snprintf(Buffer + length, buflen - length,
                         "%c[%.17g,%d,%.17g]", comma, jd_found, target, long_found);
    }
    length += snprintf(Buffer + length, buflen - length,
                       "]");

    /** events: [int se_planet_who, double tjd_ut_when, int events_type, double value] (month_moons has the last three, month_jieqi has the middle 2)
     * => who, when, what, where
     * events_type:
     * with sun
     * inner planets
     * 0: superior conj / max Earth distance / minimum elongation,
     * 100: evening max elongation / eastern,
     * 200: greatest brilliancy
     * 300: start retro,
     * 400: inferior conj / min Earth distance,
     * 500: start direct,
     * 600: greatest brilliancy,
     * 700: morning max el / western
     *
     * outer planets
     * 800: conj / max Earth distance / minimum elongation
     * 900: western quadrature / retro
     * 1000: opposition / min Earth distance
     * 1100: eastern quadrature / direct
     *
     * with moon
     * 2 conj 月掩某某: check
     * -1: moon min distance
     * -2: moon max distance
     * -3: north node
     * -4: south node
     *
     * other
     * 水星人: sun retro!
     * Astronomy - Ch. 10: Mercury (15 of 42) The Sun's Retrograde Motion as Seen From Mercury
     * jupiter conj venus
     *
     * ingress: (prefer helio)
     * 10000: ingress to Aries
     * 10100: ingress to Taures
     * ...
     * 10001: egress to Aries
     * 10101: egress to Taures
     *
     * Sirius Rising: -130 check
     */
    length += snprintf(Buffer + length, buflen - length,
                       ",\"events\":[");
    int direction;
    // moon conj
    for (i = 2; i < 10; i++) // i: planet who conj with moon
    {

      jd_found = tjd_ut - 1;

      for (int j = 0; j < 13; j++) // j: month
      {
        comma = ',';
        direction = 0;
        if (i == 2 && j == 0)
          comma = ' ';
        if (j == 0)
          direction = 1;
        long_found = find_aspects(i, SE_MOON, 0, &jd_found, direction, CROSS_PRECISION, 258);

        length += snprintf(Buffer + length, buflen - length,
                           "%c[%d,%.17g,%d,%.17g]", comma, 1, jd_found, i, long_found);
        if (jd_found < tjd_ut)
        {
          printf("Moon Search failed , too small, %d\n", i);
        }
        else if (jd_found > tjd_ut + 368.5)
        {
          break;
        }
        jd_found += 25;
      }
    }
    // // Moon conj. with node
    // jd_found = tjd_ut - 1;

    // for (int j = 0; j < 13; j++) // j: month
    // {
    //   comma = ',';
    //   direction = 0;
    //   if (i == 2 && j == 0)
    //     comma = ' ';
    //   if (j == 0)
    //     direction = 1;
    //   long_found = find_aspects(i, SE_MOON, 0, &jd_found, direction, CROSS_PRECISION, 258);

    //   length += snprintf(Buffer + length, buflen - length,
    //                      "%c[%d,%.17g,%d,%.17g]", comma, 1, jd_found, i, long_found);
    //   if (jd_found < tjd_ut)
    //   {
    //     printf("Moon Search failed , too small, %d\n", i);
    //   }
    //   else if (jd_found > tjd_ut + 368.5)
    //   {
    //     break;
    //   }
    //   jd_found += 25;
    // }

    // sirius
    if (lat >= 20 && lat <= 40)
    {
      double datm[] = {
          1013.25, 15, 40, 0};
      double dobs[] = {36, 1, 0, 0, 0, 0};
      double dret[50];
      strcpy(snam, "Sirius");

      double estimated_rising = (tjd_ut - 2460280) / 71.6 + 160 + tjd_ut;
      int retflag = swe_heliacal_ut(estimated_rising, geopos, datm, dobs, snam, SE_HELIACAL_RISING, SE_HELFLAG_NO_DETAILS, dret, serr);
      printf("Hello, sirius! %f, star name: %s, and estimated rising on %f, if there is serr: %s\n", dret[0], snam, estimated_rising, serr);

      length += snprintf(Buffer + length, buflen - length,
                         ",[130,%.17g, -130, 0]", dret[0]);
    }
    // conj
    // relative position
    double rel_position;
    double planets_phases[] = {
        0,
        90,
        180,
        270};
    double acos_semi_major;
    int planet1, planet2;
    for (i = 2; i < 10; i++)
    {
      jd_found = tjd_ut - 1;
      if (i < 4)
      {
        acos_semi_major = acos(distance_sun_AU[i]);

        planet1 = SE_EARTH;
        planet2 = i;
      }
      else
      {
        acos_semi_major = acos(1 / distance_sun_AU[i]);
        planet2 = SE_EARTH;
        planet1 = i;
      }
      swe_calc_ut(jd_found, planet1, 258 | SEFLG_HELCTR, xx1, serr);
      swe_calc_ut(jd_found, planet2, 258 | SEFLG_HELCTR, xx2, serr);
      rel_position = swe_degnorm(xx2[0] - xx1[0]);
      acos_semi_major = acos_semi_major * RADTODEG;

      planets_phases[1] = acos_semi_major;
      planets_phases[3] = 360 - acos_semi_major;
      target = 0;
      for (int count = 1; count < sizeof(planets_phases) / sizeof(planets_phases[0]); ++count)
      {
        if (rel_position < planets_phases[count])
        {
          target = count;
          // printf("\n\nnow target is %d", target);
          break;
        }
      }
      for (int j = 0; j < 18; j++, target++) // mercury: 88 365/88*4 = 16.59
      {
        target = target % 4;
        // printf("\n\nplanet: %d, round: %d,\nplanets_phases[1]:%f,planets_phases[3]%f\ntarget:%d,start_jd: %f", i, j, planets_phases[1], planets_phases[3], target, jd_found);

        long_found = find_aspects(planet1, planet2, planets_phases[target], &jd_found, 0, CROSS_PRECISION, 258 | SEFLG_HELCTR);
        if (jd_found <= tjd_ut - 1)
        {
          printf("something wrong, planet: %d, phase: %d, jd_found:%f,loop j:%d\n", i, target, jd_found, j);
          break;
        }
        else if (jd_found > tjd_ut + 368.5)
        {
          // printf("\n\nToo larget, break: planet: %d, round: %d,\nplanets_phases[1]:%f,planets_phases[3]%f\ntarget:%d,now_jd: %f", i, j, planets_phases[1], planets_phases[3], target, jd_found);
          break;
        }
        else
        {
          // printf("\n\nBefore adjustment: planet: %d, round: %d,\nplanets_phases[1]:%f,planets_phases[3]%f\ntarget:%d,now_jd: %f", i, j, planets_phases[1], planets_phases[3], target, jd_found);
          if ((i > 3) && (target == 0 || target == 2)) // outer planet, conj / oppo
            long_found = find_aspects(i, SE_SUN, (planets_phases[target] + 180), &jd_found, 0, CROSS_PRECISION, 258);
          else if ((i <= 3) && (target == 0 || target == 2)) // inner planet, int conj/ sup conj
            long_found = find_aspects(i, SE_SUN, 0, &jd_found, 0, CROSS_PRECISION, 258);
          else if ((i > 3) && (target == 1))
            long_found = find_aspects(i, SE_SUN, 270, &jd_found, 0, CROSS_PRECISION, 258);
          else if ((i > 3) && (target == 3))
            long_found = find_aspects(i, SE_SUN, 90, &jd_found, 0, CROSS_PRECISION, 258);
          // else if ((i <=3) && (target == 1))
          //   long_found = find_aspects(i, SE_SUN, 90, &jd_found, 0, CROSS_PRECISION, 258);
          // who, when, what, where
          // printf("\n\nAfter adjustment: planet: %d, round: %d,\nplanets_phases[1]:%f,planets_phases[3]%f\ntarget:%d,now_jd: %f", i, j, planets_phases[1], planets_phases[3], target, jd_found);
          length += snprintf(Buffer + length, buflen - length,
                             ",[%d,%.17g, %d,%.17g]", i, jd_found, target * 100, long_found);
        }
        jd_found += sync_period[i] * (swe_degnorm(planets_phases[(target + 1) % 4] - planets_phases[target])) / 360;
      }
    }
    // int nstep = 369, istep;
    // double t, te, tend, t2, t3, tstep = 1.0;
    // double delt;
    // int ipl;
    // double x[6], xs[6], x0[6], x1[6], x2[6];
    // double xp[6], xp0[6], xp1[6] = {0}, xp2[6], xs0[6], xs1[6] = {0}, xs2[6];
    // double xel0[6], xel1[6] = {0}, xel2[6], xang0[6], xang1[6] = {0}, xang2[6], xma0[6], xma1[6] = {0}, xma2[6];
    // double xh0[6], xh1[6] = {0}, xh2[6];
    // double attr[20];
    // int iflgret, nzer;
    // AS_BOOL is_opposition;
    // int iflag = SEFLG_RADIANS | 258;
    // double xel, xma, sunrad;
    // double dt, dt1, dt2, elong, rphel;
    // double magme[3], elong_vis;
    // for (t = tjd_ut, istep = 0; istep <= nstep; t += tstep, istep++)
    // {
    //   delt = swe_deltat_ex(t, 2, serr);
    //   te = t + delt;
    //   ipl = SE_VENUS;

    //   /* we have always
    //    * - three positions and speeds for venus
    //    * - three positions and speeds for sun
    //    * - three elongations of venus (with elongation speed)
    //    * - three magnitudes
    //    */
    //   memcpy(xp0, xp1, 6 * sizeof(double)); /* planet */
    //   memcpy(xp1, xp2, 6 * sizeof(double));
    //   memcpy(xh0, xh1, 6 * sizeof(double)); /* heliocentric */
    //   memcpy(xh1, xh2, 6 * sizeof(double)); /* heliocentric */
    //   memcpy(xs0, xs1, 6 * sizeof(double)); /* sun */
    //   memcpy(xs1, xs2, 6 * sizeof(double));
    //   memcpy(xel0, xel1, 6 * sizeof(double)); /* elongation in longitude */
    //   memcpy(xel1, xel2, 6 * sizeof(double));
    //   memcpy(xang0, xang1, 6 * sizeof(double)); /* ang. dist. from sun */
    //   memcpy(xang1, xang2, 6 * sizeof(double));
    //   memcpy(xma0, xma1, 6 * sizeof(double)); /* magnitude */
    //   memcpy(xma1, xma2, 6 * sizeof(double));
    //   iflgret = swe_calc(te, (int)ipl, iflag, xp2, serr);
    //   if (iflgret < 0)
    //   {
    //     printf("return code %d, mesg: %s\n", iflgret, serr);
    //     break;
    //   }
    //   iflgret = swe_calc(te, SE_SUN, iflag, xs2, serr);
    //   if (iflgret < 0)
    //   {
    //     printf("return code %d, mesg: %s\n", iflgret, serr);
    //     break;
    //   }
    //   iflgret = swe_calc(te, (int)ipl, iflag /*|SEFLG_HELCTR*/, xh2, serr);
    //   if (iflgret < 0) // TODO: |SEFLG_HELCTR
    //   {
    //     printf("return code %d, mesg: %s\n", iflgret, serr);
    //     break;
    //   }
    //   /* true heliocentric distance */
    //   /* elongation of planet measured on ecliptic */
    //   for (i = 0; i <= 5; i++)
    //     xel2[i] = xp2[i] - xs2[i];
    //   xel2[0] = swe_radnorm(xel2[0]);
    //   if (xel2[0] > M_PI)
    //     xel2[0] -= 2 * M_PI;
    //   /* other values */
    //   // cartesian coordinates of planet and sun
    //   swi_polcart(xp2, x1);
    //   swi_polcart(xs2, x2);
    //   for (i = 0; i <= 2; i++)
    //     x[i] = -x2[i] + x1[i];
    //   /* 'apparent' hel. distance of planet*/
    //   rphel = sqrt(square_sum(x));
    //   // elongation of planet = angular distance of planet from sun
    //   elong = acos((xs2[2] * xs2[2] + xp2[2] * xp2[2] - rphel * rphel) / 2.0 / xs2[2] / xp2[2]);
    //   // this is equivalent to:
    //   // elong = acos(swi_dot_prod_unit(x1, x2));
    //   xang2[0] = elong;
    //   if (rphel != 0 && ipl <= 4) // inner planet
    //   {
    //     if ((i = swe_pheno(te, ipl, iflag, attr, serr)) < 0)
    //     {
    //       printf("return code %d, mesg: %s\n", i, serr);
    //       xma2[0] = 1;
    //     }
    //     else
    //     {
    //       xma2[0] = attr[4];
    //     }
    //   }
    //   else
    //   {
    //     xma2[0] = 1;
    //   }
    //   if (istep >= 2)
    //   { /* now all of the arrays xp* and xs* are filled */
    //     /* conjunctions with sun, in longitude */
    //     // if (do_flag & DO_LPHASE)
    //     //   goto l_phase;
    //     // if (!(do_flag & DO_CONJ))
    //     //   goto l_noconj;
    //     if (sign_change(xel1[0], xel2[0]))
    //     {
    //       double el0 = xel0[0], el1 = xel1[0], el2 = xel2[0];
    //       if (el0 > M_PI / 2)
    //         el0 -= M_PI;
    //       if (el0 < -M_PI / 2)
    //         el0 += M_PI;
    //       if (el1 > M_PI / 2)
    //         el1 -= M_PI;
    //       if (el1 < -M_PI / 2)
    //         el1 += M_PI;
    //       if (el2 > M_PI / 2)
    //         el2 -= M_PI;
    //       if (el2 < -M_PI / 2)
    //         el2 += M_PI;
    //       nzer = find_zero(el0, el1, el2, tstep, &dt, &dt2);
    //       if (nzer > 0)
    //       {
    //         t2 = te + dt;
    //         iflgret = swe_calc(t2, (int)ipl, iflag, x, serr);
    //         iflgret = swe_calc(t2, SE_SUN, iflag, xs, serr);
    //         is_opposition = 0;
    //         delt = swe_deltat_ex(t, 2, serr);
    //         if (ipl != SE_VENUS && ipl != SE_MERCURY)
    //         {
    //           if (fabs(xel1[0]) > M_PI / 2)
    //           {
    //             is_opposition = 1;
    //             // print_item("opposition", t2, x[0] * RADTODEG, x[1] * RADTODEG, HUGE);
    //             length += snprintf(Buffer + length, buflen - length,
    //                                ",[%d,%.17g, %d,%.17g]", ipl, t2, 200, x[0] * RADTODEG);
    //           }
    //           else
    //             // print_item("conjunction", t2, x[0] * RADTODEG, x[1] * RADTODEG, HUGE);
    //             length += snprintf(Buffer + length, buflen - length,
    //                                ",[%d,%.17g, %d,%.17g]", ipl, t2, 0, x[0] * RADTODEG);
    //         }
    //         else
    //         {
    //           if (x[3] > 0)
    //             // print_item("superior conj", t2, x[0] * RADTODEG, x[1] * RADTODEG, HUGE);
    //             length += snprintf(Buffer + length, buflen - length,
    //                                ",[%d,%.17g, %d,%.17g]", ipl, t2, 0, x[0] * RADTODEG);
    //           else
    //             // print_item("inferior conj", t2, x[0] * RADTODEG, x[1] * RADTODEG, HUGE);
    //             length += snprintf(Buffer + length, buflen - length,
    //                                ",[%d,%.17g, %d,%.17g]", ipl, t2, 200, x[0] * RADTODEG);
    //         }
    //         /* planet is behind solar disk or is transiting it */
    //         for (j = 0, dt1 = tstep; j <= 5; j++, dt1 /= 3)
    //         {
    //           for (k = 0; k <= 2; k++)
    //           {
    //             switch (k)
    //             {
    //             case 0:
    //               t3 = t2 - dt1;
    //               break;
    //             case 1:
    //               t3 = t2;
    //               break;
    //             case 2:
    //               t3 = t2 + dt1;
    //               break;
    //             }
    //             iflgret = swe_calc(t3, (int)ipl, iflag, xp, serr);
    //             iflgret = swe_calc(t3, SE_SUN, iflag, xs, serr);
    //             swi_polcart(xp, x1);
    //             swi_polcart(xs, x2);
    //             for (i = 0; i <= 2; i++)
    //               x[i] = -x2[i] + x1[i];
    //             rphel = sqrt(square_sum(x));
    //             x0[k] = acos((xs[2] * xs[2] + xp[2] * xp[2] - rphel * rphel) /
    //                          2.0 / xs[2] / xp[2]);
    //           }
    //           find_maximum(x0[0], x0[1], x0[2], dt1, &dt, &xel);
    //           t2 = t2 + dt1 + dt;
    //         }
    //         iflgret = swe_calc(t2, (int)ipl, iflag, x, serr);
    //         iflgret = swe_calc(t2, SE_SUN, iflag, xs, serr);
    //         /* minimum elongation of planet */
    //         //   if (is_opposition)
    //         //   {
    //         //     /*print_item("  maximum elong", t2, x[0] * RADTODEG, xel*RADTODEG, HUGE)*/;
    //         //   }
    //         //   else
    //         //   {
    //         //     print_item("  minimum elong", t2, x[0] * RADTODEG, xel * RADTODEG, HUGE);
    //         //   }
    //         //   switch (ipl)
    //         //   {
    //         //   case SE_VENUS:
    //         //     sunrad = SUN_RADIUS / xs[2] + VENUS_RADIUS / x[2];
    //         //     break;
    //         //   case SE_MERCURY:
    //         //     sunrad = SUN_RADIUS / xs[2] + MERCURY_RADIUS / x[2];
    //         //     break;
    //         //   case SE_MARS:
    //         //   default:
    //         //     sunrad = SUN_RADIUS / xs[2] + MARS_RADIUS / x[2];
    //         //     break;
    //         //   }
    //         //   if (sunrad > fabs(xel))
    //         //   {
    //         //     if (x[3] > 0 || ipl > SE_VENUS)
    //         //     {
    //         //       strcpy(sout, "  behind sun begin");
    //         //     }
    //         //     else
    //         //     {
    //         //       strcpy(sout, "  transit begin");
    //         //       print_item("  transit middle", t2, x[0] * RADTODEG, xel * RADTODEG, HUGE);
    //         //     }
    //         //     dt = sqrt(sunrad * sunrad - xel * xel);
    //         //     /*dt = acos(cos(sunrad) / cos(xel)); is not better */
    //         //     dt /= sqrt((x[3] - xs[3]) * (x[3] - xs[3]) + (x[4] - xs[4]) * (x[4] - xs[4]));
    //         //     iflgret = swe_calc(t2 - dt, (int)ipl, iflag, x, serr);
    //         //     print_item(sout, t2 - dt, x[0] * RADTODEG, HUGE, HUGE);
    //         //     if (x[3] > 0 || ipl > SE_VENUS)
    //         //       strcpy(sout, "  behind sun end");
    //         //     else
    //         //       strcpy(sout, "  transit end");
    //         //     iflgret = swe_calc(t2 + dt, (int)ipl, iflag, x, serr);
    //         //     print_item(sout, t2 + dt, x[0] * RADTODEG, HUGE, HUGE);
    //         //   }
    //         //
    //       }
    //     }
    //   l_noconj:;
    //     if (0) //!(do_flag & DO_BRILL)
    //       goto l_nobrill;
    //     /* greatest brillancy */
    //     if (ipl <= SE_MARS && xma0[0] > xma1[0] && xma2[0] > xma1[0] && xang1[0] > 10 * DEGTORAD)
    //     {
    //       find_maximum(xma0[0], xma1[0], xma2[0], tstep, &dt, &xma);
    //       t2 = te + dt;
    //       for (j = 0, dt1 = tstep; j <= 5; j++, dt1 /= 3)
    //       {
    //         for (k = 0; k <= 2; k++)
    //         {
    //           switch (k)
    //           {
    //           case 0:
    //             t3 = t2 - dt1;
    //             break;
    //           case 1:
    //             t3 = t2;
    //             break;
    //           case 2:
    //             t3 = t2 + dt1;
    //             break;
    //           }
    //           // iflgret = swe_calc(t3, (int) ipl, iflag, xp, serr);
    //           // iflgret = swe_calc(t3, SE_SUN, iflag, xs, serr);
    //           // swi_polcart(xp, x1);
    //           // swi_polcart(xs, x2);
    //           // for (i = 0; i <= 2; i++)
    //           //   x[i] = -x2[i] + x1[i];
    //           // rphel = sqrt(square_sum(x));
    //           if ((i = swe_pheno(t3, ipl, iflag, attr, serr)) < 0)
    //           {
    //             printf("return code %d, mesg: %s\n", i, serr);
    //             x0[k] = 1;
    //             exit(0);
    //           }
    //           else
    //           {
    //             x0[k] = attr[4];
    //           }
    //         }
    //         find_maximum(x0[0], x0[1], x0[2], dt1, &dt, &xma);
    //         t2 = t2 + dt1 + dt;
    //       }
    //       iflgret = swe_calc(t2, (int)ipl, iflag, x, serr);
    //       length += snprintf(Buffer + length, buflen - length,
    //                          ",[%d,%.17g, %d,%.17g]", ipl, t2, 101, xma);

    //       // print_item("greatest brilliancy", t2, x[0] * RADTODEG, HUGE, xma);
    //     }
    //   l_nobrill:;
    //     // if (!(do_flag & DO_RISE) && !(do_flag & DO_ELONG))
    //     //   goto l_noelong;
    //     /* rise and set of morning and evening star
    //      * This calculation is very simplistic. Exact dates are not possible
    //      * because they depend on the geographic position of the observer.
    //      */
    //     // *sout = '\0';
    //     magme[0] = magme[1] = magme[2] = 0;
    //     switch (ipl)
    //     {
    //     case SE_MERCURY:
    //       magme[0] = xma0[0];
    //       magme[1] = xma1[0];
    //       magme[2] = xma2[0];
    //     case SE_VENUS:
    //     case SE_JUPITER:
    //       elong_vis = 10;
    //       break;
    //     case SE_MOON:
    //     case SE_MARS:
    //     case SE_SATURN:
    //       elong_vis = 15;
    //       break;
    //     default:
    //       elong_vis = 15;
    //       break;
    //     }
    //     // if (xang1[0] * RADTODEG > elong_vis + magme[1] && xang2[0] * RADTODEG < elong_vis + magme[2])
    //     // {
    //     //   if (xel1[0] > 0)
    //     //     strcpy(sout, "evening set");
    //     //   else
    //     //     strcpy(sout, "morning set");
    //     // }
    //     // if (xang1[0] * RADTODEG < elong_vis + magme[1] && xang2[0] * RADTODEG > elong_vis + magme[2])
    //     // {
    //     //   if (xel1[0] > 0)
    //     //     strcpy(sout, "evening rise");
    //     //   else
    //     //     strcpy(sout, "morning rise");
    //     // }
    //     // if (*sout != '\0')
    //     // {
    //     x[0] = xang0[0] - elong_vis * DEGTORAD;
    //     x[1] = xang1[0] - elong_vis * DEGTORAD;
    //     x[2] = xang2[0] - elong_vis * DEGTORAD;
    //     // with Mercury, brightness is taken into account
    //     // (this method from Expl. Suppl. of AA 1984, however
    //     // magnitudes used are from Swisseph >= 2.07)
    //     if (ipl == SE_MERCURY)
    //     {
    //       x[0] -= magme[0] * DEGTORAD;
    //       x[1] -= magme[1] * DEGTORAD;
    //       x[2] -= magme[2] * DEGTORAD;
    //     }
    //     // }
    //     // if (!(do_flag & DO_RISE))
    //     //   goto l_norise;
    //     // if (*sout != '\0')
    //     // {
    //     //   double cos_elong, deg_elong, derr;
    //     //   if ((nzer = find_zero(x[0], x[1], x[2], tstep, &dt, &dt2)) > 0)
    //     //   {
    //     //     t2 = te + dt;
    //     //     /* some test code to verify actual elongation at found date */
    //     //     iflgret = swe_calc(t2, (int)ipl, iflag, x2, serr);
    //     //     iflgret = swe_calc(t2, SE_SUN, iflag, x1, serr);
    //     //     cos_elong = cos(x2[0] - x1[0]) * cos(x2[1] - x1[1]);
    //     //     deg_elong = acos(cos_elong) * RADTODEG;
    //     //     derr = fabs(deg_elong) - elong_vis;
    //     //     if (ipl == SE_MERCURY)
    //     //     {
    //     //       // double xx1[6], xx2[6], rh;
    //     //       double ma;
    //     //       // swi_polcart(x2, xx2);
    //     //       // swi_polcart(x1, xx1);
    //     //       // for (i = 0; i <= 2; i++)
    //     //       //   x[i] = -xx1[i] + xx2[i];
    //     //       /* 'apparent' hel. distance of planet*/
    //     //       // rh = sqrt(square_sum(x));
    //     //       if ((i = swe_pheno(t2, ipl, iflag, attr, serr)) < 0)
    //     //       {
    //     //         fprintf(stderr, "return code %d, mesg: %s\n", i, serr);
    //     //         exit(0);
    //     //       }
    //     //       ma = attr[4];
    //     //       derr -= ma;
    //     //     }
    //     //     if (fabs(derr) > 0.01)
    //     //       fprintf(stderr, "warning elongation planet %d test deviation %.3f arcsec at t=%f\n", ipl, derr * 3600, t2);
    //     //     /* end test code */
    //     //     print_item(sout, t2, x2[0] * RADTODEG, HUGE, HUGE);
    //     //   }
    //     // }
    //     // l_norise:;
    //     // if (!(do_flag & DO_ELONG) || ipl >= SE_MARS)
    //     //   goto l_noelong;
    //     /* maximum elongation */
    //     if (fabs(xang0[0]) < fabs(xang1[0]) && fabs(xang2[0]) < fabs(xang1[0]))
    //     {
    //       find_maximum(xang0[0], xang1[0], xang2[0], tstep, &dt, &xel);
    //       t2 = te + dt;
    //       for (j = 0, dt1 = tstep; j <= 5; j++, dt1 /= 3)
    //       {
    //         for (k = 0; k <= 2; k++)
    //         {
    //           switch (k)
    //           {
    //           case 0:
    //             t3 = t2 - dt1;
    //             break;
    //           case 1:
    //             t3 = t2;
    //             break;
    //           case 2:
    //             t3 = t2 + dt1;
    //             break;
    //           }
    //           iflgret = swe_calc(t3, (int)ipl, iflag, xp, serr);
    //           iflgret = swe_calc(t3, SE_SUN, iflag, xs, serr);
    //           swi_polcart(xp, x1);
    //           swi_polcart(xs, x2);
    //           for (i = 0; i <= 2; i++)
    //             x[i] = -x2[i] + x1[i];
    //           rphel = sqrt(square_sum(x));
    //           x0[k] = acos((xs[2] * xs[2] + xp[2] * xp[2] - rphel * rphel) /
    //                        2.0 / xs[2] / xp[2]);
    //         }
    //         find_maximum(x0[0], x0[1], x0[2], dt1, &dt, &xel);
    //         t2 = t2 + dt1 + dt;
    //       }
    //       iflgret = swe_calc(t2, (int)ipl, iflag, x, serr);
    //       // if (ipl > SE_VENUS)
    //       //   strcpy(sout, "maximum elong.");
    //       // else if (xel1[0] > 0)
    //       //   strcpy(sout, "evening max el");
    //       // else
    //       //   strcpy(sout, "morning max el");
    //       // print_item(sout, t2, x[0] * RADTODEG, xel * RADTODEG, HUGE);
    //       length += snprintf(Buffer + length, buflen - length,
    //                          ",[%d,%.17g, %d,%.17g]", ipl, t2, xel1[0] > 0 ? 100 : 300, xel * RADTODEG);
    //     }
    //     // l_noelong:;
    //     //   if (!(do_flag & DO_RETRO))
    //     //     goto l_noretro;
    //     /* retrograde or direct, maximum position */
    //     if ((xp1[3] < 0 && xp2[3] >= 0) || (xp1[3] > 0 && xp2[3] <= 0))
    //     {
    //       t2 = te - xp2[3] / ((xp2[3] - xp1[3]) / tstep);
    //       for (j = 0, dt1 = tstep; j <= 5; j++, dt1 /= 3)
    //       {
    //         for (k = 0; k <= 1; k++)
    //         {
    //           switch (k)
    //           {
    //           case 0:
    //             t3 = t2;
    //             break;
    //           case 1:
    //             t3 = t2 + dt1;
    //             break;
    //           }
    //           iflgret = swe_calc(t3, (int)ipl, iflag, xp, serr);
    //           x0[k] = xp[3];
    //         }
    //         t2 = t3 - x0[1] / ((x0[1] - x0[0]) / dt1);
    //         // fprintf(stderr, "tt=%.8f\n", t2);
    //       }
    //       iflgret = swe_calc(t2, (int)ipl, iflag, x, serr);
    //       // if (xp2[3] < 0)
    //       //   strcpy(sout, "retrograde");
    //       // else
    //       //   strcpy(sout, "direct");
    //       // print_item(sout, t2, x[0] * RADTODEG, HUGE, HUGE);
    //       length += snprintf(Buffer + length, buflen - length,
    //                          ",[%d,%.17g, %d,%.17g]", ipl, t2, xp2[3] < 0 ? 102 : 103, x[0] * RADTODEG);
    //     }
    //     // l_noretro:;
    //     //   if (!(do_flag & DO_APS))
    //     //     goto l_noaps;
    //     /* apsides */
    //     if ((xh2[2] < xh1[2] && xh0[2] < xh1[2]) || (xh2[2] > xh1[2] && xh0[2] > xh1[2]))
    //     {
    //       x0[0] = xh0[2];
    //       x0[1] = xh1[2];
    //       x0[2] = xh2[2];
    //       find_maximum(x0[0], x0[1], x0[2], tstep, &dt, &xel);
    //       t2 = te + dt;
    //       for (j = 0, dt1 = tstep; j <= 4; j++, dt1 /= 3)
    //       {
    //         for (k = 0; k <= 2; k++)
    //         {
    //           switch (k)
    //           {
    //           case 0:
    //             t3 = t2 - dt1;
    //             break;
    //           case 1:
    //             t3 = t2;
    //             break;
    //           case 2:
    //             t3 = t2 + dt1;
    //             break;
    //           }
    //           iflgret = swe_calc(t3, (int)ipl, iflag /*|SEFLG_HELCTR*/, xp, serr);
    //           x0[k] = xp[2];
    //         }
    //         find_maximum(x0[0], x0[1], x0[2], dt1, &dt, &xel);
    //         t2 = t2 + dt1 + dt;
    //       }
    //       iflgret = swe_calc(t2, (int)ipl, iflag /*|SEFLG_HELCTR*/, x, serr);
    //       // if (xh2[2] < xh1[2])
    //       // {
    //       //   if (iflag & SEFLG_HELCTR)
    //       //     strcpy(sout, "aphelion");
    //       //   else
    //       //     strcpy(sout, "max. Earth dist.");
    //       // }
    //       // else
    //       // {
    //       //   if (iflag & SEFLG_HELCTR)
    //       //     strcpy(sout, "perihelion");
    //       //   else
    //       //     strcpy(sout, "min. Earth dist.");
    //       // }
    //       // print_item(sout, t2, x[0] * , HUGE, x[2]);
    //       length += snprintf(Buffer + length, buflen - length,
    //                          ",[%d,%.17g, %d,%.17g]", ipl, t2, xh2[2] < xh1[2] ? 107 : 108, x[2]);
    //     }
    //     // l_noaps:;
    //     //   if (!(do_flag & DO_NODE))
    //     //     goto l_nonode;
    //     //   if (sign_change(xh1[1], xh2[1]))
    //     //   { // latitude sign change?
    //     //     if ((nzer = find_zero(xh0[1], xh1[1], xh2[1], tstep, &dt, &dt2)) > 0)
    //     //     {
    //     //       t2 = te + dt;
    //     //       iflgret = swe_calc(t2, (int)ipl, iflag /*|SEFLG_HELCTR*/, x, serr);
    //     //       if (xh2[1] >= 0)
    //     //         strcpy(sout, "asc. node");
    //     //       else
    //     //         strcpy(sout, "desc. node");
    //     //       print_item(sout, t2, x[0] * RADTODEG, HUGE, HUGE);
    //     //     }
    //     //   }
    //     // l_nonode:;
    //     //   /* sign ingresses */
    //     //   if (do_flag & DO_INGR)
    //     //   {
    //     //     double x0, x1, x2, xcross, d12, d01, x[6], tx, dx;
    //     //     int j;
    //     //     x2 = xp2[0] * RADTODEG; // at t
    //     //     x1 = xp1[0] * RADTODEG; // at t - tstep
    //     //     x0 = xp0[0] * RADTODEG; // at t - 2 * tstep
    //     //     // x2 is in [0..360[
    //     //     // normalize x1 and x0 so that there are no jumps
    //     //     d12 = swe_difdeg2n(x2, x1);
    //     //     x1 = x2 - d12;
    //     //     d01 = swe_difdeg2n(x1, x0);
    //     //     x0 = x1 - d01;
    //     //     for (i = 0; i <= 12; i++)
    //     //     { // we consider 13 sign cusps, 0..360
    //     //       // because x2 can be 359, x1 = 361, x0 = 363
    //     //       xcross = i * 30.0;
    //     //       // is xcross between x1 and x2?
    //     //       // or x2 critically near xcross
    //     //       if (sign_change((x1 - xcross), (x2 - xcross)) || (fabs(x0 - x1) + fabs(x1 - x2) > fabs(x2 - xcross)))
    //     //       {
    //     //         nzer = find_zero(x0 - xcross, x1 - xcross, x2 - xcross, tstep, &dt1, &dt2);
    //     //         if (nzer == 1)
    //     //         {
    //     //           tx = te + dt1;
    //     //           for (j = 0; j < 3; j++)
    //     //           {
    //     //             iflgret = swe_calc(tx, (int)ipl, iflag, x, serr);
    //     //             x[0] *= RADTODEG;
    //     //             x[3] *= RADTODEG;
    //     //             dx = swe_degnorm(x[0] - xcross);
    //     //             if (dx > 180)
    //     //               dx -= 360;
    //     //             tx -= dx / x[3];
    //     //           }
    //     //           izod = i % 12;
    //     //           if (x2 <= xcross)
    //     //           {
    //     //             strcpy(sout, "ingress retro. ");
    //     //             izod = (izod + 11) % 12;
    //     //           }
    //     //           else
    //     //           {
    //     //             strcpy(sout, "ingress ");
    //     //           }
    //     //           print_item(sout, tx, izod, HUGE, HUGE);
    //     //         }
    //     //         if (nzer == 2)
    //     //         { // double crossed in 1 timestep
    //     //           fprintf(stderr, "warning double crossing in ingress, reduced accuracy: planet=%d, tjd1=%.8f, tjd2=%.8f\n", ipl, te + dt1, te + dt2);
    //     //           if (x2 > xcross)
    //     //           { // retro, then direct
    //     //             strcpy(sout, "ingress retro. ");
    //     //             izod = (i + 11) % 12;
    //     //             print_item(sout, te + dt1, izod, HUGE, HUGE);
    //     //             strcpy(sout, "ingress ");
    //     //             izod = i % 12;
    //     //             print_item(sout, te + dt2, izod, HUGE, HUGE);
    //     //           }
    //     //           else
    //     //           { // direct, then retro
    //     //             strcpy(sout, "ingress ");
    //     //             izod = i % 12;
    //     //             print_item(sout, te + dt1, izod, HUGE, HUGE);
    //     //             strcpy(sout, "ingress retro. ");
    //     //             izod = (i + 11) % 12;
    //     //             print_item(sout, te + dt2, izod, HUGE, HUGE);
    //     //           }
    //     //         }
    //     //       }
    //     //     }
    //     //   }
    //     //   /* 45° ingresses */
    //     //   if (do_flag & DO_INGR45)
    //     //   {
    //     //     double x0, x1, x2, xcross, d12, d01, tx, x[6];
    //     //     int j;
    //     //     x2 = xp2[0] * RADTODEG; // at t
    //     //     x1 = xp1[0] * RADTODEG; // at t - tstep
    //     //     x0 = xp0[0] * RADTODEG; // at t - 2 * tstep
    //     //     // x2 is in [0..360[
    //     //     // normalize x1 and x0 so that there are no jumps
    //     //     d12 = swe_difdeg2n(x2, x1);
    //     //     x1 = x2 - d12;
    //     //     d01 = swe_difdeg2n(x1, x0);
    //     //     x0 = x1 - d01;
    //     //     for (i = 0; i < 4; i++)
    //     //     {
    //     //       xcross = 45 + i * 90.0;
    //     //       // is xcross between x1 and x2?
    //     //       // or x2 critically near xcross
    //     //       if (sign_change((x1 - xcross), (x2 - xcross)) || (fabs(x0 - x1) + fabs(x1 - x2) > fabs(x2 - xcross)))
    //     //       {
    //     //         nzer = find_zero(x0 - xcross, x1 - xcross, x2 - xcross, tstep, &dt1, &dt2);
    //     //         izod = xcross / 30;
    //     //         if (nzer == 1)
    //     //         {
    //     //           tx = te + dt1;
    //     //           for (j = 0; j < 3; j++)
    //     //           {
    //     //             iflgret = swe_calc(tx, (int)ipl, iflag, x, serr);
    //     //             x[0] *= RADTODEG;
    //     //             x[3] *= RADTODEG;
    //     //             dx = swe_degnorm(x[0] - xcross);
    //     //             if (dx > 180)
    //     //               dx -= 360;
    //     //             tx -= dx / x[3];
    //     //           }
    //     //           if (x2 <= xcross)
    //     //           {
    //     //             strcpy(sout, "ingr45 retro. ");
    //     //           }
    //     //           else
    //     //           {
    //     //             strcpy(sout, "ingr45 ");
    //     //           }
    //     //           print_item(sout, tx, izod, HUGE, HUGE);
    //     //         }
    //     //         if (nzer == 2)
    //     //         { // double crossed in 1 timestep
    //     //           if (x2 > xcross)
    //     //           { // retro, then direct
    //     //             strcpy(sout, "ingr45 retro. ");
    //     //             print_item(sout, te + dt1, izod, HUGE, HUGE);
    //     //             strcpy(sout, "ingr45 ");
    //     //             print_item(sout, te + dt2, izod, HUGE, HUGE);
    //     //           }
    //     //           else
    //     //           { // direct, then retro
    //     //             strcpy(sout, "ingr45 ");
    //     //             print_item(sout, te + dt1, izod, HUGE, HUGE);
    //     //             strcpy(sout, "ingr45 retro. ");
    //     //             print_item(sout, te + dt2, izod, HUGE, HUGE);
    //     //           }
    //     //         }
    //     //       }
    //     //     }
    //     //   }
    //     //   /* lunar phases */
    //     // l_phase:
    //     //   if (do_flag & DO_LPHASE)
    //     //   {
    //     //     int new_phase;
    //     //     int old_phase;
    //     //     int nphases = swe_d2l(360 / phase_mod);
    //     //     int j;
    //     //     double d, dv, xm[6], xs[6];
    //     //     x2[0] = swe_degnorm((xp2[0] - xs2[0]) * RADTODEG);
    //     //     x1[0] = swe_degnorm((xp1[0] - xs1[0]) * RADTODEG);
    //     //     x0[0] = swe_degnorm((xp0[0] - xs0[0]) * RADTODEG);
    //     //     if (x0[0] > x1[0])
    //     //     {
    //     //       x1[0] += 360;
    //     //       x2[0] += 360;
    //     //     }
    //     //     if (x1[0] > x2[0])
    //     //     {
    //     //       x2[0] += 360;
    //     //     }
    //     //     /* is there a phase change within last tstep ? */
    //     //     new_phase = floor(x2[0] / phase_mod) + 1;
    //     //     old_phase = floor(x1[0] / phase_mod) + 1;
    //     //     if (old_phase != new_phase)
    //     //     {
    //     //       double lphase = HUGE;
    //     //       x0[0] = x0[0] / phase_mod - old_phase;
    //     //       x1[0] = x1[0] / phase_mod - old_phase;
    //     //       x2[0] = x2[0] / phase_mod - old_phase;
    //     //       if ((nzer = find_zero(x0[0], x1[0], x2[0], tstep, &dt1, &dt2)) > 0)
    //     //       {
    //     //         if (fabs(dt2) < fabs(dt1))
    //     //           t2 = te + dt2;
    //     //         else
    //     //           t2 = te + dt1;
    //     //         for (j = 0; j < 2; j++)
    //     //         {
    //     //           iflgret = swe_calc(t2, (int)SE_MOON, iflag, xm, serr);
    //     //           iflgret = swe_calc(t2, (int)SE_SUN, iflag, xs, serr);
    //     //           d = swe_radnorm(xm[0] - xs[0]) * RADTODEG;
    //     //           dx = swe_degnorm(d - (new_phase - 1) * 90);
    //     //           if (dx > 180)
    //     //             dx -= 360;
    //     //           dv = (xm[3] - xs[3]) * RADTODEG;
    //     //           t2 -= dx / dv;
    //     //         }
    //     //         while (new_phase > nphases)
    //     //         {
    //     //           new_phase -= nphases;
    //     //         }
    //     //         strcpy(sout, "phase ");
    //     //         if (pmodel == PMODEL_SCREEN)
    //     //         {
    //     //           iflgret = swe_calc(t2, (int)SE_MOON, iflag, xm, serr);
    //     //           lphase = xm[0] * RADTODEG;
    //     //         }
    //     //         print_item(sout, t2, new_phase, lphase, HUGE);
    //     //       }
    //     //     }
    //     //   }
    //     // }
    //   }
    // }

    length += snprintf(Buffer + length, buflen - length,
                       "]");
  }
  length += snprintf(Buffer + length, buflen - length, "}");
  swe_close();
  return Buffer;
}
/**
 * @param forward
 *  1: search forward
 *  0: search around
 * @return planet2's longitude
 */
static double find_aspects(int planet1, int planet2, double x2cross, double *jd_ut_ptr, int forward, double precision, int flag)
{
  double x_planet1[6], x_planet2[6], dist;
  x2cross = swe_degnorm(x2cross);
  /*
   * compute the SUN/MOON at start date, and then estimate the crossing date
   */

  if (swe_calc_ut(*jd_ut_ptr, planet1, flag, x_planet1, serr) < 0)
    return -1;
  if (swe_calc_ut(*jd_ut_ptr, planet2, flag, x_planet2, serr) < 0)
    return -1;
  dist = x_planet2[0] - x_planet1[0];
  dist = swe_difdeg2n(x2cross, dist);
  double temp = dist / (x_planet2[3] - x_planet1[3]);
  if (forward && (temp < 0))
  {
    if (x_planet2[3] - x_planet1[3] > 0)
    {
      temp = (dist + 360) / (x_planet2[3] - x_planet1[3]);
    }
    else
    {
      temp = (dist - 360) / (x_planet2[3] - x_planet1[3]);
    }
  }
  *jd_ut_ptr += temp;
  for (int j = 0; j < 15; j++)
  {
    swe_calc_ut(*jd_ut_ptr, planet1, flag, x_planet1, serr);
    swe_calc_ut(*jd_ut_ptr, planet2, flag, x_planet2, serr);
    dist = swe_difdeg2n(x2cross, x_planet2[0] - x_planet1[0]);

    if (fabs(dist) < precision)
      break;
    if (j > 12) // should not be that large
    {
      printf("something wrong, loop time: %d, and jd result is %.17g, dist: %.17g >  1 / %f\n", j, *jd_ut_ptr, dist, precision);
      break;
    }
    if (fabs(x_planet2[3] - x_planet1[3]) * 360 < fabs(dist)) // should not be that large
    {
      printf("something wrong, speed too small, dist/speed > 360, jd: %f, speed1:%f, speed2:%f\n, \
      distance: %f, planet1: %d, planet2: %d, goal: %f\n\n",
             *jd_ut_ptr, x_planet2[3], x_planet1[3], dist, planet1, planet2, x2cross);
      break;
    }
    *jd_ut_ptr += dist / (x_planet2[3] - x_planet1[3]);
  }
  return x_planet2[0];
}
// static int find_maximum(double y1, double y2, double y3, double *dx)
// {
//   *dx = (y1 - y3) / (y1 + y3 - 2 * y2) * (*dx) / 2;
//   return y1 + y3 < 2 * y2; // 2 * y2 > r1 + r3 means maximum(1), else minimum(0)
// }
/** @return degree different [0,360), venus increase, jupiter decrease
 *
 * */
// static double helio_sync(double tj_ut, int planet)
// {
//   double xx_planet[6], xx_earth[6];
//   swe_calc_ut(tj_ut, planet, 258 | SEFLG_HELCTR, xx_planet, serr);
//   swe_calc_ut(tj_ut, SE_EARTH, 258 | SEFLG_HELCTR, xx_earth, serr);
//   return xx_planet[0] - xx_earth[0];
// }

// 0: first half year, 1: second half year; return jd of 1/1 of this year
static double first_day(double tjd_ut, int second_half)
{
  double year_double = (tjd_ut - 1721060.0) / 365.2425;
  int year_int = (int)floor(year_double);
  double frac = year_double - year_int;
  if (second_half && frac < 0.3)
  {
    year_int = year_int - 1;
  }
  else if (!second_half && frac > 0.7)
  {
    year_int = year_int + 1;
  }
  // year to year first day jd
  return year_int * 365.2425 + 1721060.0;
}
/* y00, y11, y2 are values for -2*dx, -dx, 0.
 * find zero points of parabola.
 * return: 0 if none
 * 	   1 if one zero in [-dx.. 0[
 * 	   1 if both zeros in [-dx.. 0[
 */
// static int find_zero(double y00, double y11, double y2, double dx,
//                      double *dxret, double *dxret2)
// {
//   double a, b, c, x1, x2;
//   c = y11;
//   b = (y2 - y00) / 2.0;
//   a = (y2 + y00) / 2.0 - c;
//   if (b * b - 4 * a * c < 0)
//     return 0;
//   if (fabs(a) < 1e-100)
//     return 0;
//   x1 = (-b + sqrt(b * b - 4 * a * c)) / 2 / a;
//   x2 = (-b - sqrt(b * b - 4 * a * c)) / 2 / a;
//   // up to here the calcuation was made as if the x-values were -1, 0, 1.
//   // This is why below they are shifted by -1
//   if (x1 == x2)
//   {
//     *dxret = (x1 - 1) * dx;
//     *dxret2 = (x1 - 1) * dx;
//     return 1;
//   }
//   if (x1 >= 0 && x1 < 1 && x2 >= 0 && x2 < 1)
//   {
//     if (x1 > x2)
//     { // two zeroes, order return values
//       *dxret = (x2 - 1) * dx;
//       *dxret2 = (x1 - 1) * dx;
//     }
//     else
//     {
//       *dxret = (x1 - 1) * dx;
//       *dxret2 = (x2 - 1) * dx;
//     }
//     return 2;
//   }
//   if (x1 >= 0 && x1 < 1)
//   {
//     *dxret = (x1 - 1) * dx;
//     *dxret2 = (x2 - 1) * dx; // set this value just in case, should not be used.
//     return 1;
//   }
//   if (x2 >= 0 && x2 < 1)
//   {
//     *dxret = (x2 - 1) * dx;
//     *dxret2 = (x1 - 1) * dx;
//     return 1;
//   }
//   return 0; // should not happen!
// }

// static int find_maximum(double y00, double y11, double y2, double dx,
//                         double *dxret, double *yret)
// {
//   double a, b, c, x, y;
//   c = y11;
//   b = (y2 - y00) / 2.0;
//   a = (y2 + y00) / 2.0 - c;
//   x = -b / 2 / a;
//   y = (4 * a * c - b * b) / 4 / a;
//   *dxret = (x - 1) * dx;
//   *yret = y;
//   return OK;
// }

#if USECASE == OFFLINE
EMSCRIPTEN_KEEPALIVE
const char *get(double tjd_ut, int sid, double lon, double lat, double height, char *iHouse, long flag, long type)
{
  return astro(tjd_ut, sid, lon, lat, height, iHouse, flag, type);
}

#endif
